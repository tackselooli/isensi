import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Switch } from '@mui/material';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaGlobe } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { constConfig } from '../../../const-config';
import { logoutUser } from '../../features/auth/authThunks';
import { setMode } from '../../features/theme/themeSlice';
import useLanguage from '../../hooks/useLanguage';

// NavBar — top navigation for the main (non-dashboard) layout.
// - Removes lodash dependency (uses native scroll throttling).
// - Removes MUI `useTheme()` (was crashing because no ThemeProvider wraps MainLayout).
// - Replaces dynamic Tailwind classes (`text-${...}`) with explicit class strings
//   so Tailwind's JIT compiler doesn't purge them.
// - Wires dark-mode toggle to the Redux theme store (was local-only before).
// - Adds a Persian/English language selector.
const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { t, language, dir, toggleLanguage } = useLanguage();

  const cartItems = useSelector((state) => state.cart.items || []);
  const user = useSelector((state) => state.auth.user);
  const themeMode = useSelector((state) => state.theme?.mode) || 'light';

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [navBg, setNavBg] = useState('bg-transparent');

  // Apply theme class to <html> when Redux theme mode changes.
  useEffect(() => {
    const root = window.document.documentElement;
    if (themeMode === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [themeMode]);

  // Native (no-lodash) throttled scroll listener.
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollPosition(window.pageYOffset);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = useMemo(() => location.pathname === '/', [location.pathname]);
  const isFixed = useMemo(
    () => ['/register', '/login'].includes(location.pathname.toLowerCase()),
    [location.pathname],
  );

  useEffect(() => {
    const isDark = themeMode === 'dark';
    const baseBg = isHome
      ? 'bg-transparent'
      : isDark
        ? 'bg-gray-900'
        : 'bg-white';
    let scrollBg;
    if (scrollPosition > 100) {
      scrollBg = isHome
        ? isDark
          ? 'bg-gray-900 backdrop-blur-xl bg-opacity-80'
          : 'bg-white backdrop-blur-xl bg-opacity-80'
        : baseBg;
    } else {
      scrollBg = baseBg;
    }
    setNavBg(scrollBg);
  }, [scrollPosition, isHome, themeMode]);

  const handleLogout = () => dispatch(logoutUser());
  const handleCartClick = () => (user ? navigate('/cart') : navigate('/login'));
  const handleToggleTheme = () => dispatch(setMode());

  const navLinkKeys = constConfig.navLinkKeys || [];
  const navLinkRoutes = {
    home: '/',
    instructors: '/instructors',
    classes: '/classes',
    articles: '/articles',
    products: '/products',
  };

  const renderNavLinks = useCallback(
    () =>
      navLinkKeys.map((key) => {
        const route = navLinkRoutes[key] || '/';
        return (
          <li key={route}>
            <NavLink
              to={route}
              className={({ isActive }) =>
                `font-bold transition-colors duration-300 ${
                  isActive
                    ? 'text-secondary'
                    : themeMode === 'dark'
                      ? 'text-white hover:text-secondary'
                      : 'text-gray-900 hover:text-secondary'
                }`
              }
            >
              {t(`nav.${key}`)}
            </NavLink>
          </li>
        );
      }),
    [navLinkKeys, themeMode, t],
  );

  const linkBaseClass = ({ isActive }) =>
    `font-bold transition-colors duration-300 ${
      isActive
        ? 'text-secondary'
        : themeMode === 'dark'
          ? 'text-white hover:text-secondary'
          : 'text-gray-900 hover:text-secondary'
    }`;

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`${isFixed ? 'static' : 'fixed'} top-0 transition-colors duration-500 ease-in-out w-full z-40 ${navBg} backdrop-blur-xl`}
      dir={dir}
    >
      <div className="lg:w-[95%] mx-auto sm:px-6 lg:px-6">
        <div className="px-4 py-4 flex items-center justify-between">
          {/* Left side (in RTL this appears on the right) — logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center cursor-pointer"
          >
            <img src="/yoga-logo.png" alt="Yoga Logo" className="w-8 h-8" />
            <div className="pl-3">
              <p className="text-sm text-sky-500 font-bold text-[15px] tracking-[19px]">
                {constConfig.siteLogoTag}
              </p>
            </div>
          </div>

          {/* Center / Right — desktop nav */}
          <div className="hidden md:block">
            <ul className="flex items-center space-x-4 space-x-reverse">
              {renderNavLinks()}

              {user ? (
                <>
                  <li>
                    <NavLink to="/dashboard" className={linkBaseClass}>
                      {t('common.dashboard')}
                    </NavLink>
                  </li>
                  <li>
                    <button
                      onClick={handleCartClick}
                      className="relative"
                      aria-label={t('common.cart')}
                    >
                      🛒
                      {cartItems.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                          {cartItems.length}
                        </span>
                      )}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="font-bold px-3 py-2 bg-secondary text-white rounded-xl hover:bg-opacity-80 transition duration-300"
                    >
                      {t('common.logout')}
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <NavLink to="/login" className={linkBaseClass}>
                    {t('common.login')}
                  </NavLink>
                </li>
              )}

              {/* Dark mode toggle */}
              <li>
                <div className="flex flex-col justify-center items-center">
                  <Switch
                    checked={themeMode === 'dark'}
                    onChange={handleToggleTheme}
                    size="small"
                  />
                  <span className="text-[8px] text-gray-700 dark:text-gray-200">
                    {themeMode === 'dark' ? t('common.darkMode') : t('common.lightMode')}
                  </span>
                </div>
              </li>

              {/* Language toggle */}
              <li>
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label={t('common.language')}
                >
                  <FaGlobe className="text-sm" />
                  {language === 'fa' ? 'EN' : 'فا'}
                </button>
              </li>
            </ul>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <FaBars
              className="text-2xl text-gray-900 dark:text-white cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Mobile menu — slide-in panel */}
      {isMobileMenuOpen && (
        <motion.div
          className="md:hidden fixed inset-0 z-50 bg-white dark:bg-gray-900 p-6 overflow-y-auto"
          initial={{ x: dir === 'rtl' ? '-100%' : '100%' }}
          animate={{ x: 0 }}
          exit={{ x: dir === 'rtl' ? '-100%' : '100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <img src="/yoga-logo.png" alt="Yoga Logo" className="w-8 h-8" />
              <span className="ml-3 text-sky-500 font-bold tracking-widest">
                {constConfig.siteLogoTag}
              </span>
            </div>
            <FaTimes
              className="text-2xl text-gray-900 dark:text-white cursor-pointer"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </div>

          <ul className="flex flex-col space-y-4">
            {renderNavLinks()}
            {user ? (
              <>
                <li>
                  <NavLink
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={linkBaseClass}
                  >
                    {t('common.dashboard')}
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleCartClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="font-bold text-gray-900 dark:text-white"
                  >
                    {t('common.cart')} ({cartItems.length})
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="font-bold px-3 py-2 bg-secondary text-white rounded-xl hover:bg-opacity-80 transition duration-300 w-full"
                  >
                    {t('common.logout')}
                  </button>
                </li>
              </>
            ) : (
              <li>
                <NavLink
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={linkBaseClass}
                >
                  {t('common.login')}
                </NavLink>
              </li>
            )}

            {/* Theme + Language */}
            <li className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-col items-center">
                <Switch
                  checked={themeMode === 'dark'}
                  onChange={handleToggleTheme}
                  size="small"
                />
                <span className="text-[10px] text-gray-700 dark:text-gray-200 mt-1">
                  {themeMode === 'dark' ? t('common.darkMode') : t('common.lightMode')}
                </span>
              </div>
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <FaGlobe />
                {language === 'fa' ? 'English' : 'فارسی'}
              </button>
            </li>
          </ul>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default React.memo(NavBar);
