import { cn } from "@/lib/cn";
import Image from "next/image";

export function VideoThumbnail({ image }: { image: string }) {
    return (
        <div
            className={cn(
                'relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-linear-to-br',
            )}
        >
            <Image src={image} alt="thumbnail" fill className="object-cover" />
        </div>
    );
}