import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BorrowLend } from "../target/types/borrow_lend";

describe("borrow_lend", () =>
{
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.BorrowLend as Program<BorrowLend>;
  const [userAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("USER"), provider.publicKey.toBuffer()], program.programId);

  it("Initialize User", async () =>
  {
    const tx = await program.methods.initUserMain().rpc();
    console.log("Your transaction signature", tx);

    const userAccount = await program.account.userAcc.fetch(userAccountPDA);
    
    console.log("Authority");
    console.log(userAccount.authority.toString());
    console.log("Borrowed Tokens");
    console.log(userAccount.borrowedTokens.toString());
    console.log("Lended Tokens");
    console.log(userAccount.lendedTokens.toString());
  });

  it("Lend", async () =>
  {
    const tx1 = await program.methods.lendMain({token: new anchor.web3.PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"), amount: new anchor.BN(2)}).rpc();
    console.log("Your transaction signature", tx1);
    const tx2 = await program.methods.lendMain({token: new anchor.web3.PublicKey("So11111111111111111111111111111111111111112"), amount: new anchor.BN(2)}).rpc();
    console.log("Your transaction signature", tx2);

    const userAccount = await program.account.userAcc.fetch(userAccountPDA);
    
    console.log("Authority");
    console.log(userAccount.authority.toString());
    console.log("Lended Tokens");
    userAccount.lendedTokens.forEach(value => {
      console.log(`Token: ${value.token}, Amount: ${value.amount}`);
    });
    console.log("Borrowed Tokens");
       userAccount.borrowedTokens.forEach(value => {
      console.log(`Token: ${value.token}, Amount: ${value.amount}`);
    });
  });

  it("Borrow", async () =>
  {
    const tx1 = await program.methods.borrowMain({token: new anchor.web3.PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"), amount: new anchor.BN(1)}).rpc();
    console.log("Your transaction signature", tx1);
    const tx2 = await program.methods.borrowMain({token: new anchor.web3.PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"), amount: new anchor.BN(1)}).rpc();
    console.log("Your transaction signature", tx2);

    const userAccount = await program.account.userAcc.fetch(userAccountPDA);
    
    console.log("Authority");
    console.log(userAccount.authority.toString());
    console.log("Lended Tokens");
    userAccount.lendedTokens.forEach(value => {
      console.log(`Token: ${value.token}, Amount: ${value.amount}`);
    });
    console.log("Borrowed Tokens");
       userAccount.borrowedTokens.forEach(value => {
      console.log(`Token: ${value.token}, Amount: ${value.amount}`);
    });
  });
});