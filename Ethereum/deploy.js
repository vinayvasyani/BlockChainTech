/********************************************************
 * Author : Vinay Vasyani
 * Deploy the SeedEtherFactoryContract to Rinkbey Test Network. 
 ***************************************************** */
const HDWalletProvider = require('truffle-hdwallet-provider'); 
const Web3 = require('web3');

const SeedEtherFactoryContract = require('./build/SeedEtherFactory.json');
const interface = SeedEtherFactoryContract.interface;
const bytecode = SeedEtherFactoryContract.bytecode;


//First argument is to give seed of the account that has some ether. 
//Second is giving the api key of Infura that will be used to connect to one of the Rinkebey nodes
const provider = new HDWalletProvider(
    'jungle zero near way reunion town maximum explain month share until stumble', 
    'https://rinkeby.infura.io/eKeydAXrcs4o71aEBPEA'
);

//Inject provider into Web3 so it can communicate with the Rinkbey network. 
const web3 = new Web3(provider);

//Deployment Setup
const deploy  = async () => {
    //Get the list of Etherem accounts using web3
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    //deploy contract to Rinkbey network. 
    const contractInstance = await new web3.eth.Contract(JSON.parse(interface))
                            .deploy({ 
                                data: '0x' + bytecode 
                                })
                            .send({ 
                                gas : '3000000', 
                                gasPrice: web3.utils.toWei('2', 'gwei'),
                                from: accounts[0] 
                                })
                                .catch(err => console.log('Contract NOT deployed ', err));
                                
    
    //0xf91b8586c7cB57dDC0F251016328a159c9a10e8d <--Deployed
    console.log('Contract successfully deploy to address:', contractInstance.options.address);
    console.log(interface);
    
};

deploy();