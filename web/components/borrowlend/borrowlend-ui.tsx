'use client';
import { useState } from 'react';
import {
  useBorrowLendProgram,
  useBorrowLendProgramAccount,
} from './borrowlend-data-access';
import { useWallet } from '@solana/wallet-adapter-react';
import { BorrowLendUserPortfolio } from './borrowlend-portfolio';
import { PublicKey } from '@solana/web3.js';


export function BorrowLendCreate() {
  const { initializeUserPort } = useBorrowLendProgram();
  const { publicKey } = useWallet();
  const { accounts } = useBorrowLendProgram();


  const currentAcc = accounts.data?.find(account => account.account.authority.toString() === publicKey!.toString());


  return (
    <>
      {(publicKey! && !currentAcc) && <button
        className="btn btn-xs lg:btn-md btn-primary mb-3"
        onClick={() => initializeUserPort.mutateAsync({ user: publicKey })}
        disabled={initializeUserPort.isPending}
      >
        Create Portfolio {initializeUserPort.isPending && '...'}
      </button>}
    </>
  );
}


export function BorrowLendList() {
  const { accounts, getProgramAccount } = useBorrowLendProgram();
  const { publicKey } = useWallet();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }
  const currentAcc = accounts.data?.find(account => account.account.authority.toString() === publicKey!.toString());

  return (
    <div className={'space-y-6'}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {currentAcc! && <BorrowLendUserPortfolio
            key={currentAcc?.publicKey.toString()}
            account={currentAcc?.publicKey}
            borrowed={currentAcc?.account.borrowedTokens}
            lended={currentAcc?.account.lendedTokens}
            portfolioKey={currentAcc?.account.authority.toString()}
          />}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={'text-2xl'}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  );
}


export function BorrowLendTokenUI() {
  const { publicKey } = useWallet();
  const { accounts } = useBorrowLendProgram();

  const currentAcc = accounts.data?.find(account => account.account.authority.toString() === publicKey!.toString())?.publicKey;
  const { LendTokens, BorrowTokens } = useBorrowLendProgramAccount({ account: currentAcc! });

  const tokens = [
    { tokenName: "Solana", tokenSymbol: "SOL", tokenKey: new PublicKey("So11111111111111111111111111111111111111112") },
    { tokenName: "USDC", tokenSymbol: "USD", tokenKey: new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU") }
  ];


  const [tokenValues, setTokenValues] = useState(
    tokens.reduce((acc, token) => {
      const keyAsString = String(token.tokenKey); // Explicitly convert to string
      acc[keyAsString] = { lendValue: '', borrowValue: '' };
      return acc;
    }, {} as Record<string, { lendValue: string; borrowValue: string }>)
  );

  const handleLend = (tokenKey: any) => {
    console.log("tokenKey", tokenKey)
    const { lendValue } = tokenValues[tokenKey];
    LendTokens.mutateAsync({ user: publicKey!, tokenKey: tokenKey, tokenAmount: Number(lendValue) });
    setTokenValues(prevState => ({
      ...prevState,
      [tokenKey]: { ...prevState[tokenKey], lendValue: '' }
    }))
  };
  const handleBorrow = (tokenKey: any) => {
    const { borrowValue } = tokenValues[tokenKey];
    BorrowTokens.mutateAsync({ user: publicKey!, tokenKey: tokenKey, tokenAmount: Number(borrowValue) });
    setTokenValues(prevState => ({
      ...prevState,
      [tokenKey]: { ...prevState[tokenKey], borrowValue: '' }
    }))
  };

  const handleChangeLend = (tokenKey: string, value: string) => {
    setTokenValues(prevState => ({
      ...prevState,
      [tokenKey]: { ...prevState[tokenKey], lendValue: value }
    }));
  };

  const handleChangeBorrow = (tokenKey: string, value: string) => {
    setTokenValues(prevState => ({
      ...prevState,
      [tokenKey]: { ...prevState[tokenKey], borrowValue: value }
    }));
  };

  return (
    <>
      {currentAcc! && <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <ul className="space-y-6">
          {tokens.map((token) => (
            <li
              key={token.tokenSymbol}
              className="flex flex-col md:flex-row items-center justify-between p-6 bg-gray-100 rounded-lg shadow-md space-y-4 md:space-y-0 md:space-x-4"
            >
              <span className="text-lg font-semibold">{token.tokenName}</span>

              <div className="flex flex-col md:flex-row items-center w-full md:w-auto space-y-4 md:space-y-0 md:space-x-4">
                <input
                  type="text"
                  value={tokenValues[String(token.tokenKey)].lendValue}
                  onChange={(e) => handleChangeLend(String(token.tokenKey), e.target.value)}
                  placeholder="Enter Lend amount"
                  className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center w-full md:w-1/3"
                />
                <button
                  onClick={() => handleLend(token.tokenKey)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 w-full md:w-auto"
                >
                  Lend
                </button>
                <input
                  type="text"
                  value={tokenValues[String(token.tokenKey)].borrowValue}
                  onChange={(e) => handleChangeBorrow(String(token.tokenKey), e.target.value)}
                  placeholder="Enter Borrow amount"
                  className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center w-full md:w-1/3"
                />
                <button
                  onClick={() => handleBorrow(token.tokenKey)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 w-full md:w-auto"
                >
                  Borrow
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>}
    </>


  );
}





