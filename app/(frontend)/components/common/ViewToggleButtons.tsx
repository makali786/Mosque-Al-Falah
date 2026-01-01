import Image from "next/image";
import Link from "next/link";

interface ViewToggleButtonsProps {
  videoUrl?: string;
  onVideoClick?: () => void;
  onAudioClick?: () => void;
  className?: string;
  audioUrl?: string;
}

export default function ViewToggleButtons({
  onAudioClick,
  videoUrl,
  onVideoClick,
  audioUrl,
  className = "",
}: ViewToggleButtonsProps) {
  return (
    <div className={`flex sm:gap-4 gap-2 ${className}`}>
      {/* Audio button first */}
      {onAudioClick ? <button
        onClick={onAudioClick}
        className="sm:w-12 sm:h-12 w-10 h-10 bg-[#0e793c] rounded-full flex items-center justify-center shadow-lg hover:bg-[#0c6632] transition-colors"
      >
        <Image
          src="/assets/ayat/video.svg"
          alt="audio"
          width={16}
          height={16}
          className="object-contain"
          unoptimized
        />
      </button> : audioUrl ? <Link
        href={audioUrl}
        target="_blank"
        className="sm:w-12 sm:h-12 w-10 h-10 bg-[#0e793c] rounded-full flex items-center justify-center shadow-lg hover:bg-[#0c6632] transition-colors"
      >
        <Image
          src="/assets/ayat/video.svg"
          alt="video"
          width={16}
          height={16}
          className="object-contain"
          unoptimized
        />
      </Link> : null}

      {/* Video button second */}
      {onVideoClick ? (
        <button
          onClick={onVideoClick}
          className="sm:w-12 sm:h-12 w-10 h-10 bg-[#0e793c] rounded-full flex items-center justify-center shadow-lg hover:bg-[#0c6632] transition-colors"
        >
          <Image
            src="/assets/ayat/music.svg"
            alt="video"
            width={16}
            height={16}
            className="object-contain"
            unoptimized
          />
        </button>
      ) : videoUrl ? (
        <Link
          href={videoUrl}
          target="_blank"
          className="sm:w-12 sm:h-12 w-10 h-10 bg-[#0e793c] rounded-full flex items-center justify-center shadow-lg hover:bg-[#0c6632] transition-colors"
        >
          <Image
            src="/assets/ayat/music.svg"
            alt="video"
            width={16}
            height={16}
            className="object-contain"
            unoptimized
          />
        </Link>
      ) : null}
    </div>
  );
}
