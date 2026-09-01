import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import {
  createSignerFromKeypair,
  publicKey,
  signerIdentity,
} from "@metaplex-foundation/umi";

import {
  update,
  mplCore,
  fetchAsset,
} from "@metaplex-foundation/mpl-core";

import wallet from "../../devnet-wallet.json";

const umi = createUmi(
  process.env.SOLANA_RPC_URL ??
    "https://devnet.helius-rpc.com/?api-key=ca79b896-a662-4dae-b239-3005d401d5bb",
);

// Create keypair
const keypair = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(wallet),
);

// Create signer
const signer = createSignerFromKeypair(umi, keypair);

// Set wallet as identity
umi.use(signerIdentity(signer));

// Enable Metaplex Core
umi.use(mplCore());

(async () => {
  try {
    // Existing NFT Asset address
    const assetAddress = publicKey(
      "46dvRMv3ZPtL7xsrLxWTizckMYykKu38t3JvTh6Uc23B",
    );

    // Fetch the existing Core Asset
    console.log("Fetching NFT...");

    const asset = await fetchAsset(
      umi,
      assetAddress,
    );

    console.log("Current Asset:");
    console.log("Name:", asset.name);
    console.log("URI:", asset.uri);
    console.log("Owner:", asset.owner);
    console.log("Update Authority:", asset.updateAuthority);

    // New metadata URI
    const metadataUri =
      "https://gateway.irys.xyz/2rjXdkZyaNC8Ve6PnCfeVJoMny5SRrpPdUksZWeP8uuv";

    console.log("\nUpdating NFT...");

    const result = await update(umi, {
      asset,
      name: "Tushar updated",
      uri: metadataUri,
    }).sendAndConfirm(umi);

    console.log("\nNFT UPDATE SUCCESSFUL!");
    console.log("Asset:", assetAddress);
    console.log("New Name:", "Tushar updated");
    console.log("New Metadata URI:", metadataUri);
    console.log("Signature:", result.signature);
    console.log("Status: Finalized");
  } catch (error) {
    console.error("\nNFT UPDATE ERROR:");
    console.error(error);
  }
})();