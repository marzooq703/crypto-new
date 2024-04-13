'use client';

import {useEffect, useState, useMemo} from 'react';
import {
  useTable,
  useResizeColumns,
  useFlexLayout,
  useSortBy,
  usePagination,
} from 'react-table';
import Button from '@/components/ui/button';
import Scrollbar from '@/components/ui/scrollbar';
import { ChevronDown } from '@/components/icons/chevron-down';
import { LongArrowRight } from '@/components/icons/long-arrow-right';
import { LongArrowLeft } from '@/components/icons/long-arrow-left';
import { LinkIcon } from '@/components/icons/link-icon';
import { TransactionData } from '@/data/static/transaction-data';

import dayjs from 'dayjs';

import Swal from 'sweetalert2';

const COLUMNS = [  
  {
    Header: () => <div className="ltr:ml-auto rtl:mr-auto">Payment Date</div>,
    accessor: 'time',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
        <div className="-tracking-[1px] ltr:text-right rtl:text-left">
        <strong className="mb-0.5 flex justify-end text-base md:mb-1.5 lg:text-base 3xl:text-2xl">
        {dayjs(value).format('MMM D, YYYY')}          
        </strong>
        <span className="text-gray-600 dark:text-gray-400">
        {dayjs(value).format('hh:mm:ss')}
        </span>
      </div>      
    ),
    minWidth: 160,
    maxWidth: 220,
  },
  {
    Header: 'Email',
    accessor: 'email',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div className="cursor-pointer" onClick={() => {typeof window != 'undefined' && navigator.clipboard.writeText(value)}}>{value.substring(0, 17)}</div>
    ),
    minWidth: 60,
    maxWidth: 200,
  },
  {
    Header: 'Order Id',
    accessor: 'orderId',
    minWidth: 60,
    maxWidth: 130,
  },
  {
    Header: () => <div>USDT Value</div>,
    accessor: 'usdtValue',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div className="">{value}</div>
    ),
    minWidth: 80,
    maxWidth: 120,
  },
  {
    Header: () => <div className="ltr:ml-auto rtl:mr-auto">Crypto Trasfer</div>,
    accessor: 'cryptoTrasnfer',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div className="">{value}</div>
    ),
    minWidth: 100,
    maxWidth: 180,
  },
  {
    Header: () => <div className="ltr:ml-auto rtl:mr-auto">Wallet Address</div>,
    accessor: 'walletAddress',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div className="flex items-center justify-start cursor-pointer" onClick={() => {typeof window != 'undefined' && navigator.clipboard.writeText(value)}}>
        <LinkIcon className="h-[18px] w-[18px] ltr:mr-2 rtl:ml-2" /> {value.substring(0, 10)}
      </div>
    ),
    minWidth: 120,
    maxWidth: 200,
  },
  {
    Header: () => <div className="ltr:ml-auto rtl:mr-auto">Amount</div>,
    accessor: 'totalAmount',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
        <strong className="mb-0.5 flex justify-center text-base md:mb-1.5 lg:text-base 3xl:text-2xl">{value}</strong>
    ),
    minWidth: 80,
    maxWidth: 150,
  },
  {
    Header: () => <div className="ltr:ml-auto rtl:mr-auto">Action</div>,
    accessor: 'test',
    // @ts-ignore
    Cell: ({ cell: { value } }) => <Button rounded variant='ghost' size="mini" className="flex justify-end" onClick={() => {
        Swal.fire("Crypto Transfer Triggered...")
    }}>Completed</Button>,
    minWidth: 150,
    maxWidth: 300,
  },
];

