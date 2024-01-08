"use client";

import { AnimatePresence, useAnimation, motion } from "framer-motion";
import { ReactNode, useRef, useState } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import Link from "next/link";

export default function Tooltip({
    children,
    content,
    fullWidth,
  }: {
    children: ReactNode;
    content: ReactNode | string;
    fullWidth?: boolean;
  }) {
    const [openTooltip, setOpenTooltip] = useState(false);
    const mobileTooltipRef = useRef(null);
  
    const controls = useAnimation();
    const transitionProps = { type: "spring", stiffness: 500, damping: 30 };
  
    async function handleDragEnd(_: any, info: any) {
      const offset = info.offset.y;
      const velocity = info.velocity.y;
      // @ts-ignore
      const height = mobileTooltipRef.current.getBoundingClientRect().height;
      if (offset > height / 2 || velocity > 800) {
        await controls.start({ y: "100%", transition: transitionProps });
        setOpenTooltip(false);
      } else {
        controls.start({ y: 0, transition: transitionProps });
      }
    }
  
    return (
      <>
        <button
          type="button"
          className={`${fullWidth ? "w-full" : "inline-flex"} sm:hidden`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpenTooltip(true);
          }}
        >
          <span className="sr-only">Open tooltip</span>
          {children}
        </button>
        <AnimatePresence>
          {openTooltip && (
            <>
              <motion.div
                ref={mobileTooltipRef}
                key="mobile-tooltip"
                className="group fixed inset-x-0 bottom-0 z-40 w-screen cursor-grab active:cursor-grabbing sm:hidden"
                initial={{ y: "100%" }}
                animate={{
                  y: openTooltip ? 0 : "100%",
                  transition: transitionProps,
                }}
                exit={{ y: "100%" }}
                transition={transitionProps}
                drag="y"
                dragDirectionLock
                onDragEnd={handleDragEnd}
                dragElastic={{ top: 0, bottom: 1 }}
                dragConstraints={{ top: 0, bottom: 0 }}
              >
                <div
                  className={`rounded-t-4xl -mb-1 flex h-7 w-full items-center justify-center border-t border-gray-200 bg-white`}
                >
                  <div className="-mr-1 h-1 w-6 rounded-full bg-gray-300 transition-all group-active:rotate-12" />
                  <div className="h-1 w-6 rounded-full bg-gray-300 transition-all group-active:-rotate-12" />
                </div>
                <div className="flex min-h-[150px] w-full items-center justify-center overflow-hidden bg-white align-middle shadow-xl">
                  {typeof content === "string" ? (
                    <span className="block max-w-xs text-center text-sm text-gray-700">
                      {content}
                    </span>
                  ) : (
                    content
                  )}
                </div>
              </motion.div>
              <motion.div
                key="mobile-tooltip-backdrop"
                className="fixed inset-0 z-30 bg-gray-100 bg-opacity-10 backdrop-blur sm:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpenTooltip(false)}
              />
            </>
          )}
        </AnimatePresence>
        <TooltipPrimitive.Provider delayDuration={100}>
          <TooltipPrimitive.Root>
            <TooltipPrimitive.Trigger className="hidden sm:inline-flex" asChild>
              {children}
            </TooltipPrimitive.Trigger>
            <TooltipPrimitive.Portal>
              <TooltipPrimitive.Content
                sideOffset={4}
                side="top"
                className="z-50 hidden animate-slide-up-fade items-center overflow-hidden rounded-md border border-gray-200 bg-white drop-shadow-lg sm:block"
              >
                <TooltipPrimitive.Arrow className="fill-current text-white" />
                {typeof content === "string" ? (
                  <div className="p-4">
                    <span className="block max-w-xs text-center text-sm text-gray-700">
                      {content}
                    </span>
                  </div>
                ) : (
                  content
                )}
                <TooltipPrimitive.Arrow className="fill-current text-white" />
              </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
          </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
      </>
    );
  }
  
  export function TooltipContent({
    title,
    cta,
    href,
    onClick,
  }: {
    title: string;
    cta?: string;
    href?: string;
    onClick?: () => void;
  }) {
    return (
      <div className="flex max-w-xs flex-col items-center space-y-3 p-4 text-center">
        <p className="text-sm text-gray-700">{title}</p>
        {cta &&
          (href ? (
            <Link
              href={href}
              className="mt-4 w-full rounded-md border border-black bg-black px-3 py-1.5 text-center text-sm text-white transition-all hover:bg-white hover:text-black"
            >
              {cta}
            </Link>
          ) : onClick ? (
            <button
              className="mt-4 w-full rounded-md border border-black bg-black px-3 py-1.5 text-center text-sm text-white transition-all hover:bg-white hover:text-black"
              onClick={onClick}
            >
              {cta}
            </button>
          ) : null)}
      </div>
    );
  }