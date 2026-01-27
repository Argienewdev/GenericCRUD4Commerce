interface SpinnerProps {
  fullScreen?: boolean;
  size?: number; // px
}

export function Spinner({ fullScreen = false, size = 48 }: SpinnerProps) {
  const dimension = `${size}px`;

  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "min-h-screen" : "h-full w-full"
      }`}
    >
      <div
        className="animate-spin rounded-full border-b-2 border-indigo-600"
        style={{
          width: dimension,
          height: dimension,
        }}
      />
    </div>
  );
}
