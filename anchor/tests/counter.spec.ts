// import * as anchor from "@coral-xyz/anchor";
// import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
// import { assert } from "chai";
// import { VotingApp } from "../target/types/voting_app";

// describe("journal", () => {
//   // Set up the provider and program
//   const provider = AnchorProvider.env();
//   anchor.setProvider(provider);

//   const program = anchor.workspace.Journal as Program<VotingApp>;
//   const { SystemProgram } = web3;

//   let owner: web3.Keypair;
//   let journalEntryPda: web3.PublicKey;

//   before(async () => {
//     // Generate a keypair for the owner
//     owner = web3.Keypair.generate();

//     // Create PDA for the journal entry
//     const title = "Sample Entry";
//     const [pda, _bump] = await web3.PublicKey.findProgramAddress(
//       [Buffer.from(title), owner.publicKey.toBuffer()],
//       program.programId
//     );
//     journalEntryPda = pda;

//     // Airdrop SOL to the owner for transactions
//     await provider.connection.requestAirdrop(owner.publicKey, 1000000000);
//   });

//   it("should create a journal entry", async () => {
//     const title = "Sample Entry";
//     const message = "This is a test journal entry.";

//     await program.methods
//       .createJournalEntry(title, message)
//       .accounts({
//         journalEntry: journalEntryPda,
//         owner: owner.publicKey,
//         systemProgram: SystemProgram.programId,
//       })
//       .signers([owner])
//       .rpc();

//     const journalEntry = await program.account.journalEntryState.fetch(
//       journalEntryPda
//     );
//     assert.equal(journalEntry.title, title);
//     assert.equal(journalEntry.message, message);
//     assert.equal(journalEntry.owner.toBase58(), owner.publicKey.toBase58());
//   });

//   it("should update a journal entry", async () => {
//     const newMessage = "This message has been updated.";

//     await program.methods
//       .updateJournalEntry("Sample Entry", newMessage)
//       .accounts({
//         journalEntry: journalEntryPda,
//         owner: owner.publicKey,
//         systemProgram: SystemProgram.programId,
//       })
//       .signers([owner])
//       .rpc();

//     const journalEntry = await program.account.journalEntryState.fetch(
//       journalEntryPda
//     );
//     assert.equal(journalEntry.message, newMessage);
//   });

//   it("should delete a journal entry", async () => {
//     await program.methods
//       .deleteJournalEntry("Sample Entry")
//       .accounts({
//         journalEntry: journalEntryPda,
//         owner: owner.publicKey,
//         systemProgram: SystemProgram.programId,
//       })
//       .signers([owner])
//       .rpc();

//     // Confirm that the journal entry was deleted
//     try {
//       await program.account.journalEntryState.fetch(journalEntryPda);
//       assert.fail("Expected error not received");
//     } catch (err) {
//       assert.include(err.message, "Account does not exist");
//     }
//   });
// });
