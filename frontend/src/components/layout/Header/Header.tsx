// import MainHeader from './MainHeader';
import SubHeader from './SubHeader';

export type HeaderType = 'yoohoo' | 'sub';

interface HeaderProps {
  type: HeaderType;
  title?: string;
  onBackClick?: () => void;
  onNotificationClick?: () => void;
}

export function Header(props: HeaderProps) {
  if (props.type === 'yoohoo') {
    // return <MainHeader />;
    return null;
  }
  return (
    <SubHeader title={props.title || ''} onBackClick={props.onBackClick} />
  );
}

export default Header;
