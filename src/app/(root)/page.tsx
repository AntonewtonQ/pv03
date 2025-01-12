import Menu from "@/components/menu";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <main className="max-w-[1440px]">
        <Menu />
      </main>
      <footer></footer>
    </div>
  );
}
