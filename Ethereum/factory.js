/**
 * Author: Vinay Vasyani
 * Export the deployed SeedEtherFactory Contract to a react component so its available to other React Components. 
 */
import web3 from './web3';
import SeedEtherFactory from './build/SeedEtherFactory.json';

//const address = '0xf91b8586c7cB57dDC0F251016328a159c9a10e8d'; <--old factory
//const address = '0xc0E70d033559BE5224fB4E73A317624e331812F4';//<--- old factory
const address = '0x9A9f82B30D9740D7c02411A33f23530Ea2936ec3';

const instance = new web3.eth.Contract( 
                            JSON.parse(SeedEtherFactory.interface), 
                            address );

export default instance; 