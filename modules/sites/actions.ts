"use server";

import { getSession } from "@/lib/auth";
import { revalidateTag } from "next/cache";
import { Site } from "@prisma/client";
import {
  addDomainToVercel,
  removeDomainFromVercelProject,
  validDomainRegex,
} from "@/lib/domains";
import { getBlurDataURL, nanoid } from "@/lib/utils";
import { put } from "@vercel/blob";
import prisma from "@/prisma";
import { withSiteAuth } from "./auth";

export const createSite = async (formData: FormData, projectId: string) => {
  // Extract fields from formData
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const linkedinURL = formData.get("linkedinURL") as string;
  const location = formData.get("location") as string;
  const workauthorization = formData.get("workauthorization") as string;
  const salaryexpectations = parseInt(formData.get("salaryexpectations") as string, 10) || null;
  const availablehours = parseInt(formData.get("availablehours") as string, 10) || null;
  const documentsS3URL = formData.get("documentsS3URL") as string;
  const image = formData.get("image") as string || undefined; // Optional
  const imageBlurhash = formData.get("imageBlurhash") as string || undefined; // Optional

  try {
    // Create a new candidate using Prisma
    const response = await prisma.candidate.create({
      data: {
        name,
        email,
        phone,
        linkedinURL,
        location,
        workauthorization,
        salaryexpectations,
        availablehours,
        documentsS3URL,
        image,
        imageBlurhash,
        project: {
          connect: {
            id: projectId, // Connect candidate to the project
          },
        },
      },
    });

    return response; // Return the created candidate object
  } catch (error: any) {
    console.error("Error creating candidate:", error.message);
    return {
      error: error.message,
    };
  }
};

export const updateSite = withSiteAuth(
  async (site: Site, formData: FormData, key: string) => {
    const value = formData.get(key) as string;

    try {
      let response;

      if (key === "customDomain") {
        if (value.includes("vercel.pub")) {
          return {
            error: "Cannot use vercel.pub subdomain as your custom domain",
          };

          // if the custom domain is valid, we need to add it to Vercel
        } else if (validDomainRegex.test(value)) {
          response = await prisma.site.update({
            where: {
              id: site.id,
            },
            data: {
              customDomain: value,
            },
          });
          await Promise.all([
            addDomainToVercel(value),
            // Optional: add www subdomain as well and redirect to apex domain
            // addDomainToVercel(`www.${value}`),
          ]);

          // empty value means the user wants to remove the custom domain
        } else if (value === "") {
          response = await prisma.site.update({
            where: {
              id: site.id,
            },
            data: {
              customDomain: null,
            },
          });
        }
        if (site.customDomain && site.customDomain !== value) {
          response = await removeDomainFromVercelProject(site.customDomain);
        }
      } else if (key === "image" || key === "logo") {
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
          return {
            error:
              "Missing BLOB_READ_WRITE_TOKEN token. Note: Vercel Blob is currently in beta – ping @steventey on Twitter for access.",
          };
        }

        const file = formData.get(key) as File;
        const filename = `${nanoid()}.${file.type.split("/")[1]}`;

        const { url } = await put(filename, file, {
          access: "public",
        });

        const blurhash = key === "image" ? await getBlurDataURL(url) : null;

        response = await prisma.site.update({
          where: {
            id: site.id,
          },
          data: {
            [key]: url,
            ...(blurhash && { imageBlurhash: blurhash }),
          },
        });
      } else {
        response = await prisma.site.update({
          where: {
            id: site.id,
          },
          data: {
            [key]: value,
          },
        });
      }
      console.log(
        "Updated site data! Revalidating tags: ",
        `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
        `${site.customDomain}-metadata`,
      );
      await revalidateTag(
        `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
      );
      site.customDomain &&
        (await revalidateTag(`${site.customDomain}-metadata`));

      return response;
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          error: `This ${key} is already taken`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);

export const deleteSite = withSiteAuth(
  async (site: Site, formData: FormData, key: string) => {
    // try {
    const response = await prisma.site.delete({
      where: {
        id: site.id,
      },
    });
    await revalidateTag(
      `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
    );
    response.customDomain &&
      (await revalidateTag(`${site.customDomain}-metadata`));
    return response;
  },
);
