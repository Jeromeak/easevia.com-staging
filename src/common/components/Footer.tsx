'use client';
import { ChatBoxIcon, LogoIcon } from '@/icons/icon';
import Link from 'next/link';
import { useMemo, useCallback, useEffect } from 'react';
import { SocialLinks } from './Data';
import type { SocialLink } from '@/lib/types/common.types';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).zE) {
      const script = document.createElement('script');
      script.id = 'ze-snippet';
      script.src = 'https://static.zdassets.com/ekr/snippet.js?key=5c4273a7-2659-488f-8282-4cd1c6a5bbfb';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        if ((window as any).zE) {
          (window as any).zE('webWidget', 'hide'); // hide default chat icon
        }
      };
    }
  }, []);

  const handleChatToggle = useCallback(() => {
    if ((window as any).zE) {
      (window as any).zE('webWidget', 'toggle'); // toggles chat widget open/close
    }
  }, []);

  const socialLinksSecondary = useMemo(
    () =>
      SocialLinks.map((links: SocialLink, index: number) => (
        <Link
          key={index}
          target="_blank"
          rel="noopener noreferrer"
          title={links.title}
          className="hover:text-secondary duration-500"
          href={links.link}
        >
          {links.icon}
        </Link>
      )),
    []
  );

  return (
    <footer className="dark:xl:mt-20 bg-Teal-900 dark:bg-Teal-500 py-8 overflow-hidden">
      <div className="max-w-[90%] mx-auto text-white">
        <div className="md:hidden flex flex-col items-center space-y-6">
          <div className="flex justify-center">
            <LogoIcon width="216" height="80" />
          </div>

          <div className="text-center">
            <div className="text-base uppercase font-normal">
              Warehouse #3 to #6,
              <br /> Dubai Investment Park,
              <br /> Dubai, UAE
            </div>
          </div>

          <div className="text-center flex flex-col gap-2">
            <Link
              href="tel:+9123456789"
              title="+912 345 6789"
              className="text-xl uppercase font-normal"
              target="_blank"
            >
              +912 345 6789
            </Link>
            <Link
              href="mailto:info@easevia.com"
              title="info@easevia.com"
              className="text-xl font-normal"
              target="_blank"
            >
              info@easevia.com
            </Link>
          </div>

          <div className="flex gap-3.5 justify-center">{socialLinksSecondary}</div>

          <div className="flex flex-col items-center gap-2 pt-4 border-t border-t-white w-full">
            <div className="text-[15px] tracking-[1.5px] uppercase">{currentYear} © Easevia</div>
            <div className="uppercase text-white text-[15px] tracking-[1.5px]">
              Design by{' '}
              <span>
                <Link
                  href="https://elyts.agency/"
                  title="Elyts"
                  className="hover:text-black duration-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  elyts
                </Link>
              </span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex xl:py-[60px] gap-5 xl:gap-0 flex-row justify-between items-center w-full">
          <div className="w-full md:w-[33.33%]">
            <div className="xl:text-[32px] text-base text-center md:text-left uppercase font-normal text-white">
              Warehouse #3 to #6,
              <br /> Dubai Investment Park,
              <br /> Dubai, UAE
            </div>
          </div>
          <div className="w-full md:w-[33.33%] flex justify-center items-center">
            <LogoIcon width="280" height="100" />
          </div>
          <div className="w-full md:w-[33.33%]">
            <div className="text-center md:text-end xl:gap-4 flex flex-col text-white">
              <Link
                href="tel:+9123456789"
                title="+912 345 6789"
                className="text-xl xl:text-4xl uppercase font-normal"
                target="_blank"
              >
                +912 345 6789
              </Link>
              <Link
                href="mailto:info@easevia.com"
                title="info@easevia.com"
                className="text-xl xl:text-4xl font-normal"
                target="_blank"
              >
                info@easevia.com
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden md:flex border-t border-t-white flex-row items-center gap-3 justify-between pt-5 mt-5 xl:mt-0">
          <div className="text-[15px] tracking-[1.5px] uppercase text-white">{currentYear} © Easevia</div>
          <div className="lg:flex hidden gap-3.5 text-white">{socialLinksSecondary}</div>
          <div className="uppercase text-white text-[15px] tracking-[1.5px]">
            Design by{' '}
            <span>
              <Link
                href="https://elyts.agency/"
                title="Elyts"
                className="hover:text-black duration-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                elyts
              </Link>
            </span>
          </div>
        </div>
      </div>
      <div className="fixed bottom-8 right-8 z-50">
        <button
          type="button"
          onClick={handleChatToggle}
          className="w-14 h- bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
          aria-label="Open Zendesk chat"
        >
          <ChatBoxIcon className="w-7 h-7 text-Teal-500 cursor-pointer" />
        </button>
      </div>

      {/* <ChatboxModal isOpen={isChatOpen} onClose={handleChatClose} userName="Hannah" userStatus="Active 1h ago" /> */}
    </footer>
  );
};
