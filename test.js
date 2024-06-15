const { ethers } = require('ethers');
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

const addresses = [
    '0xB2dae2b045AA0787d6F330dE1E29BEa49fFF306F', '0x6d1b0721A5564E0e6984aA74165979771ed00521'
];

const getTimeStamp = () => {
    const now = new Date();
    return `${now.toISOString()}`;
};

const debaseAddresses = async () => {
    console.log(`[${getTimeStamp()}] Debasing addresses...`);
    let totalDebased = ethers.BigNumber.from(0)
    for (let address of addresses) {
        try {
            const balanceBefore = await tokenContract.balanceOf(address);
            await tokenContract.debase(address);
            const balanceAfter = await tokenContract.balanceOf(address);
            const debasedAmount = balanceBefore.sub(balanceAfter);
            totalDebased = totalDebased.add(debasedAmount);
            console.log(`Debase transaction successful for ${address}. Debased: ${ethers.utils.formatUnits(debasedAmount, 18)} tokens.`);
        } catch (error) {
            console.log(error);
            console.error(`${address} is on cooldown`);
        }
    }
    console.log(`Debasing complete. Total debased: ${ethers.utils.formatUnits(totalDebased, 18)} tokens.`);
};

debaseAddresses();

