import { Connection, Keypair, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction, getAccount } from '@solana/spl-token';
import { config } from './config';

export class SolanaService {
  private connection: Connection;
  private usdcMint: PublicKey;

  constructor() {
    this.connection = new Connection(config.rpcUrl, 'confirmed');
    this.usdcMint = new PublicKey(config.usdcMint);
  }

  async generateDepositAddress(): Promise<Keypair> {
    return Keypair.generate();
  }

  async checkPayment(depositAddress: string, expectedAmount: number): Promise<boolean> {
    try {
      const pubkey = new PublicKey(depositAddress);
      const tokenAccount = await getAssociatedTokenAddress(this.usdcMint, pubkey);
      
      const account = await getAccount(this.connection, tokenAccount);
      const balance = Number(account.amount) / 1e6; // USDC has 6 decimals
      
      return balance >= expectedAmount;
    } catch (error) {
      return false;
    }
  }

  async settlePayment(
    fromKeypair: Keypair,
    toAddress: string,
    amount: number,
    feeAddress: string,
    feeAmount: number
  ): Promise<string> {
    const toPubkey = new PublicKey(toAddress);
    const feePubkey = new PublicKey(feeAddress);

    const fromTokenAccount = await getAssociatedTokenAddress(this.usdcMint, fromKeypair.publicKey);
    const toTokenAccount = await getAssociatedTokenAddress(this.usdcMint, toPubkey);
    const feeTokenAccount = await getAssociatedTokenAddress(this.usdcMint, feePubkey);

    const transaction = new Transaction();

    // Transfer to merchant
    transaction.add(
      createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        fromKeypair.publicKey,
        amount * 1e6 // Convert to USDC base units
      )
    );

    // Transfer fee
    transaction.add(
      createTransferInstruction(
        fromTokenAccount,
        feeTokenAccount,
        fromKeypair.publicKey,
        feeAmount * 1e6
      )
    );

    const signature = await this.connection.sendTransaction(transaction, [fromKeypair]);
    await this.connection.confirmTransaction(signature);

    return signature;
  }
}
