import { MainHeader } from './MainHeader';
import { SubHeader } from './SubHeader';

export type HeaderType = 'main' | 'sub';

interface HeaderProps {
  type: HeaderType;
  title?: string;
  onBackClick?: () => void;
  onNotificationClick?: () => void;
}

export function Header(props: HeaderProps) {
  if (props.type === 'main') {
    return <MainHeader onNotificationClick={props.onNotificationClick} />;
  }
  return (
    <SubHeader title={props.title || ''} onBackClick={props.onBackClick} />
  );
}

export default Header;
