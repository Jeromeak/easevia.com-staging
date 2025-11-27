import type { SocialLoginProps } from '@/lib/types/common.types';

export const SocialLogin: React.FC<SocialLoginProps> = ({ onClick, label, icon }) => {
  return (
    <button
      onClick={onClick}
      className="py-3 px-7.5 w-full cursor-pointer dark:bg-neutral-100   hover:border-Teal-500 border border-transparent duration-500  flex items-center gap-5 rounded-xl bg-inputcolor"
      type="button"
      role="button"
    >
      <div>{icon}</div>
      <div className="text-Light dark:text-white text-xl font-medium leading-normal">{label}</div>
    </button>
  );
};
