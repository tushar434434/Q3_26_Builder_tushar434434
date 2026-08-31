import {
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";

import wallet from "../../devnet-wallet.json";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

const umi = createUmi(
  process.env.SOLANA_RPC_URL ??
    "https://devnet.helius-rpc.com/?api-key=c2e70dbf-7a4d-4091-a8c9-1c6d75d4e5d9",
);

const keypair = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(wallet),
);

const signer = createSignerFromKeypair(umi, keypair);

umi.use(
  irysUploader({
    address: "https://devnet.irys.xyz/",
  }),
);

umi.use(signerIdentity(signer));

(async () => {
  try {
    // Image URI obtained from nft_image.ts
    const image =
      "https://gateway.irys.xyz/FausoWMc91qSBtsQU2X3RqJE5rfPMK4ccGooueGEZ3a7";

    // NFT metadata
    const metadata = {
      name: "Tushar",
      symbol: "TUSHAR",
      description:
        "Collection of 10 numbers on the blockchain. This is the number 1/10.",

      image: image,

      external_url: "https://example.com",

      attributes: [
        {
          trait_type: "colour",
          value: "red",
        },
      ],

      properties: {
        files: [
          {
            uri: image,
            type: "image/png",
          },
        ],
        category: "image",
      },
    };

    // Upload metadata JSON to Irys
    const metadataUri = await umi.uploader.uploadJson(metadata);

    console.log("METADATA URI:", metadataUri);
  } catch (error) {
    console.log("error:", error);
  }
})();