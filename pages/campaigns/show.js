import React, {Component} from 'react'; 
import Layout from '../../components/Layout';
import Campaign from '../../Ethereum/campaign';
import { Card, Grid, GridColumn, Button } from 'semantic-ui-react';
import web3 from '../../Ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes'; //Makes children with onclick navigation to route


class CampaignShow extends Component { 

    static async getInitialProps(props) { 
        //Note: The props.query helps parse parts of URL. address variable comes from routes.js entry
        const campaign = Campaign(props.query.address);
        const summary = await campaign.methods.getSummary().call();
        /* console.log(summary);
          Note that return value is an actual object and not an array. Although we access values like an array summary[i]
          Result {
            '0': '100',
            '1': '0',
            '2': '0',
            '3': '0',
            '4': '0x06e02B72Cd2390Ed9423F8c329DE42be1Fe35647',
            '5': 'Raising Funds for building Crypto Cafe',
            '6': 'Customers will pay in Bitcoin or Ethereum. ' } 
         */

        
        return { 
            address : props.query.address,//to pass on to child component like Contribute Form
            minContribution : summary[0],
            balance : summary[1],
            requestsCount : summary[2], 
            numOfVoters : summary[3],
            manager : summary[4],
            campaignTitle : summary[5], 
            campaignDescription : summary[6],            
        }
    }

    renderCampaignDetailsOnCards() { 
        const { address, minContribution, balance, requestsCount, numOfVoters, 
                manager, campaignTitle, campaignDescription  }  = this.props;

        const items = [
            {
                header: manager,
                meta:'Address of Manager' ,
                description: 'Manager initiated this campaign and can create requests to withdraw money',
                style : { overflowWrap : 'break-word'}
            }, 
            {
                header: minContribution,
                meta : 'Minimum Contribution (wei)',
                description :  'You must contribute this wei at minimum to become approver on spending requests.  ',
                style : { overflowWrap : 'break-word'}
            },
            {
                header: requestsCount,
                meta : 'Number of Requests',
                description :  ' A request tries to withdraw money from the Campaign account. There has to be 51% votes on request to get approved',
                style : { overflowWrap : 'break-word'}
            },
            {
                header: numOfVoters,
                meta : 'Number of Approvers',
                description :  ' Number of people who have already contribtued to campaign',
                style : { overflowWrap : 'break-word'}
            },
            {
                header: web3.utils.fromWei( balance, 'ether') ,
                meta : 'Campaign Balance(Ether)',
                description :  ' This balance is how much money campaign has left to spend',
                style : { overflowWrap : 'break-word'}
            },
    ];

        return <Card.Group items = {items} />
    }

    render() { 
        return (
            <Layout>               
                <h3> {this.props.campaignTitle}</h3>
                <p>{this.props.campaignDescription} </p>
                <Grid>
                    <Grid.Row>
                        <GridColumn width={10}>
                            {this.renderCampaignDetailsOnCards()}                               
                        </GridColumn>

                        <GridColumn width={6}>
                             <ContributeForm address = {this.props.address} />
                        </GridColumn>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route = {`/campaigns/${this.props.address}/requests`}> 
                                <a><Button primary content="View Requests"/></a>
                            </Link>   
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default CampaignShow;