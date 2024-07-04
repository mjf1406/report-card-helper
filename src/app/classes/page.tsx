"use client";

import TopNav from "~/components/ui/navigation/TopNav";
import NewClassDialog from "~/components/classes/NewClassDialog";
import ClassList from "~/components/classes/ClassList";

export default function Classes() {
  return (
    <div>
      <TopNav />
      <main className="text-text flex min-h-screen flex-col items-center bg-background">
        <div className="container flex flex-col items-center gap-12 px-4 py-16 ">
          <div>
            <h1 className="text-5xl">My Classes</h1>
          </div>
          <NewClassDialog />
          <div className="text-center text-base">
            ⚠️ The &quot;Sx&quot; buttons only appear once you have completed
            all fields for a semester. ⚠️
          </div>
          <ClassList />
        </div>
      </main>
    </div>
  );
}
