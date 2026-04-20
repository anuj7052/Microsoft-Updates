/**
 * Powertool Logo — 4-square grid with yellow lightning bolt overlay.
 */
export default function Logo({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Powertool logo"
    >
      {/* Top-left: red */}
      <rect x="2" y="2" width="17" height="17" rx="1.5" fill="#f35325" />
      {/* Top-right: green */}
      <rect x="21" y="2" width="17" height="17" rx="1.5" fill="#81bc06" />
      {/* Bottom-left: blue */}
      <rect x="2" y="21" width="17" height="17" rx="1.5" fill="#05a6f0" />
      {/* Bottom-right: yellow */}
      <rect x="21" y="21" width="17" height="17" rx="1.5" fill="#ffba08" />
      {/* Lightning bolt — yellow, fully filled with white border */}
      <path
        d="M24 2 L12 22 L19 22 L16 38 L28 18 L21 18 Z"
        fill="#ffba08"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Inner fill to close the hollow gap in the centre of the bolt */}
      <path
        d="M21 18 L19 22 L20 20 Z"
        fill="#ffba08"
      />
    </svg>
  )
}

