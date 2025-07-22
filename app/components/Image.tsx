"use client";
import { CldImage } from 'next-cloudinary';

// By default, the CldImage component applies auto-format and auto-quality to all delivery URLs for optimized delivery.
interface ImageProps {
    src: string;
    className?: string;
    width?:number;
    height?:number;
    }


export default function ImageComponent({src, className="rounded-md", width = 100, height = 100}: ImageProps) {
  return (
    <CldImage
      src={src}// Use this sample image or upload your own via the Media Explorer
      width={width} // Transform the image: auto-crop to square aspect_ratio
      height={height}
      crop={{
        type: 'auto',
        source: true
      }}
      alt='Sample Image'
      className={className}
    />
  );
}