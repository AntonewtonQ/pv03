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
import { useTranslations } from "next-intl";

const AboutDesc = () => {
  const t = useTranslations("About");
  return (
    <div className="text-white px-6 md:px-14 py-6">
      <div className="mx-auto px-10 max-w-6xl flex flex-col gap-6">
        <div className="space-y-4 mb-2">
          <h1 className="font-bold text-4xl">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="border border-muted-foreground rounded-xl p-4 lg:flex gap-2">
          <div className="lg:w-1/2">
            <Image src="/my-avatar.png" width={500} height={500} alt="Avatar" />
          </div>
          <div className="lg:w-full p-4 ">
            <div className="space-y-3 py-6">
              <p className="text-muted-foreground uppercase">
                {t("introduction.title")}
              </p>
              <h2 className="text-white font-bold lg:text-2xl text-xl">
                {t("introduction.subtitle")}
              </h2>
              <p className="text-white lg:text-lg text-md">
                {t("introduction.description")}
              </p>
              <p className="text-white lg:text-lg text-md">
                {t("introduction.description2")}
              </p>
            </div>
            <Separator className="my-4 text-muted-foreground" />
            <div className="py-4 grid lg:grid-cols-3 grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="flex flex-1 gap-2 text-sm">
                  <Music className="" size={20} />
                  <span>{t("curiosity.music.title")}</span>
                </p>
                <p className="text-muted-foreground text-sm">
                  {t("curiosity.music.description")}
                </p>
              </div>

              <div className="space-y-2">
                <p className="flex flex-1 gap-2 text-sm">
                  <MapPin className="" size={20} />
                  <span>{t("curiosity.city.title")}</span>
                </p>
                <p className="text-muted-foreground text-sm">
                  {t("curiosity.city.title")}
                </p>
              </div>
              <div className="space-y-2">
                <p className="flex flex-1 gap-2 text-sm">
                  <Film className="" size={20} />
                  <span>{t("curiosity.interests.title")}</span>
                </p>
                <p className="text-muted-foreground text-sm">
                  {t("curiosity.interests.description")}
                </p>
              </div>
              <div className="space-y-2">
                <p className="flex flex-1 gap-2 text-sm">
                  <FlameKindling className="" size={20} />
                  <span>{t("curiosity.ministry.title")}</span>
                </p>
                <p className="text-muted-foreground text-sm">
                  {t("curiosity.ministry.description")}
                </p>
              </div>
              <div className="space-y-2">
                <p className="flex flex-1 gap-2 text-sm">
                  <Pizza className="" size={20} />
                  <span>{t("curiosity.food.title")}</span>
                </p>
                <p className="text-muted-foreground text-sm">
                  {t("curiosity.food.description")}
                </p>
              </div>

              <div className="space-y-2">
                <p className="flex flex-1 gap-2 text-sm">
                  <Laptop className="" size={20} />
                  <span>{t("curiosity.system.title")}</span>
                </p>
                <p className="text-muted-foreground text-sm">
                  {t("curiosity.system.description")}
                </p>
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
