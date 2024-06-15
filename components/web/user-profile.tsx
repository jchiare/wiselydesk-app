"use client";
import Image from "next/image";
import BackupProfilePicture from "@/public/profile_picture_backup.png";

export function UserProfile({ imageUrl }: { imageUrl: string | undefined }) {
  return (
    <Image
      src={imageUrl ? decodeURIComponent(imageUrl) : BackupProfilePicture}
      alt="Profile Picture"
      width={40}
      height={40}
      placeholder="blur"
      className="h-6 w-6 overflow-hidden rounded-full bg-gray-100"
    />
  );
}
