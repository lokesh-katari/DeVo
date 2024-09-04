// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Cluster, PublicKey } from "@solana/web3.js";
import VotingIDL from "../target/idl/voting_app.json";
import type { VotingApp } from "../target/types/voting_app";

// Re-export the generated IDL and type
export { VotingApp, VotingIDL };

// After updating your program ID (e.g. after running `anchor keys sync`) update the value below.
export const JOURNAL_PROGRAM_ID = new PublicKey(
  "3XZiTiynjiHNWwNjp5z6qHFpoMN6FtYoiR92qMBztd7v"
);

// This is a helper function to get the Counter Anchor program.
export function getVotingProgram(provider: AnchorProvider) {
  return new Program(VotingIDL as VotingApp, provider);
}

// This is a helper function to get the program ID for the Journal program depending on the cluster.
export function getVotingProgramId(cluster: Cluster) {
  switch (cluster) {
    case "devnet":
    case "testnet":
    case "mainnet-beta":
    default:
      return JOURNAL_PROGRAM_ID;
  }
}
