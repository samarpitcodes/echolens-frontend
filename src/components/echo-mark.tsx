/**
 * The EchoLens mark: a rounded gradient chip containing concentric "echo
 * rings" around a focused center point (Echo = rippling outward, Lens =
 * the focal center). Used as the app icon and, animated, as the chat
 * "thinking" indicator.
 */
export function EchoMark({
  className = "h-8 w-8 rounded-[10px]",
  animated = false,
}: {
  className?: string;
  animated?: boolean;
}) {
  return (
    <div className={`gradient-chip flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 32 32" className="h-[62%] w-[62%]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" stroke="white" strokeOpacity="0.55" strokeWidth="2">
          {animated && (
            <animate attributeName="r" values="8;14;8" dur="2.2s" repeatCount="indefinite" />
          )}
        </circle>
        <circle cx="16" cy="16" r="8.5" stroke="white" strokeOpacity="0.85" strokeWidth="2">
          {animated && (
            <animate attributeName="r" values="4.5;8.5;4.5" dur="2.2s" repeatCount="indefinite" begin="0.15s" />
          )}
        </circle>
        <circle cx="16" cy="16" r="3.4" fill="white" />
      </svg>
    </div>
  );
}
