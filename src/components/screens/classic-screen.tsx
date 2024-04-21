'use client';

import { useState } from 'react';
import CoinSlider from '@/components/ui/coin-card-two';
import OverviewChart from '@/components/ui/chats/overview-chart';
import ComparisonChart from '@/components/ui/chats/retro-comparision-chart';
// import VolumeChart from '@/components/ui/chats/volume-chart';
import TopPools from '@/components/ui/top-pools';
import TransactionTable from '@/components/transaction/transaction-user';
import TopCurrencyTable from '@/components/top-currency/currency-table';
// import { coinSlideData } from '@/data/static/coin-slide-data';
import TransactCoin from '@/components/ui/transact-coin';
import Avatar from '@/components/ui/avatar';
import TopupButton from '@/components/ui/topup-button';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
//images
import AuthorImage from '@/assets/images/author.jpg';
import { useEffect } from 'react';
import { db } from '../../lib/firebase';
// @ts-ignore
import { doc, onSnapshot } from 'firebase/firestore';
import MyPDFdoc from '@/app/classic/jsPDF/page';

export default function ClassicScreen() {
  const router = useRouter();
  const [buyData, setBuyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('buy');
  const [sellData, setSellData] = useState([]);
  const [PDFGenerated, setPdfGenerated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user: any = localStorage.getItem('crypto-user');
      if (!user) router.push('/authentication');
      else {
        const email = JSON.parse(user).email;
        const unsub = onSnapshot(
          doc(db, 'userTransactions', email),
          (doc: any) => {
            const data = doc.data();
            console.log('Buy data: ', data);
            if (data?.buy) setBuyData(Object.values(data.buy));
            if (data?.sell) setSellData(Object.values(data.sell));
            //   setUsdtInrPrice(Number(sell));
            setLoading(false);
          },
        );
      }
    }
  }, []);

  const generatePDF = () => {
    setPdfGenerated(true);
  };
  return (
    <>
      <div className="flex flex-wrap">
        {/* <div className="mb-8 w-full sm:mb-0  dark:[&_.swiper-scrollbar>_.swiper-scrollbar-drag]:bg-body/50">
          <CoinSlider coins={coinData} />
        </div> */}
      </div>
      {/* <div>
      <button style={{color:"white",backgroundColor:"black", borderRadius:"5px", border:"grey solid 2px", padding:"5px"}} onClick={generatePDF}>Generate PDF</button>
      {PDFGenerated && <MyPDFdoc generatePDF={PDFGenerated} />}
 */}

      {/* </div> */}
      <div className="flex w-full flex-col sm:mt-8 lg:mt-8 lg:flex-row">
        <div className="flex w-full rounded-lg bg-white p-6 shadow-card dark:bg-light-dark md:col-span-1 md:h-[678px] lg:col-span-5 lg:h-[644px] lg:w-1/3 xl:col-span-3 xl:row-start-1 xl:row-end-2 xl:h-auto xl:w-1/4 2xl:col-span-3  2xl:h-[715px] 2xl:p-6 3xl:col-span-3 3xl:h-[730px] 3xl:p-8 4xl:h-[815px]">
          <div className="w-full">
            {/* <div className="mb-8 h-full"> */}
            <Avatar
              image={AuthorImage}
              alt="Author"
              className="mx-auto mb-6"
              size="lg"
            />
            {/* <h3 className="mb-2 text-center text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 3xl:mb-3">
                Balance
              </h3>
              <div className="mb-7 text-center font-medium tracking-tighter text-gray-900 dark:text-white xl:text-2xl 3xl:mb-8 3xl:text-[32px]">
                $0
              </div> */}

            {/* <TopupButton className="md:h-12 " /> */}
            {/* </div> */}
            <span className="-mx-6 block border-t border-dashed border-t-gray-200 dark:border-t-gray-700 3xl:-mx-8" />
            <TransactCoin className="mt-6" transactionType="buy" />
          </div>
        </div>
        <div className="mt-5 w-full rtl:mr-6 sm:mt-10 lg:ml-6 lg:mt-0 lg:w-2/3 rtl:lg:ml-0 xl:w-3/4 ">
          {!loading ? (
            <>
              <Button
                variant={status == 'buy' ? 'ghost' : 'transparent'}
                onClick={() => setStatus('buy')}
              >
                Buy
              </Button>
              <Button
                variant={status == 'sell' ? 'ghost' : 'transparent'}
                onClick={() => setStatus('sell')}
              >
                Sell
              </Button>
              <TransactionTable
                serverData={status == 'buy' ? buyData : sellData}
                isSell={status == 'sell'}
              />
            </>
          ) : (
            'Loading...'
          )}
        </div>
        {/* <div className="mt-5 w-full rtl:mr-6 sm:mt-10 lg:ml-6 lg:mt-0 lg:w-2/3 rtl:lg:ml-0 xl:w-3/4 ">
          <ComparisonChart />
        </div> */}
      </div>

      {/* <div className="my-8 sm:my-10">
        <TopCurrencyTable />
      </div> */}

      <div className="flex flex-wrap">
        <div className="w-full mt-4">{/* <TransactionTable /> */}</div>
        {/* <div className="order-first mb-8 grid w-full grid-cols-1 gap-6 sm:mb-10 sm:grid-cols-2 lg:order-1 lg:mb-0 lg:flex lg:w-72 lg:flex-col 2xl:w-80 3xl:w-[358px]">
          <OverviewChart />
          <TopPools />
        </div> */}
      </div>
    </>
  );
}
