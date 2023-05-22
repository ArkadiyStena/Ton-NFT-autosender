from nft_addresses_parser import *

# creating the "nft_addresses.txt" file and writing addresses of some NFTs there
parse_nfts(
    owner_address="EQDYI91m01_RLQFaYlBRYTYXpX3JKUXrjnEiOw4dAVoRFOA6",
    conditions=[Pattern(r'STON\.fi \[anti\]glitch_2', r'.*'),  # all nfts from glitch_2 NFT collection on the wallet
                Pattern(r'.*glitch_1', r'.*#1.*')],  # all nfts of first cat. from glitch_1 NFT collection on the wallet
    account_nfts=10000
)

# creating the "destination_addresses.txt" file, it is contains addresses of users you want to send NFTs to
# you can edit it manually, separate addresses by the \n (newline)
with open("destination_addresses.txt", 'w') as file:
    file.write("EQDjf7bhJCcqjgSEK7-nS6nkru1aDMwu1URiMp7fd4H3hbOV\n"
               "EQBQgT8o1S7doOvJMmpj33l90pYaTBGeyaSrwZu2IHlColD9")
