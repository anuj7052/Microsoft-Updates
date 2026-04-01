/**
 * SiteLogo — abstract tech refresh/sync icon
 * Original design, no Microsoft branding or trademarked visuals.
 */
export default function Logo({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer arc — refresh/sync shape */}
      <path
        d="M16 4C9.373 4 4 9.373 4 16"
        stroke="#0078D4"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M16 28C22.627 28 28 22.627 28 16"
        stroke="#50E6FF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Left arrow head */}
      <path
        d="M4 16L1.5 13M4 16L6.5 13"
        stroke="#0078D4"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right arrow head */}
      <path
        d="M28 16L25.5 19M28 16L30.5 19"
        stroke="#50E6FF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner grid dots — abstract data nodes */}
      <circle cx="16" cy="16" r="2.2" fill="#0078D4" />
      <circle cx="11" cy="16" r="1.3" fill="#50E6FF" opacity="0.8" />
      <circle cx="21" cy="16" r="1.3" fill="#50E6FF" opacity="0.8" />
      <circle cx="16" cy="11" r="1.3" fill="#50E6FF" opacity="0.6" />
      <circle cx="16" cy="21" r="1.3" fill="#50E6FF" opacity="0.6" />
    </svg>
  )
}
