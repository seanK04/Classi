"use client"; // Ensure client-side navigation

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/feed"); // Automatically redirects to the /feed route
}
