import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Facebook,
  Github,
  Instagram,
  Linkedin,
} from "lucide-react";

const Menu = () => {
  return (
    <div className="mx-auto px-6 py-8 flex flex-col gap-4">
      <div className="flex items-center justify-between rounded-lg">
        <p className="text-muted-foreground flex gap-2 text-sm">
          <Building2 size={16} />
          <span> Luanda, Angola</span>
        </p>
      </div>
      <header className="flex flex-col gap-2">
        <h1 className="text-white text-xl font-bold">antonewtonquima</h1>
        <p className="text-muted-foreground text-sm capitalize">
          Front-end Developer / student
        </p>
      </header>
      <div className="flex flex-col">
        <h2 className="mb-6 font-medium text-muted-foreground uppercase">
          Menu
        </h2>
        <ul className="flex flex-col items-start gap-2">
          <Link className="w-full" href="/about">
            <Button className="w-full text-muted-foreground flex text-start bg-black justify-between ">
              About
              <ArrowRight className="text-white" />
            </Button>
          </Link>
          <Link className="w-full" href="/projects">
            <Button className="w-full text-muted-foreground flex text-start bg-black justify-between">
              Projects
              <ArrowRight className="text-white" />
            </Button>
          </Link>
          <Link className="w-full" href="/setup">
            <Button className="w-full text-muted-foreground flex text-start bg-black justify-between">
              Setup
              <ArrowRight className="text-white" />
            </Button>
          </Link>
          <Link className="w-full" href="/shop">
            <Button className="w-full text-muted-foreground flex text-start bg-black justify-between">
              Shop
              <ArrowRight className="text-white" />
            </Button>
          </Link>
          <Link className="w-full" href="/contact">
            <Button className="w-full text-muted-foreground flex text-start bg-black justify-between">
              Contact
              <ArrowRight className="text-white" />
            </Button>
          </Link>
        </ul>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="mb-6 font-medium text-muted-foreground uppercase">
          Anothers Links
        </h2>
        <div className="grid grid-cols-1 gap-2 px-4 lg:grid-cols-2 ">
          <Link
            className="text-white font-bold flex justify-start items-start gap-2"
            href="https://www.facebook.com/newton.quima.9/"
          >
            <Button className="w-full flex items-start justify-start bg-black border-[0.5px] border-muted-foreground rounded-sm">
              <Facebook /> <span>Facebook</span>
            </Button>
          </Link>

          <Link
            className="text-white font-bold flex  gap-2"
            href="https://instagram.com/antonewton_"
          >
            <Button className="w-full flex items-start justify-start bg-black  border-[0.5px] border-muted-foreground rounded-sm">
              <Instagram />
              <span>Instagram</span>
            </Button>
          </Link>
          <Link
            className="text-white font-bold flex items-center justify-center gap-4"
            href="https://github.com/AntonewtonQ"
          >
            <Button className="w-full flex items-start justify-start bg-black  border-[0.5px] border-muted-foreground rounded-sm">
              <Github /> <span>GitHub</span>
            </Button>
          </Link>
          <Link
            className="text-white font-bold flex items-center justify-center gap-4"
            href="https://www.linkedin.com/in/antonewton-quima-95aaa3238/"
          >
            <Button className="w-full flex items-start justify-start bg-black border-[0.5px] border-muted-foreground rounded-sm">
              <Linkedin /> <span>LinkedIn</span>
            </Button>
          </Link>
        </div>
      </div>
      <div className="border-t-2 border-muted-foreground w-full flex py-4 justify-end items-end">
        <Link href="/versions" className="">
          <Button className="text-muted-foreground  bg-black">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>v3.0
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Menu;
