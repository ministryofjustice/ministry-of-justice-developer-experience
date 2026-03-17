import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import { ChatBot } from '@/components/ChatBot';
import products from '@/content/products/products.json';
import sources from '@/sources.json';

interface Product {
  slug: string;
  name: string;
  category: string;
  description: string;
  owner: string;
  slackChannel?: string;
  docsUrl?: string;
  externalUrl?: string;
  status: string;
  tags: string[];
}

type Params = { slug: string };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};
  return { title: product.name };
}

export default async function ProductDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug) as Product | undefined;

  if (!product) {
    notFound();
  }

  const sourceIds = new Set(
    sources.sources
      .filter((source) => source.enabled !== false)
      .map((source) => source.id)
  );
  const isDocsSourceLink = Boolean(product.docsUrl?.startsWith('/docs/'));
  const docsSourceId = isDocsSourceLink
    ? product.docsUrl?.replace(/^\/docs\//, '').split('/')[0]
    : undefined;
  const hasValidDocsLink = Boolean(
    product.docsUrl && (!isDocsSourceLink || (docsSourceId && sourceIds.has(docsSourceId)))
  );
  const hasInternalServiceLink = Boolean(product.externalUrl?.startsWith('/'));

  const statusTag =
    product.status === 'live' ? (
      <strong className="govuk-tag govuk-tag--green">Live</strong>
    ) : product.status === 'beta' ? (
      <strong className="govuk-tag govuk-tag--blue">Beta</strong>
    ) : (
      <strong className="govuk-tag govuk-tag--yellow">Alpha</strong>
    );

  return (
    <>
      <Breadcrumbs items={[{ label: 'Products', href: '/products' }, { label: product.name }]} />

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <span className="app-card__tag">{product.category}</span>
          <h1 className="govuk-heading-xl govuk-!-margin-top-2">{product.name}</h1>
          <p className="govuk-body-l">{product.description}</p>

          <table className="govuk-table">
            <tbody className="govuk-table__body">
              <tr className="govuk-table__row">
                <th className="govuk-table__header" scope="row">Status</th>
                <td className="govuk-table__cell">{statusTag}</td>
              </tr>
              <tr className="govuk-table__row">
                <th className="govuk-table__header" scope="row">Owner</th>
                <td className="govuk-table__cell">{product.owner}</td>
              </tr>
              {product.slackChannel && (
                <tr className="govuk-table__row">
                  <th className="govuk-table__header" scope="row">Slack</th>
                  <td className="govuk-table__cell">{product.slackChannel}</td>
                </tr>
              )}
              <tr className="govuk-table__row">
                <th className="govuk-table__header" scope="row">Tags</th>
                <td className="govuk-table__cell">
                  {product.tags.map((tag) => (
                    <strong key={tag} className="govuk-tag govuk-tag--grey govuk-!-margin-right-1">
                      {tag}
                    </strong>
                  ))}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="govuk-button-group">
            {product.docsUrl && hasValidDocsLink && (
              <Link href={product.docsUrl} className="govuk-button">
                View documentation
              </Link>
            )}
            {product.externalUrl && !hasInternalServiceLink && (
              <a href={product.externalUrl} className="govuk-button govuk-button--secondary" rel="noopener noreferrer">
                Visit service
              </a>
            )}
            {product.externalUrl && hasInternalServiceLink && (
              <Link href={product.externalUrl} className="govuk-button govuk-button--secondary">
                Visit service
              </Link>
            )}
          </div>

          <FeedbackWidget />
        </div>
      </div>

      <ChatBot />
    </>
  );
}
