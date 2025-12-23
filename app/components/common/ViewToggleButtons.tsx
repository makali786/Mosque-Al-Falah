import Image from "next/image";

interface ViewToggleButtonsProps {
  onVideoClick: () => void;
  onAudioClick: () => void;
  className?: string;
}

export default function ViewToggleButtons({
  onVideoClick,
  onAudioClick,
  className = "",
}: ViewToggleButtonsProps) {
  return (
    <div className={`flex gap-5 ${className}`}>
      {/* Audio button first */}
      <button
        onClick={onAudioClick}
        className="w-12 h-12 bg-[#0e793c] rounded-full flex items-center justify-center shadow-lg hover:bg-[#0c6632] transition-colors"
      >
        <Image
          src="/assets/ayat/video.svg"
          alt="audio"
          width={16}
          height={16}
          className="object-contain"
        />
      </button>

      {/* Video button second */}
      <button
        onClick={onVideoClick}
        className="w-12 h-12 bg-[#0e793c] rounded-full flex items-center justify-center shadow-lg hover:bg-[#0c6632] transition-colors"
      >
        <Image
          src="/assets/ayat/music.svg"
          alt="video"
          width={16}
          height={16}
          className="object-contain"
        />
      </button>
    </div>
  );
}
