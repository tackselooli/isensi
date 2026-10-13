import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCreative } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-creative';
import Hero from './Hero';
import { constConfig } from '../../../../const-config';
import useLanguage from '../../../hooks/useLanguage';

// HeroContainer — Swiper carousel of home hero slides.
// Previously `autoplay` was configured but the `Autoplay` module was not
// registered, so autoplay silently did nothing. Fixed.
const HeroContainer = () => {
  const { t } = useLanguage();

  const swiperProps = {
    grabCursor: true,
    effect: 'creative',
    creativeEffect: {
      prev: { shadow: true, translate: ['-120%', 0, -500] },
      next: { shadow: true, translate: ['120%', 0, -500] },
    },
    modules: [EffectCreative, Autoplay],
    className: 'mySwiper5',
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
  };

  return (
    <section>
      <Swiper {...swiperProps}>
        {(constConfig.bannerData || []).map((banner, index) => (
          <SwiperSlide key={index}>
            <Hero
              image={banner.image}
              title={t('home.heroTitle')}
              description={t('home.heroDesc')}
              buttonText={t('home.joinNow')}
              buttonText2={t('home.moreDetails')}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroContainer;
