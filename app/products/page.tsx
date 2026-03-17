'use client';

import { useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ChatBot } from '@/components/ChatBot';
import products from '@/content/products/products.json';

const categories = [
  { key: 'all', label: 'All' },
  { key: 'platforms', label: 'Platforms' },
  { key: 'apis', label: 'APIs' },
  { key: 'tools', label: 'Tools' },
  { key: 'security', label: 'Security' },
];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <>
      <Breadcrumbs items={[{ label: 'Products' }]} />

      <h1 className="govuk-heading-xl">Products &amp; Services</h1>
      <p className="govuk-body-l">
        Browse the catalogue of platforms, tools, APIs, and services available to
        developers across government.
      </p>

      <div className="app-filter">
        <h2 className="govuk-heading-s">Filter by category</h2>
        <div className="app-filter__buttons">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`app-filter__button${activeCategory === cat.key ? ' app-filter__button--active' : ''}`}
              onClick={() => setActiveCategory(cat.key)}
              aria-pressed={activeCategory === cat.key}
            >
              {cat.label}
              {cat.key === 'all' ? ` (${products.length})` : ` (${products.filter((p) => p.category === cat.key).length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="app-cards">
        {filtered.map((product) => (
          <ProductCard key={product.slug} {...product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="govuk-body">No products found in this category.</p>
      )}

      <ChatBot />
    </>
  );
}
