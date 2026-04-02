/**
 * SiteLogo — original abstract AI/news pulse icon
 * Custom design. No trademarked colors, logos, or branding.
 */
export default function Logo({ size = 32 }) {
  const id = 'logo-grad'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-a`} x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <linearGradient id={`${id}-b`} x1="36" y1="0" x2="0" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#A855F7" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Outer ring */}
      <circle cx="18" cy="18" r="16" stroke={`url(#${id}-a)`} strokeWidth="2" strokeDasharray="6 3" strokeLinecap="round" />

      {/* Signal pulse bars — abstract broadcast / update icon */}
      <rect x="11" y="20" width="3" height="6" rx="1.5" fill={`url(#${id}-a)`} opacity="0.6" />
      <rect x="16.5" y="16" width="3" height="10" rx="1.5" fill={`url(#${id}-a)`} opacity="0.8" />
      <rect x="22" y="12" width="3" height="14" rx="1.5" fill={`url(#${id}-a)`} />

      {/* Top-left accent dot */}
      <circle cx="10" cy="10" r="2.5" fill="#A855F7" opacity="0.9" />
      <circle cx="10" cy="10" r="4.5" stroke="#A855F7" strokeWidth="1" opacity="0.25" />
    </svg>
  )
}
