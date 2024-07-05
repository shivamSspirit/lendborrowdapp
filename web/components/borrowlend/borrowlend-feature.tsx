'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import { useBorrowLendProgram } from './borrowlend-data-access';
import { BorrowLendCreate, BorrowLendList } from './borrowlend-ui';
import { BorrowLendTokenUI } from './borrowlend-ui';

export default function BorrowLendFeature() {
  const { publicKey } = useWallet();
  const { programId } = useBorrowLendProgram();

  return publicKey ? (
    <div>
      <AppHero
        title="BorrowLend"
        subtitle={
          'FIrst Create a new Portfolio account by clicking the "Create Portfolio" button. The state(your lended and borrowed tokens(devnet tokens)) of a account is stored on-chain and can be manipulated by calling the program\'s methods (borrow tokens, lend token).'
        }
      >
        <p className="mb-6">
          This is BorrowLend On-chain Program ID(deployed Contract address): <ExplorerLink
            path={`account/${programId}`}
            label={ellipsify(programId.toString())}
          />
        </p>

        <BorrowLendCreate />

        <BorrowLendTokenUI/>

      </AppHero>
      <BorrowLendList />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  );
}
