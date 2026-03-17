'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/products', label: 'Products' },
  { href: '/guidelines', label: 'Guidelines' },
  { href: '/docs', label: 'Documentation' },
  { href: '/community', label: 'Community' },
];

function WizardHatIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="30"
      height="30"
      fill="currentcolor"
      className="govuk-header__logotype"
      focusable="false"
      role="presentation"
      aria-hidden="true"
    >
      {/* Wizard hat silhouette */}
      <path d="M16 3 C16 3 14.5 4.5 13.5 6 L8.5 24 C8.5 24 12 23 16 23 C20 23 23.5 24 23.5 24 L18.5 6 C17.5 4.5 16 3 16 3Z"/>
      {/* Hat tip curve */}
      <path d="M16 3 Q19 5 21 4 Q19 7 18.5 6" fillOpacity="0.9"/>
      {/* Brim */}
      <ellipse cx="16" cy="26" rx="13" ry="2.5"/>
      {/* Star */}
      <polygon points="16,11 17,14 20,14 17.5,16 18.5,19 16,17 13.5,19 14.5,16 12,14 15,14"/>
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();

  return (
    <>
      <header className="govuk-header" role="banner" data-module="govuk-header">
        <div className="govuk-width-container govuk-header__container">
          <div className="govuk-header__logo">
            <Link href="/" className="govuk-header__homepage-link" onClick={(e) => e.currentTarget.blur()}>
              <WizardHatIcon />
              <span className="app-header__org-name">MINISTRY OF MAGIC</span>
              <span className="govuk-header__product-name">Developer Portal</span>
            </Link>
          </div>
        </div>
      </header>

      <section className="govuk-service-navigation" aria-label="Service information" data-module="govuk-service-navigation">
        <div className="govuk-width-container">
          <div className="govuk-service-navigation__container">
            <nav aria-label="Menu" className="govuk-service-navigation__wrapper">
              <ul className="govuk-service-navigation__list" id="service-navigation">
                {navItems.map((item) => (
                  <li
                    key={item.href}
                    className={`govuk-service-navigation__item${pathname?.startsWith(item.href) ? ' govuk-service-navigation__item--active' : ''}`}
                  >
                    <Link href={item.href} className="govuk-service-navigation__link" aria-current={pathname?.startsWith(item.href) ? 'page' : undefined} onClick={(e) => (e.target as HTMLElement).blur()}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>
    </>
  );
}
