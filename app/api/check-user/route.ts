// // app/api/check-user/route.ts

// import { NextResponse } from "next/server";
// import prisma from "@/prisma"; // Adjust this path if needed

// export async function POST(request: Request) {
//   const { email } = await request.json();

//   // Check if a user with this email already exists
//   const user = await prisma.user.findUnique({
//     where: { email },
//   });

//   if (user) {
//     return NextResponse.json({ exists: true });
//   } else {
//     return NextResponse.json({ exists: false });
//   }
// }
import type { Prisma } from "@prisma/client";
import type { NextApiRequest } from "next";

import { defaultResponder } from "@calcom/lib/server";
import prisma from "@calcom/prisma";

import { withMiddleware } from "~/lib/helpers/withMiddleware";
import { schemaQuerySingleOrMultipleUserEmails } from "~/lib/validations/shared/queryUserEmail";
import { schemaUsersReadPublic } from "~/lib/validations/user";

export async function getHandler(req: NextApiRequest) {
  const {
    userId,
    isSystemWideAdmin,
    pagination: { take, skip },
  } = req;
  const where: Prisma.UserWhereInput = {};
  // If user is not ADMIN, return only his data.
  if (!isSystemWideAdmin) where.id = userId;

  if (req.query.email) {
    const validationResult = schemaQuerySingleOrMultipleUserEmails.parse(req.query);
    where.email = {
      in: Array.isArray(validationResult.email) ? validationResult.email : [validationResult.email],
    };
  }

  const [total, data] = await prisma.$transaction([
    prisma.user.count({ where }),
    prisma.user.findMany({ where, take, skip }),
  ]);
  const users = schemaUsersReadPublic.parse(data);
  return { users, total };
}

export default withMiddleware("pagination")(defaultResponder(getHandler));