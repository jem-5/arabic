import { DisplayStats } from "@/components/DisplayStats";
import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  return (
    <main className="flex-grow flex flex-col items-center  ">
      <DisplayStats />
      <Dashboard />
    </main>
  );
}
