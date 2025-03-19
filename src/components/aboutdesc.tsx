import {
  Briefcase,
  Film,
  FlameKindling,
  Laptop,
  MapPin,
  Music,
  Pizza,
} from "lucide-react";
import Image from "next/image";
import AboutAcordion from "./aboutacordion";
import { Separator } from "./ui/separator";
import Carrier from "./career";
import Career from "./career";

const AboutDesc = () => {
  return (
    <div className="text-white px-6 md:px-14 py-6">
      <div className="mx-auto px-10 max-w-6xl flex flex-col gap-6">
        <div className="space-y-4 mb-2">
          <h1 className="font-bold text-4xl">About</h1>
          <p className="text-muted-foreground">
            Meet Antonewton, a skilled Front-end Developer.
          </p>
        </div>
        <div className="border border-muted-foreground rounded-xl p-4 lg:flex gap-2">
          <div className="lg:w-1/2">
            <Image src="/my-avatar.png" width={500} height={500} alt="Avatar" />
          </div>
          <div className="lg:w-full p-4 ">
            <div className="space-y-6 py-6">
              <p className="text-muted-foreground uppercase">Introduction</p>
              <h2 className="text-white font-bold lg:text-3xl text-2xl">
                Front-end Developer passionate about tech, innovation, and
                personal projects
              </h2>
              <p className="text-white lg:text-xl text-md">
                Antonewton Quima is a passionate software developer and computer
                engineering student at ISPTEC, as well as a student at 42
                School, dedicated to building innovative solutions that make an
                impact. With expertise in frontend development, he specializes
                in Next.js, Tailwind CSS, TypeScript, and Shadcn, crafting
                modern and user-friendly web applications.
              </p>
              <p className="text-white lg:text-xl text-md">
                Antonewton is committed to continuous learning, collaboration,
                and delivering high-quality digital experiences.
              </p>
            </div>
            <Separator className="my-4 text-muted-foreground" />
            <div className="py-4 grid lg:grid-cols-3 grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="flex flex-1 gap-2">
                  <Music className="" />
                  <span>Music</span>
                </p>
                <p className="text-muted-foreground">Lofi</p>
              </div>

              <div className="space-y-2">
                <p className="flex flex-1 gap-2">
                  <MapPin className="" />
                  <span>City</span>
                </p>
                <p className="text-muted-foreground">Talatona, Luanda</p>
              </div>
              <div className="space-y-2">
                <p className="flex flex-1 gap-2">
                  <Film className="" />
                  <span>Interests</span>
                </p>
                <p className="text-muted-foreground">Entrepreneurship</p>
              </div>
              <div className="space-y-2">
                <p className="flex flex-1 gap-2">
                  <FlameKindling className="" />
                  <span>Ministry</span>
                </p>
                <p className="text-muted-foreground">Pathfinder</p>
              </div>
              <div className="space-y-2">
                <p className="flex flex-1 gap-2">
                  <Pizza className="" />
                  <span>Food</span>
                </p>
                <p className="text-muted-foreground">Arroz Doce</p>
              </div>

              <div className="space-y-2">
                <p className="flex flex-1 gap-2">
                  <Laptop className="" />
                  <span>System</span>
                </p>
                <p className="text-muted-foreground">Linux-Ubuntu</p>
              </div>
            </div>
          </div>
        </div>

        <Career />
      </div>
    </div>
  );
};

export default AboutDesc;
