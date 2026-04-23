import { vi } from 'vitest';

export function nextMock() {
  vi.mock('next/link', () => ({
    default: ({ href, children }: any) => <a href={href}>{children}</a>,
  }));
}

export function searchWidgetMock() {
  vi.mock('@/components/SearchWidget', () => ({
    default: () => <div data-testid="search-widget" />,
  }));
}

export function chatbotMock() {
  vi.mock('@/components/ChatBot', () => ({
    ChatBot: () => <div data-testid="chatbot-button" />,
  }));
}

export function breadcrumbsMock() {
  vi.mock('@/components/Breadcrumbs', () => ({
    Breadcrumbs: () => <div data-testid="breadcrumbs" />,
  }));
}

export function sectionMock() {
  vi.mock('@/components/templateRender/Section', () => ({
    Section: ({ heading, children }: any) => (
      <section>
        <h2>{heading}</h2>
        {children}
      </section>
    ),
  }));
}
