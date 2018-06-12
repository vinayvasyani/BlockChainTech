pragma solidity ^0.4.17;

contract SeedEtherFactory {
    
    address[] public deployedCampaigns;
    
    function createCampaign( uint minContribution, string campaignTitle, string campaignDescription ) public {
        //Note creating new contract in a contract deploys automatically on blockchain and returns address
        address newCampaign = new Campaign(minContribution, msg.sender, campaignTitle, campaignDescription );
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns(address[]) { 
        return deployedCampaigns;
    }
}

contract Campaign { 
    
    //struct type to store Spending Request and voting details. 
    struct Request {
        string description;
        address recipient;
        uint value;
        bool complete;//finalized or not.
        uint yesVoteCount;
                
        //Note: solidity doesnt store keys. Its only hashed and looked up. So any random address will return false. 
        mapping(address=> bool) votes; //Mapping to store only YES VOTES
    } 
    
    Request[] public requests;//Campaign creators create spending requests. 
    address public manager;//Campaign creator
    string public campaignTitle;//Title
    string public campaignDescription;//Campaign about
    mapping(address =>bool) public voters;//contributors 
    uint public numOfVoters;
    uint public minContribution;//min individual contribution to become voter/approver in the Campaign 
    
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    constructor (uint minimumContribution, address creator, string title, string description) { 
        minContribution = minimumContribution;
        manager = creator;
        campaignTitle = title;
        campaignDescription = description;
    }
    
    function contribute() public payable {
        require(msg.value > minContribution);
        voters[msg.sender] = true;
        numOfVoters++;
    }
    
    function createRequest(string description,address recipient, uint value)  public restricted {
        
        Request memory newRequest = Request ({
            description : description, 
            recipient : recipient, 
            value : value,
            complete : false,
            yesVoteCount : 0
        });
        
        requests.push(newRequest);
    }
    //Method to vote on request.     
    function approveRequest(uint reqListIndex) public {
        
        Request storage request = requests[reqListIndex];
        
        //Only contributors to Campaign are allowed to approve or vote. 
        require(voters[msg.sender]);
        bool notVotedBefore = !request.votes[msg.sender];
        require(notVotedBefore);
        
        //Add to votes
        request.votes[msg.sender] = true;
        request.yesVoteCount++;
    }
    
    function finalizeRequest(uint reqListIndex) public restricted { 
        Request storage request = requests[reqListIndex];
        //Request should have enough votes and not finalized already. 
        require(!request.complete);
        require(request.yesVoteCount > numOfVoters/2);
        
        //Transfer funds and complete request. 
        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view 
        returns (uint, uint, uint, uint, address, string, string ) {        
        
        return (
            minContribution,
            this.balance, 
            requests.length,
            numOfVoters,
            manager,
            campaignTitle, 
            campaignDescription
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
        
}
