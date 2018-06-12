/*
 *Author : Vinay Vasyani 
 * Page to get list of Campaigns from the Rinkbey test network and show it on page. 
 */
import React, {Component} from 'react'; 
import { Card, Button } from 'semantic-ui-react';
import factory from '../Ethereum/factory';
import Campaign from '../Ethereum/campaign';
import Layout from '../components/Layout';
import { Link } from '../routes'; //Makes children with onclick navigation to route


class CampaignList extends Component {
    /*Note: We would fetch data in componentDidMount  if we were just using React.
    NextJs uses getInitialProps and provides to components through this.props. */
    // static async getCampaign(address) { 

    //     const campaign = Campaign(address);        
    //     const summary = await campaign.methods.getSummary().call();
    //     return { 
    //         address : address,               
    //         campaignTitle : summary[5], 
    //         campaignDescription : summary[6]
    //     };  
    // }
    
    static async getInitialProps() {        
        const campaignsAddressList = await factory.methods.getDeployedCampaigns().call();
        const campaigns = [];
        for(var i = 0; i < campaignsAddressList.length; i++)
        {
            const address = campaignsAddressList[i];
            const campaign = Campaign(address);
            const summary = await campaign.methods.getSummary().call();
            console.log(summary);
            campaigns.push({
                    address: address,
                    campaignTitle: summary[5],
                    campaignDescription: summary[6]
                }
            );
        }
        return { campaigns : campaigns }; //attached to this.Props object as property campaigns

    } ;
    

    //Method to generate Cards of each campaign.
    renderCampaigns(){       

        const items = this.props.campaigns.map( (campaign) => {
            return {
                header: ( 
                    <Link route = {`/campaigns/${campaign.address}`}> 
                        <a><h3>{campaign.campaignTitle}</h3></a>
                    </Link>                    
                ),
                description: <p>{ campaign.campaignDescription }</p>,
                meta : <h4>{'Contribute @ ' + campaign.address}</h4>,
                fluid: true
            };
        });

        return <Card.Group items={items} />
    }

    render() {        
        //All that interior JSX gets passed to Layout component in props.children
        return  <Layout>
                    <div>                        
                        <h3>Open Campaigns </h3>
                        <Link route="/campaigns/new">
                            <a>
                                <Button 
                                    content = "New Campaign"
                                    icon = "add circle"
                                    floated = "right"
                                    primary
                                />
                            </a>
                        </Link> 
                        { this.renderCampaigns() } 
                        
                    </div>
                </Layout>;
    }

}

export default CampaignList;


