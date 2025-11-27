'use client';
import { MyAccountData } from '@/common/components/Data';
import {
  ArrowUpIcon,
  EmailIcon,
  MobileMenuIcon,
  PhoneIcon,
  ProfileImageIcon,
  SeatIcon,
  ThunderIcon,
  ProfileTabIcon,
} from '@/icons/icon';
import { useAuth } from '@/context/hooks/useAuth';
import { Fragment, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import clsx from 'clsx';
import type { UserTabProps } from '@/lib/types/common.types';
import { Modal } from '@/app/authentication/components/Modal';
import { useRouter } from 'next/navigation';

export const UserData: React.FC<UserTabProps> = ({
  progress = 0,
  activeTab,
  setActiveTab,
  children,
  ptClass = ' lg:pt-[84px]',
}) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (drawerOpen) {
      if (drawerRef.current) {
        gsap.to(drawerRef.current, { x: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
      }

      if (overlayRef.current) {
        gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, overwrite: 'auto' });
        overlayRef.current.style.pointerEvents = 'auto';
      }
    } else {
      if (drawerRef.current) {
        gsap.to(drawerRef.current, { x: '-100%', duration: 0.4, ease: 'power2.in', overwrite: 'auto' });
      }

      if (overlayRef.current) {
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, overwrite: 'auto' });
        overlayRef.current.style.pointerEvents = 'none';
      }
    }
  }, [drawerOpen]);

  useEffect(() => {
    if (drawerRef.current) {
      gsap.set(drawerRef.current, { x: '-100%' });
    }

    if (overlayRef.current) {
      gsap.set(overlayRef.current, { opacity: 0 });
      overlayRef.current.style.pointerEvents = 'none';
    }
  }, []);

  const handleTabClick = useCallback(
    (label: string) => {
      setActiveTab(label);
    },
    [setActiveTab]
  );

  const handleTabClickAndCloseDrawer = useCallback(
    (label: string) => {
      setActiveTab(label);
      setDrawerOpen(false);
    },
    [setActiveTab]
  );

  const handleOpenDrawer = useCallback(() => {
    setDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const handleDrawerMenuClick = useCallback(
    (label: string) => () => {
      if (label === 'Logout') {
        setDrawerOpen(false);
        setShowLogoutModal(true);
      } else {
        handleTabClickAndCloseDrawer(label);
      }
    },
    [handleTabClickAndCloseDrawer]
  );

  const handleSidebarMenuClick = useCallback(
    (label: string) => () => {
      if (label === 'Logout') {
        setShowLogoutModal(true);
      } else {
        handleTabClick(label);
      }
    },
    [handleTabClick]
  );

  const handleLogoutConfirm = useCallback(() => {
    logout();
    setShowLogoutModal(false);
    router.push('/');
  }, [logout, router]);

  const handleLogoutCancel = useCallback(() => {
    setShowLogoutModal(false);
  }, []);

  return (
    <Fragment>
      <div className="hidden lg:flex justify-center flex-col items-center p-5 bg-[#E6F2F2] dark:bg-gray-300 rounded-s-[20px]">
        <div className="w-[140px] h-[140px] relative mt-5">
          <div
            className="absolute inset-0 rounded-full 
    bg-[conic-gradient(#009898_var(--progress),_#fff_var(--progress))]
    dark:bg-[conic-gradient(#009898_var(--progress),_#111_var(--progress))]"
            style={
              {
                '--progress': `${progress * 3.6}deg`,
                transform: 'rotate(180deg)',
              } as React.CSSProperties
            }
          />

          <div className="absolute inset-[5px] bg-white dark:bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            <ProfileImageIcon />
          </div>
          <div className="absolute bottom-0 left-1/2 translate-x-[-50%] translate-y-1/2 bg-white dark:bg-black text-Teal-500 text-sm px-3 py-1 rounded-full font-medium">
            {progress}%
          </div>
        </div>
        <div className="mt-5 font-Neutra text-2xl uppercase leading-9 ">{user?.name || ''}</div>
        <div className="flex justify-center xl:gap-2 gap-2 xl:justify-between flex-wrap items-center">
          <div className="flex gap-3 items-center text-sm uppercase text-white">
            <ProfileTabIcon className="text-Teal-500 " />
          </div>
          <div className="text-sm uppercase text-orange-200">{user?.customer_id}</div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div>
            <PhoneIcon width="14" height="14" />
          </div>
          <div>{user?.phone || ''}</div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div>
            <EmailIcon width="14" height="14" />
          </div>
          <div>{user?.email || ''}</div>
        </div>
        <div className="flex justify-center items-center gap-3 mt-5">
          <button
            role="button"
            type="button"
            className="text-xs cursor-pointer uppercase font-Neutra text-black bg-orange-200 py-2 px-2 rounded-[52.663px] flex items-center gap-2"
          >
            <div>
              <ThunderIcon />
            </div>
            <div>Premium Plane</div>
            <div>
              <ArrowUpIcon width="20" height="20" />
            </div>
          </button>
          <button
            role="button"
            type="button"
            className="text-xs cursor-pointer border border-orange-200 tracking-wider dark:text-white uppercase font-Neutra py-2 px-2 xl:px-1 rounded-[52.663px] flex items-center gap-2"
          >
            <div>
              <SeatIcon className="text-white" />
            </div>
            <div>Economy Class</div>
          </button>
        </div>
        {/* optional account stats card removed */}
        <div className="flex flex-col w-full mt-5">
          {MyAccountData.map((menu) => (
            <button
              key={menu.id}
              onClick={handleSidebarMenuClick(menu.label)}
              className={clsx(
                'flex group hover:text-[#242E32] dark:hover:text-orange-200 duration-500 hover:bg-[#b0dfdf] dark:hover:bg-black items-center cursor-pointer gap-3 py-4 rounded-sm px-4',
                activeTab === menu.label
                  ? 'dark:bg-black bg-[#B0DFDF] text-[#242E32] dark:text-orange-200'
                  : 'bg-transparent text-gray-380'
              )}
            >
              {menu.icon}
              <div>{menu.label}</div>
            </button>
          ))}
        </div>
      </div>
      <div className={clsx('bg-white dark:bg-gray-300 block lg:hidden px-5', ptClass)}>
        <div className="flex fixed top-[77px] left-0 right-0 md:mt-0 bg-blue-150 dark:bg-gray-300 z-50 justify-between items-center w-full py-5 px-5">
          <div className="flex gap-2 items-center">
            <button onClick={handleOpenDrawer} aria-label="Open menu">
              <MobileMenuIcon width="25" height="25" />
            </button>
            <div className=" font-Neutra text-2xl uppercase ">{activeTab || 'Menu'}</div>
          </div>
          <div>{children}</div>
        </div>
        <div className="fixed inset-0 z-[10000] pointer-events-none">
          <div
            ref={overlayRef}
            className="fixed inset-0 bg-black/30 bg-opacity-40 z-[10001] pointer-events-auto"
            onClick={handleCloseDrawer}
          />
          <div
            ref={drawerRef}
            className="fixed inset-y-0 left-0 ml-0 mr-auto w-full md:w-[90%] h-full overflow-y-scroll bg-white dark:bg-gray-300 shadow-2xl px-6 pb-6 flex flex-col z-[10002] pointer-events-auto -translate-x-full"
          >
            <div className="bg-white dark:bg-gray-300 sticky z-[10003] top-0 py-3">
              <button
                className="absolute top-4 right-4 text-neutral-50 dark:text-white text-2xl"
                onClick={handleCloseDrawer}
                aria-label="Close menu"
              >
                &times;
              </button>
              <div className="font-Neutra text-lg hidden md:block uppercase ">Menu</div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative w-[80px] aspect-square mb-4 shrink-0">
                <div
                  className="absolute inset-0 rounded-full
      bg-[conic-gradient(#009898_var(--progress),_#fff_var(--progress))]
      dark:bg-[conic-gradient(#009898_var(--progress),_#111_var(--progress))]"
                  style={
                    {
                      '--progress': `${progress * 3.6}deg`,
                      transform: 'rotate(-90deg)',
                    } as React.CSSProperties
                  }
                ></div>
                <div className="absolute inset-[3px] bg-white dark:bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  <ProfileImageIcon className="w-18 h-18 md:w-20 md:h-20" />
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-blue-150 dark:bg-black text-Teal-500 text-xs sm:text-sm px-2 sm:px-3 py-0.5 rounded-full font-medium">
                  {progress}%
                </div>
              </div>

              <div className="flex flex-col">
                <div className=" font-Neutra text-2xl uppercase leading-9 ">{user?.name || 'james william'}</div>
                <div className="text-xs dark:text-white mt-1">CIF ID: {user?.customer_id || ''}</div>
                <div className="flex items-center gap-2">
                  <div>
                    <PhoneIcon width="10" height="10" />
                  </div>
                  <div className="text-xs">{user?.phone || ''}</div>
                </div>
                <div className="flex items-center gap-2 ">
                  <div>
                    <EmailIcon width="10" height="10" />
                  </div>
                  <div className="text-xs">{user?.email || ''}</div>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    role="button"
                    type="button"
                    className="text-[7.219px] cursor-pointer uppercase font-Neutra text-black bg-orange-200 py-0.5 px-1 rounded-[44.668px] flex items-center gap-2"
                  >
                    <div>
                      <ThunderIcon className="lg:w-[20px] lg:h-[20px] w-5 h-5" id="thunder-icon" />
                    </div>
                    <div className="whitespace-nowrap">Premium Plane</div>
                    <div>
                      <ArrowUpIcon width="19" height="20" />
                    </div>
                  </button>
                  <button
                    role="button"
                    type="button"
                    className="text-[7.219px] cursor-pointer border border-orange-200 tracking-tighter dark:text-white uppercase font-Neutra py-0.5 px-2 rounded-[44.668px] flex items-center gap-2"
                  >
                    <div>
                      <SeatIcon className="dark:text-white w-4.5 h-4.5" />
                    </div>
                    <div className="whitespace-nowrap">Economy Class</div>
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-5">
              {useMemo(
                () =>
                  MyAccountData.map((menu) => (
                    <button
                      key={menu.id}
                      onClick={handleDrawerMenuClick(menu.label)}
                      className={clsx(
                        'flex group hover:text-orange-200 duration-500 hover:bg-black items-center cursor-pointer gap-3 py-3 rounded px-2 w-full text-left',
                        activeTab === menu.label
                          ? 'dark:bg-black bg-[#B0DFDF] text-[#242E32] dark:text-orange-200'
                          : 'bg-transparent text-gray-380'
                      )}
                    >
                      {menu.icon}
                      <div>{menu.label}</div>
                    </button>
                  )),
                [activeTab, handleDrawerMenuClick]
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showLogoutModal} onClose={handleLogoutCancel} className="max-w-md">
        <div className="flex flex-col gap-4">
          <p className="dark:text-white text-xl md:text-2xl text-center">Are you sure you want to logout?</p>
          <div className="flex gap-3 justify-center mt-4">
            <button
              type="button"
              role="button"
              onClick={handleLogoutConfirm}
              className="bg-Teal-500 w-[50%] text-white px-6 uppercase text-sm cursor-pointer py-2 rounded-full hover:bg-opacity-80 duration-500"
            >
              Confirm
            </button>
            <button
              type="button"
              role="button"
              onClick={handleLogoutCancel}
              className="bg-transparent border w-[50%] border-Teal-500 text-Teal-500 hover:text-white hover:bg-Teal-500 duration-500 px-6 uppercase text-sm cursor-pointer py-2 rounded-full"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};
