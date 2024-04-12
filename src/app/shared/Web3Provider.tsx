'use client';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [polygon, mainnet],
    transports: {
      // RPC URL for each chain
      [polygon.id]: http(
        `https://polygon-mainnet.g.alchemy.com/v2/sjH8tRBsrNce1Zhcqj65FJTtY7AmieJ-`,
      ),
      [mainnet.id]: http(
        `https://eth-mainnet.g.alchemy.com/v2/sjH8tRBsrNce1Zhcqj65FJTtY7AmieJ-`,
      ),
    },

    // Required API Keys
    walletConnectProjectId: '4b8c8cbd08646956222234798e7abedf',

    // Required App Info
    appName: 'Your App Name',

    // Optional App Info
    appDescription: 'Your App Description',
    appUrl: 'https://family.co', // your app's url
    appIcon: 'https://family.co/logo.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
