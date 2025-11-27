export function redirectToSocialLogin(provider: string) {
  const defaultRedirect =
    typeof window !== 'undefined'
      ? `${window.location.origin}/auth/callback`
      : process.env.NEXT_PUBLIC_SUPABASE_SOCIAL_LOGIN_REDIRECT_URL;

  const authUrl = `${process.env.NEXT_PUBLIC_SUPABASE_SOCIAL_LOGIN_URL}?provider=${provider}&redirect_to=${encodeURIComponent(defaultRedirect || '')}`;
  window.location.href = authUrl;
}
