import BlurImage from "@/components/ui/blur-image";
import { placeholderBlurhash, random } from "@/lib/utils";
import { Candidate } from "@prisma/client";
import { BarChart, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function SiteCard({ data }: { data: Candidate }) {
  return (
    <div className="relative rounded-lg border border-stone-200 pb-10 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
      <Link
        href={`/site/${data.id}`}
        className="flex flex-col overflow-hidden rounded-lg"
      >
<<<<<<< HEAD
=======
         <BlurImage
          alt={data.name ?? "Card thumbnail"}
          width={500}
          height={400}
          className="h-44 object-cover"
          src={data.image ?? "/placeholder.png"}
          placeholder="blur"
          blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
        />
>>>>>>> 68154ca385f21f845fa53f20c205a2058808d9e4
        <div className="border-t border-stone-200 p-4 dark:border-stone-700">
          <h3 className="my-0 truncate font-cal text-xl font-bold tracking-wide dark:text-white">
            {data.name}
          </h3>
<<<<<<< HEAD
          <h4>
            {data.createdAt.toLocaleDateString()}
          </h4>
=======
>>>>>>> 68154ca385f21f845fa53f20c205a2058808d9e4
        </div>
      </Link>
    </div>
  );
}
