import TopNav from "~/components/ui/navigation/TopNav";

interface Params {
  studentId: string;
}

export default function EditStudent({ params }: { params: Params }) {
  return (
    <>
      <TopNav />
      <div className="flex w-full justify-center">
        <h1 className="text-4xl">Editing student {params.studentId}</h1>
      </div>
    </>
  );
}
