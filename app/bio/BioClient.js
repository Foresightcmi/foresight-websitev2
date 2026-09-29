'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const LINKS = [
  {
    id: 'quote',
    title: '60-Second Instant Quote Engine',
    subtitle: 'Transparent pricing for Buyers, New Construction & Warranties',
    href: '/quote',
    badge: 'MOST POPULAR',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    icon: (
      <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    featured: true,
  },
  {
    id: 'risk-scanner',
    title: 'Georgia Property Risk Scanner',
    subtitle: 'Diagnose hidden plumbing, electrical & red clay hazards by year built',
    href: '/risk-scanner',
    badge: 'NEW TOOL',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: (
      <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: 'sample-report',
    title: 'View Live Sample Inspection Report',
    subtitle: '1,600-point InterNACHI digital report with 4K drone & FLIR thermal scans',
    href: '/samples',
    badge: 'INTERNACHI SOP',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    icon: (
      <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 'warranty',
    title: 'Up to $35,000 Combined Warranty Protection',
    subtitle: '$10,000 Elite Master Warranty ($0 Ded.) + $25,000 InterNACHI Honor Guarantee',
    href: '/about',
    badge: '$0 DEDUCTIBLE',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    icon: (
      <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: 'realtors',
    title: 'Realtor VIP Partner Network',
    subtitle: 'SUPRA eKEY enabled • 1-Click GAR F404 amendment repair builder',
    href: '/realtors',
    badge: 'AGENT PORTAL',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    icon: (
      <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 'reviews',
    title: 'Google 5-Star Reviews & Feedback',
    subtitle: 'Read 922+ verified homeowner reviews or share your experience',
    href: 'https://g.page/r/CVIwU3H8q4HREBM/review',
    badge: '5.0 ★ RATED',
    badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
    external: true,
    icon: (
      <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
  },
  {
    id: 'call',
    title: 'Call Christopher Boykin (CMI) Direct',
    subtitle: '(678) 480-2110 • Mon-Sat 8am-7pm, Sun by Appt',
    href: 'tel:6784802110',
    badge: 'TAP TO CALL',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    external: true,
    icon: (
      <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
];

export default function BioClient() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = 'https://www.fhinspectionsatl.com/bio';
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 py-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-amber-500/10 via-blue-500/5 to-transparent blur-3xl pointer-events-none" />

      <main className="max-w-md mx-auto relative z-10">
        {/* Top Share Bar */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-750 transition-all shadow-sm"
            aria-label="Share Link Hub"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-400 font-semibold">Link Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Share Profile</span>
              </>
            )}
          </button>
        </div>

        {/* Profile Header */}
        <div className="text-center mb-6">
          <div className="relative inline-block mx-auto mb-3">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-600 shadow-xl shadow-amber-500/20">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 relative">
                <Image
                  src="/images/Christopher_Boykin.webp"
                  alt="Christopher Boykin, Certified Master Inspector"
                  fill
                  sizes="112px"
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>
            {/* Live Indicator */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-900 border border-emerald-500/50 shadow-md flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold tracking-wider text-emerald-300 uppercase">2 Inspectors</span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center justify-center gap-1.5">
            Christopher Boykin, CMI®
            <svg className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
            Foresight Home Inspections • Metro Atlanta, GA
          </p>

          {/* Trust Metrics Pill Row */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
            <span className="px-2 py-0.5 rounded-md bg-slate-800/90 border border-slate-700/80 text-[11px] font-semibold text-amber-300">
              Certified Master Inspector® #1082
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800/90 border border-slate-700/80 text-[11px] font-semibold text-emerald-300">
              Up to $35k Warranty
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800/90 border border-slate-700/80 text-[11px] font-semibold text-blue-300">
              5.0 ★ Google Rated
            </span>
          </div>

          <p className="text-xs text-slate-400 italic mt-2.5">
            &ldquo;Hindsight is expensive... Choose Foresight!&rdquo;
          </p>
        </div>

        {/* Links Grid */}
        <div className="space-y-3">
          {LINKS.map((item) => {
            const isExternal = item.external || item.href.startsWith('http') || item.href.startsWith('tel:');
            const CardContent = (
              <div
                className={`relative group p-4 rounded-xl transition-all duration-200 text-left border flex items-center gap-3.5 shadow-md ${
                  item.featured
                    ? 'bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border-amber-500/50 hover:border-amber-400 hover:shadow-amber-500/10'
                    : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 hover:border-slate-700 hover:shadow-slate-800/50'
                }`}
              >
                {/* Icon Circle */}
                <div className={`p-2.5 rounded-lg flex-shrink-0 ${item.featured ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-slate-800 border border-slate-700'}`}>
                  {item.icon}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h2 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                      {item.title}
                    </h2>
                    {item.badge && (
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                    {item.subtitle}
                  </p>
                </div>

                {/* Arrow */}
                <div className="text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );

            if (isExternal) {
              return (
                <a
                  key={item.id}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="block active:scale-[0.98] transition-transform"
                >
                  {CardContent}
                </a>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                className="block active:scale-[0.98] transition-transform"
              >
                {CardContent}
              </Link>
            );
          })}
        </div>

        {/* Social Connection Footer */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400 font-semibold mb-3 tracking-wide uppercase">
            Connect Across Metro Atlanta
          </p>
          <div className="flex items-center justify-center gap-4 text-slate-400 mb-4">
            <a
              href="https://www.facebook.com/profile.php?id=61565551842918"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook Page"
              className="p-2 rounded-full bg-slate-850 hover:bg-slate-800 hover:text-blue-400 border border-slate-800 transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="https://www.instagram.com/foresight_home_inspections"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Profile"
              className="p-2 rounded-full bg-slate-850 hover:bg-slate-800 hover:text-pink-400 border border-slate-800 transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@foresight_home_inspections"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok Profile"
              className="p-2 rounded-full bg-slate-850 hover:bg-slate-800 hover:text-teal-400 border border-slate-800 transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
          </div>

          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} Foresight Home Inspections LLC. All Rights Reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
