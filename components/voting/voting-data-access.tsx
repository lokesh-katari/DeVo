"use client";

import {
  getVotingProgram,
  getVotingProgramId,
} from "../../anchor/src/voting-exports";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Cluster,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useCluster } from "../cluster/cluster-data-access";
import { useAnchorProvider } from "../solana/solana-provider";
import { useTransactionToast } from "../ui/ui-layout";
import { useMemo } from "react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

interface CreateProposalArgs {
  title: string;
  description: string;
}

interface VoteArgs {
  proposal: PublicKey;
  voteFor: boolean;
  nftMint: PublicKey;
  governanceTokenMint: PublicKey;
  governanceTokenMintAuthority: PublicKey;
}

export function useVotingProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const { publicKey: walletPublicKey } = useWallet();
  const programId = useMemo(
    () => getVotingProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = useMemo(() => getVotingProgram(provider), [provider]);

  const proposals = useQuery({
    queryKey: ["voting", "all", { cluster }],
    queryFn: () => program.account.proposal.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ["get-program-account", { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const createProposal = useMutation<string, Error, CreateProposalArgs>({
    mutationKey: ["proposal", "create", { cluster }],
    mutationFn: async ({ title, description }) => {
      if (!walletPublicKey) throw new Error("Wallet not connected");

      const [proposalPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("proposal"),
          walletPublicKey.toBuffer(),
          Buffer.from(title),
        ],
        programId
      );

      return program.methods
        .createProposal(title, description)
        .accounts({
          // proposal: proposalPda,
          creator: walletPublicKey,
          // systemProgram: SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      proposals.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to create proposal: ${error.message}`);
    },
  });

  const vote = useMutation<string, Error, VoteArgs>({
    mutationKey: ["proposal", "vote", { cluster }],
    mutationFn: async ({
      proposal,
      voteFor,
      nftMint,
      governanceTokenMint,
      governanceTokenMintAuthority,
    }) => {
      if (!walletPublicKey) throw new Error("Wallet not connected");

      console.log("Proposal:", proposal.toBase58());
      console.log("Wallet Public Key:", walletPublicKey.toBase58());
      console.log("NFT Mint:", nftMint.toBase58());
      console.log("Governance Token Mint:", governanceTokenMint.toBase58());
      console.log(
        "Governance Token Mint Authority:",
        governanceTokenMintAuthority.toBase58()
      );

      const proposalAccount = await program.account.proposal.fetch(proposal);

      const [voteRecordPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("vote_record"),
          proposal.toBuffer(),
          walletPublicKey.toBuffer(),
        ],
        programId
      );

      const [voterGovernanceTokenAccountPda] = PublicKey.findProgramAddressSync(
        [walletPublicKey.toBuffer(), governanceTokenMint.toBuffer()],
        TOKEN_PROGRAM_ID
      );

      const nftTokenAccount = await connection
        .getTokenAccountsByOwner(walletPublicKey, { mint: nftMint })
        .then((res) => res.value[0]?.pubkey);

      if (!nftTokenAccount) {
        throw new Error("No token account found for the given NFT mint.");
      }

      return program.methods
        .vote(voteFor)
        .accounts({
          voter: walletPublicKey,
          nftTokenAccount,
          nftMint: nftMint,

          governanceTokenMint: governanceTokenMint,
          voterGovernanceTokenAccount: voterGovernanceTokenAccountPda,
          governanceTokenMintAuthority: governanceTokenMintAuthority,
        })
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      proposals.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to cast vote: ${error.message}`);
    },
  });

  return {
    program,
    programId,
    proposals,
    getProgramAccount,
    createProposal,
    vote,
  };
}
