'use client';
import {
  ArrowDown,
  ArrowRightUpIcon,
  BellIcon,
  CloseIcon,
  DarkIcon,
  LightLogo,
  LogoIcon,
  LogoutIcon,
  MobileMenuIcon,
  MusicIcon,
  StarIcon,
  SunIcon,
  ThunderIcon,
} from '@/icons/icon';
import Link from 'next/link';
import { LanguageCurrencySelector } from './LanguageDropdown';
import { useThemeToggle } from '@/hooks/use-theme-toggle ';
import { useEffect, useRef, useState, useCallback } from 'react';
import { AccountDropdownData, BookingMenu } from './Data';
import { useRouter } from 'next/navigation';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/hooks/useAuth';
import type { MenuLink } from '@/lib/types/common.types';
import clsx from 'clsx';

export const Header = () => {
  const { isDark, toggleTheme } = useThemeToggle();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<boolean>(false);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }

      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        setOpenMobileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleItemClick = useCallback(
    (label: string) => {
      switch (label) {
        case 'My Profile':
          router.push('/my-account');
          break;
        case 'My Trips':
          router.push('/my-account?tab=trips');
          break;
        case 'Subscriptions Plan':
          router.push('/my-account?tab=subscription');
          break;
        default:
          break;
      }
    },
    [router]
  );

  const handleLogout = useCallback(() => {
    logout();
    router.push('/');
  }, [logout, router]);

  const handleDropdownToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handleMobileMenuToggle = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleMobileDropdownToggle = useCallback(() => {
    setOpenMobileDropdown((prev) => !prev);
  }, []);

  const handleMobileAccountClick = useCallback(
    (label: string) => {
      handleItemClick(label);
      setOpenMobileDropdown(false);
    },
    [handleItemClick]
  );

  const handleMobileLogout = useCallback(() => {
    setOpenMobileDropdown(false);
    handleLogout();
  }, [handleLogout]);

  const isAccountActive = useCallback(
    (label: string) => {
      switch (label) {
        case 'My Profile':
          return pathname === '/my-account' && !searchParams.get('tab');
        case 'My Trips':
          return pathname === '/my-account' && searchParams.get('tab') === 'trips';
        case 'Subscriptions Plan':
          return pathname === '/my-account' && searchParams.get('tab') === 'subscription';
        default:
          return false;
      }
    },
    [pathname, searchParams]
  );

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleAccountDropdownClickFactory = useCallback(
    (label: string) => () => {
      handleItemClick(label);
    },
    [handleItemClick]
  );
  const handleMobileAccountClickFactory = useCallback(
    (label: string) => () => {
      handleMobileAccountClick(label);
    },
    [handleMobileAccountClick]
  );

  return (
    <div
      className={`fixed bg-white dark:bg-neutral-50 w-full top-0 z-[10000] py-4${hasScrolled ? ' !shadow-6xl' : ''}`}
    >
      <div className="lg:max-w-[90%] xl:max-w-[90%] mx-auto">
        <div className="hidden lg:flex  justify-between w-full">
          <div className="flex items-center gap-6">
            <div>
              <Link href="/" title="Go to booking">
                <LightLogo />
              </Link>
            </div>
            <div className="flex gap-5 mt-3">
              {BookingMenu.map((menu: MenuLink, index: number) => {
                const isActive = pathname === menu.link;

                return (
                  <Link
                    key={index}
                    href={menu.link}
                    title={menu.title}
                    className={clsx('text-sm duration-500 tracking-[0.84px] leading-5', {
                      'text-Teal-500 font-semibold': isActive,
                      'hover:text-Teal-500': !isActive,
                    })}
                  >
                    {menu.title}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 cursor-pointer h-10 relative rounded-full flex justify-center items-center border border-Teal-900 dark:border-Teal-500">
              <BellIcon className="w-4 h-4 text-Teal-500! dark:text-white!" />
              <div className="w-2 h-2 rounded-full absolute top-2 right-[9px] animate-pulse bg-[#FF9C11] dark:bg-orange-100" />
            </div>
            <div className="h-10 w-10 border flex items-center justify-center cursor-pointer border-[#F7CB3C] dark:border-orange-200 rounded-full">
              <MusicIcon className="w-4 h-4" />
            </div>
            <LanguageCurrencySelector />

            <div onClick={handleDropdownToggle} className="flex items-center gap-3">
              <div className="w-10 h-10 uppercase text-lg text-white flex justify-center items-center bg-Teal-500 rounded-full">
                {user ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="relative" ref={dropdownRef}>
                <div className="flex items-center gap-2 cursor-pointer ">
                  <div className="flex flex-col">
                    <div className="text-lg font-medium uppercase ">{user ? user.name : 'User'}</div>
                    <div className=" text-xs gap-2 text-black rounded-full w-fit font-Neutra tracking-[0.295px] uppercase flex py-1 items-center px-2 bg-orange-200">
                      <ThunderIcon width="11" height="11" />
                      Premium
                      <div className="w-4 h-4 border flex justify-center items-center border-black rounded-full">
                        <ArrowRightUpIcon width="10" height="10" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <ArrowDown className="text-[#8E8E8E]" />
                  </div>
                </div>
                <div
                  className={clsx(
                    'absolute right-0 top-[67px] w-62 bg-white dark:bg-gray-300 rounded-b-xl shadow-12xl overflow-hidden transition-all duration-300',
                    {
                      'max-h-[25rem] opacity-100': open,
                      'max-h-0 opacity-0': !open,
                    }
                  )}
                >
                  <div className="flex flex-col">
                    <div className="p-4 bg-white dark:bg-black text-neutral-50 dark:text-[#A3A3A3] text-base uppercase">
                      My Account
                    </div>
                    {AccountDropdownData.map((account) => (
                      <button
                        onClick={handleAccountDropdownClickFactory(account.label)}
                        key={account.id}
                        type="button"
                        role="button"
                        className={clsx(
                          'flex duration-500 group flex-col p-4 cursor-pointer',
                          isAccountActive(account.label)
                            ? 'dark:bg-Teal-500 text-white bg-Teal-900'
                            : 'hover:bg-Teal-900 dark:hover:bg-Teal-500 hover:text-white group-hover:text-white dark:group-hover:text-neutral-50'
                        )}
                      >
                        <div
                          className={clsx(
                            'flex items-center gap-3 duration-500',
                            isAccountActive(account.label)
                              ? 'text-white'
                              : 'text-neutral-50 dark:text-[#A3A3A3] group-hover:text-white dark:group-hover:text-neutral-50'
                          )}
                        >
                          <div>{account.icon}</div>
                          <div className="flex justify-start items-start flex-col">
                            <div
                              className={clsx(
                                'duration-500 text-base',
                                isAccountActive(account.label)
                                  ? 'text-white'
                                  : 'text-neutral-50 dark:text-[#A3A3A3] group-hover:text-white dark:group-hover:text-neutral-50'
                              )}
                            >
                              {account.label}
                            </div>
                            <p className="text-xs">{account.sub_title}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                    <div className="p-4">
                      <button
                        onClick={handleLogout}
                        type="button"
                        role="button"
                        className="border-2 cursor-pointer hover:text-Teal-900 dark:hover:text-Teal-500 hover:border-Teal-900 dark:hover:border-Teal-500 duration-500 text-neutral-50 dark:text-[#5B5B5B] border-[#5B5B5B] rounded-full w-full py-2 px-5 uppercase font-medium flex justify-between items-center"
                      >
                        Log Out
                        <LogoutIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={clsx(
                'w-14 h-8 flex items-center px-1 bg-Teal-500 cursor-pointer dark:bg-[#1E1E1E] rounded-full relative transition-colors duration-300'
              )}
            >
              <div className={clsx('relative w-full', { 'opacity-0': isDark, 'opacity-100': !isDark })}>
                <SunIcon width="24" height="24" className="animate-spin duration-500 text-white" />
                <div className="w-2 h-2 rounded-full bg-white absolute animate-pulse left-8 top-0" />
                <div className="w-1 h-1 rounded-full bg-white absolute animate-pulse  left-8 top-3" />
              </div>
              <div className={clsx('relative w-full', { 'opacity-100': isDark, 'opacity-0': !isDark })}>
                <div>
                  <DarkIcon width="24" height="24" className="transform rotate-[-90deg]" />
                </div>
                <div className="absolute top-0 right-8">
                  <StarIcon width="15" height="15" className="animate-pulse duration-500" />
                </div>
              </div>
            </button>
          </div>
        </div>
        <div className="flex lg:hidden justify-between items-center w-full px-5">
          <div className="flex items-center gap-2">
            <div onClick={handleMobileMenuToggle}>
              {isMenuOpen ? (
                <CloseIcon height="28" width="28" className="text-white cursor-pointer sm:w-8 sm:h-8 w-7 h-7" />
              ) : (
                <MobileMenuIcon height="28" width="28" className="text-Teal-500 cursor-pointer sm:w-8 sm:h-8 w-7 h-7" />
              )}
            </div>
            <Link href="/booking" title="Go to booking" className="hidden dark:block">
              <LogoIcon width="90" className="sm:w-[110px] w-[90px]" />
            </Link>
            <Link href="/booking" title="Go to booking" className="block dark:hidden">
              <LightLogo width="90" className="sm:w-[110px] w-[90px]" />
            </Link>
          </div>
          <div className="flex gap-1.5 items-center">
            <div className="w-7.5 h-7.5 flex justify-center items-center border border-Teal-900 dark:border-Teal-500 rounded-full">
              <div className="relative">
                <BellIcon className="w-3 h-3 text-Teal-500 dark:text-white dark:md:text-white" />
                <div className="w-1 h-1 absolute top-0 right-0.5 rounded-full bg-orange-100"></div>
              </div>
            </div>
            <div className="w-7.5 h-7.5 flex justify-center items-center border border-orange-200 rounded-full">
              <MusicIcon className="w-3 h-3" />
            </div>
            <button
              type="button"
              className={clsx(
                'w-7.5 h-7.5 flex justify-center items-center rounded-full border border-Teal-900 dark:border-Teal-500 bg-blue-150 dark:bg-black transition-colors duration-300',
                isDark ? 'text-white' : 'text-Teal-900'
              )}
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <SunIcon className="w-3 h-3 text-yellow-400" /> : <DarkIcon className="w-3 h-3" />}
            </button>
            <div className="w-7.5 h-7.5 flex justify-center text-sm items-center text-white dark:text-black bg-Teal-900 dark:bg-Teal-500 rounded-full">
              {user ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </div>
        <div
          className={clsx(
            'xl:hidden overflow-hidden fixed w-full z-50 top-[84px] sm:top-[74px] transition-[max-height] duration-500 ease-in-out h-full bg-black/50',
            {
              'max-h-screen': isMenuOpen,
              'max-h-0': !isMenuOpen,
            }
          )}
        >
          <div className="flex flex-col gap-5 dark:bg-black/80  backdrop-blur-lg h-full py-6 px-5">
            <div className="flex flex-col gap-5 mt-3">
              {BookingMenu.map((menu: MenuLink, index: number) => {
                const isActive = pathname === menu.link;

                return (
                  <Link
                    key={index}
                    href={menu.link}
                    title={menu.title}
                    className={clsx(
                      'text-base uppercase border-b border-b-blue-150 dark:border-b-white/20 pb-3 duration-500 tracking-[0.84px] leading-5',
                      {
                        'text-orange-200 font-semibold': isActive,
                        'text-white dark:text-white hover:text-orange-200': !isActive,
                      }
                    )}
                  >
                    {menu.title}
                  </Link>
                );
              })}
            </div>
            <div className="flex flex-col gap-2 " ref={mobileDropdownRef}>
              <div
                className="flex items-center justify-between gap-2 border-b pb-3 border-b-blue-150 dark:border-b-white/20 cursor-pointer"
                onClick={handleMobileDropdownToggle}
              >
                <div className="text-base uppercase text-white">My Account</div>
                <ArrowDown className="text-white" />
              </div>
              <div
                className={clsx('w-full bg-[#fafafa] dark:bg-gray-300 overflow-hidden transition-all duration-300', {
                  'max-h-[25rem] opacity-100': openMobileDropdown,
                  'max-h-0 opacity-0': !openMobileDropdown,
                })}
                style={{ position: 'static', top: 'unset', right: 'unset' }}
              >
                <div className="flex flex-col">
                  {AccountDropdownData.map((account) => (
                    <button
                      onClick={handleMobileAccountClickFactory(account.label)}
                      key={account.id}
                      type="button"
                      role="button"
                      className={clsx('flex duration-500 group flex-col p-4 cursor-pointer', {
                        'bg-Teal-500 text-white': isAccountActive(account.label),
                        'hover:text-Teal-500': !isAccountActive(account.label),
                      })}
                    >
                      <div
                        className={clsx('flex items-center gap-3 duration-500 group-hover:text-Teal-500', {
                          'text-white': isAccountActive(account.label),
                          'text-neutral-50 dark:text-[#A3A3A3]': !isAccountActive(account.label),
                        })}
                      >
                        <div>{account.icon}</div>
                        <div className="flex justify-start items-start flex-col">
                          <div
                            className={clsx('duration-500 group-hover:text-Teal-500 text-base', {
                              'text-white': isAccountActive(account.label),
                            })}
                          >
                            {account.label}
                          </div>
                          <p className="text-xs">{account.sub_title}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                  <div className="p-4">
                    <button
                      type="button"
                      role="button"
                      className="border-2 cursor-pointer hover:text-Teal-500 hover:border-Teal-500 duration-500 text-Teal-900 dark:text-[#5B5B5B] border-Teal-900 dark:border-[#5B5B5B] rounded-full w-full py-2 px-5 uppercase font-medium flex justify-between items-center"
                      onClick={handleMobileLogout}
                    >
                      Log Out
                      <LogoutIcon />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:hidden">
              <LanguageCurrencySelector />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
