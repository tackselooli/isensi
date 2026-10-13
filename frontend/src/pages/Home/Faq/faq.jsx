import React, { useState } from 'react';
import { constConfig } from '../../../../const-config';
import useLanguage from '../../../hooks/useLanguage';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

// FAQ — Accordion list of frequently asked questions.
// The component previously accepted a `faqs` prop but ignored it and always
// read from constConfig. That's kept as the source of truth; the prop is
// removed from the signature to make intent clear.
const FAQ = () => {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = constConfig.faqs || [];

  return (
    <section className="bg-gray-900 text-white py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          {t('home.faqTitle')}
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`transition-all duration-500 bg-gray-800 rounded-xl shadow-lg p-6 ${
                activeIndex === index ? 'bg-gradient-to-r from-purple-600 to-emerald-700' : ''
              }`}
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg md:text-xl font-semibold">{faq.question}</h3>
                {activeIndex === index ? (
                  <ChevronUpIcon className="w-6 h-6 text-white" />
                ) : (
                  <ChevronDownIcon className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div
                className={`mt-4 text-gray-200 leading-relaxed transition-max-height duration-500 ease-in-out ${
                  activeIndex === index ? 'max-h-60' : 'max-h-0 overflow-hidden'
                }`}
              >
                <p className="text-right">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
