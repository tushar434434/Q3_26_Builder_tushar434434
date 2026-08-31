import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { readFile } from "fs/promises";

import wallet from "../../my-wallet.json";

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
    const image = await readFile(
      "/home/tushar/spl-nft-q326/src/generug.png",
    );

    const file = createGenericFile(
      image,
      "generug.png",
      {
        contentType: "image/png",
      },
    );

    // Upload ONLY ONCE
    const [imageUri] = await umi.uploader.upload([file]);

    console.log("IMAGE URI:", imageUri);
  } catch (error) {
    console.log("error:", error);
  }
})();