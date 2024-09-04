'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import { useVotingProgram } from './voting-data-access';
import { ProposalCreate, ProposalList } from './voting-ui';

export default function JournalFeature() {
  const { publicKey } = useWallet();
  const { programId } = useVotingProgram();

  return publicKey ? (
    <div>
      <AppHero title="DeVo" subtitle={'NFT gated voting dapp'}>
        <p className="mb-6">
          <ExplorerLink
            path={`account/${programId}`}
            label={ellipsify(programId.toString())}
          />
        </p>
        <ProposalCreate />
      </AppHero>
      <ProposalList />
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
