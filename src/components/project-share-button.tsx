"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface ProjectShareButtonProps {
  title: string;
  text: string;
  shareLabel: string;
  copiedLabel: string;
}

export default function ProjectShareButton({
  title,
  text,
  shareLabel,
  copiedLabel,
}: ProjectShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title,
      text,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      return;
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => void handleShare()}
      className="h-11 justify-between border border-white/10 bg-white/[0.03] px-4 text-sm text-white hover:bg-white/10 hover:text-white"
    >
      {copied ? copiedLabel : shareLabel}
      {copied ? <Check /> : <Share2 />}
    </Button>
  );
}
