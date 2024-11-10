import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

// export const blastTestnet = {
//   id: 168587773,
//   name: 'Blast Testnet',
//   network: 'blast-testnet',
//   iconUrl: '',
//   iconBackground: '#fff',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'Ether',
//     symbol: 'ETH',
//   },
//   rpcUrls: {
//     public: { http: ['https://sepolia.blast.io'] },
//     default: { http: ['https://sepolia.blast.io'] },
//   },
//   blockExplorers: {
//     default: { name: 'Blastscan', url: 'https://testnet.blastscan.io' },
//     etherscan: { name: 'Blastscan', url: 'https://testnet.blastscan.io' },
//   },
//   testnet: true,
// };

export const blastMainnet = {
  id: 81457,
  name: 'Blast Mainnet',
  network: 'blast-mainnet',
  iconUrl: '',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://rpc.blast.io'] },
    default: { http: ['https://rpc.blast.io'] },
  },
  blockExplorers: {
    default: { name: 'Blastscan', url: 'https://blastscan.io' },
    etherscan: { name: 'Blastscan', url: 'https://blastscan.io' },
  },
  testnet: true,
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    blastMainnet,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [blastMainnet] : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Droplet',
  projectId: '38cb123c1cbdbd7adc534326e7c1d4f0',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
