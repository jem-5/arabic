import Image from "next/image";
import BgImg from "../public/bg.jpg";
import { DisplayStats } from "@/components/DisplayStats";
import { DisplayModules } from "@/components/DisplayModules";

export default function Home() {
  return (
    <main className="flex-grow flex flex-col items-center  ">
      <DisplayStats />
      <DisplayModules />
      <Image
        src={BgImg}
        fill
        alt="hero"
        priority
        className="bg-contain -z-30 "
      />
    </main>
  );
}
