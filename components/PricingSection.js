'use client'

import { useState } from 'react'

const plans = [
  {
    name: 'Microsoft 365 Business Basic',
    price: '$6.00',
    period: '/user/month',
    features: ['Web & mobile Office apps', '1 TB OneDrive', 'Teams', 'Exchange 50GB'],
    color: 'ms-blue',
    link: 'https://www.microsoft.com/en-us/microsoft-365/business/microsoft-365-business-basic',
  },
  {
    name: 'Microsoft 365 Business Standard',
    price: '$12.50',
    period: '/user/month',
    features: ['Desktop Office apps', '1 TB OneDrive', 'Teams', 'Webinars', 'Bookings'],
    color: 'ms-accent',
    popular: true,
    link: 'https://www.microsoft.com/en-us/microsoft-365/business/microsoft-365-business-standard',
  },
  {
    name: 'Microsoft 365 Business Premium',
    price: '$22.00',
    period: '/user/month',
    features: ['Everything in Standard', 'Intune', 'Azure AD P1', 'Defender for Business'],
    color: 'ms-green',
    link: 'https://www.microsoft.com/en-us/microsoft-365/business/microsoft-365-business-premium',
  },
  {
    name: 'Microsoft 365 E3',
    price: '$36.00',
    period: '/user/month',
    features: ['Enterprise Office apps', 'Compliance', 'Windows Enterprise', 'Analytics'],
    color: 'ms-orange',
    link: 'https://www.microsoft.com/en-us/microsoft-365/enterprise/e3',
  },
  {
    name: 'Microsoft 365 E5',
    price: '$57.00',
    period: '/user/month',
    features: ['Everything in E3', 'Defender XDR', 'Power BI Pro', 'Phone System'],
    color: 'ms-yellow',
    link: 'https://www.microsoft.com/en-us/microsoft-365/enterprise/e5',
  },
  {
    name: 'Microsoft Copilot',
    price: '$30.00',
    period: '/user/month',
    features: ['AI in Word, Excel, PPT', 'Teams Copilot', 'Outlook AI', 'Business Chat'],
    color: 'ms-accent',
    link: 'https://www.microsoft.com/en-us/microsoft-365/business/copilot-for-microsoft-365',
  },
]

const azurePlans = [
  { name: 'Azure Pay-As-You-Go', desc: 'No upfront cost, pay for what you use', link: 'https://azure.microsoft.com/en-us/pricing/' },
  { name: 'Azure Reserved Instances', desc: 'Save up to 72% with 1 or 3 year commitments', link: 'https://azure.microsoft.com/en-us/pricing/reserved-vm-instances/' },
  { name: 'Azure Dev/Test Pricing', desc: 'Discounted rates for dev/test workloads', link: 'https://azure.microsoft.com/en-us/pricing/dev-test/' },
]

export default function PricingSection() {
  const [tab, setTab] = useState('m365')

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-6 bg-ms-yellow rounded-full"></div>
        <h2 className="font-syne font-extrabold text-2xl text-[var(--text-primary)]">
          Microsoft Licensing & Pricing
        </h2>
      </div>
      <p className="text-sm text-[var(--text-muted)] font-dm mb-6 ml-4">
        Latest pricing from Microsoft — prices may vary by region.{' '}
        <a href="https://www.microsoft.com/en-us/microsoft-365/business/compare-all-plans" target="_blank" rel="noopener noreferrer" className="text-ms-accent hover:underline">
          See official pricing →
        </a>
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setTab('m365')}
          className={`px-4 py-2 rounded-lg text-sm font-bold font-syne transition-all ${tab === 'm365' ? 'bg-ms-accent text-white' : 'bg-ms-card text-[var(--text-muted)] border border-[var(--border)] hover:border-ms-accent/40'}`}
        >
          Microsoft 365
        </button>
        <button
          onClick={() => setTab('azure')}
          className={`px-4 py-2 rounded-lg text-sm font-bold font-syne transition-all ${tab === 'azure' ? 'bg-ms-blue text-white' : 'bg-ms-card text-[var(--text-muted)] border border-[var(--border)] hover:border-ms-blue/40'}`}
        >
          Azure
        </button>
      </div>

      {tab === 'm365' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <a
              key={plan.name}
              href={plan.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative bg-ms-card rounded-xl border ${plan.popular ? 'border-ms-accent' : 'border-[var(--border)]'} p-6 hover:border-ms-accent/60 transition-all duration-200 hover:-translate-y-1`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-4 bg-ms-accent text-white text-[10px] font-bold px-3 py-0.5 rounded-full">
                  POPULAR
                </span>
              )}
              <h3 className="font-syne font-bold text-sm text-[var(--text-primary)] mb-3">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className={`font-syne font-extrabold text-3xl text-${plan.color}`}>
                  {plan.price}
                </span>
                <span className="text-xs text-[var(--text-muted)] font-dm">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-4">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-dm">
                    <span className="text-ms-green text-xs">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <span className="text-xs text-ms-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                View on Microsoft →
              </span>
            </a>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {azurePlans.map((plan) => (
            <a
              key={plan.name}
              href={plan.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-ms-card rounded-xl border border-[var(--border)] p-6 hover:border-ms-blue/40 transition-all duration-200 hover:-translate-y-0.5"
            >
              <h3 className="font-syne font-bold text-lg text-[var(--text-primary)] mb-1 group-hover:text-ms-blue transition-colors">{plan.name}</h3>
              <p className="text-sm text-[var(--text-secondary)] font-dm">{plan.desc}</p>
              <span className="text-xs text-ms-blue font-medium mt-2 inline-block opacity-0 group-hover:opacity-100 transition-opacity">
                View pricing →
              </span>
            </a>
          ))}
          <p className="text-xs text-[var(--text-muted)] font-dm mt-4">
            Azure pricing varies based on region, VM size, and usage.{' '}
            <a href="https://azure.microsoft.com/en-us/pricing/calculator/" target="_blank" rel="noopener noreferrer" className="text-ms-blue hover:underline">
              Use the Azure Pricing Calculator →
            </a>
          </p>
        </div>
      )}
    </section>
  )
}
