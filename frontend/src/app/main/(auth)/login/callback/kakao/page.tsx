import OAuthRedirectHandler from '@/components/auth/OAuthRedirectHandler/OAuthRedirectHandler';
import React from 'react';

export default function KakaoLoginCallback() {
  return (
    <div>
      <OAuthRedirectHandler></OAuthRedirectHandler>
    </div>
  );
}
