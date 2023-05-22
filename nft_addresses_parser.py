from requests import get
from re import fullmatch


class Pattern:
    def __init__(self, collection_pattern: str, name_pattern: str):
        self.collection_pattern = collection_pattern
        self.name_pattern = name_pattern


def parse_nfts(owner_address: str, conditions: list[Pattern], account_nfts=10000,
               filename="nft_addresses.txt", filemode='w'):
    """
    Writes to the text file addresses of the NFTs matching to a given patterns
    :param owner_address: your wallet address
    :param conditions: list of conditions, every condition is a class consisting of two
                       regular expression (name_pattern and collection pattern)
                       more about regular expressions: https://docs.python.org/3/library/re.html
    :param account_nfts: max number of NFTs to parse.
                         For example, if you have 20000 NFTs, you should set it 20000
    :param filename: name of the file where addresses will be written
    :param filemode: 'a', if you want to add new addresses to file
                     'w', if you want rewrite it
    """
    base_url = f'https://tonapi.io/v2/accounts/{owner_address}'

    offset = 0
    nfts = []
    while account_nfts > 0:
        limit = min(account_nfts, 1000)
        items = get(base_url +
                    f"/nfts?limit={limit}&offset={offset}&indirect_ownership=false").json()["nft_items"]
        if items:
            nfts.extend(items)
            account_nfts -= 1000
            offset += 1000
        else:
            break

    matching_addresses = []
    for i in range(len(conditions)):
        for j in range(len(nfts)):
            collection_pattern = conditions[i].collection_pattern
            name_pattern = conditions[i].name_pattern
            if (fullmatch(name_pattern, nfts[j]["metadata"]["name"]) and
                    fullmatch(collection_pattern, nfts[j]["collection"]["name"])):
                matching_addresses.append(nfts[j]["address"])

    with open(filename, filemode) as f:
        f.write('\n'.join(matching_addresses) + '\n')
