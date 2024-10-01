import { Stats } from "@/components/Stats";
import { Dashboard } from "@/components/Dashboard";

export const metadata = {
  alternates: {
    canonical: "https://arabicroad.com/dashboard/",
  },
};

export default function Home() {
  return (
    <main className="flex-grow flex flex-col items-start min-w-full ">
      <Dashboard />
    </main>
  );
}
