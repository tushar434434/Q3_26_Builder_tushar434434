import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  generateSigner,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { create, mplCore } from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";

import wallet from "../../devnet-wallet.json";

const RPC_URL =
  "https://devnet.helius-rpc.com/?api-key=ca79b896-a662-4dae-b239-3005d401d5bb";

const WS_URL =
  "wss://devnet.helius-rpc.com/?api-key=c2e70dbf-7a4d-4099-a8c9-1c6d75d4e5d9";

// Create Umi using Helius RPC
const umi = createUmi(RPC_URL);

// Create keypair from wallet
const keypair = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(wallet),
);

// Create signer
const signer = createSignerFromKeypair(umi, keypair);

// Set signer identity
umi.use(signerIdentity(signer));

// Enable Metaplex Core
umi.use(mplCore());

(async () => {
  try {
    // Metadata URI uploaded to Irys
    const metadataUri =
      "https://gateway.irys.xyz/FZpeTDRiwNmTnRm8LLW2z2cu5uaWa1tjn2UaUYrJDBx8";

    // Generate a new asset signer
    const asset = generateSigner(umi);

    console.log("Creating NFT...");
    console.log("Asset:", asset.publicKey);
    console.log("Metadata:", metadataUri);

    // Create NFT
    const tx = await create(umi, {
      asset,
      name: "Tushar",
      uri: metadataUri,
    });

    // Send and confirm transaction
    const result = await tx.sendAndConfirm(umi);

    // Convert signature to base58
    const signature = base58.deserialize(result.signature)[0];

    console.log("\nNFT MINT SUCCESSFUL!");
    console.log("Signature:", signature);
    console.log("Asset:", asset.publicKey);
    console.log("Status: Finalized");
  } catch (error) {
    console.error("\nNFT MINT ERROR:");
    console.error(error);
  }
})();

//revising the concept of minting an NFT using the Metaplex SDK and Helius RPC. The code initializes the Umi environment, creates a signer from a provided wallet, and then generates a new asset signer for the NFT. It sets the metadata URI for the NFT and sends a transaction to create the NFT on the Solana blockchain. Upon successful minting, it logs the transaction signature and asset public key.
//the workflow involves setting up the necessary environment, handling keypairs and signers, and interacting with the Metaplex SDK to facilitate the minting process. The code also includes error handling to catch any issues that may arise during the minting process.