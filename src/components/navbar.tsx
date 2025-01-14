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
    <div className="px-6 md:px-14 md:py-6">
      <div className="mx-auto p-6 max-w-6xl flex items-center justify-between">
        <div>
          <Link className="w-full" href="/">
            <Button className="w-full text-muted-foreground flex text-start bg-black justify-between hover:text-white hover:bg-black">
              <ChevronLeft />
              <span className="capitalize">Back</span>
            </Button>
          </Link>
        </div>
        <div className="">
          <Button className="lg:hidden text-muted-foreground bg-black hover:text-white hover:bg-black">
            <PanelRight />
          </Button>
          <nav className="hidden overflow-hidden lg:flex">
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
