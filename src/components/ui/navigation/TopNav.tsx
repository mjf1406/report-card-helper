"use client";

import * as React from "react";
import DesktopNav from "~/components/ui/navigation/DesktopNav";
import MobileNav from "~/components/ui/navigation/MobileNav";
import { usePathname } from "next/navigation";

export default function TopNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0">
      <div className="sticky top-0 z-10 block md:hidden">
        <MobileNav page={pathname} />
      </div>
      <div className="sticky top-0 z-10 hidden sm:hidden md:block">
        <DesktopNav page={pathname} />
      </div>
    </div>
  );
}
