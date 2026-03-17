import '@/styles/globals.scss';
import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PhaseBanner } from '@/components/PhaseBanner';

export const metadata: Metadata = {
  title: {
    template: '%s - Ministry of Magic Developer Portal',
    default: 'Ministry of Magic Developer Portal',
  },
  description: 'The Ministry of Magic Developer Portal — documentation, products, and guidelines for cross-government developers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="govuk-template">
      <body className="govuk-template__body js-enabled">
        <a href="#main-content" className="govuk-skip-link" data-module="govuk-skip-link">
          Skip to main content
        </a>
        <Header />
        <div className="govuk-width-container">
          <PhaseBanner />
          <div className="govuk-notification-banner" role="region" aria-labelledby="demo-banner-title" data-module="govuk-notification-banner">
            <div className="govuk-notification-banner__header">
              <h2 className="govuk-notification-banner__title" id="demo-banner-title">
                Demonstration
              </h2>
            </div>
            <div className="govuk-notification-banner__content">
              <p className="govuk-notification-banner__heading">
                This is a demonstration site. It is not affiliated with or endorsed by the UK Government, GDS, or the Ministry of Justice. External links to GOV.UK resources are provided for reference only.
              </p>
            </div>
          </div>
          <main className="govuk-main-wrapper" id="main-content" role="main">
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
