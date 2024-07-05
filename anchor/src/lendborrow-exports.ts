// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import borrowLendIDL from '../target/idl/borrow_lend.json';
import type { BorrowLend } from '../target/types/borrow_lend';

// Re-export the generated IDL and type
export { BorrowLend, borrowLendIDL };

// The programId is imported from the program IDL.
export const BorrowLend_PROGRAM_ID = new PublicKey(borrowLendIDL.address);

// This is a helper function to get the Counter Anchor program.
export function getBorrowLendProgram(provider: AnchorProvider) {
  return new Program(borrowLendIDL as BorrowLend, provider);
}

// This is a helper function to get the program ID for the Counter program depending on the cluster.
export function getBorrowLendProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Lend program on devnet and testnet.
      return new PublicKey('FqfKDfzgDaf4JsEaP5eDX9qEedUPdfdv8uCcQDv4LszL');
    case 'mainnet-beta':
    default:
      return BorrowLend_PROGRAM_ID;
  }
}
