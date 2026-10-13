// Convenience hook: `const { t, language, dir, setLanguage, toggleLanguage } = useLanguage();`
import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useMemo } from 'react';
import { translations, languages } from '../i18n/translations';
import { setLanguage, toggleLanguage } from '../features/language/languageSlice';

// Resolve a dotted key like "nav.home" from a flat-or-nested object.
const resolveKey = (dict, key) => {
  if (dict == null) return undefined;
  if (Object.prototype.hasOwnProperty.call(dict, key)) return dict[key];
  const parts = key.split('.');
  let cur = dict;
  for (const part of parts) {
    if (cur && typeof cur === 'object' && part in cur) {
      cur = cur[part];
    } else {
      return undefined;
    }
  }
  return cur;
};

const useLanguage = () => {
  const language = useSelector((state) => state.language?.language || 'fa');
  const dispatch = useDispatch();

  const t = useCallback(
    (key, fallback) => {
      const dict = translations[language] || translations.fa;
      const value = resolveKey(dict, key);
      if (value !== undefined && value !== null) return value;
      // fall back to other language then to the key itself
      const alt = translations[language === 'fa' ? 'en' : 'fa'];
      const altValue = resolveKey(alt, key);
      return altValue !== undefined ? altValue : (fallback ?? key);
    },
    [language],
  );

  const dir = language === 'en' ? 'ltr' : 'rtl';

  const setLang = useCallback((lang) => dispatch(setLanguage(lang)), [dispatch]);
  const toggleLang = useCallback(() => dispatch(toggleLanguage()), [dispatch]);

  return useMemo(
    () => ({ t, language, dir, languages, setLanguage: setLang, toggleLanguage: toggleLang }),
    [t, language, dir, setLang, toggleLang],
  );
};

export default useLanguage;
