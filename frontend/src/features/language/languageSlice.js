// Redux slice for managing app language (fa / en) and direction (rtl / ltr).
import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'app_language';

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'fa';
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === 'en' || saved === 'fa' ? saved : 'fa';
};

const applyDocumentAttributes = (language) => {
  if (typeof document === 'undefined') return;
  const dir = language === 'en' ? 'ltr' : 'rtl';
  document.documentElement.lang = language;
  document.documentElement.dir = dir;
  document.body.classList.toggle('font-en', language === 'en');
};

// Apply on module load so the very first paint is correct.
applyDocumentAttributes(getInitialLanguage());

const languageSlice = createSlice({
  name: 'language',
  initialState: {
    language: getInitialLanguage(),
  },
  reducers: {
    setLanguage: (state, action) => {
      const lang = action.payload === 'en' ? 'en' : 'fa';
      state.language = lang;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, lang);
      }
      applyDocumentAttributes(lang);
    },
    toggleLanguage: (state) => {
      const lang = state.language === 'fa' ? 'en' : 'fa';
      state.language = lang;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, lang);
      }
      applyDocumentAttributes(lang);
    },
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;
export default languageSlice.reducer;
