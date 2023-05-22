import {getHttpEndpoint} from "@orbs-network/ton-access";
import {mnemonicToWalletKey, mnemonicNew} from "ton-crypto";
import {TonClient, fromNano, toNano, internal, beginCell, Address} from "ton";
import {WalletContractV3R1, WalletContractV3R2, WalletContractV4} from "ton"

import {readFileSync} from "fs"


async function main() {
    // settings
    const nftAddresses = readFileSync("nft_addresses.txt").toString().split("\n");
    const destAddresses = readFileSync("destination_addresses.txt").toString().split("\n");
    const mnemonic = "word1 word2 ... word24";  // your seed phrase
    const WalletContractV = WalletContractV3R2;  // contract version of your wallet

    //main code
    const amountOfNfts = nftAddresses.length
    if (amountOfNfts != destAddresses.length) {
        return console.log("number of addresses != number of NFTs");
    }
    const key = await mnemonicToWalletKey(mnemonic.split(' '));
    const wallet = WalletContractV.create({publicKey: key.publicKey, workchain: 0});
    const walletAddress = wallet.address;
    const endpoint = await getHttpEndpoint({network: "mainnet"});
    const client = new TonClient({endpoint});

    console.log("Your wallet address", walletAddress.toString());
    if (!await client.isContractDeployed(wallet.address)) {
        console.log("wallet is not deployed");
        return;
    }
    let balance = await client.getBalance(wallet.address);
    console.log("balance:", fromNano(balance));
    if (parseFloat(fromNano(balance)) < 0.08 + 0.035 * amountOfNfts) {  // you can modify conditions
        console.log("not enough balance for sending all of your NFTs");
        return;
    }

    const walletContract = client.open(wallet);
    let seqno = await walletContract.getSeqno();

    for (let i = 0; i < amountOfNfts; ++i) {
        let nftAddressStr = nftAddresses[i];
        let destinationAddress = Address.parse(destAddresses[i]);
        let forwardPayload = beginCell().storeUint(0, 32).endCell();
        let transferNftBody = beginCell().storeUint(0x5fcc3d14, 32).storeUint(0, 64)
            .storeAddress(destinationAddress).storeAddress(walletAddress).storeBit(0)
            .storeCoins(toNano("0.01")).storeBit(1).storeRef(forwardPayload).endCell();

        // TODO: check that nft belongs to you

        let transfer = await walletContract.sendTransfer({
            secretKey: key.secretKey,
            seqno: seqno,
            messages: [internal({
                to: nftAddressStr,
                value: "0.05", body: transferNftBody,
                bounce: true
            })]
        });

        // wait for transaction to confirm
        let max_reties = 50;
        while ((await walletContract.getSeqno()) == seqno && (--max_reties)) {
            await sleep(1500);
        }
        if (!max_reties) {
            return console.log("something went wrong\nnft addr:", nftAddressStr,
                "index =", i);
        }
        ++seqno;
        console.log(i + 1, "transaction confirmed");
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main();