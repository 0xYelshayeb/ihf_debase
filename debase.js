const { ethers } = require('ethers');
const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config();

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

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
    }
];

const tokenContract = new ethers.Contract(tokenContractAddress, tokenAbi, wallet);

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

const THRESHOLD = ethers.utils.parseEther('0.000003');

const getTimeStamp = () => {
    const now = new Date();
    return `${now.toISOString()}`;
};

const getBalance = async () => {
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
                resolve(addresses.slice(0, 310));
            })
            .on('error', reject);
    });
};

const debaseAddresses = async () => {
    const addresses = await readAddressesFromCSV('holders.csv');
    firstSuccessful = false;
    console.log(`[${getTimeStamp()}] Debasing addresses...`);
    let block = await provider.getBlock("latest");
    let baseFee = block.baseFeePerGas;
    let gasPrice = baseFee.mul(110).div(100);
    let amount = 0;

    for (let i = 0; i < addresses.length; i++) {
        let initialBalance = 0;
        const address = addresses[i];

        // because debase sessions take so long sometimes we need to update the gas price to avoid rejected transactions
        if (i % 30 === 0) {
            block = await provider.getBlock("latest");
            baseFee = block.baseFeePerGas;
            gasPrice = baseFee.mul(110).div(100);
        }

        if (i % 10 === 0 || !firstSuccessful) {
            initialBalance = await getBalance();
        }

        try {
            const tx = await tokenContract.debase(address, {
                gasPrice: gasPrice,
            });
            console.log(`Debase transaction successful for ${address}.`);
            // Ensure the balance change is checked for the first successful transaction
            if (i % 10 === 0 || !firstSuccessful) {

                await Promise.race([
                    tx.wait(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timed out')), 15000))
                ]);
                firstSuccessful = true;
                const currentBalance = await getBalance();
                const balanceChange = initialBalance.sub(currentBalance);
                console.log(`Balance Change: ${ethers.utils.formatEther(balanceChange)} ETH`);

                if (balanceChange.gt(THRESHOLD)) {
                    console.log(`[${getTimeStamp()}] Balance change exceeds threshold. Halting debase process.`);
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            else {
                // Wait 3.5s
                await new Promise(resolve => setTimeout(resolve, 3500));
            }
            amount++;
        } catch (error) {
            console.error(`${address} is on cooldown at ${getTimeStamp()}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    console.log(`[${getTimeStamp()}] ${amount} addresses debased.`);
};

const debaseUser = async (user) => {
    const block = await provider.getBlock("latest");
    const baseFee = block.baseFeePerGas;

    const gasPrice = baseFee.mul(110).div(100);
    try {
        await tokenContract.debase(user, {
            gasPrice: gasPrice,
        });
        console.log(`Debase transaction successful for ${user}.`);
    } catch (error) {
        console.error(`${user} is on cooldown at ${getTimeStamp()}`);
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

console.log('Listening for Withdraw events...');

process.on('uncaughtException', function (err) {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', function (reason, promise) {
    console.error('Unhandled Rejection:', reason);
});
