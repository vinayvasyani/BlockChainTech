import React, {Component} from 'react';
import {Table, Button} from 'semantic-ui-react';
import web3 from '../Ethereum/web3';
import Campaign from '../Ethereum/campaign'

class RequestRow extends Component { 
    onApprove = async () => { 
        const accounts = await web3.eth.getAccounts(); 
        const campaign = Campaign(this.props.address);
        const requestIndex = this.props.id;
        await campaign.methods.approveRequest(requestIndex).send({
            from: accounts[0]
        });
    }
    onFinalize = async () => {
        const accounts = await web3.eth.getAccounts(); 
        const campaign = Campaign(this.props.address);
        const requestIndex = this.props.id;
        await campaign.methods.finalizeRequest(requestIndex).send({
            from: accounts[0]
        });
    }

    render() { 

        const { Row, Cell } = Table;
        const {id,  request,  numOfVoters } = this.props;
        const readyToFinalize = request.yesVoteCount > (numOfVoters /2);
        return (
            <Row disabled ={request.complete} positive ={readyToFinalize && !request.complete}> 
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{request.yesVoteCount}/{numOfVoters}</Cell>
                <Cell>
                    { request.complete ? null : (<Button color="green" basic onClick= {this.onApprove}>Approve</Button> ) }
                </Cell>
                <Cell>
                     { request.complete ? null : (<Button color="teal" basic onClick= {this.onFinalize}>Finalize</Button>  ) }                   
                </Cell>                
            </Row>
        );
    }
}

export default RequestRow;