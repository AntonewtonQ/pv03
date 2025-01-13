import { Film, Laptop, MapPin, Music, Pizza, Tv } from "lucide-react";
import Image from "next/image";

const AboutDesc = () => {
  return (
    <div className="text-white px-6 md:px-14 py-6">
      <div className="mx-auto px-10 max-w-7xl flex flex-col gap-6">
        <div className="space-y-4 mb-10">
          <h1 className="font-bold text-4xl">About</h1>
          <p className="text-muted-foreground">
            Meet Antonewton, a skilled Front-end Developer.
          </p>
        </div>
        <div className="border border-muted-foreground rounded-xl p-4 lg:flex gap-2">
          <div className="lg:w-1/2">
            <Image src="/avatar.png" width={500} height={500} alt="Avatar" />
          </div>
          <div className="lg:w-full p-4 ">
            <div className="space-y-6 border-b border-muted-foreground py-6">
              <p className="text-muted-foreground uppercase">Introduction</p>
              <h2 className="text-white font-bold lg:text-3xl text-2xl">
                Front-end Developer passionate about tech, coffee, and personal
                projects
              </h2>
              <p className="text-white lg:text-xl text-md">
                With around 2 years of experience in front-end development, I am
                currently working remotely with Actio Software. I enjoy creating
                dynamic user experiences and have experience with a range of
                technologies including React, Next.js, and Tailwind CSS.
                Additionally, I enjoy helping others improve their skills by
                creating tutorials and sharing insights on social media.
              </p>
            </div>
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
                  <span>Movie</span>
                </p>
                <p className="text-muted-foreground">Gifted hands</p>
              </div>
              <div className="space-y-2">
                <p className="flex flex-1 gap-2">
                  <Tv className="" />
                  <span>TV Show</span>
                </p>
                <p className="text-muted-foreground">Supernatural</p>
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
                <p className="text-muted-foreground">Linux</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-muted-foreground rounded-xl p-4 lg:flex gap-2">
          career for me
        </div>
      </div>
    </div>
  );
};

export default AboutDesc;
