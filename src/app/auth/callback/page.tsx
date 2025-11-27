'use client';

import { useEffect, useState, useCallback, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { googleOauthVerify } from '@/lib/api/auth';
import { saveTokens, clearTokens } from '@/utils/tokenStorage';
import { GoogleVerifyModal } from '@/app/authentication/google-verify-modal/google-verify-modal';
import { getErrorMessage } from '@/lib/utils/error';
import { useLanguageCurrency } from '@/context/hooks/useLanguageCurrency';

export default function GoogleAuthCallback() {
  const router = useRouter();
  const { triggerCurrencyFetch } = useLanguageCurrency();
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('Logging you in...');

  const handleCloseModal = useCallback(() => setShowVerifyModal(false), []);

  const handleOpenPhoneVerify = useCallback(() => {
    setShowVerifyModal(false);
    router.push('/verify-phone');
  }, [router]);

  const handleRedirectHome = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleTimeoutRedirect = useCallback(() => {
    setTimeout(handleRedirectHome, 3000);
  }, [handleRedirectHome]);

  const authenticateUser = useCallback(async () => {
    setLoadingMessage('Processing authentication...');
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    //* Get the access and refresh token from the url
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    // const expires_in = params.get('expires_in');
    // const token_type = params.get('token_type');

    if (!access_token) {
      setErrorMessage('Missing access token. Redirecting to home...');
      handleRedirectHome();

      return;
    }

    try {
      //* Store tokens via reusable utility
      saveTokens(access_token, refresh_token || '');

      //* Optionally call backend to validate or complete registration
      const response = await googleOauthVerify(access_token);
      const { user } = response.data;

      if (!user?.phone_verified) {
        router.push('/google-verify-phone');
      } else {
        //* Only trigger currency fetch if phone is already verified
        await triggerCurrencyFetch();
        router.push('/booking');
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      setErrorMessage(message || 'Authentication failed. Please try again.');
      clearTokens();
      handleTimeoutRedirect();
    }
  }, [router, handleRedirectHome, handleTimeoutRedirect, triggerCurrencyFetch]);

  useEffect(() => {
    authenticateUser();
  }, [authenticateUser]);

  const handleOpenSignInAccount = useCallback(() => {
    console.error('Function not implemented.');
  }, []);

  return (
    <Fragment>
      <div className="text-center mt-8 text-lg">
        {errorMessage ? <p className="text-red-500">{errorMessage}</p> : <p>{loadingMessage}</p>}
      </div>
      <GoogleVerifyModal
        isOpenGoogleVerify={showVerifyModal}
        onCloseGoogleVerify={handleCloseModal}
        openMobileVerifyModal={handleOpenPhoneVerify}
        openSignInAccoount={handleOpenSignInAccount}
      />
    </Fragment>
  );
}
