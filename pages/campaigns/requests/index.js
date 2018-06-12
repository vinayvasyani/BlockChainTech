import React, {Component} from 'react';
import Layout from '../../../components/Layout';
import {Button, Table} from 'semantic-ui-react';
import {Link} from '../../../routes';
import Campaign from '../../../Ethereum/campaign'
import RequestRow from '../../../components/RequestRow'

class CampaignRequests extends Component { 

    static async getInitialProps(props) {  
        const address = props.query.address;
        const campaign = Campaign(address);
        const requestCount = await campaign.methods.getRequestsCount().call();       

        //Array.fill(n) returns array with n undefined elements. 
        //.map( (element,index) => return index ) will fill array with index values. 
        //Array.fill(5).map(element, index => index  ) will give output of [0,1,2,3,4]        
        const asyncPromisesArray =  Array(parseInt(requestCount)).fill().map( (element, index) => {
            return campaign.methods.requests(index).call();
        });

        //Promise.all() will return everything till all requests complete.
        const requests = await Promise.all( asyncPromisesArray);
        /* Output : [Result {
            '0': 'Buy Coffee Machine',
            '1': '0x7De7b28a221Ef795E8976e3B9E869538d77116fD',
            '2': '1000000000000000',
            '3': false,
            '4': '0',
            description: 'Buy Coffee Machine',
            recipient: '0x7De7b28a221Ef795E8976e3B9E869538d77116fD',
            value: '1000000000000000',
            complete: false,
            yesVoteCount: '0' } ] */

        
        const numOfVoters = await campaign.methods.numOfVoters().call();
        console.log('Request Count :' + requestCount)
        console.log('Num of Voters' + numOfVoters);
        return {
            address : props.query.address, 
            requests : requests,
            requestCount : requestCount,
            numOfVoters : numOfVoters
        }
    }
    
    renderRequestRows() { 
        console.log('Request Rows called. ')
        //React requires to pass key property whenever a list of components is being rendered. so we use index as key. 
        return this.props.requests.map( (request,index) => {
                return ( 
                    <RequestRow 
                            key = {index}
                            id = {index}
                            request = {request}
                            address = {this.props.address}
                            numOfVoters = {this.props.numOfVoters}
                    />
                );
        });
    }

    render() {        
        const { Header, Row, HeaderCell, Body } = Table; //ES 2015 shortcut to make properties Header = Table.Header and so on. 
        return (
            <Layout>
                <h3> Campaign Spending Requests </h3>
                <Link route = {`/campaigns/${this.props.address}/requests/new`}> 
                    <a> <Button primary floated="right" style = {{marginBottom : 10}}>Add Request</Button> </a>
                </Link>            
                
                <Table> 
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Request To</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Votes</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRequestRows()}
                    </Body>
                </Table>
                <div> Found {this.props.requestCount} requests </div>
            </Layout>
        );
    }    
}

export default CampaignRequests;