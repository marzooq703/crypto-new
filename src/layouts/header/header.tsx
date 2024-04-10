'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import cn from 'classnames';
import LogoIcon from '@/components/ui/logo-icon';
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

import { Web3OnboardProvider, init } from '@web3-onboard/react';
import injectedModule from '@web3-onboard/injected-wallets';
import infinityWalletModule from '@web3-onboard/infinity-wallet';
import fortmaticModule from '@web3-onboard/fortmatic';
import safeModule from '@web3-onboard/gnosis';
import keepkeyModule from '@web3-onboard/keepkey';
import keystoneModule from '@web3-onboard/keystone';
// import ledgerModule from '@web3-onboard/ledger';
import portisModule from '@web3-onboard/portis';
import trezorModule from '@web3-onboard/trezor';
import walletConnectModule from '@web3-onboard/walletconnect';
import coinbaseModule from '@web3-onboard/coinbase';
import magicModule from '@web3-onboard/magic';
import dcentModule from '@web3-onboard/dcent';
import sequenceModule from '@web3-onboard/sequence';
import tahoModule from '@web3-onboard/taho';
import trustModule from '@web3-onboard/trust';
import frontierModule from '@web3-onboard/frontier';
import ConnectWallet from './ConnectWallet';

const INFURA_KEY = '1fbd0696460d4a55bc0caac624669019';

const injected = injectedModule();
const coinbase = coinbaseModule();
const dcent = dcentModule();
const walletConnect = walletConnectModule({
  projectId: '1fbd0696460d4a55bc0caac624669019',
  dappUrl: 'http://localhost:3000/',
});

const portis = portisModule({
  apiKey: '3222c982-f64f-4e28-86fe-b825e9e30653',
});

const fortmatic = fortmaticModule({
  apiKey: '3222c982-f64f-4e28-86fe-b825e9e30653',
});

const infinityWallet = infinityWalletModule();
// const ledger = ledgerModule();
const keystone = keystoneModule();
const keepkey = keepkeyModule();
const safe = safeModule();
const sequence = sequenceModule();
const taho = tahoModule(); // Previously named Tally Ho wallet
const trust = trustModule();
const frontier = frontierModule();

const trezorOptions = {
  email: 'test@test.com',
  appUrl: 'https://www.blocknative.com',
};

const trezor = trezorModule(trezorOptions);

const magic = magicModule({
  apiKey: '3222c982-f64f-4e28-86fe-b825e9e30653',
});

const wallets = [
  infinityWallet,
  keepkey,
  sequence,
  injected,
  trust,
  frontier,
  taho,
  coinbase,
  dcent,
  trezor,
  walletConnect,
  safe,
  magic,
  fortmatic,
  keystone,
  portis,
];

const chains = [
  {
    id: '0x1',
    token: 'ETH',
    label: 'Ethereum Mainnet',
    rpcUrl: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  },
  {
    id: '0x5',
    token: 'ETH',
    label: 'Goerli',
    rpcUrl: `https://goerli.infura.io/v3/${INFURA_KEY}`,
  },
  {
    id: '0x13881',
    token: 'MATIC',
    label: 'Polygon - Mumbai',
    rpcUrl: 'https://matic-mumbai.chainstacklabs.com',
  },
  {
    id: '0x38',
    token: 'BNB',
    label: 'Binance',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
  },
  {
    id: '0xA',
    token: 'OETH',
    label: 'Optimism',
    rpcUrl: 'https://mainnet.optimism.io',
  },
  {
    id: '0xA4B1',
    token: 'ARB-ETH',
    label: 'Arbitrum',
    rpcUrl: 'https://rpc.ankr.com/arbitrum',
  },
  {
    id: '0xa4ec',
    token: 'ETH',
    label: 'Celo',
    rpcUrl: 'https://1rpc.io/celo',
  },
];

const appMetadata = {
  name: 'Connect Wallet Example',
  icon: '<svg>My App Icon</svg>',
  description: 'Example showcasing how to connect a wallet.',
  recommendedInjectedWallets: [
    { name: 'MetaMask', url: 'https://metamask.io' },
    { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
  ],
};

const web3Onboard = init({
  wallets,
  chains,
  appMetadata,
});

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

function HeaderRightArea() {
  return (
    <div className="relative order-last flex shrink-0 items-center gap-4 sm:gap-6 lg:gap-8">
      <AuthenticationDropdown />
      <Web3OnboardProvider web3Onboard={web3Onboard}>
        <ConnectWallet />
      </Web3OnboardProvider>
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
          <SearchButton
            variant="transparent"
            className="ltr:-ml-[17px] rtl:-mr-[17px] dark:text-white"
          />
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
          <SearchButton
            variant="transparent"
            className="ltr:-ml-[17px] rtl:-mr-[17px] dark:text-white"
          />
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
          <SearchButton
            variant="transparent"
            className="ltr:-ml-[17px] rtl:-mr-[17px] dark:text-white"
          />
        </div>
        <HeaderRightArea />
      </div>
    </nav>
  );
}
