// components/ui/MarketingMenubar.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

export default function MarketingMenubar() {
  const { data: session } = useSession(); // Access session info
  const isLoggedIn = Boolean(session);

  return (
    <Menubar className="flex items-center justify-between bg-white shadow px-4 py-4 w-full">
      {/* Logo Section */}
      <div className="flex items-center space-x-2">
        <img src="/logo.png" alt="Files 24 Logo" className="h-6 w-6" />
        <span className="font-bold text-xl text-gray-800">REIA</span>
      </div>

      {/* Menu Items */}
      <div className="flex space-x-4 text-gray-700">
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
      <div className="flex items-center space-x-4">
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
              href="/register"
              className="bg-blue-600 text-white font-semibold py-1 px-4 rounded hover:bg-blue-700"
            >
              Sign Up
            </a>
          </>
        )}
      </div>
    </Menubar>
  );
}
