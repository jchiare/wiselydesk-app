"use client";
import Image from "next/image";

export function UserProfile({ imageUrl }: { imageUrl: string | undefined }) {
  return (
    <Image
      src={
        imageUrl ? decodeURIComponent(imageUrl) : "/profile_picture_backup.png"
      }
      alt="Profile Picture"
      width={40}
      height={40}
      placeholder="blur"
      className="h-6 w-6 overflow-hidden rounded-full bg-gray-100"
    />
  );
}
