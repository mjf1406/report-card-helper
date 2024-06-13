import Link from "next/link";
import NewClassDialog from "~/components/classes/NewClassDialog";
import { ModeToggle } from "~/components/theme-toggle";

export default function HomePage() {
  return (
    <main className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center gap-2">
      <NewClassDialog />
      <ModeToggle />
    </main>
  );
}
