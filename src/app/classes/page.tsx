"use client";

import TopNav from "~/components/ui/navigation/TopNav";
import NewClassDialog from "~/components/classes/NewClassDialog";
import ClassList from "~/components/classes/ClassList";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import addDemoClasses from "~/server/actions/addDemoClasses";
import { Loader2 } from "lucide-react";

export default function Classes() {
  const [isLoading, setLoading] = useState(false);

  async function addDemos() {
    setLoading(true);
    await addDemoClasses();
    window.location.reload();
    setLoading(false);
  }

  return (
    <div>
      <TopNav />
      <main className="text-text flex min-h-screen flex-col items-center bg-background">
        <div className="container flex flex-col items-center gap-12 px-4 py-16 ">
          <div>
            <h1 className="text-5xl">My Classes</h1>
          </div>
          <div className="flex gap-5">
            <NewClassDialog />
            <Button
              variant={"secondary"}
              disabled={isLoading}
              onClick={addDemos}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Adding classes...
                </>
              ) : (
                <>Add demo classes</>
              )}
            </Button>
          </div>
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
