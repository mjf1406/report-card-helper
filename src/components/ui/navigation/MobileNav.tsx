"use client";

import * as React from "react";
import Link from "next/link";
import Logo from "~/components/brand/Logo";
import { Loader2, User, Menu } from "lucide-react";

import { ModeToggle } from "~/components/theme-toggle";
import { Button } from "~/components/ui/button";

import { cn } from "~/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import {
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
  useClerk,
} from "@clerk/clerk-react";
import { Skeleton } from "~/components/ui/skeleton";

interface MobileNavProps {
  page: string;
}

const MobileNav: React.FC<MobileNavProps> = ({ page }) => {
  const { isSignedIn } = useAuth();
  const { loaded } = useClerk();
  const [loading, setLoading] = React.useState(true);
  const [isLoading, loadingSignIn] = React.useState(false);
  const [isMenuOpen, setMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleClick = (e) => {
    loadingSignIn(true);
  };

  React.useEffect(() => {
    if (loaded) {
      setLoading(false);
    }
  }, [loaded]);

  return (
    <div>
      <div className="sticky top-0 m-auto flex w-full items-center justify-between border-b border-accent bg-background">
        <div className="m-auto grid h-14 w-full grid-cols-2 items-center justify-between px-4 md:px-6">
          <div className="flex flex-row items-center justify-start gap-2">
            <div>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => setMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-7 w-7"></Menu>
              </Button>
            </div>
            <div>
              {page === "/" ? (
                <Link className="flex gap-2 font-semibold" href="#hero">
                  <Logo fill="hsl(var(--primary))" size="30" />
                  <span className="hidden text-2xl md:block">Reparper</span>
                </Link>
              ) : (
                <Link className="flex gap-2 font-semibold" href="/">
                  <Logo fill="hsl(var(--primary))" size="30" />
                  <span className="hidden text-2xl md:block">Reparper</span>
                </Link>
              )}
            </div>
          </div>
          <div className="flex flex-row items-center justify-end gap-4">
            {!isSignedIn ? (
              <SignedOut>
                <div>
                  {isLoading ? (
                    <Button
                      disabled={true}
                      className="flex items-center justify-center gap-2"
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading...</span>
                    </Button>
                  ) : (
                    <Button asChild onClick={handleClick}>
                      <Link href="/auth/sign-in">Sign in</Link>
                    </Button>
                  )}
                </div>
              </SignedOut>
            ) : loaded ? (
              <div>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            ) : (
              <div>
                <Skeleton className="flex h-[30px] w-[30px] items-center justify-center rounded-full">
                  <User></User>
                </Skeleton>
              </div>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
      <div
        className={`m-auto -mx-4 flex h-full w-full justify-self-start bg-[color:hsl(144,50%,86%)] dark:bg-[color:hsl(147,47%,9%)] ${
          isMenuOpen ? "fixed" : "hidden"
        }`}
      >
        {page === "/" ? (
          <NavigationMenu className=" z-20 m-auto flex w-full flex-col justify-start gap-10 p-3 text-2xl">
            <NavigationMenuList className="flex w-full flex-col justify-start text-2xl">
              <NavigationMenuItem>
                <Link href="/classes" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    My classes
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        ) : (
          <NavigationMenu></NavigationMenu>
        )}
      </div>
    </div>
  );
};
export default MobileNav;
