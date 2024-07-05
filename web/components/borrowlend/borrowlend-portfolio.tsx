'use client';

import { Keypair } from '@solana/web3.js';
import { useMemo, useState } from 'react';
import { ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import { getMint } from '@solana/spl-token'
import { useConnection } from '@solana/wallet-adapter-react';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { publicKey, PublicKey } from "@metaplex-foundation/umi";

import { Metaplex, Nft, Sft } from "@metaplex-foundation/js";

import {
  useBorrowLendProgram,
  useBorrowLendProgramAccount,
} from './borrowlend-data-access';

import { useWallet } from '@solana/wallet-adapter-react';
import { BN } from '@coral-xyz/anchor';

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, MintLayout, getAssociatedTokenAddressSync, createMint } from "@solana/spl-token";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import {
  mplTokenMetadata, Metadata, MasterEdition,
  Edition, findMetadataPda, fetchDigitalAsset, fetchMetadata, fetchMetadataFromSeeds, getMetadataAccountDataSerializer
} from '@metaplex-foundation/mpl-token-metadata'
import { Mint } from '@metaplex-foundation/mpl-toolbox'


const headerCellStyle = {
  backgroundColor: '#f2f2f2',
  borderBottom: '2px solid #ddd',
  padding: '10px',
  textAlign: 'left',
  fontWeight: 'bold'
};

const cellStyle = {
  padding: '10px',
  borderBottom: '1px solid #ddd'
};

const rowStyle = {
  backgroundColor: '#fff'
};

const alternateRowStyle = {
  backgroundColor: '#f9f9f9'
};



export function BorrowLendUserPortfolio({ account, borrowed, lended, portfolioKey }:{ account:any; borrowed:any; lended:any; portfolioKey:string}) {
  const { initializeUserPort } = useBorrowLendProgram();
  const { accounts, getProgramAccount } = useBorrowLendProgram();
  const { publicKey } = useWallet();

   // Slice the first 6 characters
   const start = portfolioKey?.slice(0, 8);
  
   // Slice the last 6 characters
   const end = portfolioKey?.slice(-8);
   
   // Combine with ellipsis in between
   const slices = `${start}...${end}`;

  const {
    accountQuery,
    // incrementMutation,
    // setMutation,
    // decrementMutation,
    // closeMutation,
  } = useBorrowLendProgramAccount({ account });

  return (
    <div className="space-y-6">
      <h2
        className="card-title justify-center text-3xl cursor-pointer"
        onClick={() => accountQuery.refetch()}
      >
        {'User Portfolio'}
      </h2>
      <div>
        <span>{`User portfolioKey: ${slices}`}</span>
        {/* <h2>Borrowed and Lended Tokens</h2> */}

      <div style={{ padding: '20px', margin: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2 style={{ textAlign: 'center' }}>Borrowed and Lended Tokens</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{
  backgroundColor: '#f2f2f2',
  borderBottom: '2px solid #ddd',
  padding: '10px',
  textAlign: 'left',
  fontWeight: 'bold'
}}>Type</th>
                <th style={{
  backgroundColor: '#f2f2f2',
  borderBottom: '2px solid #ddd',
  padding: '10px',
  textAlign: 'left',
  fontWeight: 'bold'
}}>Token</th>
                <th style={{
  backgroundColor: '#f2f2f2',
  borderBottom: '2px solid #ddd',
  padding: '10px',
  textAlign: 'left',
  fontWeight: 'bold'
}}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {borrowed?.map((token:any, index:number) => (
                <tr key={`borrowed-${index}`} style={index % 2 ? rowStyle : alternateRowStyle}>
                  <td style={cellStyle}>Borrowed</td>
                  <td style={cellStyle}>{token.token.toString() === "So11111111111111111111111111111111111111112" ? "SOL" :
                      token.token.toString() === "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU" ? "USD" : "SPL"}</td>
                  <td style={cellStyle}>{token.amount.toString()}</td>
                </tr>
              ))}
              {lended?.map((token:any, index:number) => (
                <tr key={`lended-${index}`} style={index % 2 ? rowStyle : alternateRowStyle}>
                  <td style={cellStyle}>Lended</td>
                  <td style={cellStyle}>
                    {token.token.toString() === "So11111111111111111111111111111111111111112" ? "SOL" :
                      token.token.toString() === "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU" ? "USD" : "SPL"}
                  </td>
                  <td style={cellStyle}>{token.amount.toString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        



      </div>

    </div>
  );
}
