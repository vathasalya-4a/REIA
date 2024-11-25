"use client";

import { fetcher } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { Basic } from "unsplash-js/dist/methods/photos/types";
import { useDebounce } from "use-debounce";
import LoadingSpinner from "../loading-spinner";

export default function UnsplashSearch({
  onSelect,
}: {
  onSelect: (url: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [debouncedQuery] = useDebounce(search, 500);
  const { data } = useSWR<Basic[]>(
    `/api/unsplash/search?query=${
      debouncedQuery.length > 0 ? debouncedQuery : "office photos"
    }`,
    fetcher,
    {
      onError: (err) => {
        toast.error(err.message);
      },
    },
  );
  return (
    <div className="h-[24rem] w-full overflow-auto rounded-lg border border-stone-700 bg-white p-3 shadow-lg dark:border-stone-300 dark:bg-stone-800 md:w-[24rem]">
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search for an image..."
          autoFocus
          autoComplete="off"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full rounded-md border-gray-300 py-1 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
        />
      </div>
      {data ? (
        data.length > 0 ? (
          <div className="mt-3 grid grid-cols-2 gap-3">
            {data.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => {
                  onSelect(photo.urls.regular);
                  // fetch("/api/unsplash/download", {
                  //   method: "POST",
                  //   headers: {
                  //     "Content-Type": "application/json",
                  //   },
                  //   body: JSON.stringify({
                  //     url: photo.links.download_location,
                  //   }),
                  // });
                }}
                className="relative flex h-24 w-full items-center justify-center overflow-hidden rounded-md bg-gray-100 transition-all hover:brightness-75"
              >
                <img
                  src={photo.urls.small}
                  alt={photo.alt_description || "Unsplash image"}
                  className="absolute h-full w-full object-cover"
                />
                <p className="absolute bottom-0 left-0 right-0 line-clamp-1 w-full bg-black bg-opacity-10 p-1 text-xs text-white">
                  by{" "}
                  <a
                    className="underline underline-offset-2"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${photo.user.links.html}?utm_source=dub.co&utm_medium=referral`}
                  >
                    {photo.user.name}
                  </a>
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex h-[90%] items-center justify-center">
            <p className="text-center text-sm text-gray-500">
              No results found. <br /> Maybe try tweaking your search query?
            </p>
          </div>
        )
      ) : (
        <div className="flex h-[90%] items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
