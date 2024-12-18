import { ReactNode } from "react";

export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-2 mt-2">
      <div className="flex flex-col space-y-6">{children}</div>
    </div>
  );
}
