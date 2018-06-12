/**
 * Author: Vinay Vasyani
 * Export the metamask web3 to a component so its accessible by other components. 
 */
import Web3 from 'web3'; 

/**
 * NextJs runs the pages on server side, creates HTML and then serves it to user. 
 * Therefore, when it runs on server , metamask is not available. Just doing window.web3.provider will return window undefined. 
 * Thus we check if we are running this JS in browser vs server. 
 */


let web3;
if (typeof window !== 'undefined' &&
    typeof window.web3 != 'undefined' ) {
    //We are in browser


    //Note : Metamask injects its own web3 lib into our webpages. 
    //We want to wrangle provider thats inside metamask's web3 into our instance. 
    // window.web3 is Metamasks web3. CurrentProvider is what metamask uses to connect to Rinkeby network. 
    //We need metamasks provider because it hosts our public and private keys thats holding ether. 
    const metamaskWeb3 = window.web3;
    web3 = new Web3(metamaskWeb3.currentProvider);

} else {
    //We are in server *OR user is not running metamask.
    //https://rinkeby.infura.io/eKeydAXrcs4o71aEBPEA'

    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/eKeydAXrcs4o71aEBPEA'
    )
    web3 = new Web3(provider);
}


export default web3;