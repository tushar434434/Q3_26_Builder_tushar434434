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
  "https://devnet.helius-rpc.com/?api-key=c2e70dbf-7a4d-4099-a8c9-1c6d75d4e5d9";

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
      "https://gateway.irys.xyz/75CR9YFWNU1wUjib5Bjqbf5519EGp2q9a3sn9SUo1Hn4";

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