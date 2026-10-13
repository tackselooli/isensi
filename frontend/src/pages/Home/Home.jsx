import HeroContainer from './Hero/HeroContainer';
import Gallery from './Gallery/Gallery';
import PopularClasses from '../PopularClasses/PopularClasses';
import BMICalculator from './BmiCalculator/BmiCalculator';
import FAQ from './Faq/faq';
import Articles from './articles/Articles';

const Home = () => {
  return (
    <div>
      <HeroContainer />
      <div className="max-w-screen-xl mx-auto">
        <Gallery />
        <PopularClasses />
        <Articles />
      </div>
      <BMICalculator />
      <FAQ />
    </div>
  );
};

export default Home;
