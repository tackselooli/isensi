import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../features/auth/authThunks';
import useLanguage from '../../hooks/useLanguage';

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  photourl: '',
  role: 'user',
  gender: 'Male',
  address: '',
  phone: '',
};

const inputClass = (field, errors) =>
  `w-full rounded-xl border bg-gray-50/80 px-4 py-3 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-white ${
    errors[field]
      ? 'border-red-400 focus:ring-red-400/40'
      : 'border-gray-200 focus:border-indigo-400 focus:ring-indigo-500/40'
  }`;

const Field = ({ label, required, error, children }) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-gray-700">
      {label}
      {required && <span className="text-red-500"> *</span>}
    </label>
    {children}
    {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
  </div>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" />
  </svg>
);

const Register = () => {
  const { t, dir } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t('auth.validation.nameRequired');

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = t('auth.validation.emailInvalid');

    if (formData.password.length < 6) newErrors.password = t('auth.validation.passwordShort');

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = t('auth.validation.passwordMismatch');

    if (formData.phone && !/^09\d{9}$/.test(formData.phone))
      newErrors.phone = t('auth.validation.phoneInvalid');

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const { confirmPassword, ...payload } = formData;
      await dispatch(registerUser(payload)).unwrap();
      alert(t('common.register') + ' ✓');
      navigate('/dashboard');
    } catch (err) {
      console.error('Register failed:', err);
      alert(typeof err === 'string' ? err : t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      dir={dir}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-600 p-4 sm:p-6"
    >
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-fuchsia-400/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 left-1/4 h-64 w-64 rounded-full bg-indigo-400/10 blur-3xl" />

      <div className="relative w-full max-w-3xl rounded-3xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 shadow-lg shadow-indigo-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-800 sm:text-4xl">
            {t('auth.registerTitle')}
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">{t('auth.registerSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Field label={t('auth.fullName')} required error={errors.name}>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('auth.namePlaceholder')}
              className={inputClass('name', errors)}
            />
          </Field>

          <Field label={t('auth.email')} required error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              dir="ltr"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={inputClass('email', errors)}
            />
          </Field>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label={t('auth.password')} required error={errors.password}>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="******"
                  dir="ltr"
                  className={inputClass('password', errors) + ' pl-12'}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-indigo-600"
                  aria-label="toggle password"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </Field>

            <Field label={t('auth.confirmPassword')} required error={errors.confirmPassword}>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="******"
                  dir="ltr"
                  className={inputClass('confirmPassword', errors) + ' pl-12'}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-indigo-600"
                  aria-label="toggle confirm"
                >
                  {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label={t('auth.gender')}>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-gray-800 transition-all duration-200 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="Male">{t('auth.male')}</option>
                <option value="Female">{t('auth.female')}</option>
                <option value="Other">{t('auth.other')}</option>
              </select>
            </Field>

            <Field label={t('auth.phone')} error={errors.phone}>
              <input
                id="phone"
                name="phone"
                type="tel"
                dir="ltr"
                value={formData.phone}
                onChange={handleChange}
                placeholder="09xxxxxxxxx"
                className={inputClass('phone', errors)}
              />
            </Field>
          </div>

          <Field label={t('auth.photoUrl')}>
            <input
              id="photourl"
              name="photourl"
              type="text"
              dir="ltr"
              value={formData.photourl}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
              className={inputClass('photourl', errors)}
            />
          </Field>

          <Field label={t('auth.address')}>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              placeholder={t('auth.address')}
              className={inputClass('address', errors)}
            />
          </Field>

          <button
            type="submit"
            disabled={isSubmitting || auth.status === 'loading'}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {isSubmitting || auth.status === 'loading' ? t('auth.submitting') : t('common.register')}
          </button>

          <p className="text-center text-sm text-gray-500">
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
              {t('auth.enterAccount')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
