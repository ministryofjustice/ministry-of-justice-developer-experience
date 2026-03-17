import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDocPage, getDocSources, getAllDocSlugs } from '@/lib/docs';
import type { NavItem } from '@/lib/docs';
import { markdownToHtml } from '@/lib/markdown';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import { ChatBot } from '@/components/ChatBot';

export function generateStaticParams() {
  const slugs = getAllDocSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Params = { slug: string[] };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = getDocPage(slug);
  if (!page) return {};
  return { title: page.meta.title };
}

function getReviewStatus(lastReviewedOn?: string, reviewIn?: string): 'ok' | 'warning' | 'overdue' | null {
  if (!lastReviewedOn || !reviewIn) return null;
  const lastReviewed = new Date(lastReviewedOn);
  const months = parseInt(reviewIn) || 6;
  const dueDate = new Date(lastReviewed);
  dueDate.setMonth(dueDate.getMonth() + months);
  const now = new Date();
  const warningDate = new Date(dueDate);
  warningDate.setMonth(warningDate.getMonth() - 1);

  if (now > dueDate) return 'overdue';
  if (now > warningDate) return 'warning';
  return 'ok';
}

function SidebarNav({ items, currentSlug }: { items: NavItem[]; currentSlug: string[] }) {
  const currentPath = currentSlug.join('/');

  return (
    <ul className="app-subnav">
      {items.map((item) => {
        const itemPath = item.slug.join('/');
        const isActive = currentPath === itemPath;
        const isParent = currentPath.startsWith(itemPath + '/');

        return (
          <li key={itemPath} className="app-subnav__item">
            <Link
              href={`/docs/${itemPath}`}
              className={`app-subnav__link${isActive ? ' app-subnav__link--active' : ''}`}
            >
              {item.title}
            </Link>
            {item.children && (isActive || isParent) && (
              <SidebarNav items={item.children} currentSlug={currentSlug} />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default async function DocPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = getDocPage(slug);
  if (!page) notFound();

  const htmlContent = await markdownToHtml(page.content);
  const sourceSlug = slug[0];
  const sources = getDocSources();
  const currentSource = sources.find((s) => s.slug === sourceSlug);

  const reviewStatus = getReviewStatus(page.meta.lastReviewedOn, page.meta.reviewIn);

  const breadcrumbs = [
    { label: 'Documentation', href: '/docs' },
    ...(currentSource ? [{ label: currentSource.name, href: `/docs/${sourceSlug}` }] : []),
    { label: page.meta.title },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <div className="app-layout">
        {currentSource && (
          <nav className="app-layout__sidebar" aria-label="Documentation navigation">
            <h2 className="app-subnav__section-title">{currentSource.name}</h2>
            <SidebarNav items={currentSource.items} currentSlug={slug} />
          </nav>
        )}

        <div className="app-layout__content">
          <h1 className="govuk-heading-xl">{page.meta.title}</h1>

          <div className="app-prose-scope" dangerouslySetInnerHTML={{ __html: htmlContent }} />

          <div className="app-doc-meta">
            {page.meta.lastReviewedOn && (
              <span>
                Last reviewed:{' '}
                {new Date(page.meta.lastReviewedOn).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            )}
            {reviewStatus && (
              <span>
                <span className={`app-review-badge app-review-badge--${reviewStatus}`}>
                  {reviewStatus === 'ok' ? '✓ Up to date' : reviewStatus === 'warning' ? '⚠ Review soon' : '✗ Review overdue'}
                </span>
              </span>
            )}
            {page.meta.ownerSlack && <span>Owner: {page.meta.ownerSlack}</span>}
            {page.meta.sourceRepo && (
              <span>
                <a
                  className="govuk-link"
                  href={`https://github.com/${page.meta.sourceRepo}/blob/main/${page.meta.sourcePath || ''}`}
                  rel="noopener noreferrer"
                >
                  View source on GitHub
                </a>
              </span>
            )}
          </div>

          <FeedbackWidget />
        </div>
      </div>

      <ChatBot />
    </>
  );
}
