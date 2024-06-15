import TopNav from "~/components/ui/navigation/TopNav";

interface Params {
  classId: string;
}

export default function EditClass({ params }: { params: Params }) {
  return (
    <>
      <TopNav />
      <div className="flex w-full justify-center">
        <h1 className="text-4xl">Editing class {params.classId}</h1>
      </div>
    </>
  );
}
