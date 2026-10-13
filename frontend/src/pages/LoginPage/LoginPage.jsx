import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginUser } from '../../features/auth/authThunks';
import useLanguage from '../../hooks/useLanguage';

const LoginPage = () => {
  const { t, dir } = useLanguage();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useSelector((state) => state.auth);
  const from = location.state?.from || '/dashboard';

  useEffect(() => {
    if (auth.user) navigate(from);
  }, [auth.user, navigate, from]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await dispatch(loginUser(formData)).unwrap();
      navigate(from);
    } catch (err) {
      console.error('Error logging in:', err);
      setError(typeof err === 'string' ? err : (err.message || t('auth.loginFailed')));
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-600 p-4"
      dir={dir}
    >
      <form
        className="bg-white shadow-2xl rounded-3xl px-8 pt-8 pb-8 mb-4 w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 shadow-lg">
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800">{t('auth.loginTitle')}</h2>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            {t('auth.email')}
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            dir="ltr"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            {t('auth.password')}
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            dir="ltr"
            required
          />
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <div className="flex items-center justify-between">
          <button
            className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 text-white font-bold py-2.5 px-6 rounded-xl focus:outline-none focus:shadow-outline transition-transform hover:scale-105"
            type="submit"
            disabled={auth.status === 'loading'}
          >
            {auth.status === 'loading' ? t('auth.loggingIn') : t('common.login')}
          </button>
          <Link to="/register" className="inline-block align-baseline font-bold text-sm text-indigo-600 hover:text-indigo-800">
            {t('common.register')}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
