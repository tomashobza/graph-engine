import Graph from "@/components/Graph";

export default function Home() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-4">
      <div className="w-full h-[30rem] border">
        <Graph />
      </div>
    </div>
  );
}
