import React, { useEffect, useState } from 'react';
import useAxiosFetch from '../../hooks/useAxiosFetch';
import Cart from './Cart';
import SectionHeading from '../../components/sectionHeading/SectionHeading';
import useLanguage from '../../hooks/useLanguage';

const PopularClasses = () => {
  const { t } = useLanguage();
  const axiosFetch = useAxiosFetch();
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axiosFetch.get('/classes');
        setClasses(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.warn('Could not load popular classes:', err.message);
        setClasses([]);
      }
    };
    fetchClasses();
  }, [axiosFetch]);

  return (
    <div className="w-full px-4 md:w-[80%] mx-auto my-36 md:my-28">
      <div className="relative text-center">
        <SectionHeading title={t('home.popularClasses')} link="/classes" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {classes.slice(0, 6).map((item, index) => (
          <Cart key={item._id || index} item={item} />
        ))}
        {classes.length === 0 && (
          <div className="col-span-3 text-center py-12 text-gray-500">
            {t('classesPage.noClasses')}
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularClasses;
