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
    '0x595514c067a7c5f00acc526aaa195124ebda7bf0', '0xd3c8da6139835d53c4030c119ed115ce07f51317', '0xd777dadc4302574b8db41fe58b1d9063c604bb4f', '0x63c772fdcf943aa9a6925a66567db3cf91d792b4', '0xb45992ac3b561361bc00a5f0649fafc267ce5428', '0x11e2eba910084989d820d55da7a459f95ccfd92f', '0x5b24c86ef94676d7755634a10b3c28502db849d2', '0xe7a5b8e2fd538dcb5e6b1204005968678c53ab4a', '0xcc5ea2dce90adc97b4ea7f3e01b6cbe51a7de472', '0xe88edc2ffdaac827a130099e558a0eb1788eb514', '0x12a51944e8349b8e70ed8e2d9bfbc88adb4a8f4e', '0xb5a4a0bd3388b0512d3dcd056834271a73e0075f', '0xaf4b3c3a82f42e2227e5d80f4efcce729370d6ce', '0xa62c54ba5b2b5aa58f888c54f4d7da3d637a88bf', '0x69289086a5dbbf38058c9d1a54b4d336f56fe5ee', '0x692f6816c0903ea0e122ac5dc1ef14027d028278', '0x96cf0850929c9668f3ab861acddb33e78f51a2b4', '0xaa02d3d0c32ee3222ce9762d02747bfaf5119c4b', '0x1dd4bc24869bf9e39f1ea1a6d8d078c8c3a9530e', '0x602dc1d22884e333fca32eb03105773c3b97b22b', '0x670f6f654925e7ff465f10816928cceb13436ef6', '0xe07825a841748b421eac8d9b1c8858b7bfee0af6', '0x4ee2acf64a2c0db6a1da0a4b534b08f036d0da41', '0x0fe7452d32f566e138346df242cd76c59bf810d8', '0x4a263388fe86383a8933df1ad46cbd18a163b395', '0x6e4a03af9ff60e7a37d10faac9f37fde8e62db5c', '0x95ef79f19dea10f94f18e22fe9621ea1bb25198c', '0x159c143ef5a519d79ca308cf33b25684ee8b5395',
    '0x440bd537745701bdb7726c5c31a8526423941814', '0xe20203d03cfaaea1dc157ff727d27db331851ded', '0x87153c509cb9e7da3b1c61912d06366dd04bfe71', '0xa7fc0008afb4f7b7cfba98b4f26d8021270406f4', '0x0a352179a107122943f6e0d6d09638acccdb7fa5', '0xdadcd1378e2cd0983cc5e61caf0e9e161aff4b6b', '0x60a43b39f7cb8a1f12fcdebf6e0d7b939b05e67a', '0x0da5f7aa948275245db81eea25d092f67cbe5937', '0xa2b8383a0a31e0cf1f20be582535742d8dea1d4d', '0x6bed4d3195aa2ca38bf3a88eafa0ad2b6c17973d', '0xf6af27d1dea25f6e3838d10eb4a37ddd5209507a', '0x813df9e9496063e17357318d69dae274558d13c9', '0xbccb33aeaf45a95f366320c5469ee433c3ec752a', '0xe829e94109fed6e41585b75a12948bad50cbaa12', '0xee468ccf66d52154caa3b512a33bf1dc47d96f72', '0x1a5eb732271f84d55cb385b796ddac39c84ccdaa', '0x912c61308ad87c3863691144e578998293ec4b39', '0xb1c95ac3fcfb2a21a79ba5f95cce0ff2237f1692', '0x2fa7dedc227cfdaaed1acd78501a9604ab501e39', '0x382ffce2287252f930e1c8dc9328dac5bf282ba1', '0x0534c4185ad25e43d4cbe5bae10112824d79cab2', '0x5b8868302cced6b2541ebddecc9e6a966a69b51c', '0x294bb51db47778cf06eb9590efc554c89e4ddf4b', '0xc263b094db9cd027cb3176bc0decc96fd839c35e', '0x6d1b0721a5564e0e6984aa74165979771ed00521', '0xe5fe4412f281c21384439f60f3aba18ff334984f', '0xde6d59a1bac947ca7d320859c8354b42d521cc87', '0xb618b47b564d49512c1b2fbe71f53ac012c9db8a', '0x3bb3384e2dbd32bb1f090604002a66838471d893', '0xb73efeb2ef6f4a5cc5d38109be9594aae01f5043', '0x3b8f18047e5f67567bbe7c682327fd372bbaee5c', '0xf94262a58388268079ff33d11c0c3d62045dee7c', '0xf49da06ab5ece9754b2dac760b8dabe3c605ae15', '0xa47ac78ead59957b1d15b473d4f183d8e3038756', '0xa6534b16302c8c8c252fc9b9a1666e5d887428dc', '0x37e75e1b716026b12086790b1db1fa8c6fa1a583', '0xd92ff6a4d178e0b4060ade7a69f73c1b3c1dc3f8', '0xedd41a43e2fff8a9cd6a2d0b6000d97ddb72be6f', '0xfa4571bcba2bfdd82cc45d37b8163d2b29a6c9c5', '0xce98bdbaa386c2ae85a1967cef2519feee32c97f', '0xeabffa04256eb2eebeaf8753f2a97288a28dbf40', '0x4f266f295bad85436ecea51e0ae2afe82b11553b', '0x5b4e866bba2f552193abdd444f582f0808a91392', '0xd35d998022f90672a7382d3dcba045c5334cd2fa', '0x9e02bb2bbc1a05a1d4febd1f52adb40564876e7c', '0xfb20b1d8f046f1fcd52d3977061b725d428a13b3', '0xc9c586895d77102c8e7ab95a92685bd43ce039e0', '0xdd4b82486b606d70de0a1ad1a5446dd724fc793a',
    '0x85598a951bc7fcf6d8d66aa804cf9e1d294050af', '0xeb8b516234c7f63c8012f3e4032e42603eff9895', '0x4d07e010aff560de7870a85792e952f42ad7d6b7', '0x9ee19889d7447a54319bb5c74a32585a3d228631', '0xdde0e4722e10180aae9963f8636a83fa5a61e296', '0x0a125744c59c90d00c79f635841c2401327d8891', '0xd23194e5985a23eb3c17ff03137d1b084dd75854', '0xe94af4982f67b57ddffb3548062664f1294ef871', '0x056fe75eaabc301dc23a51140c989a7a4af02fd4', '0x9ad96fc95b72ca0ba0237cf803c6885e6e2aa58c', '0xb45a2dda996c32e93b8c47098e90ed0e7ab18e39', '0xf0ac737fe99d8abfd0e87d994c4e127b349b443e',
    '0xd069cccad6ac16e4a929c38b0309f992b0cdca47', '0x52cf1881fdd2088e6c9a5aaab3ac7f6ab1d841dd', '0x7644e55de551555ad771439a67a1228df4da49b5', '0x9315bfe685eaf454315892133d80de0e9696254c', '0x3b44a18d68c5a86feb1662338e55c5f52c9c1a56', '0x5b1eae42bc3245ac82b8a8b8cc04621bf8e59a79', '0x887dcdef06a8cb505bbdd8f42c6dec680c610605', '0x6e219b249469ec722db7cf3c323d8c24cffb849c', '0xe7a83f9f62f9427e9943440b97ee66bd51cac491', '0x0d38716f0fa7b1f1dee7301235f3349911159408', '0x63dae83f3ca2a69df97ed193049b01890de499c6', '0x48e8532b95cb160a442560960892830ac9a7f9b2', '0x1ea5ace0abae96ec92ad654b0222c0da234d24c4', '0xbae97465a16b159aacd3341d020313dd342a10c0', '0x78a4e338241277f4eddaa9ac38dedc874169c040', '0xde60b8d9cf8ec16c5ea4ab0131131cfa05e4b1ab', '0x3cbaa1e6bbf2a0cf6951d385807cf95a69664eba', '0x85ecb968aac86e41113e0561ee6b6cb464a1ff3e', '0x49c29ea7b2161e43dce046f9a4e6734d71ea2dc1', '0xc47c67e6a1f426c836da216a1324b8883c232ea4', '0x444087417e5ac7faf68caf31484c21badd306829', '0xa024c191c19636b85729f097582b7cc612726ebb', '0x598ab6ef3e3397a5265ee4f3466f1817bd6cafc5', '0xe91c6e51ac2ae67bf2099c822b2c19fe928b3f28', '0x2eeef6cef781cdc327123f8596e93740e60fd20d', '0x87b57b7a28ff53f24e3a34e85632bbdd1ddee494', '0xa6c26b12e2ff3469b52c9b6e0b17ba6f3ce16820', '0x5c6a6bebd3db91927e5410f7c9a62a2c35397c20', '0x4f82e73edb06d29ff62c91ec8f5ff06571bdeb29', '0x3de1c18d4f05ebf536eed61c7a1f2dfc9338565e', '0xee8a30a9ccc972650bcf49eb430c0934a24fd671', '0x58f3bddd7404d5a54d24667a434361d5561f4133', '0xc30068848b62f85450ddabd68a6d9fc74014fa7f', '0x9ccceb986e087141e629305f8e31e27e2a7b9696', '0x76afc25f3210bd44fa9b9112cfc3767bdab44ff4', '0xee14eca1b366ce3f6e287d3a3d7d0f3f76c926f7', '0x87d281f619d8cfe0802592a770abd70985da5455', '0xcd56977bf663c9a5006299e7077540bf0aab838d', '0x14d4909b41aae4364949f7d443c47adfa3086e0b', '0xe98110d5398cb76b7a24f764beba59056d2b1c61', '0xe1bd78b3d0ca0ab92fe98f2d660d36712e9b39ee', '0x98042c45e57508bba29eb90162ca5865c54428a7', '0x38f5e5b4da37531a6e85161e337e0238bb27aa90', '0xad01c20d5886137e056775af56915de824c8fce5', '0x2fd9d1c53e5ab922af9f203ca2758bc661cf9b1d', '0x211e4b7e4e4bb827c9e10f94139e32788e507c1f', '0xac3269a2a0704bde92e2a019c5b0e4f5fe323191', '0x0fabf023b032659195f9d8590affc257412bb5d6', '0x02efc651647ba3fbe8653bcc68c40f260fb95e84', '0x6faa7d4b7f63ebd067fd91ade87298ec04f312c0'
];

const getTimeStamp = () => {
    const now = new Date();
    return `${now.toISOString()}`;
};

const debaseAddresses = async () => {
    console.log(`[${getTimeStamp()}] Debasing addresses...`);
    const block = await provider.getBlock("latest");
    const baseFee = block.baseFeePerGas;

    const gasPrice = baseFee.mul(112).div(100);
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
        //wait 3.5s between transactions
        await new Promise((resolve) => setTimeout(resolve, 3500));
    }
    console.log(`[${getTimeStamp()}] ${amount} addresses debased.`);
};

const debaseUser = async (user) => {
    const block = await provider.getBlock("latest");
    const baseFee = block.baseFeePerGas;

    const gasPrice = baseFee.mul(112).div(100);
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
