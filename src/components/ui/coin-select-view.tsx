import type { CoinTypes } from '@/types';
import { useState } from 'react';
import chains from '@/data/static/chain-list';
import { coinList } from '@/data/static/coin-list';
import { SearchIcon } from '@/components/icons/search';
import { useModal } from '@/components/modal-views/context';

interface CoinSelectViewTypes {
  onSelect: (selectedCoin: CoinTypes, selectedChain: string) => void;
}

export default function CoinSelectView({ onSelect }: CoinSelectViewTypes) {
  const { closeModal } = useModal();
  const [selectedChain, setSelectedChain] = useState<string>('');
  const [selectedCoin, setSelectedCoin] = useState<CoinTypes | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const handleChainSelection = (chainCode: string) => {
    setSelectedChain(chainCode);
    // Check if both coin and chain are selected when chain is selected
    if (selectedCoin) {
      confirmSelection(selectedCoin, chainCode);
    }
  };

  const handleSelectedCoin = (item: CoinTypes) => {
    setSelectedCoin(item);
    // Check if both coin and chain are selected when coin is selected
    if (selectedChain) {
      confirmSelection(item, selectedChain);
    }
  };

  const confirmSelection = (coin: CoinTypes, chain: string) => {
    onSelect(coin, chain);
    closeModal();
  };

  let coinListData = coinList;

  if (searchKeyword.length > 0) {
    coinListData = coinList.filter(function (item) {
      const name = item.name;
      return name.match(new RegExp(searchKeyword, 'i')) !== null;
    });
  }

  function handleSelectedCoinOnKeyDown(
    event: React.KeyboardEvent<HTMLLIElement>,
    item: CoinTypes,
  ) {
    if (event.code === 'Enter') {
      handleSelectedCoin(item);
    }
  }

  return (
    <div className="w-full rounded-lg bg-white text-sm shadow-large dark:bg-dark xs:w-[400px]">
      <h2 className="p-6 text-lg font-medium uppercase text-gray-900 dark:text-white">
        Pay with
      </h2>
      <div className="relative">
        <SearchIcon className="absolute left-6 h-full text-gray-700" />
        <input
          type="search"
          autoFocus={true}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Search Your Coin by Name"
          className="w-full border-x-0 border-y border-dashed border-gray-200 py-3.5 pl-14 pr-6 text-sm focus:border-gray-300 focus:ring-0 dark:border-gray-700 dark:bg-light-dark focus:dark:border-gray-600"
        />
      </div>
      <ul role="listbox" className="min-h-[200px] py-3">
        {coinListData.map((item, index) => (
          <li
            key={item.code}
            role="listitem"
            tabIndex={index}
            onClick={() => handleSelectedCoin(item)}
            onKeyDown={(event) => handleSelectedCoinOnKeyDown(event, item)}
            className="flex cursor-pointer items-center gap-2 px-6 py-3 outline-none hover:bg-gray-100 focus:bg-gray-200 dark:hover:bg-gray-800 dark:focus:bg-gray-900"
          >
            {item.icon}
            <span className="uppercase">{item.name}</span>
          </li>
        ))}
      </ul>
      <div className="mb-4">
        <label
          htmlFor="chainSelect"
          className="block font-bold  mb-1 text-sm text-gray-700 dark:text-gray-300"
        >
          Select Chain
        </label>
        <select
          id="chainSelect"
          value={selectedChain}
          onChange={(e) => handleChainSelection(e.target.value)}
          className="w-full py-2 pl-3 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
        >
          <option value="">Select a chain</option>
          {chains.map((chain) => (
            <option key={chain.code} value={chain.code}>
              {chain.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
