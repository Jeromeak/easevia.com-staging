import { Fragment, Suspense } from 'react';
import { Header } from '../../common/components/Header';
import { Management } from './components/Management';
import { Footer } from '@/common/components/Footer';
import config from '../../../config.json';

const MyAccountSEO = config.find((item) => item.slug === '/my-account');
export const metadata = {
  title: MyAccountSEO?.title || '',
  description: MyAccountSEO?.description || '',
  keywords: MyAccountSEO?.keywords || '',
};

const MyAccount = () => {
  return (
    <Fragment>
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
        <Management />
        <Footer />
      </Suspense>
    </Fragment>
  );
};

export default MyAccount;
