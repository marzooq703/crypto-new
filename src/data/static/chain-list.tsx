// Define a type for a chain
type Chain = {
  name: string;
  code: string;
  icon: string; // You can use an icon URL or any other representation
};

// Define an array of chains
const chains: Chain[] = [
  {
    name: 'Ethereum',
    code: 'ETH',
    icon: 'ethereum_icon_url.png',
  },
  {
    name: 'Binance Smart Chain',
    code: 'BSC',
    icon: 'bsc_icon_url.png',
  },
  {
    name: 'Polygon',
    code: 'MATIC',
    icon: 'matic_icon_url.png',
  },
  // Add more chains as needed
];

export default chains;
