'use client';

import { getBorrowLendProgram, getBorrowLendProgramId } from '@lendborrow/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';
import { BN } from '@coral-xyz/anchor';

export function useBorrowLendProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getBorrowLendProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getBorrowLendProgram(provider);

  const accounts = useQuery({
    queryKey: ['user-account', 'all', { cluster }],
    queryFn: () => program.account.userAcc.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initializeUserPort = useMutation({
    mutationKey: ['borrow_lend', 'initialize_user', { cluster }],
    mutationFn: async ({ user }: { user: PublicKey }) => {
      return program.methods
        .initUserMain()
        .rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initializeUserPort,
  };
}

export function useBorrowLendProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useBorrowLendProgram();

  const accountQuery = useQuery({
    queryKey: ['borrow_lend', 'fetch', { cluster, account }],
    queryFn: () => program.account.userAcc.fetch(account),
  });


  const LendTokens = useMutation({
    mutationKey: ["borrow_lend", 'lend', { cluster, account }],
    mutationFn: async ({ user, tokenKey, tokenAmount }: { user: PublicKey; tokenKey: PublicKey; tokenAmount: number }) => {

      const userPDa = PublicKey.findProgramAddressSync([Buffer.from("USER"), user.toBuffer()], program.programId);

      return program.methods.lendMain({ token: tokenKey, amount: new BN(tokenAmount) }).accounts({
        signer: user
      }).rpc();


    },
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },

    onError: () => {
      toast.error('Failed to create entry')
    }
  })


  const BorrowTokens = useMutation({
    mutationKey: ["borrow_lend", 'borrow', { cluster, account }],
    mutationFn: async ({ user, tokenKey, tokenAmount }: { user: PublicKey; tokenKey: PublicKey; tokenAmount: number }) => {

      const userPDa = PublicKey.findProgramAddressSync([Buffer.from("USER"), user.toBuffer()], program.programId);

      return program.methods.borrowMain({ token: tokenKey, amount: new BN(tokenAmount) }).accounts({
        signer: user
      }).rpc();

    },
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },

    onError: () => {
      toast.error('Failed to create entry')
    }
  })


  return {
    accountQuery,
    LendTokens,
    BorrowTokens
  };
}
