import React from 'react';
import { Link } from 'react-router-dom';
import useLanguage from '../../hooks/useLanguage';
import { constConfig } from '../../../const-config';

const Footer = () => {
  const { t, dir } = useLanguage();

  return (
    <footer
      className="relative bg-gradient-to-br text-start from-purple-900 via-emerald-800 to-purple-900 text-gray-100 py-16"
      dir={dir}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-t from-purple-500 via-transparent to-emerald-600 opacity-40"></div>
        <div className="absolute top-10 right-10 w-40 h-40 bg-pink-500 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-yellow-500 rounded-full blur-2xl opacity-60 animate-pulse"></div>
      </div>

      {/* Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-right space-y-4">
          <div className="w-24 h-24 rounded-full bg-slate-300 shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <img src="/yoga-logo.png" alt="" />
          </div>
          <h2 className="text-3xl font-bold">{constConfig.siteLogoTag}</h2>
          <p className="text-gray-300 text-base leading-relaxed">{t('footer.about')}</p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-right">
          <h3 className="text-xl font-bold text-white mb-4">{t('footer.usefulLinks')}</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="text-lg hover:text-yellow-400 transition-colors duration-300">{t('nav.home')}</Link></li>
            <li><Link to="/instructors" className="text-lg hover:text-yellow-400 transition-colors duration-300">{t('footer.aboutUs')}</Link></li>
            <li><Link to="/classes" className="text-lg hover:text-yellow-400 transition-colors duration-300">{t('footer.programs')}</Link></li>
            <li><Link to="/articles" className="text-lg hover:text-yellow-400 transition-colors duration-300">{t('nav.articles')}</Link></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-right">
          <h3 className="text-xl font-bold text-white mb-4">{t('footer.contact')}</h3>
          <ul className="space-y-2">
            <li className="flex items-center"><i className="fas fa-map-marker-alt text-yellow-400 mr-2"></i> Bushehr</li>
            <li className="flex items-center" dir="ltr"><i className="fas fa-phone-alt text-yellow-400 mr-2"></i> +98 912-345-6789</li>
            <li className="flex items-center" dir="ltr"><i className="fas fa-envelope text-yellow-400 mr-2"></i> isensi@fitness.ir</li>
          </ul>
        </div>

        {/* Newsletter Section */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-right">
          <h3 className="text-xl font-bold text-white mb-4">{t('footer.newsletter')}</h3>
          <p className="text-gray-300 text-base mb-4">{t('footer.newsletterDesc')}</p>
          <form
            className="flex space-x-2 w-full"
            onSubmit={(e) => {
              e.preventDefault();
              alert(t('footer.send') + ' ✓');
            }}
          >
            <input
              type="email"
              required
              placeholder={t('footer.emailPlaceholder')}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-yellow-400"
            />
            <button className="px-4 py-2 bg-yellow-400 rounded-lg text-gray-900 font-bold hover:bg-yellow-500 transition-colors duration-300">
              {t('footer.send')}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="relative mt-16 text-center text-sm text-gray-400">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
        <p>{t('footer.rights')}</p>
      </div>
    </footer>
  );
};

export default Footer;
