'use client';

import { useEffect, useRef } from 'react';

const ANIMATION_DURATION_MS = 7000;
const PAUSE_BETWEEN_SECTIONS_MS = 900;

function pickNextIndex(length: number, previous: number): number {
  if (length <= 1) return 0;

  let next = Math.floor(Math.random() * length);
  while (next === previous) {
    next = Math.floor(Math.random() * length);
  }

  return next;
}

export function MomDesignSystemShowcase() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-mom-fade-target]')
    );
    if (targets.length === 0) return;

    let previousIndex = -1;
    let stopped = false;
    const timerIds: number[] = [];

    const pulseTarget = (index: number) => {
      const target = targets[index];
      target.classList.remove('mom-fade-pulse');
      void target.offsetHeight;

      const onAnimationEnd = () => {
        target.classList.remove('mom-fade-pulse');
      };

      target.addEventListener('animationend', onAnimationEnd, { once: true });
      target.classList.add('mom-fade-pulse');

      const fallbackId = window.setTimeout(onAnimationEnd, ANIMATION_DURATION_MS + 300);
      timerIds.push(fallbackId);
    };

    const scheduleNext = () => {
      if (stopped) return;
      const id = window.setTimeout(() => {
        if (stopped) return;
        previousIndex = pickNextIndex(targets.length, previousIndex);
        pulseTarget(previousIndex);
        scheduleNext();
      }, ANIMATION_DURATION_MS + PAUSE_BETWEEN_SECTIONS_MS);
      timerIds.push(id);
    };

    previousIndex = pickNextIndex(targets.length, previousIndex);
    pulseTarget(previousIndex);
    scheduleNext();

    return () => {
      stopped = true;
      timerIds.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return (
    <div ref={containerRef}>
      <div className="govuk-inset-text">
        This system is maintained by the Arcane Standards Office. Every pattern, component,
        and glyph sequence published here has been stress-tested under live enchantment load
        and cleared for deployment to citizen-facing services across all seven realms.
      </div>

      <p className="govuk-body-s" data-mom-fade-target="disclaimer">
        Decorative motion appears occasionally on this page for demo purposes. It is subtle,
        non-blocking, and disabled when reduced-motion is enabled.
      </p>

      <section className="govuk-!-margin-top-7" data-mom-fade-target="principles">
        <h2 className="govuk-heading-l">Design principles</h2>
        <ul className="govuk-list govuk-list--bullet">
          <li><strong>Make outcomes legible:</strong> users should always know what will happen next.</li>
          <li><strong>Design for real pressure:</strong> interfaces must remain usable during incidents and spikes.</li>
          <li><strong>Use consistent language:</strong> plain, direct content across every service and team.</li>
          <li><strong>Prefer reusable patterns:</strong> speed through standardisation, not reinvention.</li>
        </ul>
      </section>

      <section className="govuk-!-margin-top-7">
        <h2 className="govuk-heading-l">Foundations</h2>
        <table className="govuk-table">
          <thead className="govuk-table__head">
            <tr className="govuk-table__row">
              <th scope="col" className="govuk-table__header">Foundation</th>
              <th scope="col" className="govuk-table__header">Standard</th>
              <th scope="col" className="govuk-table__header">Why it matters</th>
            </tr>
          </thead>
          <tbody className="govuk-table__body">
            <tr className="govuk-table__row">
              <td className="govuk-table__cell">Rune typography</td>
              <td className="govuk-table__cell">Dual-script hierarchy — standard glyphs for body content, verified rune sequences for binding clauses and formal notices</td>
              <td className="govuk-table__cell">Prevents mis-invocation when citizens scan permit documents under pressure</td>
            </tr>
            <tr className="govuk-table__row">
              <td className="govuk-table__cell">Ethereal spacing</td>
              <td className="govuk-table__cell">Consistent spatial rhythm that holds across physical and scrying-mirror viewports</td>
              <td className="govuk-table__cell">Ensures form layouts remain stable during dimensional-shift rendering</td>
            </tr>
            <tr className="govuk-table__row">
              <td className="govuk-table__cell">Enchanted content style</td>
              <td className="govuk-table__cell">Plain language first, incantation syntax only where legally required</td>
              <td className="govuk-table__cell">Reduces failed submissions — 73% of permit errors trace to unclear phrasing</td>
            </tr>
            <tr className="govuk-table__row">
              <td className="govuk-table__cell">Colour and contrast</td>
              <td className="govuk-table__cell">Meets WCAG 2.2 AA in daylight, torchlight, and bioluminescent cavern conditions</td>
              <td className="govuk-table__cell">Not all Ministry offices have consistent ambient lighting</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="govuk-!-margin-top-7">
        <h2 className="govuk-heading-l">Core components</h2>
        <dl className="govuk-summary-list">
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Ward activation controls</dt>
            <dd className="govuk-summary-list__value">
              Primary ward actions are singular and irreversible — the interface must make consequences
              obvious before activation. Secondary actions (modify parameters, request review) are
              available but visually subordinate.
              <div className="govuk-button-group govuk-!-margin-top-2">
                <button className="govuk-button" type="button">Activate ward</button>
                <button className="govuk-button govuk-button--secondary" type="button">Review parameters</button>
              </div>
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Containment status tags</dt>
            <dd className="govuk-summary-list__value">
              Every registered entity, permit, and active enchantment carries a visible status tag.
              Operational teams rely on these for triage during surge events and containment reviews.
              <p className="govuk-!-margin-top-2 govuk-!-margin-bottom-0">
                <strong className="govuk-tag govuk-tag--green govuk-!-margin-right-1">Contained</strong>
                <strong className="govuk-tag govuk-tag--blue govuk-!-margin-right-1">Under review</strong>
                <strong className="govuk-tag govuk-tag--yellow govuk-!-margin-right-1">Provisional</strong>
                <strong className="govuk-tag govuk-tag--red">Breach detected</strong>
              </p>
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Curse-breach warnings</dt>
            <dd className="govuk-summary-list__value">
              High-severity alerts use warning text with the exclamation icon. These are reserved
              for situations where inaction causes measurable harm — containment failures,
              expired protective wards, and revoked permits with active enchantments.
              <div className="govuk-warning-text govuk-!-margin-top-2 govuk-!-margin-bottom-0">
                <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
                <strong className="govuk-warning-text__text">
                  <span className="govuk-warning-text__assistive">Warning</span>
                  Protective ward expired. Re-activate before resuming fieldwork or citizens may be exposed to residual enchantment.
                </strong>
              </div>
            </dd>
          </div>
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Permit summary cards</dt>
            <dd className="govuk-summary-list__value">
              Permit details are displayed in structured summary lists so caseworkers can verify
              conditions at a glance during high-volume processing windows.
            </dd>
          </div>
        </dl>
      </section>

      <section className="govuk-!-margin-top-7">
        <h2 className="govuk-heading-l">Service patterns</h2>
        <h3 className="govuk-heading-m">Pattern: Apparition licence application</h3>
        <ol className="govuk-list govuk-list--number">
          <li>Confirm eligibility — applicant must hold a current realm-of-origin identity credential and have no outstanding spatial-violation notices.</li>
          <li>Capture destination preferences and restricted-zone exclusions through a stepped form with clear progress indication.</li>
          <li>Present a confirmation page stating the licence reference, effective date, and any conditions imposed by the Spatial Integrity Board.</li>
        </ol>

        <h3 className="govuk-heading-m">Pattern: Creature registration and welfare check</h3>
        <ol className="govuk-list govuk-list--number">
          <li>Identify the creature class from a validated taxonomy — free-text descriptions are mapped to the nearest registered classification with a confidence indicator.</li>
          <li>Collect habitat requirements, dietary restrictions, and containment grade through conditional form sections that adapt based on creature class.</li>
          <li>Schedule an initial welfare inspection and issue a provisional registration with a 90-day review window.</li>
        </ol>

        <h3 className="govuk-heading-m">Pattern: Hex incident response</h3>
        <p className="govuk-body">
          During active hex incidents, the interface reduces navigation depth to two levels,
          promotes the status banner to fixed position, and limits available actions to those
          that directly support containment or citizen safety. Non-critical functions are
          suppressed, not hidden — they show a &quot;temporarily unavailable during active incident&quot;
          state with an estimated restoration time.
        </p>
      </section>

      <section className="govuk-!-margin-top-7">
        <h2 className="govuk-heading-l">Accessibility and multi-realm support</h2>
        <p className="govuk-body">
          Ministry services are used by practitioners, citizens, creatures, and automated
          familiar systems. The design system accounts for this range explicitly:
        </p>
        <ul className="govuk-list govuk-list--bullet">
          <li><strong>Wand-free navigation:</strong> every action is reachable by keyboard, voice, and familiar-relay input. No interaction requires gestural casting.</li>
          <li><strong>Multi-species readability:</strong> content is tested across human-standard, low-light (subterranean), and high-altitude scrying conditions at WCAG 2.2 AA minimum.</li>
          <li><strong>Temporal consistency:</strong> interfaces must render identically regardless of the observer&apos;s local time-flow rate. All timestamps use Coordinated Magical Time (CMT).</li>
          <li><strong>Screen reader and rune reader parity:</strong> ARIA labels and rune-sequence descriptions provide equivalent information to users of both technologies.</li>
          <li><strong>Familiar-agent compatibility:</strong> automated familiars acting on behalf of a user receive the same semantic structure as human users, ensuring no degraded experience for delegated tasks.</li>
        </ul>
      </section>

      <section className="govuk-!-margin-top-7">
        <h2 className="govuk-heading-l">Contribution model</h2>
        <p className="govuk-body">
          New components and patterns are proposed through a Grimoire Contribution Request (GCR).
          Each GCR must include:
        </p>
        <ul className="govuk-list govuk-list--bullet">
          <li>A documented user need grounded in an active service or policy requirement</li>
          <li>Accessibility evidence covering keyboard, screen reader, and familiar-agent testing</li>
          <li>Containment-grade classification (standard, elevated, or critical) with rationale</li>
          <li>At least one working prototype deployable to the Arcane Staging Environment</li>
        </ul>
        <p className="govuk-body">
          Accepted GCRs are versioned in the Grimoire Registry and published with migration
          guidance so service teams can adopt new patterns without disrupting active enchantments.
          Breaking changes require a 60-day deprecation notice and a compatibility shim for the
          previous version.
        </p>
        <div className="govuk-inset-text">
          The Arcane Standards Office reviews GCRs on a fortnightly cadence. Proposals with
          cross-realm impact are escalated to the Inter-Realm Interface Council for joint review.
        </div>
      </section>
    </div>
  );
}
