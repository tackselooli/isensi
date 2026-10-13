import React, { useState, useCallback } from 'react';
import { constConfig } from '../../../../const-config';
import SectionHeading from '../../../components/sectionHeading/SectionHeading';
import useLanguage from '../../../hooks/useLanguage';
import { motion, AnimatePresence } from 'framer-motion';

const Gallery = () => {
  const { t } = useLanguage();
  const galleryImages = constConfig.galleryImages || [];
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const openLightbox = useCallback((index) => () => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const showPrev = useCallback(
    (e) => {
      e.stopPropagation();
      setLightboxIndex((i) => (i === null ? null : (i - 1 + galleryImages.length) % galleryImages.length));
    },
    [galleryImages.length],
  );
  const showNext = useCallback(
    (e) => {
      e.stopPropagation();
      setLightboxIndex((i) => (i === null ? null : (i + 1) % galleryImages.length));
    },
    [galleryImages.length],
  );

  if (!galleryImages.length) return null;

  return (
    <div className="w-full px-4 md:w-[80%] mx-auto my-16 md:my-28">
      <SectionHeading title={t('home.gallery')} link="/classes" />

      {/* Masonry-like grid: 1 large image on the left + 4 smaller on the right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        {/* Main large image — spans 2 rows on large screens */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:row-span-2 lg:col-span-1 cursor-pointer group relative overflow-hidden rounded-xl shadow-lg"
          onClick={openLightbox(0)}
        >
          <img
            src={galleryImages[0]}
            alt="Gallery Main"
            className="w-full h-full max-h-[560px] object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <span className="text-white font-semibold text-sm">{t('common.view', 'View')}</span>
          </div>
        </motion.div>

        {/* 4 smaller images in a 2x2 grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {galleryImages.slice(1, 5).map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="cursor-pointer group relative overflow-hidden rounded-xl shadow-md"
              onClick={openLightbox(index + 1)}
            >
              <img
                src={image}
                alt={`Gallery ${index + 2}`}
                className="w-full h-48 md:h-56 lg:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <span className="text-white font-semibold text-sm">{t('common.view', 'View')}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white text-4xl leading-none hover:text-yellow-400 transition-colors z-10"
              aria-label={t('common.close')}
            >
              &times;
            </button>

            {/* Previous */}
            <button
              type="button"
              onClick={showPrev}
              className="absolute left-4 md:left-8 text-white text-5xl hover:text-yellow-400 transition-colors z-10"
              aria-label={t('common.previous')}
            >
              &#8249;
            </button>

            {/* Image */}
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={galleryImages[lightboxIndex]}
              alt={`Gallery ${lightboxIndex + 1}`}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next */}
            <button
              type="button"
              onClick={showNext}
              className="absolute right-4 md:right-8 text-white text-5xl hover:text-yellow-400 transition-colors z-10"
              aria-label={t('common.next')}
            >
              &#8250;
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-1.5 rounded-full">
              {lightboxIndex + 1} / {galleryImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
