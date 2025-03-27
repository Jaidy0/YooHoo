import OAuthRedirectHandler from '@/components/auth/OAuthRedirectHandler';
import React from 'react';

export default function KakaoLoginCallback() {
  return (
    <div>
      <OAuthRedirectHandler></OAuthRedirectHandler>
    </div>
  );
}
