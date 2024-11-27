"use client";

import { getSiteFromPostId } from "@/modules/posts/actions";
import {
  ArrowLeft,
  BarChart3,
  Edit3,
  FileCode,
  Github,
  Globe,
  Layout,
  User,
  UploadCloudIcon,
  LayoutDashboard,
  Megaphone,
  Menu,
  Newspaper,
  Settings,
  FileEdit,
  MessageCircle,
  ContactIcon
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useSelectedLayoutSegments,
} from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";

const externalLinks = [
  {
    name: "Read announcement",
    href: "https://vercel.com/blog/platforms-starter-kit",
    icon: <Megaphone width={18} />,
  },
  {
    name: "Read the guide",
    href: "https://vercel.com/guides/nextjs-multi-tenant-application",
    icon: <FileCode width={18} />,
  },
  {
    name: "Read FAQ",
    href: "https://vercel.com/templates/next.js/platforms-starter-kit",
    icon: (
      <svg
        width={18}
        viewBox="0 0 76 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="py-1 text-black dark:text-white"
      >
        <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="currentColor" />
      </svg>
    ),
  },
];

export default function Nav({ children }: { children: ReactNode }) {
  const segments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: string };
  const { projectid } = useParams() as { projectid?: string };
  const { siteid } = useParams() as { siteid?: string };
  const [siteId, setSiteId] = useState<string | null>();
  const { resumeid } = useParams() as { resumeid?: string};
 
  useEffect(() => {
    if (segments[0] === "post" && id) {
      getSiteFromPostId(id).then((id) => {
        setSiteId(id);
      });
    }
  }, [id]);

  const tabs = useMemo(() => {
    if (segments[0] === "client" && id && segments[2] === "project" && projectid && segments[4] === "site" && siteid && segments[6] === "modifyresume" ) {
      return [
        {
          name: "Back to All Resumes",
          href: `/client/${id}/project/${projectid}/site/${siteid}`,
          icon: <ArrowLeft width={18} />,
        },
        {
          name: "Transform Resume",
          href: `/client/${id}/project/${projectid}/site/${siteid}/${resumeid}/modifyresume`,
          isActive: segments[6] === "modifyresume",
          icon: <FileEdit width={18} />,
        },
      ];
    }   
    else if (segments[0] === "client" && id && segments[2] === "project" && projectid && segments[4] === "site" && siteid && segments[6] === "checkats" ) {
      return [
        {
          name: "Back to All Resumes",
          href: `/client/${id}/project/${projectid}/site/${siteid}`,
          icon: <ArrowLeft width={18} />,
        },
        {
          name: "Upload Resume",
          href: `/client/${id}/project/${projectid}/site/${siteid}/checkats`,
          isActive: segments[6] === "checkats",
          icon: <UploadCloudIcon width={18} />,
        },
      ];
    }else if (segments[0] === "client" && id && segments[2] === "project" && projectid && segments[4] === "site" && siteid && segments[6] === "contact"  ) {
      return [
        {
          name: "Back to All Candidates",
          href: `/client/${id}/project/${projectid}`,
          icon: <ArrowLeft width={18} />,
        },
        {
          name: "Resumes",
          href: `/client/${id}/project/${projectid}/site/${siteid}`,
          icon: <UploadCloudIcon width={18} />,
        },
        {
          name: "Interview",
          href: `/client/${id}/project/${projectid}/site/${siteid}/candidate-interview`,
          icon: <MessageCircle width={18} />,
        },
        {
          name: "Contact",
          href: `/client/${id}/project/${projectid}/site/${siteid}/contact`,
          isActive: segments[6] === "contact",
          icon: <ContactIcon width={18} />,
        },
        {
          name: "Settings",
          href: `/client/${id}/settings`,
          isActive: segments.includes("settings"),
          icon: <Settings width={18} />,
        },
      ];
    }
    else if (segments[0] === "client" && id && segments[2] === "project" && projectid && segments[4] === "site" && siteid && segments[6] === "candidate-interview"  ) {
      return [
        {
          name: "Back to All Candidates",
          href: `/client/${id}/project/${projectid}`,
          icon: <ArrowLeft width={18} />,
        },
        {
          name: "Resumes",
          href: `/client/${id}/project/${projectid}/site/${siteid}`,
          icon: <UploadCloudIcon width={18} />,
        },
        {
          name: "Interview",
          href: `/client/${id}/project/${projectid}/site/${siteid}/candidate-interview`,
          isActive: segments[6] === "candidate-interview",
          icon: <MessageCircle width={18} />,
        },
        {
          name: "Settings",
          href: `/client/${id}/settings`,
          isActive: segments.includes("settings"),
          icon: <Settings width={18} />,
        },
      ];
    }
    else if (segments[0] === "client" && id && segments[2] === "project" && projectid && segments[4] === "site" && siteid ) {
      return [
        {
          name: "Back to All Candidates",
          href: `/client/${id}/project/${projectid}`,
          icon: <ArrowLeft width={18} />,
        },
        {
          name: "Resumes",
          href: `/client/${id}/project/${projectid}/site/${siteid}`,
          isActive: segments[4] === "site",
          icon: <UploadCloudIcon width={18} />,
        },
        {
          name: "Interview",
          href: `/client/${id}/project/${projectid}/site/${siteid}/candidate-interview`,
          icon: <MessageCircle width={18} />,
        },
        {
          name: "Settings",
          href: `/client/${id}/settings`,
          isActive: segments.includes("settings"),
          icon: <Settings width={18} />,
        },
      ];
    }else if (segments[0] === "client" && id && segments[2] === "project" && projectid && segments[4] === "interview") {
      return [
        {
          name: "Back to All Projects",
          href: `/client/${id}`, 
          icon: <ArrowLeft width={18} />,
        },
        {
          name: "Candidates",
          href: `/client/${id}/project/${projectid}`, 
          isActive: segments.length === 4,
          icon: <Newspaper width={18} />,
        },
        {
          name: "AI Interview",
          href: `/client/${id}/project/${projectid}/interview`,
          isActive: segments.length === 5,
          icon: <MessageCircle width={18} />,
        },
        {
          name: "Contact",
          href: `/client/${id}/project/${projectid}/contact`,
          isActive: segments.includes("contact"),
          icon: <ContactIcon width={18} />,
        },
        {
          name: "Settings",
          href: `/client/${id}/settings`,
          isActive: segments.includes("settings"),
          icon: <Settings width={18} />,
        }
      ];
    }   
    else if (segments[0] === "client" && id && segments[2] === "project" && projectid) {
      return [
        {
          name: "Back to All Projects",
          href: `/client/${id}`, 
          icon: <ArrowLeft width={18} />,
        },
        {
          name: "Candidates",
          href: `/client/${id}/project/${projectid}`, 
          isActive: segments.length === 4,
          icon: <Newspaper width={18} />,
        },
        {
          name: "AI Interview",
          href: `/client/${id}/project/${projectid}/interview`,
          isActive: segments.includes("interview"),
          icon: <MessageCircle width={18} />,
        },
        {
          name: "Contact",
          href: `/client/${id}/project/${projectid}/contact`,
          isActive: segments.includes("contact"),
          icon: <ContactIcon width={18} />,
        },
        {
          name: "Settings",
          href: `/client/${id}/settings`,
          isActive: segments.includes("settings"),
          icon: <Settings width={18} />,
        },
      ];
    }    
    else if (segments[0] === "client" && id) {
      return [
        {
          name: "Back to All Clients",
          href: "/clients",
          icon: <ArrowLeft width={18} />,
        },
        {
          name: "Projects",
          href: `/client/${id}`,
          isActive: segments.length === 2,
          icon: <Newspaper width={18} />,
        },
        {
          name: "Settings",
          href: `/client/${id}/settings`,
          isActive: segments.includes("settings"),
          icon: <Settings width={18} />,
        },
      ];
    } else if (segments[0] === "post" && id) {
      return [
        {
          name: "Back to All Posts",
          href: siteId ? `/site/${siteId}` : "/sites",
          icon: <ArrowLeft width={18} />,
        },
        {
          name: "Editor",
          href: `/post/${id}`,
          isActive: segments.length === 2,
          icon: <Edit3 width={18} />,
        },
        {
          name: "Settings",
          href: `/post/${id}/settings`,
          isActive: segments.includes("settings"),
          icon: <Settings width={18} />,
        },
      ];
    }
    return [
      {
        name: "Clients",
        href: "/clients",
        isActive: segments[0] === "clients" || segments.length === 0,
        icon: <User width={18} />,
      },
      {
        name: "Settings",
        href: "/settings",
        isActive: segments[0] === "settings",
        icon: <Settings width={18} />,
      }
    ];
  }, [segments, id, siteId]);

  const [showSidebar, setShowSidebar] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setShowSidebar(false);
  }, [pathname]);

  return (
    <>
      <button
        className={`fixed z-20 ${
          segments[0] === "post" && segments.length === 2 && !showSidebar
            ? "left-5 top-5"
            : "right-5 top-7"
        } sm:hidden`}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu width={20} />
      </button>
      <div
        className={`transform ${
          showSidebar ? "w-full translate-x-0" : "-translate-x-full"
        } fixed z-10 flex h-full flex-col justify-between border-r border-stone-200 bg-stone-100 p-4 transition-all dark:border-stone-700 dark:bg-stone-900 sm:w-60 sm:translate-x-0`}
      >
        <div className="grid gap-2">
          <div className="flex items-center space-x-2 rounded-lg px-2 py-1.5">
          <div className="flex items-center">
  <Link
    href="/"
    className="flex items-center rounded-lg p-2 hover:bg-stone-200 dark:hover:bg-stone-700"
  >
    <Image
      src="/logo.png"
      width={24}
      height={24}
      alt="Logo"
      className="dark:scale-110 dark:rounded-full dark:border dark:border-stone-400"
    />
    <span className="ml-2 font-semibold text-stone-700 dark:text-stone-200">
      REIA
    </span>
  </Link>
</div>
</div>
          <div className="grid gap-1">
            {tabs.map(({ name, href, isActive, icon }) => (
              <Link
                key={name}
                href={href}
                className={`flex items-center space-x-3 ${
                  isActive ? "bg-stone-200 text-black dark:bg-stone-700" : ""
                } rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800`}
              >
                {icon}
                <span className="text-sm font-medium">{name}</span>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="grid gap-1">
            {externalLinks.map(({ name, href, icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800"
              >
                <div className="flex items-center space-x-3">
                  {icon}
                  <span className="text-sm font-medium">{name}</span>
                </div>
                <p>↗</p>
              </a>
            ))}
          </div>
          <div className="my-2 border-t border-stone-200 dark:border-stone-700" />
          {children}
        </div>
      </div>
    </>
  );
}
