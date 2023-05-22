# TON NFT autosender
## General info
This is a tool which can help you to transfer a large 
number of NFTs. For instance, it will be useful for sending prizes
to winners of some competitions or shilling your collection.<br>
This tool can automatically create a list of NFT addresses by given
parameters (name of collection or regular expression for NFT name),
and then transfer all of these NFTs to other users.
## Structure
This project contains two files:
- <b>nft_addresses_parser.py</b> - python script for parsing
addresses of the NFTs you want to send.
- <b>nft_addresses_parser.py</b> - script for sending NFTs
## Additional libraries installation
Assuming you have `node`, `npm`, `npx` and `python3` already installed, 
you should execute the following commands to start using this script.
- For typescript
```
npm install ts-node
npm install ton ton-crypto ton-core
npm install @orbs-network/ton-access
npm install tonweb
npm install @types/node
npx tsc --init
```
- For python
```
pip3 install requests
```
## Quickstart
After you have cloned this repository, you can make the list of NFTs
to send. Open the file <b>"example.py"</b> and modify it. 
Note that this script uses "python regular expressions", which is
actually very convenient way to filter NFTs (google if you don't 
know how to write them). For more info check the
<b>"nft_addresses_parser.py"</b> file. You can run example
via `python3 example.py`
<br>Once you have created files <b>"nft_addresses.txt"</b> and 
<b>"destination_addresses.txt"</b> you can edit seed phrase in the
<b>"nft_sender.ts"</b> and start it using `npx ts-node nft_sender.ts`
command. It will take some time to send all your NFTs, because this
script sends them one by one.

## Donations
If my script was helpful for you, you can send me some tons :)<br>
`arkadiystena.ton`,
`EQBQgT8o1S7doOvJMmpj33l90pYaTBGeyaSrwZu2IHlColD9`
<br>If you have any questions, feel free to dm me: `t.me/arkadiystena`
