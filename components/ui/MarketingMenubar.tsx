"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

export default function MarketingMenubar() {
  const { data: session } = useSession(); // Access session info
  const isLoggedIn = Boolean(session);

  return (
    <Menubar className="flex items-center justify-between bg-white px-8 py-8 w-full rounded-lg border border-stone-200 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
      {/* Logo Section */}
      <div className="flex items-center space-x-2">
        <img src="/logo.png" alt="Files 24 Logo" className="h-8 w-8" /> {/* Increased logo size */}
        <span className="font-bold text-2xl text-gray-800">REIA</span>
      </div>

      {/* Menu Items */}
      <div className="flex space-x-8 text-gray-700 text-lg"> {/* Adjusted spacing and font size */}
        <MenubarMenu>
          <MenubarTrigger>Features</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Pricing</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Blog</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Contact</MenubarTrigger>
        </MenubarMenu>
      </div>

      {/* Authentication Links */}
      <div className="flex items-center space-x-6">
        {isLoggedIn ? (
          <>
            <span className="text-gray-600">Hello, {session.user?.name}</span>
            <button
              onClick={() => signOut()}
              className="text-gray-600 hover:text-gray-800"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <a href="/login" className="text-gray-600 hover:text-gray-800">
              Login
            </a>
            <a
              href="/register" className="bg-black text-white font-semibold py-2 px-6 rounded hover:bg-gray-500"
            >
            Sign Up
            </a>

          </>
        )}
      </div>
    </Menubar>
  );
}
