'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import cn from 'classnames';
import LogoIcon from '@/components/ui/logo-icon';
import LogoutIcon from '@mui/icons-material/Logout';
import { useWindowScroll } from '@/lib/hooks/use-window-scroll';
import { FlashIcon } from '@/components/icons/flash';
import Hamburger from '@/components/ui/hamburger';
import ActiveLink from '@/components/ui/links/active-link';
import SearchButton from '@/components/search/button';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useDrawer } from '@/components/drawer-views/context';
// import WalletConnect from '@/components/nft/wallet-connect';
import routes from '@/config/routes';
import { useLayout } from '@/lib/hooks/use-layout';
import { LAYOUT_OPTIONS } from '@/lib/constants';
import { sideBarMenuItems } from '../sidebar/_expandable';
import { LockIcon } from '@/components/icons/lock-icon';
// import { getAuth, signOut } from 'firebase/auth';
import ConnectWallet from './ConnectWallet';
import Button from '@/components/ui/button';

function NotificationButton() {
  const { layout } = useLayout();
  const isMounted = useIsMounted();
  return (
    isMounted && (
      <ActiveLink
        href={
          (layout === LAYOUT_OPTIONS.MODERN ? '' : `/${layout}`) +
          routes.notification
        }
      >
        <div className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-100 bg-white text-brand shadow-main transition-all hover:-translate-y-0.5 hover:shadow-large focus:-translate-y-0.5 focus:shadow-large focus:outline-none dark:border-gray-700 dark:bg-light-dark dark:text-white sm:h-12 sm:w-12">
          <FlashIcon className="h-auto w-3 sm:w-auto" />
          <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-brand shadow-light dark:bg-slate-50 sm:h-3 sm:w-3" />
        </div>
      </ActiveLink>
    )
  );
}

function AuthenticationDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  // const auth = getAuth();
  const router = useRouter();
  // if (!auth) router.push('/authentication');
  return (
    <div className="relative">
      <button className="dropbtn" onClick={toggleDropdown}>
        <div className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-100 bg-white text-brand shadow-main transition-all hover:-translate-y-0.5 hover:shadow-large focus:-translate-y-0.5 focus:shadow-large focus:outline-none dark:border-gray-700 dark:bg-light-dark dark:text-white sm:h-12 sm:w-12">
          <LockIcon className="h-8 w-3 sm:w-auto" />
          {/* <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-brand shadow-light dark:bg-slate-50 sm:h-3 sm:w-3" /> */}
        </div>
      </button>
      {isOpen && (
        <div className="absolute z-10 right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none">
          <div className="py-1">
            <a
              onClick={() => {
                console.log('singout');
                // signOut(auth)
                //   .then(() => {
                //     // Sign-out successful.
                router.push('/authentication');
                //   })
                //   .catch((error) => {
                //     // An error happened.
                //   });
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              sign out
            </a>
            {/* {sideBarMenuItems
              .find((item) => item.name === 'Authentication')
              ?.dropdownItems?.map((dropdownItem, index) => (
                <a
                  key={index}
                  href={dropdownItem.href}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {dropdownItem.name}
                </a>
              ))} */}
          </div>
        </div>
      )}
    </div>
  );
}

const SignOutButton = () => {
  const router = useRouter();
  return (
    <Button
      shape="circle"
      color="gray"
      onClick={() => {
        router.push('/authentication');
        // TODO: complete this signout and handle firebase signout here
        // Reference:
        // signOut(auth)
        //   .then(() => {
        //     // Sign-out successful.
        // router.push('/authentication');
        //   })
        //   .catch((error) => {
        //     // An error happened.
        //   });
      }}
    >
      <LogoutIcon />
    </Button>
  );
};

function HeaderRightArea() {
  return (
    <div className="relative order-last flex shrink-0 items-center gap-4 sm:gap-6 lg:gap-8">
      {/* <AuthenticationDropdown /> */}
      <SignOutButton />
      <ConnectWallet />
      {/* <NotificationButton /> */}
      {/* <WalletConnect /> */}
    </div>
  );
}

export function RetroHeader({ className }: { className?: string }) {
  const router = useRouter();
  const isMounted = useIsMounted();
  const { openDrawer } = useDrawer();
  const windowScroll = useWindowScroll();
  return (
    <nav
      className={cn(
        'sticky top-0 z-30 h-16 w-full backdrop-blur transition-all duration-300 ltr:right-0 rtl:left-0 sm:h-20 3xl:h-24',
        isMounted && windowScroll.y > 17
          ? 'bg-white/80 shadow-card dark:bg-dark/80'
          : '',
        className,
      )}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8 3xl:px-10">
        <div className="flex items-center">
          <div
            onClick={() => router.push(routes.home)}
            className="flex items-center xl:hidden"
          >
            <LogoIcon />
          </div>
          <div className="mx-2 block sm:mx-4 xl:hidden">
            <Hamburger
              isOpen={false}
              variant="transparent"
              onClick={() => openDrawer('RETRO_SIDEBAR')}
              className="dark:text-white"
            />
          </div>
          {/* <SearchButton
            variant="transparent"
            className="ltr:-ml-[17px] rtl:-mr-[17px] dark:text-white"
          /> */}
        </div>
        <HeaderRightArea />
      </div>
    </nav>
  );
}

export function ClassicHeader({ className }: { className?: string }) {
  const router = useRouter();
  const isMounted = useIsMounted();
  const { openDrawer } = useDrawer();
  const windowScroll = useWindowScroll();
  return (
    <nav
      className={cn(
        'sticky top-0 z-30 h-16 w-full backdrop-blur transition-all duration-300 ltr:right-0 rtl:left-0 sm:h-20 3xl:h-24',
        ((isMounted && windowScroll.y) as number) > 2
          ? 'bg-white/80 dark:bg-dark/80 shadow-card'
          : '',
        className,
      )}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8 3xl:px-10">
        <div className="flex items-center">
          <div
            onClick={() => router.push(routes.home)}
            className="flex items-center xl:hidden"
          >
            <LogoIcon />
          </div>
          <div className="mx-2 block sm:mx-4 xl:hidden">
            <Hamburger
              isOpen={false}
              variant="transparent"
              onClick={() => openDrawer('CLASSIC_SIDEBAR')}
              className="dark:text-white"
            />
          </div>
          {/* <SearchButton
            variant="transparent"
            className="ltr:-ml-[17px] rtl:-mr-[17px] dark:text-white"
          /> */}
        </div>
        <HeaderRightArea />
      </div>
    </nav>
  );
}

export default function Header({ className }: { className?: string }) {
  const router = useRouter();
  const isMounted = useIsMounted();
  const { openDrawer } = useDrawer();
  const windowScroll = useWindowScroll();
  return (
    <nav
      className={cn(
        'sticky top-0 z-30 h-16 w-full backdrop-blur transition-shadow duration-300 ltr:right-0 rtl:left-0 sm:h-20 3xl:h-24',
        ((isMounted && windowScroll.y) as number) > 2
          ? 'bg-white/80 shadow-card dark:bg-dark/80'
          : '',
        className,
      )}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8 3xl:px-10">
        <div className="flex items-center">
          <div
            onClick={() => router.push(routes.home)}
            className="flex items-center xl:hidden"
          >
            <LogoIcon />
          </div>
          <div className="mx-2 block sm:mx-4 xl:hidden">
            <Hamburger
              isOpen={false}
              variant="transparent"
              onClick={() => openDrawer('DEFAULT_SIDEBAR')}
              className="dark:text-white"
            />
          </div>
          {/* <SearchButton
            variant="transparent"
            className="ltr:-ml-[17px] rtl:-mr-[17px] dark:text-white"
          /> */}
        </div>
        <HeaderRightArea />
      </div>
    </nav>
  );
}
