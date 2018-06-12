/********************************************************
 * Author : Vinay Vasyani
 * Outputs the solidity contracts to build folder into contract files
 ***************************************************** */

//NodeJS modules. 
const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

//folder path to store compiled contracts. Similar to bin directory. 
const buildFolPath = path.resolve(__dirname, 'build');
fs.removeSync(buildFolPath); //Removes directory with all contents. 

//Compile Campaign.sol and store in buildFolder. 
const campaignContractPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const sourceCode = fs.readFileSync(campaignContractPath, 'utf8');
const compileOutput = solc.compile(sourceCode,1).contracts;//json objects of keyvalue pairs.{ : Contract1, {assembly : ... ,  bytecode :...} .. }

//console.log(compileOutput);
//make sure to create build directory to save compiled Contracts into file. 
fs.ensureDirSync(buildFolPath);

//save compiled Contracts to file. Outputs are :Campaign and :SeedEtherFactory keys and assemblys as the value. 
for( let contract in compileOutput) { 
    
    fs.outputJsonSync( 
        path.resolve(buildFolPath, contract.replace(':','') + '.json'),
        compileOutput[contract]
    );

}