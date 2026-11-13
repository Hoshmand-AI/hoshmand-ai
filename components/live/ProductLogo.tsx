/* eslint-disable @next/next/no-img-element */
// The product's own mark, served by the product (its card names the file). A plain <img>: the
// image lives on the product's origin and changes when the product changes it, so it is not
// copied or optimised here. Decorative next to the product's name, so alt is empty.
export default function ProductLogo({ src, size = 48, className = "" }: { src?: string; size?: number; className?: string }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
