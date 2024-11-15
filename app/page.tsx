// app/page.tsx

import { redirect } from "next/navigation";

export default function HomePageRedirect() {
  redirect("/marketing"); // Redirects to your marketing page
}
