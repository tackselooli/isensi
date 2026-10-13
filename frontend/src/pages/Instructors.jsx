import React, { useEffect, useState } from 'react';
import useAxiosFetch from '../hooks/useAxiosFetch';
import useLanguage from '../hooks/useLanguage';
import { motion } from 'framer-motion';
import instructorFallback from '../assets/gallary/image3.jpg';

// Static fallback data shown when the backend is unreachable.
// In production these come from GET /popular-instructors or /instructors.
const FALLBACK_INSTRUCTORS = [
  {
    _id: '1',
    name: 'Sensei Sajjad',
    email: 'isensi@gmail.com',
    gender: 'Male',
    address: 'Bushehr',
    phone: '09120000001',
    specialty: 'Yoga & Meditation',
    experience: 12,
    photoUrl: '',
  },
  {
    _id: '2',
    name: 'Coach Maryam',
    email: 'maryam@isensi.ir',
    gender: 'Female',
    address: 'Tehran',
    phone: '09120000002',
    specialty: 'HIIT & Cardio',
    experience: 8,
    photoUrl: '',
  },
  {
    _id: '3',
    name: 'Trainer Reza',
    email: 'reza@isensi.ir',
    gender: 'Male',
    address: 'Shiraz',
    phone: '09120000003',
    specialty: 'Strength Training',
    experience: 10,
    photoUrl: '',
  },
  {
    _id: '4',
    name: 'Coach Sara',
    email: 'sara@isensi.ir',
    gender: 'Female',
    address: 'Isfahan',
    phone: '09120000004',
    specialty: 'Pilates & Core',
    experience: 6,
    photoUrl: '',
  },
  {
    _id: '5',
    name: 'Trainer Ali',
    email: 'ali@isensi.ir',
    gender: 'Male',
    address: 'Mashhad',
    phone: '09120000005',
    specialty: 'CrossFit',
    experience: 9,
    photoUrl: '',
  },
  {
    _id: '6',
    name: 'Coach Niloofar',
    email: 'niloofar@isensi.ir',
    gender: 'Female',
    address: 'Tabriz',
    phone: '09120000006',
    specialty: 'Nutrition & Wellness',
    experience: 7,
    photoUrl: '',
  },
];

const Instructors = () => {
  const { t, dir } = useLanguage();
  const axiosFetch = useAxiosFetch();
  const [instructors, setInstructors] = useState(FALLBACK_INSTRUCTORS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    axiosFetch
      .get('/instructors')
      .then((res) => {
        if (mounted && Array.isArray(res.data) && res.data.length > 0) {
          setInstructors(res.data);
        }
      })
      .catch((err) => {
        // keep fallback data
        console.warn('Could not load instructors from backend, using fallback:', err.message);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [axiosFetch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800 pt-24 pb-16" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600 mb-3">
            {t('instructorsPage.title')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('instructorsPage.subtitle')}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {instructors.map((inst, index) => (
            <motion.div
              key={inst._id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Photo */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={inst.photoUrl || instructorFallback}
                  alt={inst.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = instructorFallback;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white">{inst.name}</h3>
                  <p className="text-yellow-300 font-semibold text-sm">{inst.specialty}</p>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{t('instructorsPage.experience')}</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {inst.experience || '—'} {t('instructorsPage.years')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{t('instructorsPage.specialty')}</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{inst.specialty || '—'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{t('auth.email')}</span>
                  <span className="font-mono text-gray-700 dark:text-gray-300 text-xs" dir="ltr">{inst.email || '—'}</span>
                </div>
                {inst.address && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{t('auth.address')}</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{inst.address}</span>
                  </div>
                )}

                {/* Action button */}
                <button className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-bold shadow-lg hover:scale-[1.02] transition-transform">
                  {t('classesPage.view')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {instructors.length === 0 && !loading && (
          <p className="text-center text-gray-500 dark:text-gray-400 text-lg mt-12">
            {t('instructorsPage.noInstructors')}
          </p>
        )}
      </div>
    </div>
  );
};

export default Instructors;
