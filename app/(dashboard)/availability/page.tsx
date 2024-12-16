"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import LoadingDots from "@/components/icons/loading-dots";

const timeZones = [
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "Europe/London",
  "Europe/Paris",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const CalendarForm = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [selectedDays, setSelectedDays] = useState<Record<string, boolean>>({});
  const [selectedTimes, setSelectedTimes] = useState<Record<string, { start: string; end: string }>>({});
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [scheduleId, setScheduleId] = useState<string | null>(null);
  const userEmail = session?.user?.email || "";
  const userName = session?.user?.name || "User";
  const defaultStartTime = "9:00 AM";
  const defaultEndTime = "5:00 PM";

  let calComAccessToken;
      let refreshToken;
      let accessTokenExpiresAt;
      let calId = "";
  
  async function refreshAccessToken(refreshToken: string, userEmail: string, calId: string) {
    try {
      console.log("Refreshing access token...");

      const refreshRes = await fetch(
        `https://api.cal.com/v2/oauth/${process.env.NEXT_PUBLIC_CAL_CLIENT_ID}/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-cal-secret-key": process.env.NEXT_PUBLIC_CAL_SECRET_KEY || "",
          },
          body: JSON.stringify({
            refreshToken,
          }),
        }
      );

      if (!refreshRes.ok) {
        throw new Error("Failed to refresh access token.");
      }

      const tokenData = await refreshRes.json();

      await fetch('/api/calcom/cal-user', {
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

  function isTokenExpired(expiration: string) {
    return new Date(expiration) <= new Date();
  }

  const convertTo24Hour = (time: string) => {
    const [hours, minutesPart] = time.split(":");
    const [minutes, period] = minutesPart.split(" ");
    let hour24 = parseInt(hours, 10);
    if (period === "PM" && hour24 !== 12) {
      hour24 += 12;
    } else if (period === "AM" && hour24 === 12) {
      hour24 = 0;
    }
    return `${hour24.toString().padStart(2, "0")}:${minutes}`;
  };

  const convertTo12Hour = (time: string) => {
    const [hour24, minutes] = time.split(":");
    let hour12 = parseInt(hour24, 10);
    const suffix = hour12 >= 12 ? "PM" : "AM";
    if (hour12 > 12) hour12 -= 12;
    if (hour12 === 0) hour12 = 12;
    return `${hour12}:${minutes} ${suffix}`;
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const handleTimeChange = (day: string, time: string, type: "start" | "end") => {
    setSelectedTimes((prev) => ({
      ...prev,
      [day]: { ...prev[day], [type]: time },
    }));
  };

  const groupDaysByTime = () => {
    const grouped: Record<string, { days: string[]; startTime: string; endTime: string }> = {};
    Object.entries(selectedDays).forEach(([day, isSelected]) => {
      if (isSelected) {
        const { start, end } = selectedTimes[day] || {};
        const key = `${convertTo24Hour(start || defaultStartTime)}-${convertTo24Hour(end || defaultEndTime)}`;
        if (!grouped[key]) {
          grouped[key] = {
            days: [],
            startTime: convertTo24Hour(start || defaultStartTime),
            endTime: convertTo24Hour(end || defaultEndTime),
          };
        }
        grouped[key].days.push(day);
      }
    });
    return Object.values(grouped);
  };

  useEffect(() => {
    const initialSelectedDays: Record<string, boolean> = {};
    const initialSelectedTimes: Record<string, { start: string; end: string }> = {};

    days.forEach((day) => {
      initialSelectedDays[day] = false;
      initialSelectedTimes[day] = { start: defaultStartTime, end: defaultEndTime };
    });

    setSelectedDays(initialSelectedDays);
    setSelectedTimes(initialSelectedTimes);
  }, []);


  useEffect(() => {
    const fetchScheduleDetails = async () => {

      setLoading(true);

      try {
        const userRes = await fetch(`/api/calcom/cal-user?email=${encodeURIComponent(session.user.email)}`);
        const userData = await userRes.json();
          if (userData.calComAccessToken) {
            if (userData.scheduleId){
              calComAccessToken = userData.calComAccessToken
              setScheduleId(userData.scheduleId);
              if (userData.calComaccessTokenExpiresAt && isTokenExpired(userData.calComaccessTokenExpiresAt)) {
                const refreshedTokenData = await refreshAccessToken(userData.calComRefreshToken, userEmail, userData.calId);
                calComAccessToken = refreshedTokenData.accessToken;
              }
              const scheduleRes = await fetch(`https://api.cal.com/v2/schedules/${userData.scheduleId}`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${calComAccessToken}`,
                  "cal-api-version": "2024-06-11",
                },
              });
              if(scheduleRes.ok){
                const scheduleData = await scheduleRes.json();
                setJobTitle(scheduleData.data.name || "");
                setTimeZone(scheduleData.data.timeZone || "");
  
            const availability = scheduleData.data.availability || [];
            const updatedDays: Record<string, boolean> = {};
            const updatedTimes: Record<string, { start: string; end: string }> = {};

            availability.forEach((slot: any) => {
              slot.days.forEach((day: string) => {
                updatedDays[day] = true;
                updatedTimes[day] = {
                  start: convertTo12Hour(slot.startTime),
                  end: convertTo12Hour(slot.endTime),
                };
              });
            });
  
            setSelectedDays(updatedDays);
            setSelectedTimes(updatedTimes);

            }
            else{
              console.log("Failed to fetch the schedule details");
            }

          }
          else{
            console.log("Schedule not created");
          }
  
        } 
        else{
              console.log("user was not created on cal.com");         
          }
        
      } catch (error) {
        console.error("Error fetching schedule details:", error);
        
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchScheduleDetails();
    } else {
      setLoading(false); // Stop loading if session is unavailable
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingDots />
      </div>
    );
  }


  const handleSaveOrUpdate = async () => {
    
    setLoading(true);
    setStatusMessage("");

    const availability = groupDaysByTime();

    const schedulePayload = {
      name: jobTitle,
      timeZone,
      isDefault: false,
      overrides: [],
      availability,
    };

    try {
      // Attempt to create a user if doesn't exist, or use existing user
      const createUserRes = await fetch(
        `https://api.cal.com/v2/oauth-clients/${process.env.NEXT_PUBLIC_CAL_CLIENT_ID}/users`,
        {
          method: "POST",
          headers: {
            "x-cal-secret-key": process.env.NEXT_PUBLIC_CAL_SECRET_KEY || "",
            "x-cal-client-id": process.env.NEXT_PUBLIC_CAL_CLIENT_ID || "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            name: userName,
            timeZone,
          }),
        }
      );


      if (createUserRes.ok) {
        const createUserData = await createUserRes.json();
        calId = createUserData.data.user.id;
        calComAccessToken = createUserData.data.accessToken;
        refreshToken = createUserData.data.refreshToken;
        accessTokenExpiresAt = createUserData.data.accessTokenExpiresAt;

        // Update database with user details
        await fetch('/api/calcom/cal-user', {
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
        const userRes = await fetch(`/api/calcom/cal-user?email=${encodeURIComponent(userEmail)}`);

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
          const refreshedTokenData = await refreshAccessToken(refreshToken, userEmail, calId);
          calComAccessToken = refreshedTokenData.accessToken;
        }
      }

      if (scheduleId) {
        // Update schedule
        const updateRes = await fetch(`https://api.cal.com/v2/schedules/${scheduleId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${calComAccessToken}`,
            "cal-api-version": "2024-06-11",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(schedulePayload),
        });

        if (!updateRes.ok) {
          throw new Error(await updateRes.text());
        }

        setStatusMessage("Schedule updated successfully!");
      } else {
        // Create new schedule
        const createRes = await fetch("https://api.cal.com/v2/schedules", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${calComAccessToken}`,
            "cal-api-version": "2024-06-11",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(schedulePayload),
        });

        if (!createRes.ok) {
          throw new Error(await createRes.text());
        }

        const scheduleData = await createRes.json();
        const newScheduleId = scheduleData.data.id;
        setScheduleId(newScheduleId);

        // Store the newly created scheduleId in the database
        await fetch('/api/calcom/cal-user', {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            calId: calId.toString(),
            name: userName,
            accessToken: calComAccessToken,
            refreshToken,
            accessTokenExpiresAt,
            scheduleId: newScheduleId,
          }),
        });

        setStatusMessage("Schedule created successfully!");
      }
    } catch (error) {
      console.error("Error:", error);
      setStatusMessage("An error occurred. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="custom-scrollbar relative resize-none overflow-y-auto p-6">
      <h1 className="text-black-200 mt-3 text-center font-cal text-3xl">
        Welcome to Calendar Schedule
      </h1>
      {loading && <p>Loading...</p>}
      {statusMessage && <p className="text-red-500">{statusMessage}</p>}
      <div className="mx-auto mt-8 w-5/6 p-4">
        <label htmlFor="jobTitle" className="block text-base font-medium text-gray-700 mb-2">
          Name
        </label>
        <input
          id="jobTitle"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="w-1/2 mb-4 p-2 border border-gray-300 rounded-md"
        />
        <label htmlFor="timeZone" className="block text-base font-medium text-gray-700 mb-2">
          Time Zone
        </label>
        <select
          id="timeZone"
          value={timeZone}
          onChange={(e) => setTimeZone(e.target.value)}
          className="w-1/2 mb-4 p-2 border border-gray-300 rounded-md"
        >
          <option value="" disabled>
            Select Time Zone
          </option>
          {timeZones.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md w-3/4 max-w-2xl">
          <h2 className="mb-6 text-lg font-bold text-gray-700">Set Your Availability</h2>
          {days.map((day) => (
            <div key={day} className="grid grid-cols-7 items-center mb-4 gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!selectedDays[day]}
                  onChange={() => handleDayToggle(day)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-black peer-checked:after:translate-x-5 after:content-[''] after:block after:h-4 after:w-4 after:bg-white after:rounded-full after:transition-all"></div>
              </label>
              <span className="font-medium text-gray-700">{day}</span>
              <div
                className={`col-span-5 flex items-center space-x-2 ${
                  selectedDays[day] ? "visible opacity-100" : "invisible opacity-0"
                } transition-all duration-300`}
              >
                <select
                  value={selectedTimes[day]?.start || ""}
                  onChange={(e) => handleTimeChange(day, e.target.value, "start")}
                  className="bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="" disabled>
                    Select Start Time
                  </option>
                  {Array.from({ length: 24 }, (_, i) => `${i % 12 || 12}:00 ${i < 12 ? "AM" : "PM"}`).map((time) => (
                    <option key={`${day}-start-${time}`} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-gray-500">-</span>
                <select
                  value={selectedTimes[day]?.end || ""}
                  onChange={(e) => handleTimeChange(day, e.target.value, "end")}
                  className="bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="" disabled>
                    Select End Time
                  </option>
                  {Array.from({ length: 24 }, (_, i) => `${i % 12 || 12}:00 ${i < 12 ? "AM" : "PM"}`).map((time) => (
                    <option key={`${day}-end-${time}`} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={handleSaveOrUpdate} className="px-4 py-2 bg-black text-white rounded-lg">
            {scheduleId ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarForm;
