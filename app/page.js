import { Stats } from "@/components/Stats";
import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  return (
    <main className="flex-grow flex flex-col items-center min-w-full ">
      <Dashboard />
    </main>
  );
}
