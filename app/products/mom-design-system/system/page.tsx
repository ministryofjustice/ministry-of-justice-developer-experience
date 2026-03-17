import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ChatBot } from '@/components/ChatBot';
import { MomDesignSystemShowcase } from '@/components/MomDesignSystemShowcase';

export const metadata = {
  title: 'Ministry of Magic Design System',
};

export default function MomDesignSystemPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Products', href: '/products' },
          { label: 'Ministry of Magic Design System', href: '/products/mom-design-system' },
          { label: 'Design system' },
        ]}
      />

      <h1 className="govuk-heading-xl">Ministry of Magic Design System</h1>
      <p className="govuk-body-l" data-mom-fade-target="intro">
        The unified pattern library for enchanted public services — field-tested across
        ward licensing, creature registration, and interdimensional border control.
        Every component here has survived a containment breach drill.
      </p>

      <MomDesignSystemShowcase />

      <ChatBot />
    </>
  );
}
