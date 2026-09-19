import React, { useState } from 'react';

export function AccordionItem({ question, answer, isOpen, onToggle, id }) {
  return (
    <div className="border-b border-[#1C1B19]/20 py-4">
      <button
        type="button"
        id={`faq-btn-${id}`}
        aria-controls={`faq-panel-${id}`}
        aria-expanded={isOpen}
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left font-serif font-bold text-lg sm:text-xl text-[#1C1B19] hover:text-[#7A1F1F] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1F1F] py-2"
      >
        <span>{question}</span>
        <span className="font-mono text-xl text-[#7A1F1F] font-bold ml-4 shrink-0">
          {isOpen ? '—' : '+'}
        </span>
      </button>

      {isOpen && (
        <div
          id={`faq-panel-${id}`}
          role="region"
          aria-labelledby={`faq-btn-${id}`}
          className="pt-2 pb-4 font-serif text-base text-[#1C1B19]/80 leading-relaxed max-w-3xl animate-fadeIn"
        >
          {answer}
        </div>
      )}
    </div>
  );
}

export function Accordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="border-t border-[#1C1B19]/20 divide-y divide-[#1C1B19]/20">
      {items.map((item, idx) => (
        <AccordionItem
          key={idx}
          id={idx}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === idx}
          onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
        />
      ))}
    </div>
  );
}
