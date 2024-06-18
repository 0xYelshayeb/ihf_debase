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
    '0x042fef60ad51f48c65e6106f9b950178910a3300', '0x455fd3ae52a8ab80f319a1bf912457aa8296695a', '0x287110f1c99551b377955b64a38a1b026aa9a35a', '0x2ac0c3f0d2eda7b24eff8012a70a03422c8d2b91', '0x8a49f5548f716dccd1db9dc345fb02da9d2c42c3', '0x2b574f753b9613029eabcf7cdb9d9b910d5ae311', '0xfbe353ec512fc1686d904465b66e3a93a67598c8', '0x05789c67f19404ec9fb3e8521579b6186ec4b3c9', '0x52fd6fa754dfe88249dad4c7be106c46392a8c1d', '0x62d23ee20c5aa2b1d0f8f418414bafcef8a9aa1f', '0xa3db0778b38398923867e60adf875325339bc374', '0x503514046121103d66337a867e23c19be8617b30', '0x779768e8405eaf09dee8da356b1eb3bfdb0383e1', '0x22b6a0c71dedcef295423c17b84b08f46082ac1a', '0xa02648567b588f6dbad0ed6713c0f74352bda1f4', '0x79b08024d35c054a6e9bbe513bed990c0039da98', '0xe84f39d70b0f2c5fada69008a3803bce12286227', '0x8f4acb8c705464fcfa72afcc147e05b7faa2f601', '0xeb7790107ef32c7d54809ff28c04df61b1d40b46', '0x4727a60743ebf1b80109ceaf46e534091d6187c0', '0xa2c829b3521dd0b91de2a2833c86cf2cbdba1aea', '0x446504819a921736ef5dd034d2c9e45bb698fcef', '0x57b2e0a2b28bd6821f4ac95175487b98c4269203', '0xa35ae25d08b2242759a89166858abe86b8f544cf',
    '0x280fcde4b685c30c0ed124c34fcc4d58850f4c81', '0xe3b2ccd5fbb7e73992b3e9451090479478f98fa9', '0x208ee67ccb35202b626f2b3401b1c118b517ad7c', '0xf2870dde3e94663ce8c7aaf242ca20ce07c5d02b', '0x8806c1f851fb7a26af35171c0ec4ec2242bd723f', '0xe3970e13c208454e59e8fb96f8530de80554fc5d', '0xf4319b7f94acf99ed27978797935189bd8c68648', '0xcf277f726f474f1fc060f0ea98e0c6d9189d20c8', '0xb4cbc62a4615955bce9d09323956bcee8237aa8c', '0x77b33e600b1e101b9206db3c9258599e3738acd6', '0x0302adf2b750aa8c24b9c41b0fd4635add36a192', '0xe6de2f195aaa52df0bd7ab05dda5731dd34f96a3', '0x0f27a3c666cfcf076cec14def6b8da28e5c47a88', '0x5e39a6030fc48d52fdb729f55394002b26ffcf38', '0x40db27b9d058900a483f06e1b016d77389f00737', '0x9a5757395d8eb504bf984aef9c57f931bfa2c38c', '0xa6d28b0602edb03ed5010465569ef398a307fb6b', '0x9006b085b605d2a81772a2c3f1c365ce04c048a2', '0x3378f62f1d65aec04aad79acc34bd204f039d9a5', '0x45d07779bcd95c94d9e5465aaf262356775afe45', '0x2b4a661164015dd60b3124bec397d053d14cdb43', '0x2ed92a8d5508f538c4f2a413f091542a1e66416a', '0x92b774b7ce35b58eaf08962cdd4bdf15299d7c42', '0xce54ee39375577a68fac846f75a87ffbeaea2642', '0x5d64d14d2cf4fe5fe4e65b1c7e3d11e18d493091', '0x5f04502b04eac2426ee731e1f29e84884d038084', '0x3e57efef507b4db7acfa2ee79ceca6b19e18d106', '0x69420a842c1769789ffa0d62ddb44036a304f3dd', '0x6826727e5a46cd6b6cdacb71345e0569c73f5937', '0x306d4c4f16e81bf9ad5b27ca32cf23c6ddc2da51', '0x145da5fddd81c9b62b58180351a9b6379c47f1aa', '0xbfc6215a9e6b79bff5be022445ec000b1989556f', '0x04bda42de3bc32abb00df46004204424d4cf8287', '0x6150b4d7b46a9e7e72343e4b0bb4b9db64e6077f', '0xbc0f97138a63ceb6546ef4b2f8186ae03f9a2a4d', '0x5f56755c0deab1322655e615818ecdbbc7bedbdd', '0x1cf7d64894d3c731d0701bcba7f706ad17369110', '0x3926642bb55a6ef5d4d30182bfd3aca97703bfb4', '0x4e3c9647e992a4e5944cd9bafee40021169069fd', '0xf4c06a94799d7148b4c761ad17b52aa6254de8fa', '0x498b7b7ddb5e057e5d055c4e59f839dbd6e26ff4', '0x2616528437dc0dcf9195a1ad22e7d779ab0ced7f',
    '0x564539d2a4f73ff26ee573a73dfee83a8f9951b8', '0x273ebff3bda08d0699c3bbdd701dcc986d7e5f76', '0x3b9728bd65ca2c11a817ce39a6e91808cceef6fd', '0xc60d058f18f4d74441b2d9b239a3d4e7c4d93342', '0x8129c94d2f2b18fa4b63bd0a3b64ede4823374ae', '0xc8f455dada38ae63199a1edf162571bcc20560d4', '0x96d80fdec427117b5bed01bd24fb3c960487e872', '0x401f140584fcfbb02ff5ddcd4fa298b7ec0edb5a', '0x6169d055a1602c5f673b58029a501d41d8b2287b', '0x22c759dfd7b84f7d3b53d8bb8c8df6383a9c27d1', '0x76a147d3ded227180fc5daa5c5523630c32ee4b6', '0xca84e7ac68420705e70eeefc39bef0deea27fad5', '0xe97b346214a58f8673025574768ef1f7ee10ed48', '0x97e85c3b844f1b7ed2fce4109214da84a518644a', '0x6b11e69c6967e0c52d39591a307fdf441363cf77', '0x6a2f3a8cfe01590487c6ac70314b11b7b88c6d17', '0xba0608e2ecd747e14eecc5187b08ca9e4ddca188', '0x6be496f3dcba4a00da511b6bb6fa3c78199771ec', '0xd6872559c10945ac77ded6e0e8a745173733d3bf', '0x60b28d601bc403b968acc930479ed639ee3f6eb6', '0x0ced32b3593cf725c3cdca1d1f98f9ada4b8ac4b', '0xa3c37ce9c82d1da1556ac74230cc2607e83e1cdc', '0x8b3a85b206b65bf6b5175dbaaecb7919993c3907', '0xdd73d1c21e31a92097813d84fb7894ce10b5ded5', '0xaa02d3d0c32ee3222ce9762d02747bfaf5119c4b', '0xbb9a742df9eb1dd63860f456f782a8d9bc6f6082', '0xeafbfc76e54fbad22e3314008cc1b0d4fa8c1691', '0xa74a461a963adc00a9d2b0e3c9e624ed457d36c4', '0x60aea90f2aebb4fbfc82ac31f2e4a748d414ca77', '0x2de9468a7f93f8bb338c268cc0905966f64be478', '0x6c912eeea82ea00d193065d0b154f4b3511935fc', '0x146ddf707823387c0e764a719c9863624b86e749', '0xa7f13bc6f165a61ed8dde71cadea761540035aa6', '0x2cdf2c970cfb4efc48cd22a8e61ff77a2bbe948d', '0x0d1d6d6c9cd4a40b2d97fd2fccbeecb3426e42fb', '0x15d0cbd7c08a7d560e3a57ec1b1a7f3fc64bea5f', '0x242d7f4710666d8625bb8d836f7972856a72562b', '0xd46c4edaae2067f5888f62f7b72118926296d859', '0xac9a41d5fae855415591707ffec4db5dc16c8643', '0x27427f09396d649f4405d4031f2ac10aec4e7c8d',
    '0xcafb353190611a012092bdc8cfaf9eb6d4d179cf', '0xebbda1c220363e0e15414bb5b6670f3888e547ef', '0x9835d944bf87061bc3b7457afe0ad32d826d118b', '0xa6ea7a5a7ef16d22bcd55534c5e890d779be7b43', '0x1278bd1dd6be20abc29bf7f20a99ce5519387156', '0xbe329b80d2491c3a0e2a631734397d401253e0dd', '0x7eac56933bdde9125e7d20f17edb6fe3a831c563', '0xcf57ec8b12a8a1ef149d4d95b7ec4743ba054483', '0x83fd8667a3fcb24fc4eeb266e0f88b6f40ae4923', '0x75af8ef8030d699ac76dbc15d5d58b6d3a17809b', '0x65d9dc9c6eceb77ccdc5c99ca634390e0798bee1', '0x84065bcdec65077833b237c17a1e86846df04edf', '0xafae0d357777d8865f066bc727aed785700dc5d1', '0x6420640fedfe78cd7cb8006a63ba3337847c7332', '0xf8b196b3b4811aacea7c5c034568fcc7b0f5bbe9', '0xc02bfc8c96477d82ae78d3212b802c4bfc820f90', '0x1b32da8873b9a8d18d2ef35809665bcb79f9bef1', '0xb2746d60a3a460869024fa8fc89cc1bf965f3dfe', '0xeacebecc08d03ab4d0cfc8a4b0432f5699b0fecb', '0x4b28cda36a2d776ce076628439a01a3b920484dd', '0xcca4becd136f077009c6fbdfd5d10f629574ecd0', '0x88f7c81f8103dcb19abc31b0e42d972911498ba3', '0xc0012d85a62d1962f11afb583d8f2b8d36af1e3d', '0x3a6d0024696aa910c7e5d751549ba650bc0b8c98', '0x48ee2de00c4c9f8c46780dce8ef720bd0c3e7dcf', '0xab678f87ce9d6964744f3f45a4bd52c90aa7ff24', '0xa9d91181f4eeb40dfceebce3b95bb477aba93105', '0x38061ca20b8edd121736139f0685c8ea9a9e6ecd', '0x14fc9f64d0b02635840c0ff076f7bbcc8e9376d6', '0x984ae05d9769255b4cb356d9f84212bf7bb1537c', '0xf06aca5f05ffa9bd0d080f40c4b62c36a607c3c7', '0xc0855f464261832aa43f1d9d9e1cc2aceef7c54b', '0x6af14adaa395f010d21c04fad9e4c3f214dc6353', '0x5e5fbec7afcc5a961ae3a4ee9f19ba78c9da9d0e', '0x3946de061e990be7bfecb9d540793eabaf18a44b', '0xd4cd4284a744a693d494a10b7600ff03dd4569c4', '0x85ff34ccdd3cb36a4553d57009371be35eb72870', '0xa73eb1de91eb7c7a75cfa4796aefbd8d53fb9275', '0x4db79d7a4fa66bb8bb0b6014712768f5fb1778a3', '0x95cb5cfecf30cc522fbb360dd6afc22f6d5123f8', '0x45660e0905536f0ca635f551e11474a6b2af8ce0', '0x1ccf73a8edbc7dc3063af94fdc3d4e37f7251ee9', '0x1505033412a602e8f27d2ee8f3431551bb27cb7a', '0x4ef6cb4fb44724eb8d8f1801d93479ab9cabef69', '0x5187a6290f251de6bdf9159af9c37cd4ac280788', '0x62ddc6d522531b3be598b5cd8aa4748d0adaedb1',
    '0x2852a6b37b25db0dc16391562a69a7ffaec845c0', '0x31ba7fbb25b37fc0dd2ebf1aaa8e4058ba801009', '0x2b0ddfe2b81c98856bcc28a5f024a23c5d663d86', '0xfee798db313617b2497a1518de1e6f4a86a15532', '0x808f3d20ac3b9517e30a4f2f924b90e017e9a027', '0x1467627cc8a1bb70b6e9c60620221377ce5b7eb7', '0x501f4860aad23ffa53992dca8316952e374eaeab', '0xd3c8da6139835d53c4030c119ed115ce07f51317', '0xd777dadc4302574b8db41fe58b1d9063c604bb4f', '0x63c772fdcf943aa9a6925a66567db3cf91d792b4', '0xb45992ac3b561361bc00a5f0649fafc267ce5428', '0xcc5ea2dce90adc97b4ea7f3e01b6cbe51a7de472', '0x12a51944e8349b8e70ed8e2d9bfbc88adb4a8f4e', '0xaf4b3c3a82f42e2227e5d80f4efcce729370d6ce', '0xa62c54ba5b2b5aa58f888c54f4d7da3d637a88bf', '0xcc0d56c6cdc2677343ddc7ae63ba801334869051', '0x69289086a5dbbf38058c9d1a54b4d336f56fe5ee', '0x692f6816c0903ea0e122ac5dc1ef14027d028278', '0x96cf0850929c9668f3ab861acddb33e78f51a2b4', '0x1dd4bc24869bf9e39f1ea1a6d8d078c8c3a9530e', '0x602dc1d22884e333fca32eb03105773c3b97b22b', '0x670f6f654925e7ff465f10816928cceb13436ef6', '0xe07825a841748b421eac8d9b1c8858b7bfee0af6', '0x0fe7452d32f566e138346df242cd76c59bf810d8', '0x4ee2acf64a2c0db6a1da0a4b534b08f036d0da41', '0x4a263388fe86383a8933df1ad46cbd18a163b395', '0x6e4a03af9ff60e7a37d10faac9f37fde8e62db5c', '0x0b41078fe96ad555b13eed39f30d2c7d264fdaf5', '0xf252bd7bbb3059efe173f9ba9cee1e7157db0662', '0x95ef79f19dea10f94f18e22fe9621ea1bb25198c', '0x159c143ef5a519d79ca308cf33b25684ee8b5395', '0xe20203d03cfaaea1dc157ff727d27db331851ded',
    '0xa7fc0008afb4f7b7cfba98b4f26d8021270406f4', '0x87153c509cb9e7da3b1c61912d06366dd04bfe71',];

const getTimeStamp = () => {
    const now = new Date();
    return `${now.toISOString()}`;
};

const debaseAddresses = async () => {
    console.log(`[${getTimeStamp()}] Debasing addresses...`);
    const block = await provider.getBlock("latest");
    const baseFee = block.baseFeePerGas;

    const gasPrice = baseFee.mul(110).div(100);
    let amount = 0;

    for (let address of addresses) {
        try {
            await tokenContract.debase(address, {
                gasPrice: gasPrice,
            });
            console.log(`Debase transaction successful for ${address}.`);
            amount++;
        } catch (error) {
            console.error(`${address} is on cooldown at ${getTimeStamp()}`);
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

setInterval(debaseAddresses, 31.2 * 60 * 1000);

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
