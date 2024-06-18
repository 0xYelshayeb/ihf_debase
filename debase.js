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

const addresses = [
    '0x042fef60ad51f48c65e6106f9b950178910a3300', '0x455fd3ae52a8ab80f319a1bf912457aa8296695a', '0x287110f1c99551b377955b64a38a1b026aa9a35a', '0x2ac0c3f0d2eda7b24eff8012a70a03422c8d2b91', '0x8a49f5548f716dccd1db9dc345fb02da9d2c42c3', '0x2b574f753b9613029eabcf7cdb9d9b910d5ae311', '0xfbe353ec512fc1686d904465b66e3a93a67598c8', '0x52fd6fa754dfe88249dad4c7be106c46392a8c1d', '0x05789c67f19404ec9fb3e8521579b6186ec4b3c9', '0x62d23ee20c5aa2b1d0f8f418414bafcef8a9aa1f', '0xa3db0778b38398923867e60adf875325339bc374', '0xaa348388795c565cf6514cd756021a05523a61ad', '0xa2c829b3521dd0b91de2a2833c86cf2cbdba1aea', '0x779768e8405eaf09dee8da356b1eb3bfdb0383e1', '0x446504819a921736ef5dd034d2c9e45bb698fcef', '0x22b6a0c71dedcef295423c17b84b08f46082ac1a', '0x57b2e0a2b28bd6821f4ac95175487b98c4269203', '0xa35ae25d08b2242759a89166858abe86b8f544cf', '0x280fcde4b685c30c0ed124c34fcc4d58850f4c81', '0xa02648567b588f6dbad0ed6713c0f74352bda1f4', '0x5e62b1b5745a0a144c9ffb8873cca34a85dc5fbc', '0xeb7790107ef32c7d54809ff28c04df61b1d40b46', '0x79b08024d35c054a6e9bbe513bed990c0039da98', '0xe84f39d70b0f2c5fada69008a3803bce12286227', '0x8f4acb8c705464fcfa72afcc147e05b7faa2f601', '0x866967c434d27af3472600727c543326198fd168',
    '0x208ee67ccb35202b626f2b3401b1c118b517ad7c', '0xf2870dde3e94663ce8c7aaf242ca20ce07c5d02b', '0x8806c1f851fb7a26af35171c0ec4ec2242bd723f', '0xe3970e13c208454e59e8fb96f8530de80554fc5d', '0xf4319b7f94acf99ed27978797935189bd8c68648', '0xb4cbc62a4615955bce9d09323956bcee8237aa8c', '0x77b33e600b1e101b9206db3c9258599e3738acd6', '0x0302adf2b750aa8c24b9c41b0fd4635add36a192', '0xe6de2f195aaa52df0bd7ab05dda5731dd34f96a3', '0x40db27b9d058900a483f06e1b016d77389f00737', '0x9a5757395d8eb504bf984aef9c57f931bfa2c38c', '0xa6d28b0602edb03ed5010465569ef398a307fb6b', '0x9006b085b605d2a81772a2c3f1c365ce04c048a2', '0x5e6d720f6aaa39da16bcd7bc8198afaea8ea82a6', '0x45d07779bcd95c94d9e5465aaf262356775afe45', '0x2b4a661164015dd60b3124bec397d053d14cdb43', '0x2ed92a8d5508f538c4f2a413f091542a1e66416a', '0x92b774b7ce35b58eaf08962cdd4bdf15299d7c42', '0x98d840b40d060c9805a5b81ed04133a193e0227f', '0xce54ee39375577a68fac846f75a87ffbeaea2642', '0x5d64d14d2cf4fe5fe4e65b1c7e3d11e18d493091', '0x5f04502b04eac2426ee731e1f29e84884d038084', '0x3e57efef507b4db7acfa2ee79ceca6b19e18d106', '0x69420a842c1769789ffa0d62ddb44036a304f3dd', '0x6826727e5a46cd6b6cdacb71345e0569c73f5937', '0x306d4c4f16e81bf9ad5b27ca32cf23c6ddc2da51', '0x145da5fddd81c9b62b58180351a9b6379c47f1aa', '0xbfc6215a9e6b79bff5be022445ec000b1989556f', '0x04bda42de3bc32abb00df46004204424d4cf8287', '0x6150b4d7b46a9e7e72343e4b0bb4b9db64e6077f', '0x3926642bb55a6ef5d4d30182bfd3aca97703bfb4', '0x5f56755c0deab1322655e615818ecdbbc7bedbdd', '0x7a52565d3cfeed6f0cfd16127958b9904a04d2fe', '0x1cf7d64894d3c731d0701bcba7f706ad17369110',
    '0x4e3c9647e992a4e5944cd9bafee40021169069fd', '0xbc0f97138a63ceb6546ef4b2f8186ae03f9a2a4d', '0x3b281fb69b2af236d9a8ff882236ebb1b82baedb', '0xf4c06a94799d7148b4c761ad17b52aa6254de8fa', '0x498b7b7ddb5e057e5d055c4e59f839dbd6e26ff4', '0x2616528437dc0dcf9195a1ad22e7d779ab0ced7f', '0x564539d2a4f73ff26ee573a73dfee83a8f9951b8', '0x273ebff3bda08d0699c3bbdd701dcc986d7e5f76', '0x3b9728bd65ca2c11a817ce39a6e91808cceef6fd', '0xc60d058f18f4d74441b2d9b239a3d4e7c4d93342', '0x8129c94d2f2b18fa4b63bd0a3b64ede4823374ae', '0xc8f455dada38ae63199a1edf162571bcc20560d4', '0x96d80fdec427117b5bed01bd24fb3c960487e872', '0x401f140584fcfbb02ff5ddcd4fa298b7ec0edb5a', '0x6169d055a1602c5f673b58029a501d41d8b2287b', '0xdbe1a101b489f64694f42a18c1ceeb3e39866c96', '0x22c759dfd7b84f7d3b53d8bb8c8df6383a9c27d1', '0xc30cf256dfc731193a4fe2b02c89bf1815ec70a5', '0x76a147d3ded227180fc5daa5c5523630c32ee4b6', '0x03a6dd5a1f31d3b8a0c6b05b3752c334203dd2d6', '0x0c2405c6475e0e6165a9a66d04a87e78fa0a79ff', '0xca84e7ac68420705e70eeefc39bef0deea27fad5', '0xe97b346214a58f8673025574768ef1f7ee10ed48', '0x97e85c3b844f1b7ed2fce4109214da84a518644a', '0x6b11e69c6967e0c52d39591a307fdf441363cf77', '0x6a2f3a8cfe01590487c6ac70314b11b7b88c6d17', '0x0e3a84b87098683e57fbf62443dc8944ecded2e3', '0xba0608e2ecd747e14eecc5187b08ca9e4ddca188', '0x6be496f3dcba4a00da511b6bb6fa3c78199771ec', '0xd6872559c10945ac77ded6e0e8a745173733d3bf', '0x60b28d601bc403b968acc930479ed639ee3f6eb6', '0x0ced32b3593cf725c3cdca1d1f98f9ada4b8ac4b', '0xa3c37ce9c82d1da1556ac74230cc2607e83e1cdc', '0x8b3a85b206b65bf6b5175dbaaecb7919993c3907', '0xdd73d1c21e31a92097813d84fb7894ce10b5ded5', '0xaa02d3d0c32ee3222ce9762d02747bfaf5119c4b', '0xbb9a742df9eb1dd63860f456f782a8d9bc6f6082', '0xe6ade88281cd978600d3b244f4b4c64a91abd198', '0xeafbfc76e54fbad22e3314008cc1b0d4fa8c1691', '0x60aea90f2aebb4fbfc82ac31f2e4a748d414ca77', '0xa74a461a963adc00a9d2b0e3c9e624ed457d36c4', '0x2de9468a7f93f8bb338c268cc0905966f64be478', '0x6c912eeea82ea00d193065d0b154f4b3511935fc', '0x146ddf707823387c0e764a719c9863624b86e749',
    '0xa7f13bc6f165a61ed8dde71cadea761540035aa6', '0x2cdf2c970cfb4efc48cd22a8e61ff77a2bbe948d', '0x0d1d6d6c9cd4a40b2d97fd2fccbeecb3426e42fb', '0x15d0cbd7c08a7d560e3a57ec1b1a7f3fc64bea5f', '0x242d7f4710666d8625bb8d836f7972856a72562b', '0x503514046121103d66337a867e23c19be8617b30', '0xd46c4edaae2067f5888f62f7b72118926296d859', '0x27427f09396d649f4405d4031f2ac10aec4e7c8d', '0xac9a41d5fae855415591707ffec4db5dc16c8643', '0xcafb353190611a012092bdc8cfaf9eb6d4d179cf', '0xebbda1c220363e0e15414bb5b6670f3888e547ef', '0x5b7a174d6e07dbf356bd547b809759f89672c657', '0x9835d944bf87061bc3b7457afe0ad32d826d118b', '0xa6ea7a5a7ef16d22bcd55534c5e890d779be7b43', '0x1278bd1dd6be20abc29bf7f20a99ce5519387156', '0xbe329b80d2491c3a0e2a631734397d401253e0dd', '0x7eac56933bdde9125e7d20f17edb6fe3a831c563', '0xcf57ec8b12a8a1ef149d4d95b7ec4743ba054483', '0x83fd8667a3fcb24fc4eeb266e0f88b6f40ae4923', '0x1cf7fccf87ceabfa832822ff81dad406ab870bed', '0x65d9dc9c6eceb77ccdc5c99ca634390e0798bee1', '0x75af8ef8030d699ac76dbc15d5d58b6d3a17809b', '0x84065bcdec65077833b237c17a1e86846df04edf', '0xafae0d357777d8865f066bc727aed785700dc5d1', '0x6420640fedfe78cd7cb8006a63ba3337847c7332', '0xe8906fccc707743c562a1633ee9750f206a66700', '0xaf0217def7116c50c80d9f97836ab7a6fa490eca', '0xd73c4db5d594125edbdc25b8aa01e76564d3da92', '0x13a6d208b3d45960ca6853a9cb8e9c7ed61e6ad9', '0xf8b196b3b4811aacea7c5c034568fcc7b0f5bbe9',
];

const getTimeStamp = () => {
    const now = new Date();
    return `${now.toISOString()}`;
};

const slowGasPrice = ethers.utils.parseUnits('0.000025', 'gwei');

const debaseAddresses = async () => {
    console.log(`[${getTimeStamp()}] Debasing addresses...`);
    const block = await provider.getBlock("latest");
    const baseFee = block.baseFeePerGas;

    const gasPrice = baseFee.mul(110).div(100);

    for (let address of addresses) {
        try {
            await tokenContract.debase(address, {
                gasPrice: gasPrice,
            });
            console.log(`Debase transaction successful for ${address}.`);
        } catch (error) {
            console.error(`${address} is on cooldown`);
        }
    }
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
        console.error(`${user} is on cooldown`);
    }
};

setInterval(debaseAddresses, 31 * 60 * 1000);

debaseAddresses();

vaultContract.on('Withdraw', (user, amount, tax) => {
    console.log(`[${getTimeStamp()}] Withdraw event detected. User: ${user}, Amount: ${amount}, Tax: ${tax}`);
    debaseUser(user);
});

console.log('Listening for Withdraw events...');

process.on('uncaughtException', function (err) {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', function (reason, promise) {
    console.error('Unhandled Rejection:', reason);
});
