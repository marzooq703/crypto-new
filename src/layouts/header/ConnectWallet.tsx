import { useEffect, useState } from 'react';
import Button from '@/components/ui/button';
import { ConnectKitButton } from 'connectkit';

export default function ConnectWallet() {
  // useEffect(() => {
  // }, []);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  if (false) {
    return (
      <div>
        <Button onClick={toggleDropdown} shape="pill">
          {/* {wallet.label} */}Name
        </Button>
        {isOpen && (
          <div className="absolute z-10 right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none">
            <div className="py-1">
              <a
                onClick={() => {
                  // disconnect({ label: wallet.label });
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Disconnect
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }

  return <ConnectKitButton />;
}
