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
    '0x042fef60ad51f48c65e6106f9b950178910a3300', '0x455fd3ae52a8ab80f319a1bf912457aa8296695a', '0x287110f1c99551b377955b64a38a1b026aa9a35a', '0x2ac0c3f0d2eda7b24eff8012a70a03422c8d2b91', '0x8a49f5548f716dccd1db9dc345fb02da9d2c42c3', '0x2b574f753b9613029eabcf7cdb9d9b910d5ae311', '0xfbe353ec512fc1686d904465b66e3a93a67598c8', '0x05729e0e1bf3f9320e96247ab28ff79d0acb4b05', '0x05789c67f19404ec9fb3e8521579b6186ec4b3c9', '0x62d23ee20c5aa2b1d0f8f418414bafcef8a9aa1f', '0x52fd6fa754dfe88249dad4c7be106c46392a8c1d', '0x779768e8405eaf09dee8da356b1eb3bfdb0383e1', '0x22b6a0c71dedcef295423c17b84b08f46082ac1a', '0x745f0a7f065857670af71fc827e4557c64e679c9', '0xa3db0778b38398923867e60adf875325339bc374', '0xa02648567b588f6dbad0ed6713c0f74352bda1f4', '0x79b08024d35c054a6e9bbe513bed990c0039da98', '0xeb7790107ef32c7d54809ff28c04df61b1d40b46', '0x8f4acb8c705464fcfa72afcc147e05b7faa2f601', '0xe84f39d70b0f2c5fada69008a3803bce12286227', '0x5ce980d9eb0feecb7d3a8f60b9c4959ef271def5', '0x4727a60743ebf1b80109ceaf46e534091d6187c0', '0xa2c829b3521dd0b91de2a2833c86cf2cbdba1aea', '0x446504819a921736ef5dd034d2c9e45bb698fcef', '0xa35ae25d08b2242759a89166858abe86b8f544cf', '0x280fcde4b685c30c0ed124c34fcc4d58850f4c81', '0x208ee67ccb35202b626f2b3401b1c118b517ad7c', '0xf2870dde3e94663ce8c7aaf242ca20ce07c5d02b',
    '0x8806c1f851fb7a26af35171c0ec4ec2242bd723f', '0xe3970e13c208454e59e8fb96f8530de80554fc5d', '0xcf277f726f474f1fc060f0ea98e0c6d9189d20c8', '0x0f27a3c666cfcf076cec14def6b8da28e5c47a88', '0x5e39a6030fc48d52fdb729f55394002b26ffcf38', '0x9006b085b605d2a81772a2c3f1c365ce04c048a2', '0x3378f62f1d65aec04aad79acc34bd204f039d9a5', '0x5d64d14d2cf4fe5fe4e65b1c7e3d11e18d493091', '0x4ee2acf64a2c0db6a1da0a4b534b08f036d0da41', '0x5f04502b04eac2426ee731e1f29e84884d038084', '0x3e57efef507b4db7acfa2ee79ceca6b19e18d106', '0x69420a842c1769789ffa0d62ddb44036a304f3dd', '0x306d4c4f16e81bf9ad5b27ca32cf23c6ddc2da51', '0x6826727e5a46cd6b6cdacb71345e0569c73f5937', '0x145da5fddd81c9b62b58180351a9b6379c47f1aa', '0xbfc6215a9e6b79bff5be022445ec000b1989556f', '0x6150b4d7b46a9e7e72343e4b0bb4b9db64e6077f', '0x04bda42de3bc32abb00df46004204424d4cf8287', '0x2ed92a8d5508f538c4f2a413f091542a1e66416a', '0xe6de2f195aaa52df0bd7ab05dda5731dd34f96a3', '0xa6d28b0602edb03ed5010465569ef398a307fb6b', '0xb4cbc62a4615955bce9d09323956bcee8237aa8c', '0x77b33e600b1e101b9206db3c9258599e3738acd6', '0x92b774b7ce35b58eaf08962cdd4bdf15299d7c42', '0xf4319b7f94acf99ed27978797935189bd8c68648', '0x40db27b9d058900a483f06e1b016d77389f00737', '0x9a5757395d8eb504bf984aef9c57f931bfa2c38c', '0x0302adf2b750aa8c24b9c41b0fd4635add36a192', '0xbc0f97138a63ceb6546ef4b2f8186ae03f9a2a4d', '0x5f56755c0deab1322655e615818ecdbbc7bedbdd', '0x1cf7d64894d3c731d0701bcba7f706ad17369110', '0x3926642bb55a6ef5d4d30182bfd3aca97703bfb4', '0x4e3c9647e992a4e5944cd9bafee40021169069fd', '0x498b7b7ddb5e057e5d055c4e59f839dbd6e26ff4',
    '0x2616528437dc0dcf9195a1ad22e7d779ab0ced7f', '0x564539d2a4f73ff26ee573a73dfee83a8f9951b8', '0x273ebff3bda08d0699c3bbdd701dcc986d7e5f76', '0x3b9728bd65ca2c11a817ce39a6e91808cceef6fd', '0xc60d058f18f4d74441b2d9b239a3d4e7c4d93342', '0x8129c94d2f2b18fa4b63bd0a3b64ede4823374ae', '0xc8f455dada38ae63199a1edf162571bcc20560d4', '0x96d80fdec427117b5bed01bd24fb3c960487e872', '0x401f140584fcfbb02ff5ddcd4fa298b7ec0edb5a', '0x6169d055a1602c5f673b58029a501d41d8b2287b', '0x22c759dfd7b84f7d3b53d8bb8c8df6383a9c27d1', '0xca84e7ac68420705e70eeefc39bef0deea27fad5', '0xe97b346214a58f8673025574768ef1f7ee10ed48', '0x6b11e69c6967e0c52d39591a307fdf441363cf77', '0x6a2f3a8cfe01590487c6ac70314b11b7b88c6d17', '0xd6872559c10945ac77ded6e0e8a745173733d3bf', '0x6be496f3dcba4a00da511b6bb6fa3c78199771ec', '0x60b28d601bc403b968acc930479ed639ee3f6eb6', '0x0ced32b3593cf725c3cdca1d1f98f9ada4b8ac4b', '0xa3c37ce9c82d1da1556ac74230cc2607e83e1cdc', '0x8b3a85b206b65bf6b5175dbaaecb7919993c3907', '0xdd73d1c21e31a92097813d84fb7894ce10b5ded5', '0xbb9a742df9eb1dd63860f456f782a8d9bc6f6082', '0xeafbfc76e54fbad22e3314008cc1b0d4fa8c1691', '0xa74a461a963adc00a9d2b0e3c9e624ed457d36c4', '0x60aea90f2aebb4fbfc82ac31f2e4a748d414ca77', '0x2de9468a7f93f8bb338c268cc0905966f64be478', '0x6c912eeea82ea00d193065d0b154f4b3511935fc', '0x146ddf707823387c0e764a719c9863624b86e749', '0xa7f13bc6f165a61ed8dde71cadea761540035aa6',
    '0x0d1d6d6c9cd4a40b2d97fd2fccbeecb3426e42fb', '0x15d0cbd7c08a7d560e3a57ec1b1a7f3fc64bea5f', '0x242d7f4710666d8625bb8d836f7972856a72562b', '0xaa02d3d0c32ee3222ce9762d02747bfaf5119c4b', '0xd46c4edaae2067f5888f62f7b72118926296d859', '0xac9a41d5fae855415591707ffec4db5dc16c8643', '0x27427f09396d649f4405d4031f2ac10aec4e7c8d', '0xcafb353190611a012092bdc8cfaf9eb6d4d179cf', '0xebbda1c220363e0e15414bb5b6670f3888e547ef', '0x9835d944bf87061bc3b7457afe0ad32d826d118b', '0x1278bd1dd6be20abc29bf7f20a99ce5519387156', '0xa6ea7a5a7ef16d22bcd55534c5e890d779be7b43', '0x42c2df9d9c161cb79e0258b34f9f3cca733b2ce4', '0xbe329b80d2491c3a0e2a631734397d401253e0dd', '0x7eac56933bdde9125e7d20f17edb6fe3a831c563', '0xcf57ec8b12a8a1ef149d4d95b7ec4743ba054483', '0x83fd8667a3fcb24fc4eeb266e0f88b6f40ae4923', '0x75af8ef8030d699ac76dbc15d5d58b6d3a17809b', '0x65d9dc9c6eceb77ccdc5c99ca634390e0798bee1', '0xa597f1664badfbb186cde1927d38aca7a1f68a69', '0xafae0d357777d8865f066bc727aed785700dc5d1', '0x6420640fedfe78cd7cb8006a63ba3337847c7332', '0x654b76484ea847db97e43f9f1dcba4a7d120f36b', '0xf8b196b3b4811aacea7c5c034568fcc7b0f5bbe9', '0x1b32da8873b9a8d18d2ef35809665bcb79f9bef1', '0xb2746d60a3a460869024fa8fc89cc1bf965f3dfe', '0x4b28cda36a2d776ce076628439a01a3b920484dd', '0xcca4becd136f077009c6fbdfd5d10f629574ecd0',
    '0xab678f87ce9d6964744f3f45a4bd52c90aa7ff24', '0x2a3f8f8fe4b7d7060f84e1969bae3b573a9d0e5b', '0xa9d91181f4eeb40dfceebce3b95bb477aba93105', '0xe3b2ccd5fbb7e73992b3e9451090479478f98fa9', '0xfc4eaa4ac84d00f1c5854113581f881b42b4a745', '0x38061ca20b8edd121736139f0685c8ea9a9e6ecd', '0x14fc9f64d0b02635840c0ff076f7bbcc8e9376d6', '0x984ae05d9769255b4cb356d9f84212bf7bb1537c', '0xf06aca5f05ffa9bd0d080f40c4b62c36a607c3c7', '0xc0855f464261832aa43f1d9d9e1cc2aceef7c54b', '0x5e5fbec7afcc5a961ae3a4ee9f19ba78c9da9d0e', '0x3946de061e990be7bfecb9d540793eabaf18a44b', '0xd4cd4284a744a693d494a10b7600ff03dd4569c4', '0x1aa1d01ac8848fdfc4eee4252a6572dc3ff539bb', '0x85ff34ccdd3cb36a4553d57009371be35eb72870', '0xa73eb1de91eb7c7a75cfa4796aefbd8d53fb9275', '0x4db79d7a4fa66bb8bb0b6014712768f5fb1778a3', '0x95cb5cfecf30cc522fbb360dd6afc22f6d5123f8', '0x45660e0905536f0ca635f551e11474a6b2af8ce0', '0x1ccf73a8edbc7dc3063af94fdc3d4e37f7251ee9', '0x4ef6cb4fb44724eb8d8f1801d93479ab9cabef69', '0x5187a6290f251de6bdf9159af9c37cd4ac280788', '0x2852a6b37b25db0dc16391562a69a7ffaec845c0', '0x31ba7fbb25b37fc0dd2ebf1aaa8e4058ba801009', '0x2b0ddfe2b81c98856bcc28a5f024a23c5d663d86', '0x22c39cec4751948a8fb79b5e8eb490ca384554f4',
    '0x4310366ef7810a746a389c228b79ade3785dc7b1', '0xfee798db313617b2497a1518de1e6f4a86a15532', '0x808f3d20ac3b9517e30a4f2f924b90e017e9a027', '0x1467627cc8a1bb70b6e9c60620221377ce5b7eb7', '0x501f4860aad23ffa53992dca8316952e374eaeab', '0x595514c067a7c5f00acc526aaa195124ebda7bf0', '0xd3c8da6139835d53c4030c119ed115ce07f51317', '0xd777dadc4302574b8db41fe58b1d9063c604bb4f', '0x63c772fdcf943aa9a6925a66567db3cf91d792b4', '0xb45992ac3b561361bc00a5f0649fafc267ce5428', '0x12a51944e8349b8e70ed8e2d9bfbc88adb4a8f4e', '0x11e2eba910084989d820d55da7a459f95ccfd92f', '0x5b24c86ef94676d7755634a10b3c28502db849d2', '0xe7a5b8e2fd538dcb5e6b1204005968678c53ab4a', '0xe88edc2ffdaac827a130099e558a0eb1788eb514', '0xcc5ea2dce90adc97b4ea7f3e01b6cbe51a7de472', '0xb5a4a0bd3388b0512d3dcd056834271a73e0075f', '0xaf4b3c3a82f42e2227e5d80f4efcce729370d6ce', '0xa62c54ba5b2b5aa58f888c54f4d7da3d637a88bf', '0xb2dae2b045aa0787d6f330de1e29bea49fff306f', '0x69289086a5dbbf38058c9d1a54b4d336f56fe5ee', '0x692f6816c0903ea0e122ac5dc1ef14027d028278', '0x1dd4bc24869bf9e39f1ea1a6d8d078c8c3a9530e', '0x602dc1d22884e333fca32eb03105773c3b97b22b', '0x670f6f654925e7ff465f10816928cceb13436ef6', '0xe07825a841748b421eac8d9b1c8858b7bfee0af6', '0x0fe7452d32f566e138346df242cd76c59bf810d8', '0x4a263388fe86383a8933df1ad46cbd18a163b395', '0x6e4a03af9ff60e7a37d10faac9f37fde8e62db5c', '0x512aa9cee3643b7895124fc7b0582b2915278134', '0x95ef79f19dea10f94f18e22fe9621ea1bb25198c', '0x87153c509cb9e7da3b1c61912d06366dd04bfe71', '0x440bd537745701bdb7726c5c31a8526423941814', '0xe20203d03cfaaea1dc157ff727d27db331851ded', '0xa7fc0008afb4f7b7cfba98b4f26d8021270406f4', '0x0a352179a107122943f6e0d6d09638acccdb7fa5',
    '0xdadcd1378e2cd0983cc5e61caf0e9e161aff4b6b', '0x60a43b39f7cb8a1f12fcdebf6e0d7b939b05e67a', '0x0da5f7aa948275245db81eea25d092f67cbe5937', '0x6bed4d3195aa2ca38bf3a88eafa0ad2b6c17973d', '0xf6af27d1dea25f6e3838d10eb4a37ddd5209507a', '0x813df9e9496063e17357318d69dae274558d13c9', '0xbccb33aeaf45a95f366320c5469ee433c3ec752a', '0xe829e94109fed6e41585b75a12948bad50cbaa12', '0x1a5eb732271f84d55cb385b796ddac39c84ccdaa', '0xee468ccf66d52154caa3b512a33bf1dc47d96f72', '0x912c61308ad87c3863691144e578998293ec4b39', '0x0534c4185ad25e43d4cbe5bae10112824d79cab2', '0x5b8868302cced6b2541ebddecc9e6a966a69b51c', '0x294bb51db47778cf06eb9590efc554c89e4ddf4b', '0x8dc358d81d8c87bbc6a8e96bae9361599c34ec93', '0xc263b094db9cd027cb3176bc0decc96fd839c35e', '0xe5fe4412f281c21384439f60f3aba18ff334984f', '0xf30851e9c72749a6cdd940a64e1e3a311ca010a0', '0xde6d59a1bac947ca7d320859c8354b42d521cc87', '0xb618b47b564d49512c1b2fbe71f53ac012c9db8a', '0x3bb3384e2dbd32bb1f090604002a66838471d893', '0xb73efeb2ef6f4a5cc5d38109be9594aae01f5043', '0x3b8f18047e5f67567bbe7c682327fd372bbaee5c', '0xf94262a58388268079ff33d11c0c3d62045dee7c', '0xf49da06ab5ece9754b2dac760b8dabe3c605ae15', '0xa6534b16302c8c8c252fc9b9a1666e5d887428dc', '0xd92ff6a4d178e0b4060ade7a69f73c1b3c1dc3f8', '0xedd41a43e2fff8a9cd6a2d0b6000d97ddb72be6f', '0xfa4571bcba2bfdd82cc45d37b8163d2b29a6c9c5', '0x4f266f295bad85436ecea51e0ae2afe82b11553b',
    '0xd35d998022f90672a7382d3dcba045c5334cd2fa', '0x9e02bb2bbc1a05a1d4febd1f52adb40564876e7c', '0xfb20b1d8f046f1fcd52d3977061b725d428a13b3', '0xc9c586895d77102c8e7ab95a92685bd43ce039e0', '0xdd4b82486b606d70de0a1ad1a5446dd724fc793a', '0x85598a951bc7fcf6d8d66aa804cf9e1d294050af', '0xeb8b516234c7f63c8012f3e4032e42603eff9895', '0x4d07e010aff560de7870a85792e952f42ad7d6b7', '0xb1c95ac3fcfb2a21a79ba5f95cce0ff2237f1692', '0x9ee19889d7447a54319bb5c74a32585a3d228631', '0xdde0e4722e10180aae9963f8636a83fa5a61e296', '0x96940b319adec6d9548ac91730685605ed0bc7b4', '0x0a125744c59c90d00c79f635841c2401327d8891', '0xe94af4982f67b57ddffb3548062664f1294ef871', '0x056fe75eaabc301dc23a51140c989a7a4af02fd4', '0x9ad96fc95b72ca0ba0237cf803c6885e6e2aa58c', '0xb45a2dda996c32e93b8c47098e90ed0e7ab18e39', '0xf0ac737fe99d8abfd0e87d994c4e127b349b443e', '0xd069cccad6ac16e4a929c38b0309f992b0cdca47', '0x9315bfe685eaf454315892133d80de0e9696254c', '0x3b44a18d68c5a86feb1662338e55c5f52c9c1a56', '0x5b1eae42bc3245ac82b8a8b8cc04621bf8e59a79', '0x887dcdef06a8cb505bbdd8f42c6dec680c610605', '0x6e219b249469ec722db7cf3c323d8c24cffb849c', '0xe7a83f9f62f9427e9943440b97ee66bd51cac491', '0x0d38716f0fa7b1f1dee7301235f3349911159408', '0x48e8532b95cb160a442560960892830ac9a7f9b2', '0x1ea5ace0abae96ec92ad654b0222c0da234d24c4', '0xbae97465a16b159aacd3341d020313dd342a10c0', '0x78a4e338241277f4eddaa9ac38dedc874169c040', '0xde60b8d9cf8ec16c5ea4ab0131131cfa05e4b1ab', '0x3cbaa1e6bbf2a0cf6951d385807cf95a69664eba', '0x49c29ea7b2161e43dce046f9a4e6734d71ea2dc1', '0xc47c67e6a1f426c836da216a1324b8883c232ea4',
    '0x444087417e5ac7faf68caf31484c21badd306829', '0xa024c191c19636b85729f097582b7cc612726ebb', '0x598ab6ef3e3397a5265ee4f3466f1817bd6cafc5', '0xe91c6e51ac2ae67bf2099c822b2c19fe928b3f28', '0x87b57b7a28ff53f24e3a34e85632bbdd1ddee494', '0xa6c26b12e2ff3469b52c9b6e0b17ba6f3ce16820', '0x37e807b56e8e991af935e1cea967c3bc1be6b73b', '0x4f82e73edb06d29ff62c91ec8f5ff06571bdeb29', '0x3de1c18d4f05ebf536eed61c7a1f2dfc9338565e', '0xee8a30a9ccc972650bcf49eb430c0934a24fd671', '0x58f3bddd7404d5a54d24667a434361d5561f4133', '0xc30068848b62f85450ddabd68a6d9fc74014fa7f', '0x76afc25f3210bd44fa9b9112cfc3767bdab44ff4', '0xcd56977bf663c9a5006299e7077540bf0aab838d', '0x14d4909b41aae4364949f7d443c47adfa3086e0b', '0xe1bd78b3d0ca0ab92fe98f2d660d36712e9b39ee', '0x98042c45e57508bba29eb90162ca5865c54428a7', '0x38f5e5b4da37531a6e85161e337e0238bb27aa90', '0xad01c20d5886137e056775af56915de824c8fce5', '0xdbb8b86a1ceabe0943064ae62c6bed8094c1f838', '0xac3269a2a0704bde92e2a019c5b0e4f5fe323191', '0xf33388722bbb125ae55e5122ec4d64d37079482e', '0x0fabf023b032659195f9d8590affc257412bb5d6', '0x02efc651647ba3fbe8653bcc68c40f260fb95e84', '0x6faa7d4b7f63ebd067fd91ade87298ec04f312c0', '0xbf2f1aaf4283080c1295e4a44ef10e3a36f76a47',
    '0x852f88395e3f6d988efe1eec4c140e8e33699846', '0x11a22db15082231c05b80fb68c09428fb80eaacd', '0x9cf6637a0e74ca6c6999301a7883618c2206aec1', '0xe1dd341477f7a5a26815356dbd11b97fb5b4ccd7', '0x82c3a8a5f89554dd5029b5eda8d0277ebdeb4b29', '0xe856934cc0ec6c351c2dafc532b74ef28a4ae38f', '0x338e28af5bcad546da27b7dbe4a82bd07569ea79', '0x5d7be174597cd6d21801edbe929d5bfbf04f63a0', '0x45614e1bbd2a0498e4252aecebc6fd710bfbea2b', '0x878e9ff9e4354eff2bd4723ff98f83968d25c1a7',
    '0xc2c08692efc3c4dcc629118244ca6f02617aa126', '0xcf2deeb9da87327e63c873428dfb80b3e9b8c3e3', '0xf7a089df125d85000623aa23778c4db6d6ca4e91', '0xb8343021cc6c773bf9dd00850c09801f10dbb10c', '0x834cd95fb7fcb89bf4030c606d9b6732ed33279a', '0x1c7de7a22989c84a7d4be21c6570b5cda357a172', '0xd76ac025e5a9dd12fcee42f525c9b729b85df58b', '0x064814c093150de24cde8ee01fad1634d6ce4122', '0xd6516ccbba1a265742908ac6b3e90b55fa92692d', '0x7811b60612e946534ca965e1dc809c460ddaf3b7',
    '0xe8153e83e20b755c0a76646b84ae2ffa3ac932a1', '0xb068e9147cd770f970af5dbfca5cbb61dd05abce', '0x9b79b32805d07c3c4f50045be40a53bf09458d3c', '0x211e4b7e4e4bb827c9e10f94139e32788e507c1f', '0x0e086b28186662cf458400d093f25c914b9924ce', '0x299a42e204254cfa14298ded9a9b2f570fe805c2', '0x7bff12096409191a29760aabff1ff11a690cfe3a', '0xcd8c5a30e434351933de32a5b336ecd5a45f15dc',
    '0xf6789053ecd92fa29dbd3dd8ee553350192035f4', '0x19e8f0f4a73babfee77450acbffe683cb6eb8825', '0x45c7509a5e9bc8c839931f56f097dbc3ce5e1a6e', '0x961da3f96b27eb356239589bb022412168133ed2', '0x8e398e3d8b6d9ff90d54f86ff98a1d271af4c0ff', '0x8f167478610984ef4a69780c6b15eec4b8d2c7f7', '0x2e7cd7b71f5f6efb78f2154f115f7cded8b70e73', '0x80ebda07a4aa13eb6de7ca95dfd923e7eeb5c41d', '0xeb1e6e1aa73b1f5c2c4448461e6f1e29c8c92966', '0xa87dccdc8f445aabc1e7e179e573302da905b1a8'
];

const THRESHOLD = ethers.utils.parseEther('0.000005');

const getTimeStamp = () => {
    const now = new Date();
    return `${now.toISOString()}`;
};

const getBalance = async () => {
    return await wallet.getBalance();
};

const debaseAddresses = async () => {
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

                await tx.wait();
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
