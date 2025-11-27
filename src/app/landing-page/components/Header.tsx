'use client';
import clsx from 'clsx';
import {
  BellIcon,
  CloseIcon,
  DarkIcon,
  LightLogo,
  LogoIcon,
  MobileMenuIcon,
  MusicIcon,
  StarIcon,
  SunIcon,
} from '@/icons/icon';
import Link from 'next/link';
import { Fragment, useEffect, useState, useCallback, useMemo } from 'react';
import { MenuLinks } from '../../../common/components/Data';
import { LoginModal } from '@/app/authentication/login-modal/login-modal';
import { CreateAccount } from '@/app/authentication/create-with-mail/create-with-mail-modal';
import { useThemeToggle } from '@/hooks/use-theme-toggle ';
import { LanguageCurrencySelector } from '../../../common/components/LanguageDropdown';
import { ContactSupport } from '@/app/authentication/contact-support/contact-support';
import { OtpModal } from '@/app/authentication/otp-modal/otp-modal';
import { VerifyMobileModal } from '@/app/authentication/verify-mobile-modal/verify-mobile-modal';
import { VerifyEmailModal } from '@/app/authentication/verify-email-modal/verify-email-modal';
import { GoogleVerifyModal } from '@/app/authentication/google-verify-modal/google-verify-modal';
import { SuccessModal } from '@/app/authentication/success-modal/success-modal';
import type { MenuLink } from '@/lib/types/common.types';
import { ModalType, TabType } from '@/lib/types/common.types';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);
  const { isDark, toggleTheme } = useThemeToggle();
  const [otpData, setOtpData] = useState<{ input: string; tab: TabType }>({
    input: '',
    tab: TabType.EMAIL,
  });
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [isPhoneVerifyFromLogin, setIsPhoneVerifyFromLogin] = useState(false);
  const notImplemented = useCallback((): void => { }, []);

  const handleOtpModal = useCallback((data: { input: string; tab: TabType }) => {
    setOtpData(data);
    setActiveModal(ModalType.OTP);
  }, []);

  const handleCreateAccount = useCallback(() => {
    setActiveModal(ModalType.CREATE);
  }, []);

  const handleSignInAccount = useCallback(() => {
    setActiveModal(ModalType.LOGIN);
  }, []);

  const handleEdit = useCallback(() => {
    setActiveModal(ModalType.LOGIN);
  }, []);

  const handleMobileVerify = useCallback(() => {
    setIsPhoneVerifyFromLogin(true);
    setActiveModal(ModalType.VERIFY_MOBILE);
  }, []);

  const handleMobileVerifyFromSignup = useCallback(() => {
    setIsPhoneVerifyFromLogin(false);
    setActiveModal(ModalType.VERIFY_MOBILE);
  }, []);

  const handleEmailChange = useCallback(() => {
    setActiveModal(ModalType.CREATE);
  }, []);

  const handleEmailVerify = useCallback(() => {
    setActiveModal(ModalType.VERIFY_EMAIL);
  }, []);

  const handleGoogleVerify = useCallback(() => {
    setActiveModal(ModalType.GOOGLE);
  }, []);

  const handleSuccess = useCallback(() => {
    setActiveModal(ModalType.SUCCESS);
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleMenuLinkClick = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleOpenOtpModal = useCallback(() => {
    setActiveModal(ModalType.OTP);
  }, []);

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const sectionIds = MenuLinks.map((link: MenuLink) => link.link.replace('#', ''));

    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight / 2;
      let matchedSection = '';

      for (const id of sectionIds) {
        const section = document.getElementById(id);

        if (section) {
          const { offsetTop, offsetHeight } = section;

          if (scrollY >= offsetTop && scrollY < offsetTop + offsetHeight) {
            matchedSection = id;
            break;
          }
        }
      }

      setActiveSection(matchedSection);
      setHasScrolled(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const openZendeskTicket = () => {
    window.open(
      "https://elytshelp.zendesk.com/hc/en-us/requests/new",
      "_blank"
    );
  };
  const desktopMenuLinks = useMemo(
    () =>
      MenuLinks.map((menu: MenuLink, index: number) => (
        <Link
          key={index}
          href={menu.link}
          title={menu.title}
          className={clsx(
            'uppercase duration-500 text-sm md:text-base lg:text-lg tracking-[1.08px] pb-1 leading-5 relative',
            {
              'text-Teal-500 font-[500] border-b-2': activeSection === menu.link.replace('#', ''),
              'hover:!text-Teal-500 lines border-b-2 border-b-transparent duration-500 text-black dark:text-white font-[450]':
                activeSection !== menu.link.replace('#', ''),
            }
          )}
        >
          {menu.title}
        </Link>
      )),
    [activeSection]
  );

  return (
    <Fragment>
      <div className={clsx('w-full xl:block hidden fixed bg-white dark:bg-black z-10', { 'shadow-6xl': hasScrolled })}>
        <div className="max-w-[90%] mx-auto py-4 lg:py-7">
          <div className="flex justify-between items-center w-full">
            <div onClick={handleScrollToTop} className="flex gap-5 cursor-pointer items-center">
              <LightLogo />
              <div className="flex gap-3 xl:gap-3 2xl:gap-5 mt-5 justify-start">{desktopMenuLinks}</div>
            </div>
            <div className="flex gap-3 xl:gap-3 2xl:gap-5 items-center justify-end">
              <button
                onClick={handleSignInAccount}
                type="button"
                role="button"
                className="border-2 cursor-pointer dark:hover:text-black dark:hover:bg-orange-200 uppercase tracking-wide font-medium bg-transparent border-orange-200 text-orange-200 duration-500 rounded-full px-5 py-1 text-xs md:text-sm lg:text-base whitespace-nowrap"
              >
                Book Ticket
              </button>
              <div
                onClick={openZendeskTicket}
                className="h-8 md:h-10 aspect-square border flex items-center justify-center cursor-pointer border-orange-200 rounded-full hover:bg-orange-50"
              >
                <MusicIcon className="w-4 h-4 md:w-5 md:h-5" />
              </div>


              <div className="flex items-center flex-nowrap">
                <LanguageCurrencySelector />
              </div>
              <button
                onClick={handleSignInAccount}
                type="button"
                role="button"
                className="border-2 cursor-pointer dark:hover:bg-Teal-500 dark:hover:text-black text-Teal-500 uppercase tracking-wide font-medium bg-transparent border-Teal-500 duration-500 rounded-full px-4  py-1 text-xs md:text-sm lg:text-base whitespace-nowrap"
              >
                Log in
              </button>

              <button
                onClick={toggleTheme}
                className="w-14 h-8 flex items-center px-1 bg-Teal-500 cursor-pointer dark:bg-[#1E1E1E] rounded-full relative transition-colors duration-300"
              >
                <div className={clsx('relative w-full', { 'opacity-0': isDark, 'opacity-100': !isDark })}>
                  <SunIcon width="24" height="24" className="text-white animate-spin duration-500" />
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
        </div>
      </div>

      <div className="fixed w-full xl:hidden block z-10 bg-white dark:bg-black py-2 sm:py-3 shadow-6xl">
        <div className="max-w-[95%] mx-auto">
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-1">
              <div onClick={handleMenuToggle}>
                {isMenuOpen ? (
                  <CloseIcon height="28" width="28" className="text-white cursor-pointer sm:w-8 sm:h-8 w-7 h-7" />
                ) : (
                  <MobileMenuIcon height="28" width="28" className="text-white cursor-pointer sm:w-8 sm:h-8 w-7 h-7" />
                )}
              </div>
              <Link href="/" title="home" className="hidden dark:block">
                <LogoIcon width="90" className="sm:w-[110px] w-[90px]" />
              </Link>
              <Link href="/" title="home" className="block dark:hidden">
                <LightLogo width="90" className="sm:w-[110px] w-[90px]" />
              </Link>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-7.5 h-7.5 flex justify-center items-center border border-Teal-500 rounded-full">
                <div className="relative">
                  <BellIcon className="text-Teal-500 dark:text-white" />
                  <div className="w-1 h-1 absolute top-0 right-0.5 rounded-full bg-orange-100"></div>
                </div>
              </div>
              <div
                onClick={openZendeskTicket}
                className="w-7.5 h-7.5 flex justify-center items-center border border-orange-200 rounded-full cursor-pointer hover:bg-orange-50"
              >
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
            </div>
          </div>
        </div>
      </div>
      <div
        className={clsx(
          'xl:hidden overflow-hidden fixed w-full z-50 top-[60px] sm:top-[74px] transition-[max-height] duration-500 ease-in-out h-full bg-black/50',
          {
            'max-h-screen': isMenuOpen,
            'max-h-0': !isMenuOpen,
          }
        )}
      >
        <div className="flex flex-col gap-6  dark:bg-black/80  backdrop-blur-lg py-7 sm:py-10 px-3 sm:px-5 h-full overflow-y-auto">
          {MenuLinks.map((menu: MenuLink, index: number) => (
            <Link
              key={index}
              href={menu.link}
              title={menu.title}
              onClick={handleMenuLinkClick}
              className="uppercase hover:text-Teal-500 text-white border-b-white/30 duration-500 text-base border-b pb-3 tracking-[1.08px] leading-5"
            >
              {menu.title}
            </Link>
          ))}
          <div className="flex flex-col w-full gap-6">
            <button
              onClick={handleSignInAccount}
              type="button"
              role="button"
              className="uppercase border-b pb-3 border-b-white/30 hover:text-Teal-500 text-white duration-500 text-left text-base tracking-[1.08px] leading-5"
            >
              Book Ticket
            </button>
            <button
              onClick={handleSignInAccount}
              type="button"
              role="button"
              className="uppercase border-b pb-3 border-b-white/30 hover:text-Teal-500 duration-500 text-white text-left text-base tracking-[1.08px] leading-5"
            >
              Login
            </button>
            <div className="w-full">
              <LanguageCurrencySelector />
            </div>
          </div>
        </div>
      </div>

      <LoginModal
        openGoogleVerfiyModal={handleGoogleVerify}
        isOpen={activeModal === ModalType.LOGIN}
        onOpenCreateAccount={handleCreateAccount}
        onOpenOtpModal={handleOtpModal}
        onClose={handleCloseModal}
      />

      <OtpModal
        input={otpData.input}
        tab={otpData.tab}
        openGoogleVerifyModal={handleGoogleVerify}
        OtpModalOpen={activeModal === ModalType.OTP}
        onOpenCreateAccount={handleCreateAccount}
        onOtpModalClose={handleCloseModal}
        onEdit={handleEdit}
      />

      <CreateAccount
        openGoogleVerifyModal={handleGoogleVerify}
        openVerifyEmailModal={handleEmailVerify}
        openSignInAccoount={handleSignInAccount}
        isCreateModalOpen={activeModal === ModalType.CREATE}
        onCloseCreateModal={handleCloseModal}
      />

      <VerifyEmailModal
        openVerifyMobile={handleMobileVerifyFromSignup}
        isVerifyEmailModalOpen={activeModal === ModalType.VERIFY_EMAIL}
        openSignInAccount={handleEmailChange}
        onCloseVerifyEmailModal={handleCloseModal}
        isVerifyMobileModalOpen={false}
        onCloseVerifyMobileModal={notImplemented}
        openSignInAccoount={notImplemented}
        openSuccessModal={notImplemented}
      />

      <VerifyMobileModal
        openSuccessModal={isPhoneVerifyFromLogin ? notImplemented : handleSuccess}
        openSignInAccoount={handleEmailChange}
        isVerifyMobileModalOpen={activeModal === ModalType.VERIFY_MOBILE}
        onCloseVerifyMobileModal={handleCloseModal}
        isVerifyEmailModalOpen={false}
        onCloseVerifyEmailModal={notImplemented}
        openSignInAccount={notImplemented}
        openVerifyMobile={notImplemented}
      />

      <ContactSupport
        isContactSupportModal={activeModal === ModalType.CONTACT}
        onCloseContactSupport={handleCloseModal}
        onOpenOtpModal={handleOpenOtpModal}
      />

      <GoogleVerifyModal
        openMobileVerifyModal={handleMobileVerify}
        isOpenGoogleVerify={activeModal === ModalType.GOOGLE}
        onCloseGoogleVerify={handleCloseModal}
        openSignInAccoount={notImplemented}
      />
      <SuccessModal onCloseSuccessModal={handleCloseModal} isSuccessModalOpen={activeModal === ModalType.SUCCESS} />
    </Fragment>
  );
};

