'use client';

import { useState, useEffect, useRef, Fragment, useCallback } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import { FileAttachIcon, SmileyIcon, OnlineDot, CloseIcon, RightArrow } from '@/icons/icon';
import dynamic from 'next/dynamic';
import type { Message, ChatboxModalProps } from '@/lib/types/common.types';
import { MessageStatus } from '@/lib/types/common.types';
import React from 'react';
import { Theme } from 'emoji-picker-react';
import { cdnBaseUrl } from '@/lib/config';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

const ChatMessage = React.memo(({ message }: { message: Message }) => {
  const bubbleClass = clsx(
    'px-3 py-2 rounded-[6px]',
    message.id === 4 || message.id === 5
      ? 'bg-[#E6F2F2] text-[#013499] text-[15px] font-normal '
      : message.isBot
        ? 'bg-[#F2F2F2] text-black leading-5'
        : 'bg-Teal-500 text-white leading-[21px]'
  );
  const timestampClass = clsx('text-xs mt-1 px-1', message.isBot ? 'text-gray-500' : 'text-gray-500 text-right');

  return (
    <div className={clsx('flex', message.isBot ? 'justify-start' : 'justify-end')}>
      <div className="flex gap-2 max-w-[80%]">
        {message.isBot && (
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden flex-shrink-0 mt-auto">
            <Image
              src={`${cdnBaseUrl}/profile_image.png`}
              alt="Bot"
              title="Bot"
              className="w-full h-full object-cover"
              width={64}
              height={64}
            />
          </div>
        )}
        <div className="flex flex-col">
          <div className={bubbleClass}>
            <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
          </div>
          <div className={timestampClass}>
            {message.isBot && message.id !== 1 && <span>Bot • </span>}
            <span>{message.timestamp}</span>
            {!message.isBot && message.status && (
              <span className="ml-1">{message.status === 'seen' ? '. Seen' : ''}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
ChatMessage.displayName = 'ChatMessage';

export const ChatboxModal: React.FC<ChatboxModalProps> = ({ isOpen, onClose, userName, userStatus }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hi there! How can I help?',
      isBot: true,
      timestamp: '',
      status: MessageStatus.SEEN,
    },
    {
      id: 2,
      text: "I'm just browsing!",
      isBot: false,
      timestamp: '2m ago',
      status: MessageStatus.SEEN,
    },
    {
      id: 3,
      text: 'No problem.\n\nIf you need help you can type below to ask a question',
      isBot: true,
      timestamp: 'Just now',
      status: MessageStatus.DELIVERED,
    },
    {
      id: 4,
      text: 'How can you help me?',
      isBot: false,
      timestamp: '',
      status: undefined,
    },
    {
      id: 5,
      text: 'Another quick reply',
      isBot: false,
      timestamp: '',
      status: undefined,
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  useEffect(() => scrollToBottom(), [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (modalRef.current?.contains(target)) return;
      const chatButton = document.querySelector('[aria-label*="chat"]');
      if (chatButton && chatButton.contains(target)) return;
      onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = originalPaddingRight;

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text: inputValue,
        isBot: false,
        timestamp: 'Just now',
        status: MessageStatus.DELIVERED,
      },
    ]);
    setInputValue('');
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          text: "Thanks for your message! I'll help you with that.",
          isBot: true,
          timestamp: 'Just now',
          status: MessageStatus.DELIVERED,
        },
      ]);
    }, 1000);
  }, [inputValue]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleSendMessage();
    },
    [handleSendMessage]
  );

  const handleFileAttach = useCallback(() => fileInputRef.current?.click(), []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text: `File attached: ${file.name}`,
        isBot: false,
        timestamp: 'Just now',
        status: MessageStatus.DELIVERED,
      },
    ]);
    e.target.value = '';
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const addEmoji = useCallback((emoji: string) => {
    setInputValue((prev) => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  }, []);

  const handleSend = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setShowEmojiPicker(false);
      handleSendMessage();
      inputRef.current?.focus();
    },
    [handleSendMessage]
  );

  const handleModalClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker((prev) => !prev);
  }, []);

  return (
    <Fragment>
      <div
        className={clsx(
          'fixed bottom-20 right-6 w-96 max-w-[calc(100vw-2rem)] sm:max-w-md z-100000',
          'transition-all duration-500 ease-out',
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-90 translate-y-6 pointer-events-none'
        )}
      >
        <div
          className={clsx(
            'w-full bg-white rounded-[18px] shadow-13xl overflow-hidden',
            'transform transition-all duration-500',
            isOpen ? 'scale-100 shadow-2xl' : 'scale-95 shadow-none'
          )}
          ref={modalRef}
          onClick={handleModalClick}
        >
          <div className="bg-Teal-500 text-white p-4 flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 hover:bg-teal-700 rounded-full transition-colors flex-shrink-0 cursor-pointer"
              aria-label="Go back"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                <Image
                  src={`${cdnBaseUrl}/profile_image.png`}
                  alt="Chat-Profile"
                  title="Chat-Profile"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-4 h-4">
                  <OnlineDot className="w-4 h-4" />
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{userName}</span>
                <span className="text-xs text-white/80">{userStatus}</span>
              </div>
            </div>
          </div>

          <div className="h-[450px] bg-white overflow-y-scroll scroll p-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-[#EBEBEB]">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a reply..."
                  className="w-full px-4 py-2.5 text-black pr-24 border border-white rounded-lg focus:outline-none focus:border-transparent text-sm bg-white placeholder-[#737376]"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={toggleEmojiPicker}
                    className="p-1.5 hover:bg-Teal-500/50 hover:text-white rounded transition-colors text-[#8F9195] cursor-pointer"
                    aria-label="Add emoji"
                  >
                    <SmileyIcon className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleFileAttach}
                    className="p-1.5 hover:bg-Teal-500/50 hover:text-white rounded transition-colors text-[#8F9195] cursor-pointer"
                    aria-label="Attach file"
                  >
                    <FileAttachIcon className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleSend}
                    className="p-1.5 bg-Teal-500 hover:bg-Teal-500/50 text-white rounded-full transition-colors cursor-pointer"
                  >
                    <RightArrow className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*,application/pdf,.doc,.docx,.txt"
              />
            </div>

            {showEmojiPicker && (
              <div className="absolute bottom-16 right-4 z-50">
                <EmojiPicker
                  onEmojiClick={(emojiData) => addEmoji(emojiData.emoji)}
                  theme={Theme.LIGHT}
                  lazyLoadEmojis
                  searchDisabled={false}
                  previewConfig={{ showPreview: false }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};
