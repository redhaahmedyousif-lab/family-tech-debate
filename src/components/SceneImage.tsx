"use client";

import { useEffect, useRef, useState } from "react";
import SceneIllustration from "./SceneIllustration";

type Props = {
  src: string;
  alt: string;
  variant: "traditional" | "digital";
  className?: string;
};

/** Renders the photo from public/images, falling back to an SVG illustration if it is missing. */
export default function SceneImage({ src, alt, variant, className = "" }: Props) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // The image may have errored before hydration attached onError.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return <SceneIllustration variant={variant} className={`h-full w-full object-cover ${className}`} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- plain <img> so a missing file can fall back gracefully
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
