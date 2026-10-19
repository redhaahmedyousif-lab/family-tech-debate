"use client";

import { useEffect, useState } from "react";
import TraditionalFamilySVG from "./TraditionalFamilySVG";
import DigitalFamilySVG from "./DigitalFamilySVG";

type Props = {
  src: string;
  alt: string;
  variant: "traditional" | "digital";
  className?: string;
};

/**
 * Shows the hand-drawn SVG scene by default. If a photo exists at `src`
 * (public/images/...), it is swapped in once it has loaded successfully.
 */
export default function SceneImage({ src, alt, variant, className = "" }: Props) {
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}`;
    const img = new Image();
    img.onload = () => setPhoto(url);
    img.src = url;
    return () => {
      img.onload = null;
    };
  }, [src]);

  if (photo) {
    // eslint-disable-next-line @next/next/no-img-element -- static export; photo is optional
    return <img src={photo} alt={alt} className={`h-full w-full object-cover ${className}`} />;
  }

  const Illustration = variant === "traditional" ? TraditionalFamilySVG : DigitalFamilySVG;
  return <Illustration className={`h-full w-full ${className}`} />;
}
