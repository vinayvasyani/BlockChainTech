/**
 * Author: Vinay Vasyani
 * Fetch the deployed Campaign Contract and export to a react component so its available to other React Components. 
 */

import web3 from './web3';
import Campaign from './build/Campaign.json';

export default (address) => {
    const campaign = new web3.eth.Contract(
                            JSON.parse(Campaign.interface),
                            address);
    return campaign;
};