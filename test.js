const { ethers } = require('ethers');
require('dotenv').config();

const amountInEther = ethers.utils.formatEther('14000000000000000000');
const taxInEther = ethers.utils.formatEther('1400000000000000000');
console.log(`Withdraw event detected. Amount: ${amountInEther} ETH, Tax: ${taxInEther} ETH`);