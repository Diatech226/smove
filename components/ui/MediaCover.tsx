import Image from "next/image";
import { cn } from "@/lib/utils";

type MediaCoverProps = {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  overlayClassName?: string;
};

export function MediaCover({ src, alt, className, sizes, priority, overlayClassName }: MediaCoverProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/80 to-sky-500/20",
        className,
      )}
    >
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} priority={priority} />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
            SMOVE
          </div>
        </div>
      )}
      <div className={cn("absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent", overlayClassName)} />
    </div>
  );
}
