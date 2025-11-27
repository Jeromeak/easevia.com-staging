import { Fragment } from 'react';
import { Header } from './landing-page/components/Header';
import { HeroSection } from './landing-page/components/HeroBanner';
import { Steps } from './landing-page/components/Steps';
import { Booking } from './landing-page/components/Booking';
import { Mission } from './landing-page/components/Mission';
import { Subscription } from './landing-page/components/Subscription';
import { Banner } from './landing-page/components/Banner';
import { Form } from './landing-page/components/Form';
import { Experience } from './landing-page/components/Experience';
import { Plans } from './landing-page/components/Plans';
import { Destination } from './booking/components/Destination';
import { Footer } from '@/common/components/Footer';

const Home = () => {
  return (
    <Fragment>
      <Header />
      <HeroSection />
      <Steps />
      <Booking />
      <Plans />
      <Destination
        textColor="dark:text-orange-200 text-Teal-900 dark:lg:text-Teal-500"
        leftBgColor="bg-white dark:bg-black"
        arrowColor="text-orange-450 dark:text-orange-200"
        arrowBorderColor="border-orange-450 dark:border-orange-200"
      />
      <Mission />
      <Subscription />
      <Experience />
      <Banner />
      <Form />
      <Footer />
    </Fragment>
  );
};

export default Home;
