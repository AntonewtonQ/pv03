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
            <div className="space-y-3 py-6">
              <p className="text-muted-foreground uppercase">Introduction</p>
              <h2 className="text-white font-bold lg:text-2xl text-xl">
                Software Developer passionate about tech, startups, and personal
                projects
              </h2>
              <p className="text-white lg:text-lg text-md">
                Antonewton Quima is a passionate software developer and computer
                engineering student at ISPTEC, as well as a student at 42
                School, dedicated to building innovative solutions that make an
                impact. With expertise in frontend development, he specializes
                in Next.js, Tailwind CSS, TypeScript, and Shadcn, crafting
                modern and user-friendly web applications.
              </p>
              <p className="text-white lg:text-lg text-md">
                Antonewton is committed to continuous learning, collaboration,
                and delivering high-quality digital experiences.
              </p>
            </div>
            <Separator className="my-4 text-muted-foreground" />
            <div className="py-4 grid lg:grid-cols-3 grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="flex flex-1 gap-2 text-sm">
                  <Music className="" size={20} />
                  <span>Music</span>
                </p>
                <p className="text-muted-foreground text-sm">Lofi</p>
              </div>

              <div className="space-y-2">
                <p className="flex flex-1 gap-2 text-sm">
                  <MapPin className="" size={20} />
                  <span>City</span>
                </p>
                <p className="text-muted-foreground text-sm">
                  Talatona, Luanda
                </p>
              </div>
              <div className="space-y-2">
                <p className="flex flex-1 gap-2 text-sm">
                  <Film className="" size={20} />
                  <span>Interests</span>
                </p>
                <p className="text-muted-foreground text-sm">
                  Entrepreneurship
                </p>
              </div>
              <div className="space-y-2">
                <p className="flex flex-1 gap-2 text-sm">
                  <FlameKindling className="" size={20} />
                  <span>Ministry</span>
                </p>
                <p className="text-muted-foreground text-sm">Pathfinder</p>
              </div>
              <div className="space-y-2">
                <p className="flex flex-1 gap-2 text-sm">
                  <Pizza className="" size={20} />
                  <span>Food</span>
                </p>
                <p className="text-muted-foreground text-sm">Arroz Doce</p>
              </div>

              <div className="space-y-2">
                <p className="flex flex-1 gap-2 text-sm">
                  <Laptop className="" size={20} />
                  <span>System</span>
                </p>
                <p className="text-muted-foreground text-sm">Linux-Ubuntu</p>
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
