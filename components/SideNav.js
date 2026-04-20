'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/',               icon: 'dashboard',               label: 'Dashboard' },
  { href: '/office365',      icon: 'cloud',                   label: 'Microsoft 365' },
  { href: '/azure',          icon: 'terminal',                label: 'Azure' },
  { href: '/windows',        icon: 'laptop_windows',          label: 'Windows' },
  { href: '/copilot',        icon: 'smart_toy',               label: 'Copilot AI' },
  { href: '/power-platform', icon: 'settings_input_component',label: 'Power Platform' },
  { href: '/fabric',         icon: 'layers',                  label: 'Fabric' },
  { href: '/security',       icon: 'security',                label: 'Security' },
  { href: '/live',           icon: 'sensors',                 label: 'Live Feed' },
]

export default function SideNav() {
  const pathname = usePathname()

  function isActive(href) {
    return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <aside className="hidden lg:flex flex-col py-8 pr-4 gap-2 fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-slate-50">
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item, idx) => {
          const active = isActive(item.href)
          return (
            <Link key={item.href} href={item.href}
              className={`sidebar-item stagger-${Math.min(idx + 1, 10)} flex items-center gap-4 px-6 py-3 text-sm font-label uppercase tracking-widest transition-all duration-300 hover:translate-x-1 cursor-pointer ${
                active
                  ? 'text-primary font-bold bg-slate-200/50 rounded-r-full'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-primary'
              }`}>
              <span className="material-symbols-outlined shrink-0"
                style={{ fontSize: '20px', fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-6 mt-auto">
        {/* Subscribe card */}
        <div className="mb-4 bg-surface-container-low p-4 rounded-lg">
          <h4 className="font-label text-xs font-semibold text-on-surface mb-1">Curated Stream</h4>
          <p className="font-body text-xs text-on-surface-variant mb-3">Intelligence Hub</p>
          <button className="w-full py-2 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded text-xs font-medium font-label hover:opacity-90 transition-opacity">
            Subscribe to Updates
          </button>
        </div>
        {/* Utility links */}
        <div className="flex flex-col gap-1">
          <Link href="/about"
            className="flex items-center gap-4 py-2 text-slate-500 hover:text-primary font-label text-xs uppercase tracking-widest transition-colors duration-200">
            <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 0" }}>settings</span>
            Settings
          </Link>
          <Link href="/contact"
            className="flex items-center gap-4 py-2 text-slate-500 hover:text-primary font-label text-xs uppercase tracking-widest transition-colors duration-200">
            <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 0" }}>help_outline</span>
            Support
          </Link>
        </div>
      </div>
    </aside>
  )
}
