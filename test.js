const fetchEthPrice = async () => {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await response.json();
    return data.ethereum.usd;
};

const main = async () => {
    const ethPrice = await fetchEthPrice();
    console.log(`ETH Price: $${ethPrice}`);
}

main()