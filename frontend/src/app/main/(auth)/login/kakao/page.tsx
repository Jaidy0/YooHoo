import KakaoLoginBtn from '@/components/auth/KakaoLoginBtn';
// import OAuthRedirectHandler from '@/components/auth/OAuthRedirectHandler';

export default async function Login() {
  return (
    <span>
      <KakaoLoginBtn />
      {/* <OAuthRedirectHandler />; */}
    </span>
  );
}
