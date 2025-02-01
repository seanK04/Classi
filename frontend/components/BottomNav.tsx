"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, List, Trophy, User, Plus } from "lucide-react";
import { Icon } from "lucide-react";

// Define the type for navigation items
interface NavItem {
  name: string;
  href: string;
  icon: Icon;
}

// Navigation items array (Added "Search" with Plus Icon)
const navItems: NavItem[] = [
  { name: "Feed", href: "/feed", icon: Home },
  { name: "Your Classes", href: "/classes", icon: List },
  { name: "Search", href: "/search", icon: Plus }, // Added Search tab
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Profile", href: "/profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md border-t border-gray-300">
      <div className="flex justify-around py-2">
        {navItems.map(({ name, href, icon: Icon }) => (
          <Link key={href} href={href} className="flex flex-col items-center text-gray-600 hover:text-black">
            <Icon
              className={`w-6 h-6 ${pathname === href ? "text-black" : "text-gray-500"}`}
            />
            <span className={`text-xs ${pathname === href ? "font-semibold text-black" : "text-gray-500"}`}>
              {name}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
