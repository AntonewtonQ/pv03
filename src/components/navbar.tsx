"use client";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ChevronLeft, PanelRight } from "lucide-react";

import { navLinks } from "@/constants/navlinks";

import { usePathname } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname();

  return (
    <div className="p-6 md:p-14">
      <div className="mx-auto p-6 max-w-6xl border-2 border-red-200 flex items-center justify-between">
        <div>
          <Link className="w-full" href="/">
            <Button className="w-full text-muted-foreground flex text-start bg-black justify-between hover:text-white hover:bg-black">
              <ChevronLeft />
              <span className="capitalize">voltar</span>
            </Button>
          </Link>
        </div>
        <div className="">
          <Button className="hidden">
            <PanelRight />
          </Button>
          <nav className="flex">
            {navLinks.map((link) => (
              <Link className="w-full" href={link.href} key={link.label}>
                <Button
                  className={`w-full flex text-start bg-black justify-between hover:text-white hover:bg-black ${
                    pathname == link.href
                      ? "text-white"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
