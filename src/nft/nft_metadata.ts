import {
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";

import wallet from "../../devnet-wallet.json";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

const API_KEY = "ca79b896-a662-4dae-b239-3005d401d5bb";

const RPC_URL = `https://devnet.helius-rpc.com/?api-key=${API_KEY}`;

const umi = createUmi(RPC_URL);

const keypair = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(wallet),
);

const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));

umi.use(
  irysUploader({
    address: "https://devnet.irys.xyz/",
  }),
);

(async () => {
  try {
    const image =
      "https://gateway.irys.xyz/FausoWMc91qSBtsQU2X3RqJE5rfPMK4ccGooueGEZ3a7";

    const metadata = {
      name: "Tushar updated",
      symbol: "TUSHAR",
      description: "Updated NFT metadata",

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

    console.log("Uploading metadata...");

    const metadataUri = await umi.uploader.uploadJson(metadata);

    console.log("METADATA URI:", metadataUri);
  } catch (error) {
    console.error("ERROR:", error);
  }
})();