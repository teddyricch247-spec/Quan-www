import React from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ } from '../../data/kael';

/**
 * Native <details>/<summary> accordion: keyboard and screen-reader
 * behaviour come from the browser, it works with JavaScript off, and the
 * open state is findable with in-page search. The chevron turn and the
 * short fade on the answer (see .faq-* in globals.css) answer the click.
 */
export const Faq: React.FC = () => {
  return (
    <div className="border-t border-line">
      {FAQ.map((item) => (
        <details key={item.q} className="faq-item border-b border-line">
          <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-[1.0625rem] font-medium text-ink">
            <span>{item.q}</span>
            <ChevronDown
              className="faq-chevron h-5 w-5 flex-none text-ink-3 transition-transform duration-300"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </summary>
          <div className="faq-body max-w-[720px] pb-6 pr-10">
            {item.a.map((paragraph, i) => (
              <p key={i} className={`m-0 text-[0.9375rem] leading-[1.7] text-ink-2 ${i > 0 ? 'mt-3' : ''}`}>
                {paragraph}
              </p>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
};

export default Faq;
