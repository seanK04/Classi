import { Bell, Menu } from "lucide-react";
import Image from "next/image";

export default function TopNav() {
  return (
    <header className="sticky top-0 bg-white shadow-md z-50">
      <div className="flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <div className="flex items-center">
          <Image src="/logo.png" alt="Classi Logo" width={80} height={30} />
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          {/* Bell Icon */}
          <div>
            <Bell className="w-6 h-6 text-gray-600 hover:text-black" />
          </div>

          {/* Menu Icon */}
          <div>
            <Menu className="w-6 h-6 text-gray-600 hover:text-black" />
          </div>
        </div>
      </div>
    </header>
  );
}
