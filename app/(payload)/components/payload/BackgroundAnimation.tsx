// src/components/BackgroundAnimation.tsx

const BackgroundAnimation = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1, // Ensures it stays behind content
        overflow: 'hidden',
        pointerEvents: 'none', // Allows clicks to pass through to the UI
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        src="https://videocdn.cdnpk.net/videos/1b54e0c4-3a03-530f-b1a3-1c94d5c19f2c/horizontal/previews/clear/large.mp4?token=exp=1767106503~hmac=a98db9f21da79294ae423c96c42238bbc94e0948ac5ec904e2ce666d2e0a14f8"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover', // Ensures the video fills the screen
          opacity: 1, // Optional: Adjust opacity to make text readable
        }}
      />
      {/* Optional: Add a gradient overlay to ensure text contrast */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(255, 255, 255, 0.6)', // Adjust darkness here
        }}
      />
    </div>
  );
};

export default BackgroundAnimation;
