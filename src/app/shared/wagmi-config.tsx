'use client';

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig } from 'wagmi';
import { arbitrum, mainnet, polygon } from 'wagmi/chains';

const chains = [arbitrum, mainnet, polygon];
const projectId = '47d4dba760e85df3b29247f4ece69ed1';

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function WagmiConfig({ children }: React.PropsWithChildren) {
  return (
    <>
      {/* <WagmiConfigWrapper config={wagmiConfig}>{children}</WagmiConfigWrapper> */}

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}
