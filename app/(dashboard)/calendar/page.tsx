"use client";

import React, { useState } from "react";
import { Suspense } from "react";
import { useSession } from "next-auth/react";
import LoadingDots from "@/components/icons/loading-dots";
import CreateAvailabilityButton from "@/modules/cal/components/create-availability-button";
import CreateAvailabilityModal from "@/modules/cal/components/create-availability-modal";
import PlaceholderCard from "@/components/ui/placeholder-card";

async function refreshAccessToken(refreshToken, userEmail, calId) {
  try {
    console.log("Refreshing access token...");

    const refreshRes = await fetch(
      `https://api.cal.com/v2/oauth/${process.env.NEXT_PUBLIC_CAL_CLIENT_ID}/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-cal-secret-key": process.env.NEXT_PUBLIC_CAL_SECRET_KEY,
        },
        body: JSON.stringify({
          refreshToken,
        }),
      },
    );

    if (!refreshRes.ok) {
      throw new Error("Failed to refresh access token.");
    }

    const tokenData = await refreshRes.json();

    await fetch(`/api/calcom/cal-user`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmail,
        calId,
        accessToken: tokenData.data.accessToken,
        refreshToken: tokenData.data.refreshToken,
        accessTokenExpiresAt: tokenData.data.accessTokenExpiresAt,
        scheduleId: null,
      }),
    });

    console.log("Access token refreshed successfully.");
    return {
      accessToken: tokenData.data.accessToken,
      refreshToken: tokenData.data.refreshToken,
      accessTokenExpiresAt: tokenData.data.accessTokenExpiresAt,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
}

function isTokenExpired(expiration) {
  return new Date(expiration) <= new Date();
}

export default function CalendarPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  function groupAvailabilityByTime(availabilities) {
    const grouped = {};

    for (const slot of availabilities) {
      const key = `${slot.startTime}-${slot.endTime}`;
      if (!grouped[key]) {
        grouped[key] = {
          days: [],
          startTime: slot.startTime,
          endTime: slot.endTime,
        };
      }
      grouped[key].days.push(slot.day);
    }

    return Object.values(grouped);
  }

  const handleAddEvent = async (data) => {
    if (!session || !session.user) {
      setStatusMessage("User is not logged in.");
      return;
    }

    setLoading(true);
    setStatusMessage("");

    const userEmail = session.user.email;
    const userName = session.user.name || "User";
    const timeZone = "America/New_York";

    try {
      // Step 1: Check if the user exists on Cal.com
      const createUserRes = await fetch(
        `https://api.cal.com/v2/oauth-clients/${process.env.NEXT_PUBLIC_CAL_CLIENT_ID}/users`,
        {
          method: "POST",
          headers: {
            "x-cal-secret-key": process.env.NEXT_PUBLIC_CAL_SECRET_KEY,
            "x-cal-client-id": process.env.NEXT_PUBLIC_CAL_CLIENT_ID,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            name: userName,
            timeZone,
          }),
        },
      );

      let calComAccessToken;
      let refreshToken;
      let accessTokenExpiresAt;
      let calId;
      let scheduleId;

      if (createUserRes.ok) {
        const createUserData = await createUserRes.json();
        calId = createUserData.data.user.id;
        calComAccessToken = createUserData.data.accessToken;
        refreshToken = createUserData.data.refreshToken;
        accessTokenExpiresAt = createUserData.data.accessTokenExpiresAt;

        // Update our database with the new user
        await fetch(`/api/calcom/cal-user`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            calId: calId.toString(),
            name: userName,
            accessToken: calComAccessToken,
            refreshToken,
            accessTokenExpiresAt,
            scheduleId: null,
          }),
        });
      } else {
        // User already exists on Cal.com
        const userRes = await fetch(
          `/api/calcom/cal-user?email=${encodeURIComponent(userEmail)}`,
        );

        if (!userRes.ok) {
          throw new Error("User not found in our database.");
        }

        const userData = await userRes.json();
        calId = userData.calId;
        calComAccessToken = userData.calComAccessToken;
        refreshToken = userData.calComRefreshToken;
        accessTokenExpiresAt = userData.calComAccessTokenExpiresAt;

        // Refresh token if expired
        if (accessTokenExpiresAt && isTokenExpired(accessTokenExpiresAt)) {
          const refreshedTokenData = await refreshAccessToken(
            refreshToken,
            userEmail,
            calId,
          );
          calComAccessToken = refreshedTokenData.accessToken;
        }
      }
      console.log(data);

      const schedulePayload = {
        name: data.name || "My Work Schedule",
        timeZone: data.timeZone || "America/New_York",
        isDefault: data.isDefault ?? false,
        overrides: data.overrides || [],
        // If you want each day to be its own entry, you can simply do:
        // availability: data.availability.map(av => ({
        //   days: [av.day],
        //   startTime: av.startTime,
        //   endTime: av.endTime
        // })),

        // If you want to group multiple days that share the same time window (like Monday/Tuesday and Wednesday/Thursday in your static payload), use the grouping function:
        availability: groupAvailabilityByTime(data.availability),
      };

      console.log(schedulePayload);

      //create schedule
      const scheduleRes = await fetch("https://api.cal.com/v2/schedules", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${calComAccessToken}`,
          "cal-api-version": "2024-06-11",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(schedulePayload),
      });

      if (!scheduleRes.ok) {
        throw new Error(await scheduleRes.text());
      }

      const scheduleData = await scheduleRes.json();
      console.log(scheduleData.data.id)
      scheduleId = scheduleData.data.id;

      // Step 3: Update `scheduleId` in the database
      const updateRes = await fetch(`/api/calcom/cal-user`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        email: userEmail,
        calId,
        accessToken: calComAccessToken,
        refreshToken,
        accessTokenExpiresAt,
        scheduleId: scheduleId.toString(), // Send scheduleId to backend
        }),
      });

      if (!updateRes.ok) {
        throw new Error("Failed to update user with schedule ID.");
      }

      // if (scheduleRes.ok) {
      //   setStatusMessage("Schedule created successfully!");
      // }
      // else {
      //   const errorDetails = await scheduleRes.text();
      //   console.error("Failed to create schedule:", errorDetails);
      //   setStatusMessage("Failed to create schedule.");
      // }
      //api to fetch schedules
      console.log(calComAccessToken);

      //owner
      // const fetchme = await fetch('https://api.cal.com/v2/me', {
      //   method: "GET",
      //   headers: {
      //     Authorization: `Bearer ${calComAccessToken}`,
      //   },
      // });

      const fetchRes = await fetch(`https://api.cal.com/v2/schedules/${scheduleId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${calComAccessToken}`,
          'cal-api-version' : '2024-06-11',
        },
      });

      if (!fetchRes.ok) {
        console.error("Failed to fetch schedules:", await fetchRes.text());
      } else {
        const schedules = await fetchRes.json();
        console.log("User Schedules:", schedules);
      }
    } catch (error) {
      console.error("Error:", error);
      setStatusMessage(
        "An error occurred. Please check the console for details.",
      );
    } finally {
      setLoading(false);
    }
  };
  const convertDayToNumber = (day) => {
    const daysMap = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    return daysMap[day] || -1;
  };

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            Welcome to Calendar Schedule
          </h1>
          {/* Use the button as a child inside CreateAvailabilityButton */}

          <button
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={() => setIsModalOpen(true)}
          >
            Create Availability
          </button>
        </div>

        {isModalOpen && (
          <CreateAvailabilityModal
            onSubmit={(data) => handleAddEvent(data)}
            onClose={() => setIsModalOpen(false)}
          />
        )}

        {/* Suspense for loading existing schedules */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <PlaceholderCard key={i} />
              ))}
            </div>
          }
        >
          {/* Future schedules listing will go here */}
        </Suspense>

        {loading && <LoadingDots />}
        {statusMessage && <p>{statusMessage}</p>}
      </div>
    </div>
  );
}
