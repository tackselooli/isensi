import React, { useState } from 'react';
import useLanguage from '../../../hooks/useLanguage';

const BMICalculator = () => {
  const { t } = useLanguage();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [bmi, setBMI] = useState(null);
  const [category, setCategory] = useState('');

  const calculateBMI = (e) => {
    e.preventDefault();
    if (!height || !weight || !age) {
      alert(t('home.fillAllFields'));
      return;
    }

    const heightInMeters = Number(height) / 100;
    const bmiValue = (Number(weight) / (heightInMeters * heightInMeters)).toFixed(2);
    setBMI(bmiValue);

    let bmiCategory = '';
    const v = Number(bmiValue);
    if (v < 18.5) bmiCategory = t('home.bmiUnderweight');
    else if (v >= 18.5 && v < 24.9) bmiCategory = t('home.bmiIdeal');
    else if (v >= 25 && v < 29.9) bmiCategory = t('home.bmiOverweight');
    else bmiCategory = t('home.bmiObese');
    setCategory(bmiCategory);
  };

  return (
    <div className="container mx-auto p-6 max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-transform transform hover:scale-105 duration-300">
      <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 text-center mb-8">
        {t('home.bmiTitle')}
      </h2>
      <form onSubmit={calculateBMI} className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('home.height')}
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder={t('home.heightPlaceholder')}
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('home.weight')}
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder={t('home.weightPlaceholder')}
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('home.age')}
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder={t('home.agePlaceholder')}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 font-semibold rounded-md shadow-md bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white duration-300"
        >
          {t('home.bmiButton')}
        </button>
      </form>
      {bmi !== null && (
        <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-700 rounded-md shadow-inner text-center">
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {t('home.bmiYourScore')}: {bmi}
          </p>
          <p
            className={`text-lg mt-2 ${
              category === t('home.bmiIdeal') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {t('home.bmiStatus')}: {category}
          </p>
        </div>
      )}
    </div>
  );
};

export default BMICalculator;
