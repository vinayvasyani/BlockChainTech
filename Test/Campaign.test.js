/******************************************
 * Author: Vinay Vasyani
 * Testing the Campain and SeedEtherFactory solidity contracts. 
 * Note that to test we use mocha and that entry is made in package.json file under Scripts variable. 
 */
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledCampaign = require('../Ethereum/build/Campaign.json');
const compiledFactory = require('../Ethereum/build/SeedEtherFactory.json');

let accounts;
let seedEtherFactoryContract;
let campaignContract; //actual contract. 
let campaignContractAddress;  // address where factory created the campaign. 

beforeEach( async () => { 

    accounts = await web3.eth.getAccounts();
    
    //Deploy factory contract on network. 
    seedEtherFactoryContract = await new web3.eth.Contract( JSON.parse( compiledFactory.interface ))
                .deploy({ data:compiledFactory.bytecode })
                .send({ from:accounts[0], gas:'3000000' });

    
    await seedEtherFactoryContract.methods.createCampaign('100', 'RandomTitle', 'RandomDescription').send({ 
        from : accounts[0],
        gas  : '1000000' 
     });

    //Fancy Syntax: method call returns array and first element is assigned to variable campaignAddress. 
    [campaignContractAddress] = await seedEtherFactoryContract.methods.getDeployedCampaigns().call(); 

    //Fetch the Campaign contract 
    campaignContract =  await new web3.eth.Contract( JSON.parse( compiledCampaign.interface ), 
                             campaignContractAddress );   
});

describe('Campaigns Test', () => {

    it('Factory and Campaign got created correctly', () => {
        assert.ok(seedEtherFactoryContract.options.address);        
        assert.ok(campaignContract.options.address);
    });

    it('marks caller as Campaign manager',async ()=>{
        const manager = await campaignContract.methods.manager().call();

        assert.equal(manager, accounts[0]);
    });

    it('allows others to contribute to a campaign', async () => {
        await campaignContract.methods.contribute().send({
            from: accounts[1], 
            value: '101'
        });

        const isContributor = await campaignContract.methods.voters(accounts[1]).call();
        assert(isContributor);
    });

    it('fails if contribute below minimum', async () => {

        try{
            await campaignContract.methods.contribute().send({
                from : accounts[2],
                value : '50'
            });
            assert(false);
        }
        catch (err) { 
            assert(err);
        }
        
    });

    it('allows manager to create spending request', async () => {
        /*
         Request memory newRequest = Request ({
            description : description, 
            recipient : recipient, 
            value : value,
            complete : false,
            yesVoteCount : 0
        });
         */
        const description = 'Buy Batteries';
        const recepient = accounts[9];
        const value = '1000';

        await campaignContract.methods.createRequest(description, recepient, value).send({
            from: accounts[0], 
            gas : '1000000'
        });


        const request = await campaignContract.methods.requests(0).call();

        assert.equal(request.description, description);

    });

    it('can finalize after votes to complete spending request', async () =>  { 
        
        //Contribute 10 ether to campaign. Account 0 created, Account 3 contributes.  
        await campaignContract.methods.contribute().send({
            from : accounts[3],
            value : web3.utils.toWei('10', 'ether')
        });

        //Create request to spend 5 ether and send it to account 8        
        await campaignContract.methods.createRequest('Buy Books', accounts[8], web3.utils.toWei('5', 'ether')).send({
            from: accounts[0], 
            gas : '1000000'
        });

        //Approve the first request
        await campaignContract.methods.approveRequest(0).send({
            from: accounts[3],
            gas :'1000000'
        });

        //Finalize request to issue the transfer 
        await campaignContract.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas : '1000000'
        });

        const request = await campaignContract.methods.requests(0).call();
        console.log(request.description);

        let balance = await web3.eth.getBalance(accounts[8]);
        balance = web3.utils.fromWei(balance, 'ether'); 
        balance = parseFloat(balance);
        console.log(balance);
        assert(balance > 104 ); 





    });
});



