# AudioPlayer Component Usage

The `AudioPlayer` component is a reusable audio player that can be used anywhere in your application by simply passing an audio URL.

## Location
`/app/(frontend)/components/common/AudioPlayer.tsx`

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `audioUrl` | `string` | Yes | - | The URL of the audio file to play |
| `className` | `string` | No | `""` | Additional CSS classes to apply to the container |
| `showPreviousNext` | `boolean` | No | `true` | Whether to show previous/next buttons |
| `onPrevious` | `() => void` | No | - | Callback function when previous button is clicked |
| `onNext` | `() => void` | No | - | Callback function when next button is clicked |

## Basic Usage

```tsx
import AudioPlayer from "@/app/(frontend)/components/common/AudioPlayer";

export default function MyComponent() {
  return (
    <div>
      <AudioPlayer audioUrl="https://example.com/audio.mp3" />
    </div>
  );
}
```

## Usage without Previous/Next Buttons

```tsx
import AudioPlayer from "@/app/(frontend)/components/common/AudioPlayer";

export default function MyComponent() {
  return (
    <div>
      <AudioPlayer 
        audioUrl="https://example.com/audio.mp3" 
        showPreviousNext={false}
      />
    </div>
  );
}
```

## Usage with Previous/Next Handlers

```tsx
import AudioPlayer from "@/app/(frontend)/components/common/AudioPlayer";

export default function MyComponent() {
  const handlePrevious = () => {
    console.log("Previous track");
    // Your logic to switch to previous track
  };

  const handleNext = () => {
    console.log("Next track");
    // Your logic to switch to next track
  };

  return (
    <div>
      <AudioPlayer 
        audioUrl="https://example.com/audio.mp3"
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
}
```

## Usage with Custom Styling

```tsx
import AudioPlayer from "@/app/(frontend)/components/common/AudioPlayer";

export default function MyComponent() {
  return (
    <div>
      <AudioPlayer 
        audioUrl="https://example.com/audio.mp3"
        className="max-w-md mx-auto"
      />
    </div>
  );
}
```

## Features

- ✅ Play/Pause functionality
- ✅ Seek bar with progress indicator
- ✅ Current time and total duration display
- ✅ Optional previous/next track buttons
- ✅ Responsive design
- ✅ Custom styling support
- ✅ Automatic audio loading and playback management

## Example: Playlist Implementation

```tsx
import { useState } from "react";
import AudioPlayer from "@/app/(frontend)/components/common/AudioPlayer";

const playlist = [
  { id: 1, title: "Track 1", url: "https://example.com/track1.mp3" },
  { id: 2, title: "Track 2", url: "https://example.com/track2.mp3" },
  { id: 3, title: "Track 3", url: "https://example.com/track3.mp3" },
];

export default function PlaylistPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentTrackIndex((prev) => 
      prev > 0 ? prev - 1 : playlist.length - 1
    );
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => 
      prev < playlist.length - 1 ? prev + 1 : 0
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        {playlist[currentTrackIndex].title}
      </h2>
      <AudioPlayer 
        audioUrl={playlist[currentTrackIndex].url}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
}
```
