"use client";

import * as React from "react";
import Link from "next/link";
import Logo from "~/components/brand/Logo";
import { Loader2, User } from "lucide-react";

import { ModeToggle } from "~/components/theme-toggle";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

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
import { Skeleton } from "../skeleton";

interface DesktopNavProps {
  page: string;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ page }) => {
  const { isSignedIn } = useAuth();
  const { loaded } = useClerk();
  const [loading, setLoading] = React.useState(true);

  const [isLoading, loadingSignIn] = React.useState(false);

  const handleClick = () => {
    loadingSignIn(true);
  };

  React.useEffect(() => {
    if (loaded) {
      setLoading(false);
    }
  }, [loaded]);

  return (
    <div className="sticky top-0 m-auto flex w-full items-center justify-between border-b border-accent bg-background">
      <div className="m-auto grid h-14 w-full max-w-5xl grid-cols-3 items-center justify-between px-4 md:px-6">
        <div className="flex-1 items-center justify-start">
          {page === "/" ? (
            <Link className="flex gap-2 font-semibold" href="#hero">
              <Logo fill="hsl(var(--primary))" size="30" />
              <div className="hidden flex-row gap-1 text-2xl md:flex">
                <div>Reparper</div>
                <div className="text-top justify-start self-start text-xs">
                  [BETA]
                </div>
              </div>
            </Link>
          ) : (
            <Link className="flex flex-row gap-2 font-semibold" href="/">
              <Logo fill="hsl(var(--primary))" size="30" />
              <div className="hidden flex-row gap-1 text-2xl md:flex">
                <div>Reparper</div>
                <div className="text-top justify-start self-start text-xs">
                  [BETA]
                </div>
              </div>
            </Link>
          )}
        </div>
        <div className="flex-1 items-center justify-center">
          {page === "/" ? (
            <NavigationMenu className="m-auto flex flex-row items-center justify-center">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/classes" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
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
        <div className="flex items-center justify-end gap-4">
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
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
export default DesktopNav;
