import { Footer } from '@/common/components/Footer';
import { Header } from '@/common/components/Header';
import { Fragment, Suspense } from 'react';
import { HeroBanner } from './components/HeroBanner';
import { Content } from './components/Content';
import config from '../../../config.json';

const TermsAndConditionsSEO = config.find((item) => item.slug === '/terms-and-conditions');
export const metadata = {
  title: TermsAndConditionsSEO?.title || '',
  description: TermsAndConditionsSEO?.description || '',
  keywords: TermsAndConditionsSEO?.keywords || '',
};

const TermsAndConditions = () => {
  return (
    <Fragment>
      <Suspense fallback={<div></div>}>
        <Header />
        <HeroBanner />
        <Content />
        <Footer />
      </Suspense>
    </Fragment>
  );
};

export default TermsAndConditions;
