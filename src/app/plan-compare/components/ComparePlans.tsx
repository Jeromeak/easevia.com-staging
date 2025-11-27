'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import { ArrowLeft } from '@/icons/icon';
import { useCallback } from 'react';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import { comparePackages, fetchPackageById } from '@/lib/api/package';
import type { ComparePackageResponse } from '@/lib/types/api/package';
import { useLanguageCurrency } from '@/context/hooks/useLanguageCurrency';
import { useCheckout } from '@/context/hooks/useCheckout';
import type { SelectedPlan } from '@/context/checkout.types';
import { toPlanViewModel } from '@/services/planViewModel';

interface ComparePlanData {
  plan: string;
  class: string;
  price: string;
}

interface ComparePlanUIData {
  title: string;
  values: string[];
}

export const ComparePlane = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currency } = useLanguageCurrency();
  const { setSelectedPlan } = useCheckout();
  const [packages, setPackages] = useState<ComparePackageResponse[]>([]);
  const [packagePrices, setPackagePrices] = useState<Record<string, string>>({});
  const [loadingPrices, setLoadingPrices] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchedSignatureRef = useRef<string>('');

  const handleSubscribe = useCallback(
    async (packageIndex: number) => {
      const selectedPackage = packages[packageIndex];

      if (!selectedPackage || !selectedPackage.id) {
        return;
      }

      try {
        // Fetch full package details to ensure we have all required fields
        const fullPackage = await fetchPackageById(selectedPackage.id);

        // Transform to SelectedPlan format
        const vm = toPlanViewModel(fullPackage);
        const planData: SelectedPlan = {
          id: vm.id,
          title: vm.title,
          price: vm.price,
          classLabel: vm.classLabel,
          tripsPerYear: vm.tripsPerYear,
          airlinesLabel: vm.airlinesLabel,
          description: fullPackage.description || '',
          additionalBenefits: fullPackage.additional_benefits?.filter(Boolean) || [],
        };

        setSelectedPlan(planData);
        router.push(`/checkout?packageId=${vm.id}`);
      } catch (error) {
        console.error('Failed to fetch package details:', error);
        // Fallback: try to use partial data from compare response
        const classNames = selectedPackage.classes?.map((c) => c.name).join(', ') || '';
        const classLabel = classNames ? `${classNames} class` : '';
        const tripsPerYear =
          typeof selectedPackage.trip_count === 'number'
            ? `${selectedPackage.trip_count} ${selectedPackage.trip_count === 1 ? 'trip' : 'trips'}/year`
            : '';
        const airlinesLabel =
          selectedPackage.airlines
            ?.map((a) => a.common_name || a.business_name)
            .filter(Boolean)
            .join(', ') || '';

        const planData: SelectedPlan = {
          id: selectedPackage.id,
          title: selectedPackage.title || 'N/A',
          price: packagePrices[selectedPackage.id] || selectedPackage.price || 'N/A',
          classLabel,
          tripsPerYear,
          airlinesLabel,
          description: selectedPackage.description || '',
          additionalBenefits: selectedPackage.additional_benefits?.filter(Boolean) || [],
        };

        setSelectedPlan(planData);
        router.push(`/checkout?packageId=${selectedPackage.id}`);
      }
    },
    [packages, packagePrices, setSelectedPlan, router]
  );

  useEffect(() => {
    const fetchCompareData = async () => {
      try {
        setLoading(true);
        setError(null);

        const packageIdsParam = searchParams.get('package_ids');
        const currencyIdParam = searchParams.get('currency_id');

        let packageIds: string[];

        if (packageIdsParam) {
          packageIds = packageIdsParam
            .split(',')
            .map((id) => id.trim())
            .filter((id) => id.length > 0);
        } else {
          packageIds = ['1', '2', '3'];
        }

        let currencyId: string;

        if (currencyIdParam) {
          currencyId = currencyIdParam;
        } else if (currency?.id) {
          currencyId = currency.id;
        } else {
          setError('Currency not available');
          setLoading(false);

          return;
        }

        if (packageIds.length === 0) {
          setError('No valid package IDs provided');
          setLoading(false);

          return;
        }

        const signature = `${packageIds.join(',')}|${currencyId}`;

        if (fetchedSignatureRef.current === signature) {
          setLoading(false);

          return;
        }

        fetchedSignatureRef.current = signature;

        const response = await comparePackages(packageIds, currencyId);
        setPackages(response);

        // Fetch prices separately if not in response
        const pricesToFetch: string[] = [];
        response.forEach((pkg) => {
          if (!pkg.price && pkg.id) {
            pricesToFetch.push(pkg.id);
          } else if (pkg.price) {
            setPackagePrices((prev) => ({ ...prev, [pkg.id]: pkg.price! }));
          }
        });

        // Fetch missing prices
        if (pricesToFetch.length > 0) {
          setLoadingPrices(true);

          try {
            const pricePromises = pricesToFetch.map(async (id) => {
              try {
                const fullPackage = await fetchPackageById(id);

                return { id, price: fullPackage.price || 'N/A' };
              } catch {
                return { id, price: 'N/A' };
              }
            });

            const priceResults = await Promise.all(pricePromises);
            const priceMap: Record<string, string> = {};
            priceResults.forEach(({ id, price }) => {
              priceMap[id] = price;
            });
            setPackagePrices((prev) => ({ ...prev, ...priceMap }));
          } catch {
            // Silent fail for price fetching
          } finally {
            setLoadingPrices(false);
          }
        }
      } catch (err: unknown) {
        console.error('Error fetching comparison data:', err);

        let errorMessage: string;

        if (typeof err === 'string') {
          errorMessage = err.includes("'package_ids'") ? err.replace(/'package_ids'/g, "'package'") : err;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        } else {
          errorMessage = 'Failed to fetch comparison data';
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCompareData();
  }, [searchParams, currency]);

  const comparePlansData: ComparePlanData[] = useMemo(() => {
    return packages.map((pkg) => ({
      plan: pkg.title || 'N/A',
      class: pkg.classes?.map((c) => c.name).join(', ') || 'N/A',
      price: packagePrices[pkg.id] || pkg.price || (loadingPrices ? 'Loading...' : 'N/A'),
    }));
  }, [packages, packagePrices, loadingPrices]);

  // Dynamically generate comparison rows based on available fields
  const generateComparePlansUIData = useCallback((): ComparePlanUIData[] => {
    if (packages.length === 0) return [];

    const features: ComparePlanUIData[] = [];

    // Field mappings: [fieldName, displayTitle, formatter]
    const fieldMappings: Array<
      [keyof ComparePackageResponse, string, (value: unknown, pkg: ComparePackageResponse) => string]
    > = [
      ['trip_count', 'No. of Trips', (val) => (val ? String(val) : '')],
      ['member_count', 'No. of Persons', (val) => (val ? String(val) : '')],
      ['allowed_date_change_count', 'Date Changes', (val) => (val ? `Upto ${val} free` : '')],
      [
        'classes',
        'Class',
        (val, _pkg) => {
          void _pkg; // Mark as intentionally unused

          if (Array.isArray(val) && val.length > 0) {
            return val
              .map((c: { name?: string }) => c.name || '')
              .filter(Boolean)
              .join(', ');
          }

          return '';
        },
      ],
      ['description', 'Description', (val) => (val ? String(val) : '')],
      ['duration_days', 'Duration (Days)', (val) => (val ? String(val) : '')],
      ['allowed_route_count', 'No. of Routes', (val) => (val ? String(val) : '')],
    ];

    // Only add fields that exist in at least one package
    fieldMappings.forEach(([fieldName, displayTitle, formatter]) => {
      const hasField = packages.some((pkg) => pkg[fieldName] !== undefined && pkg[fieldName] !== null);

      if (hasField) {
        features.push({
          title: displayTitle,
          values: packages.map((pkg) => {
            const value = pkg[fieldName];

            return formatter(value, pkg);
          }),
        });
      }
    });

    return features;
  }, [packages]);

  const comparePlansUIData = useMemo(() => generateComparePlansUIData(), [generateComparePlansUIData]);

  if (loading) {
    return (
      <section>
        <div className="max-w-[90%] mx-auto pb-30">
          <div className="overflow-x-auto scroll lg:mt-10 bg-gray-300 p-5 lg:p-10 rounded-3xl">
            <div className="flex justify-center items-center h-64">
              <div className="text-xl text-neutral-150">Loading comparison data...</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (packages.length === 0 && !loading) {
    return (
      <section>
        <div className="max-w-[90%] mx-auto pb-30">
          <div className="overflow-x-auto scroll lg:mt-10 bg-gray-300 p-5 lg:p-10 rounded-3xl">
            <div className="flex flex-col justify-center items-center h-64 space-y-1">
              <div className="text-xl text-neutral-150">No packages found for comparison</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <div className="max-w-[90%] mx-auto pb-30">
          <div className="overflow-x-auto scroll lg:mt-10 bg-gray-300 p-5 lg:p-10 rounded-3xl">
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <div className="text-xl text-red-500 text-center">{error}</div>
              <div className="text-sm text-neutral-150 text-center">
                Please reduce your selection to at most 3 plans and try again.
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="hidden lg:block max-w-[90%] mx-auto pb-30">
        <div className="overflow-x-auto scroll lg:mt-10 bg-white dark:bg-black dark:md:bg-gray-300 p-5 lg:p-10 rounded-3xl">
          <table className="w-full min-w-[600px] rounded-2xl">
            <thead>
              <tr>
                <th className="text-left p-4 text-xl font-Neutra text-orange-200 uppercase bg-gray-300 rounded-tl-2xl"></th>
                {comparePlansData.map((plan, idx) => (
                  <th
                    key={idx}
                    className={clsx(
                      'text-center p-4 bg-gray-300 align-top',
                      idx === comparePlansData.length - 1 && 'rounded-tr-2xl'
                    )}
                  >
                    <div className="font-Neutra text-3xl lg:text-41 tracking-[-0.419px] uppercase text-[#f7cb3c] dark:text-orange-200">
                      {plan.plan}
                    </div>
                    <div className="mt-3 md:mt-5 text-neutral-800 font-normal text-xl">
                      <span className="font-Neutra text-5xl !font-medium text-[#00CBCB] dark:text-Teal-900">
                        {plan.price}
                      </span>
                      / Year
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparePlansUIData.map((feature, idx) => (
                <tr key={idx} className={clsx(idx % 2 === 0 ? 'bg-gray-180' : 'bg-gray-1')}>
                  <td className="text-neutral-150 px-5 lg:px-8 py-4 lg:py-8 !rounded-l-[60px] text-xl lg:text-2xl whitespace-nowrap">
                    {feature.title}
                  </td>
                  {feature.values.map((value, valueIdx) => (
                    <td
                      key={valueIdx}
                      className={`text-center text-neutral-150 text-lg ${
                        valueIdx === feature.values.length - 1 ? '!rounded-r-[60px]' : ''
                      }`}
                    >
                      {value || '-'}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td></td>
                {comparePlansData.map((_, idx) => (
                  <td key={idx} className="p-4 text-center">
                    <button
                      type="button"
                      role="button"
                      onClick={() => handleSubscribe(idx)}
                      className="flex gap-2 uppercase orange text-white dark:text-black bg-[#F7CB3C] dark:bg-orange-200 px-6 rounded-full border-[1.5px] border-[#F7CB3C] dark:border-orange-200 cursor-pointer py-2 mx-auto"
                    >
                      Subscribe
                      <ArrowLeft width="24" height="24" className="transform -rotate-180" />
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="block lg:hidden max-w-full mx-auto">
        <div className="bg-blue-150 dark:bg-black rounded-3xl overflow-hidden pb-10">
          <div className="grid grid-cols-3 text-center py-4 gap-0">
            {comparePlansData.map((plan, idx) => (
              <div key={idx} className="flex flex-col items-center px-3">
                <div className="font-Neutra text-2xl tracking-tight uppercase text-orange-200 mb-1">{plan.plan}</div>
                <div className="text-Teal-900 text-xs mb-1">YEARLY {plan.price}</div>
                <button
                  type="button"
                  role="button"
                  onClick={() => handleSubscribe(idx)}
                  className="flex items-center gap-1 uppercase text-black bg-orange-200 px-3 py-2 rounded-full font-Futra leading-3 text-[10px] mb-2 mt-2"
                >
                  Subscribe
                </button>
              </div>
            ))}
          </div>
          <div className="">
            {comparePlansUIData.map((feature, fIdx) => (
              <div key={fIdx}>
                <div className="bg-white dark:bg-gray-300/50 text-neutral-50 dark:text-white text-center text-base font-Futra font-medium mx-4 py-2">
                  {feature.title}
                </div>
                <div className="grid grid-cols-3 text-neutral-50 dark:text-neutral-150 text-center text-base font-Futra">
                  {feature.values.map((v, i) => (
                    <div key={i} className="py-2">
                      {v || '-'}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
