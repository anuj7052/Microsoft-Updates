'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Home', href: '/', icon: 'home' },
  { label: 'Trending', href: '/trending', icon: 'trending_up' },
  { label: 'Windows', href: '/windows', icon: 'grid_view' },
  { label: 'Azure', href: '/azure', icon: 'cloud' },
  { label: 'Copilot', href: '/copilot', icon: 'smart_toy' },
  { label: 'Power Platform', href: '/power-platform', icon: 'settings_input_component' },
  { label: 'Fabric', href: '/fabric', icon: 'layers' },
  { label: 'Security', href: '/security', icon: 'security' },
  { label: 'Licensing', href: '/licensing', icon: 'description' },
  { label: 'Live Updates', href: '/live', icon: 'sensors', isLive: true },
]

/* Microsoft logo as inline SVG — used as watermark */
function MsLogoWatermark() {
  return (
    <svg
      className="ms-logo-bg"
      style={{ bottom: 40, right: -20, width: 180, height: 180 }}
      viewBox="0 0 96 96"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="1" y="1" width="44" height="44" fill="#f25022" />
      <rect x="51" y="1" width="44" height="44" fill="#7fba00" />
      <rect x="1" y="51" width="44" height="44" fill="#00a4ef" />
      <rect x="51" y="51" width="44" height="44" fill="#ffb900" />
    </svg>
  )
}

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col bg-[#191c1f] fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 z-40 overflow-hidden py-6">
      {/* Background logo watermark */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <MsLogoWatermark />
      </div>

      {/* Header label */}
      <div className="px-4 mb-5 relative z-10 animate-fade-in">
        <p className="text-[0.65rem] font-bold tracking-[0.12em] text-on-surface-variant uppercase">
          Navigation
        </p>
        <p className="text-[0.6rem] text-outline mt-0.5 tracking-wider">Technical Intelligence</p>
        <div className="mt-3 h-px bg-gradient-to-r from-primary/30 via-primary/10 to-transparent" />
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-0.5 w-full relative z-10 overflow-y-auto pb-4">
        {navItems.map((item, index) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`animate-slide-left flex items-center gap-3 pl-4 pr-3 py-2.5 text-sm transition-all duration-200 border-l-2 w-full group ${
                isActive
                  ? 'border-primary text-white font-semibold bg-gradient-to-r from-[#1d2023] to-transparent'
                  : 'border-transparent text-[#c0c7d4] hover:text-white hover:bg-[#1d2023]'
              } ${item.isLive ? 'mt-4' : ''}`}
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              <span
                className={`material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:scale-110 ${
                  isActive
                    ? 'text-primary'
                    : item.isLive
                    ? 'text-primary'
                    : 'text-on-surface-variant group-hover:text-white'
                }`}
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.isLive && (
                <span className="w-2 h-2 rounded-full bg-error pulse-dot shrink-0" />
              )}
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom branding */}
      <div className="mt-auto px-4 pt-4 relative z-10 border-t border-outline-variant/10">
        <p className="text-[0.6rem] text-outline tracking-wider">
          © 2026 PowerTool
        </p>
        <p className="text-[0.6rem] text-outline/60 mt-0.5">Independent News Coverage</p>
      </div>
    </aside>
  )
}
  )
}
