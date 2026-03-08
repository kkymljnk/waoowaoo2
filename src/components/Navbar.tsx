'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { AppIcon } from '@/components/ui/icons'

export default function Navbar() {
  const { data: session } = useSession()
  const t = useTranslations('nav')
  const tc = useTranslations('common')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 min-w-0">
            <Link href={session ? "/workspace" : "/"} className="group flex-shrink-0">
              <Image
                src="/logo-small.png?v=1"
                alt={tc('appName')}
                width={64}
                height={64}
                className="object-contain transition-transform group-hover:scale-110 w-12 h-12 sm:w-[80px] sm:h-[80px]"
              />
            </Link>
            <span className="glass-chip glass-chip-info px-2 py-0.5 text-[10px] sm:px-2.5 sm:py-1 sm:text-[11px] flex-shrink-0">
              {tc('betaVersion')}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {session ? (
              <>
                <Link
                  href="/workspace"
                  className="text-sm text-[var(--glass-text-secondary)] hover:text-[var(--glass-text-primary)] font-medium transition-colors"
                >
                  {t('workspace')}
                </Link>
                <Link
                  href="/workspace/asset-hub"
                  className="text-sm text-[var(--glass-text-secondary)] hover:text-[var(--glass-text-primary)] font-medium transition-colors flex items-center gap-1"
                >
                  <AppIcon name="folderHeart" className="w-4 h-4" />
                  {t('assetHub')}
                </Link>
                <Link
                  href="/profile"
                  className="text-sm text-[var(--glass-text-secondary)] hover:text-[var(--glass-text-primary)] font-medium transition-colors flex items-center gap-1"
                  title={t('profile')}
                >
                  <AppIcon name="userRoundCog" className="w-5 h-5" />
                  {t('profile')}
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-sm text-[var(--glass-text-secondary)] hover:text-[var(--glass-text-primary)] font-medium transition-colors"
                >
                  {t('signin')}
                </Link>
                <Link
                  href="/auth/signup"
                  className="glass-btn-base glass-btn-primary px-4 py-2 text-sm font-medium"
                >
                  {t('signup')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[var(--glass-text-secondary)] hover:text-[var(--glass-text-primary)] hover:bg-[var(--glass-bg-muted)] transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-[var(--glass-stroke-soft)]">
            {session ? (
              <div className="flex flex-col space-y-1">
                <Link
                  href="/workspace"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm text-[var(--glass-text-secondary)] hover:text-[var(--glass-text-primary)] hover:bg-[var(--glass-bg-muted)] font-medium transition-colors"
                >
                  {t('workspace')}
                </Link>
                <Link
                  href="/workspace/asset-hub"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm text-[var(--glass-text-secondary)] hover:text-[var(--glass-text-primary)] hover:bg-[var(--glass-bg-muted)] font-medium transition-colors flex items-center gap-2"
                >
                  <AppIcon name="folderHeart" className="w-4 h-4" />
                  {t('assetHub')}
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm text-[var(--glass-text-secondary)] hover:text-[var(--glass-text-primary)] hover:bg-[var(--glass-bg-muted)] font-medium transition-colors flex items-center gap-2"
                >
                  <AppIcon name="userRoundCog" className="w-4 h-4" />
                  {t('profile')}
                </Link>
              </div>
            ) : (
              <div className="flex flex-col space-y-1">
                <Link
                  href="/auth/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm text-[var(--glass-text-secondary)] hover:text-[var(--glass-text-primary)] hover:bg-[var(--glass-bg-muted)] font-medium transition-colors"
                >
                  {t('signin')}
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg glass-btn-base glass-btn-primary text-sm font-medium text-center"
                >
                  {t('signup')}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
