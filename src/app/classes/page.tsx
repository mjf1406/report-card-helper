"use client";

import TopNav from "~/components/ui/navigation/TopNav";
import NewClassDialog from "~/components/classes/NewClassDialog";
import ClassList from "~/components/classes/ClassList";

export default function Classes() {
  return (
    <div>
      <TopNav />
      <main className="flex min-h-screen flex-col items-center bg-background text-text">
        <div className="container flex flex-col items-center gap-12 px-4 py-16 ">
          <div>
            <h1 className="text-5xl">My Classes</h1>
          </div>
          <NewClassDialog />
          <ClassList />
        </div>
      </main>
    </div>
  );
}
