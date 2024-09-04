# DeVo

## NFT-Gated Voting DApp on Solana

Welcome to the **NFT-Gated Voting Application**! This decentralized application (DApp) is built on the Solana blockchain and leverages NFTs to gate access to voting on various proposals. Additionally, the DApp features governance token distribution as a reward for participating in the voting process.

## Features

- **NFT-Gated Voting**: Only users who hold a specific NFT can participate in voting on proposals.
- **Create Proposals**: Users with the required NFT can create proposals for the community to vote on.
- **Vote on Proposals**: Cast your vote in favor or against any active proposal.
- **Governance Token Distribution**: Users who participate in voting will be rewarded with governance tokens.
- **Solana Blockchain**: Leverages the fast and low-cost transactions provided by the Solana network.

## Technology Stack

- **Solana**: A high-performance blockchain for fast, secure, and scalable decentralized applications.
- **Anchor Framework**: A Rust-based framework for Solana smart contract development.
- **React**: A JavaScript library for building user interfaces, used for the front-end of the application.
- **TypeScript**: A strongly typed programming language that builds on JavaScript, used for the front-end.
- **React Query**: A powerful data-fetching library that simplifies fetching, caching, and syncing server data.
- **Solana Wallet Adapter**: Used to connect and interact with Solana wallets in the DApp.

## Getting Started

### Prerequisites

- Node v18.18.0 or higher

- Rust v1.77.2 or higher
- Anchor CLI 0.30.0 or higher
- Solana CLI 1.18.9 or higher

### Installation

#### Clone the repo

```shell
git clone <repo-url>
cd <repo-name>
```

#### Install Dependencies

```shell
npm install
```

#### Start the web app

```
npm run dev
```

## Apps

### anchor

This is a Solana program written in Rust using the Anchor framework.

#### Commands

You can use any normal anchor commands. Either move to the `anchor` directory and run the `anchor` command or prefix the command with `npm run`, eg: `npm run anchor`.

#### Sync the program id:

Running this command will create a new keypair in the `anchor/target/deploy` directory and save the address to the Anchor config file and update the `declare_id!` macro in the `./src/lib.rs` file of the program.

You will manually need to update the constant in `anchor/lib/counter-exports.ts` to match the new program id.

```shell
npm run anchor keys sync
```

#### Build the program:

```shell
npm run anchor-build
```

#### Start the test validator with the program deployed:

```shell
npm run anchor-localnet
```

#### Run the tests

```shell
npm run anchor-test
```

#### Deploy to Devnet

```shell
npm run anchor deploy --provider.cluster devnet
```

### web

This is a React app that uses the Anchor generated client to interact with the Solana program.

#### Commands

Start the web app

```shell
npm run dev
```

Build the web app

```shell
npm run build
```
