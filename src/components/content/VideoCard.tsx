import Image from "next/image";
import { ExternalLink, Clock, Play } from "lucide-react";
import type { Video } from "@/types";
import { DifficultyBadge, TagBadge } from "@/components/ui/Badge";

export function VideoCard({ video }: { video: Video }) {
  const videoId = video.youtubeUrl.match(
    /(?:youtu\.be\/|v=)([\w-]+)/
  )?.[1];

  return (
    <div
      id={video.id}
      className="rounded-xl border border-border bg-card overflow-hidden scroll-mt-24"
    >
      {videoId && (
        <a
          href={video.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block aspect-video bg-muted-bg"
        >
          <Image
            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
            alt={video.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
            <Play className="h-12 w-12 text-white" fill="white" />
          </div>
        </a>
      )}
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
            {video.topic}
          </span>
          <DifficultyBadge difficulty={video.difficulty} />
          <span className="flex items-center gap-1 text-xs text-muted">
            <Clock className="h-3 w-3" />
            {video.duration}
          </span>
        </div>
        <h3 className="mt-2 text-lg font-semibold text-foreground">
          {video.title}
        </h3>
        <p className="mt-1 text-sm text-muted">{video.description}</p>
        <a
          href={video.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Watch on YouTube <ExternalLink className="h-3 w-3" />
        </a>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {video.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      </div>
    </div>
  );
}
