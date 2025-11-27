import config from '../../../config.json';
import PlansClient from './PlansClient';

const plansSEO = config.find((item) => item.slug === '/plans');

export const metadata = {
  title: plansSEO?.title || '',
  description: plansSEO?.description || '',
  keywords: plansSEO?.keywords?.join(', ') || '',
};

export default function PlansPage() {
  return <PlansClient />;
}