export default function TransactionTable({serverData}) {
  
  const data = useMemo(() => serverData, []);
  const columns = useMemo(() => COLUMNS, []);
// console.log("buyData", buyData)
console.log("data", data)
  const {
    getTableProps,
    getTableBodyProps,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state,
    headerGroups,
    page,
    nextPage,
    previousPage,
    prepareRow,
  } = useTable(
    {
      // @ts-ignore
      columns,
      data,
      initialState: { pageSize: 5 },
    },
    useSortBy,
    useResizeColumns,
    useFlexLayout,
    usePagination,
  );

  const { pageIndex } = state;  
  return (
    <div className="">
      <div className="rounded-tl-lg rounded-tr-lg bg-white px-4 pt-6 dark:bg-light-dark md:px-8 md:pt-8">
        <div className="flex flex-col items-center justify-between border-b border-dashed border-gray-200 pb-5 dark:border-gray-700 md:flex-row">
          <h2 className="mb-3 shrink-0 text-lg font-medium uppercase text-black dark:text-white sm:text-xl md:mb-0 md:text-2xl">
            Buy Transaction History
          </h2>
        </div>
      </div>
      <div className="-mx-0.5 dark:[&_.os-scrollbar_.os-scrollbar-track_.os-scrollbar-handle:before]:!bg-white/50">
        <Scrollbar style={{ width: '100%' }} autoHide="never">
          <div className="px-0.5">
            <table
              {...getTableProps()}
              className="transaction-table w-full border-separate border-0"
            >
              <thead className="text-sm text-gray-500 dark:text-gray-300">
                {headerGroups.map((headerGroup, idx) => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={idx}>
                    {headerGroup.headers.map((column, idx) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps(),
                        )}
                        key={idx}
                        className="group  bg-white px-2 py-5 font-normal first:rounded-bl-lg last:rounded-br-lg ltr:first:pl-8 ltr:last:pr-8 rtl:first:pr-8 rtl:last:pl-8 dark:bg-light-dark md:px-4"
                      >
                        <div className="flex items-center">
                          {column.render('Header')}
                          {column.canResize && (
                            <div
                              {...column.getResizerProps()}
                              className={`resizer ${
                                column.isResizing ? 'isResizing' : ''
                              }`}
                            />
                          )}
                          <span className="ltr:ml-1 rtl:mr-1">
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <ChevronDown />
                              ) : (
                                <ChevronDown className="rotate-180" />
                              )
                            ) : (
                              <ChevronDown className="rotate-180 opacity-0 transition group-hover:opacity-50" />
                            )}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody
                {...getTableBodyProps()}
                className="text-xs font-medium text-gray-900 dark:text-white 3xl:text-sm"
              >
                {page.map((row, idx) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      key={idx}
                      className="mb-3 items-center rounded-lg bg-white uppercase shadow-card last:mb-0 dark:bg-light-dark"
                    >
                      {row.cells.map((cell, idx) => {
                        return (
                          <td
                            {...cell.getCellProps()}
                            key={idx}
                            className="px-2 py-4 tracking-[1px] ltr:first:pl-4 ltr:last:pr-4 rtl:first:pr-8 rtl:last:pl-8 md:px-4 md:py-6 md:ltr:first:pl-8 md:ltr:last:pr-8 3xl:py-5"
                          >
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Scrollbar>
      </div>
      {/* <div className="mt-3 flex items-center justify-center rounded-lg bg-white px-5 py-4 text-sm shadow-card dark:bg-light-dark lg:py-6">
        <div className="flex items-center gap-5">
          <Button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            title="Previous"
            shape="circle"
            variant="transparent"
            size="small"
            className="text-gray-700 disabled:text-gray-400 dark:text-white disabled:dark:text-gray-400"
          >
            <LongArrowLeft className="h-auto w-4 rtl:rotate-180" />
          </Button>
          <div>
            Page{' '}
            <strong className="font-semibold">
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </div>
          <Button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            title="Next"
            shape="circle"
            variant="transparent"
            size="small"
            className="text-gray-700 disabled:text-gray-400 dark:text-white disabled:dark:text-gray-400"
          >
            <LongArrowRight className="h-auto w-4 rtl:rotate-180 " />
          </Button>
        </div>
      </div> */}
    </div>
  );
}
