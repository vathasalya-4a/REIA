import { getSession } from "@/lib/auth";
import { HttpError } from "@/lib/utils";
import prisma from "@/prisma";
import { Post, Site } from "@prisma/client";

export function withSiteAuthOld(action: (site: Site, ...args: any) => any) {
  return async (
    siteId: string,
    formData: FormData | null,
    key: string | null,
  ) => {
    const session = await getSession();
    if (!session) {
      return {
        error: "Not authenticated",
      };
    }
    const site = await prisma.site.findUnique({
      where: {
        id: siteId,
      },
      include: {
        users: {
          select: {
            userId: true,
          },
        },
      },
    });
    if (!site || !site.users.map((s) => s.userId).includes(session.user.id)) {
      return {
        error: "Not authorized",
      };
    }

    return action(site, formData, key);
  };
}

export function withSiteAuth(
  action: (site: Site, ...args: any) => Promise<Site | Post>,
) {
  return async (
    siteId: string,
    formData: FormData | null,
    key: string | null,
  ) => {
    if (!siteId) throw new HttpError("Site not found", 404);

    const session = await getSession();
    if (!session) {
      throw new HttpError("Not authenticated", 401);
    }

    const site = await prisma.site.findUnique({
      where: {
        id: siteId,
      },
      include: {
        users: {
          select: {
            userId: true,
            role: true,
          },
        },
      },
    });

    if (site) {
      if (site.users && site.users.length === 0) {
        const pendingInvites = await prisma.siteInvite.findUnique({
          where: {
            email_siteId: {
              email: session.user.email,
              siteId: site.id,
            },
          },
          select: {
            expires: true,
          },
        });
        if (!pendingInvites) {
          throw new HttpError("Site not found", 404);
        } else if (pendingInvites.expires < new Date()) {
          throw new HttpError("Site invite expired.", 410);
        } else {
          throw new HttpError("Site invite pending.", 409);
        }
      }
    } else {
      throw new HttpError("Site not found", 404);
    }

    return action(site, formData, key);
  };
}
