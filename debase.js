const { ethers } = require('ethers');
const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config();

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

const wallet1 = new ethers.Wallet(process.env.PRIVATE_KEY1, provider);
const wallet2 = new ethers.Wallet(process.env.PRIVATE_KEY2, provider);

// print the address of the wallets
console.log(`Wallet 1 address: ${wallet1.address}`);
console.log(`Wallet 2 address: ${wallet2.address}`);

const tokenContractAddress = process.env.CONTRACT_ADDRESS;
const tokenAbi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "target",
                "type": "address"
            }
        ],
        "name": "debase",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
];

const tokenContract1 = new ethers.Contract(tokenContractAddress, tokenAbi, wallet1);
const tokenContract2 = new ethers.Contract(tokenContractAddress, tokenAbi, wallet2);

const vaultContractAddress = process.env.VAULT_CONTRACT_ADDRESS;
const vaultAbi = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tax",
                "type": "uint256"
            }
        ],
        "name": "Withdraw",
        "type": "event"
    }
];

const vaultContract = new ethers.Contract(vaultContractAddress, vaultAbi, provider);

let addresses = [];
let transferAddresses = [];

const getTimeStamp = () => {
    const now = new Date();
    return `${now.toISOString()}`;
};

const getBalance = async (wallet) => {
    return await wallet.getBalance();
};

const readAddressesFromCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const addresses = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                addresses.push(row.HolderAddress);
            })
            .on('end', () => {
                resolve(addresses.slice(0, 270));
            })
            .on('error', reject);
    });
};

const fetchEthPrice = async () => {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await response.json();
    return data.ethereum.usd;
};

const usdThreshold = 0.4;

const debaseAddresses = async () => {

    const newAddresses = await readAddressesFromCSV('holders.csv');

    // If the addresses differ, clear the transferAddresses
    if (newAddresses.some((address, index) => address !== addresses[index])) {
        console.log(`[${getTimeStamp()}] Addresses have changed.`);
        transferAddresses = [];
        addresses = newAddresses;
    }

    const combinedAddresses = newAddresses.concat(transferAddresses);
    const ethPrice = await fetchEthPrice();

    console.log(`[${getTimeStamp()}] Debasing addresses...`);

    let balanceChangeInEth = ethers.BigNumber.from(0);
    let firstSuccessful = false;
    let block = await provider.getBlock("latest");
    let baseFee = block.baseFeePerGas;
    let gasPrice = baseFee.mul(107).div(100);
    let amount = 0;
    let maxAddresses = combinedAddresses.length;

    for (let i = 0; i < maxAddresses; i++) {
        let initialBalance = 0;
        const address = combinedAddresses[i];

        // make sure each loop iteration takes exactly 5 seconds
        const start = new Date();

        // because debase sessions take so long sometimes we need to update the gas price to avoid rejected transactions
        if (i % 5 === 0) {
            block = await provider.getBlock("latest");
            baseFee = block.baseFeePerGas;
            gasPrice = baseFee.mul(107).div(100);
        }

        if (!firstSuccessful) {
            initialBalance = await getBalance(wallet1);
        }

        try {
            const tx = await tokenContract1.debase(address, {
                gasPrice: gasPrice,
            });
            console.log(`Debase transaction successful for ${address}.`);
            // Ensure the balance change is checked for the first successful transaction
            if (!firstSuccessful) {
                await Promise.race([
                    tx.wait(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timed out')), 15000))
                ]);
                firstSuccessful = true;
                const currentBalance = await getBalance(wallet1);
                balanceChangeInEth = initialBalance.sub(currentBalance);
                const balanceChangeInUsd = ethers.utils.formatEther(balanceChangeInEth) * ethPrice;

                console.log(`Balance change in USD: $${balanceChangeInUsd.toFixed(4)}`);

                maxAddresses = Math.min(Math.floor(usdThreshold / balanceChangeInUsd), combinedAddresses.length);
                console.log(`Max addresses to debase: ${maxAddresses}`);
            }
            amount++;
        } catch (error) {
            // Extract the nested error message
            let errorMessage = '';
            const matches = error.message.match(/execution reverted: (.+?)(?="|$)/);
            if (matches && matches[1]) {
                errorMessage = matches[1];
            } else {
                errorMessage = "Unexpected error structure";
            }
            console.error(`Error: ${errorMessage} - ${address} at ${getTimeStamp()}`);
        }
        const end = new Date();
        const timeTaken = end - start;
        // wait 6 seconds before the next iteration
        if (timeTaken < 6000) {
            await new Promise((resolve) => setTimeout(resolve, 6000 - timeTaken));
        }
        else {
            console.error(`Time taken: ${timeTaken}ms`);
        }
    }
    console.log(`[${getTimeStamp()}] ${amount} addresses debased.`);
};

const debaseUser = async (user) => {
    const block = await provider.getBlock("latest");
    const baseFee = block.baseFeePerGas;
    const gasPrice = baseFee.mul(107).div(100);

    try {
        await tokenContract2.debase(user, {
            gasPrice: gasPrice,
        });
        console.log(`Debase transaction successful for ${user}.`);
    } catch (error) {
        // Extract the nested error message
        let errorMessage = '';
        const matches = error.message.match(/execution reverted: (.+?)(?="|$)/);
        if (matches && matches[1]) {
            errorMessage = matches[1];
        } else {
            errorMessage = "Unexpected error structure";
        }
        console.error(`Error: ${errorMessage} - ${user} at ${getTimeStamp()}`);
    }
};

setInterval(debaseAddresses, 31.25 * 60 * 1000);

debaseAddresses();

vaultContract.on('Withdraw', (user, amount, tax) => {
    const amountInEther = ethers.utils.formatEther(amount);
    const taxInEther = ethers.utils.formatEther(tax);
    console.log(`[${getTimeStamp()}] Withdraw event detected. User: ${user}, Amount: ${amountInEther} IHF, Tax: ${taxInEther} IHF`);
    debaseUser(user);
});

const whitelist = [NULL_ADDRESS, '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad', '0x1111111254EEB25477B68fb85Ed929f73A960582']

tokenContract1.on('Transfer', (from, to, value) => {
    to = to.toLowerCase();
    const valueInEther = ethers.utils.formatEther(value);
    // if target is not the null address
    if (!whitelist.includes(to) && valueInEther > 0.4) {
        console.log(`Transfer event detected. From: ${from}, To: ${to}, Value: ${valueInEther} tokens`);
        if (!addresses.includes(to) && !transferAddresses.includes(to)) {
            // print all addresses that are being tracked
            console.log(`Adding ${to} to transferAddresses`);
            transferAddresses.push(to);
            debaseUser(to);
        } else {
            console.log(`User ${to} already tracked.`);
        }
    }
});

console.log('Listening for Transfer events...');
console.log('Listening for Withdraw events...');

process.on('uncaughtException', function (err) {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', function (reason, promise) {
    console.error('Unhandled Rejection:', reason);
});
