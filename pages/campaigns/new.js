/**
 * Author : Vinay Vasyani
 * Page to create a new Campaign. 
 */

import React, {Component} from 'react'; 
import Layout from '../../components/Layout';
import {Form,Button,Input,Message} from 'semantic-ui-react';
import factory from '../../Ethereum/factory';
import web3 from '../../Ethereum/web3';
import { Router } from '../../routes';


class CampaignNew extends Component { 
    state = {
        minimumContribution : '',
        campaignTitle : '',
        campaignDescription : '',
        errorMessage : '', 
        loading : false
    }

    //Note we dont create onSubmit() coz we cant access this object. Hence the functionPointer approach. 
    onSubmit = async (event) => {        
        //This avoids form submission to server
        event.preventDefault(); 

        //Create Campaign on Ethereum ! 
        try{
            this.setState({loading:true, errorMessage : ''});
            //Fetch Accounts
            const accounts = await web3.eth.getAccounts();
            //Create New Campaign
            await factory.methods
                    .createCampaign(this.state.minimumContribution, this.state.campaignTitle, this.state.campaignDescription)
                    .send({
                        //gas: Metamask auto calcualtes amt of gas required. So no need to specify when running inside browser. 
                        from: accounts[0] 
                    });
            //Bring user back to the home page of list of contracts
            Router.pushRoute('/');            
        } 
        catch(error){
            
            this.setState({errorMessage : error.message.split("\n")[0]});
        }
        this.setState({loading:false});
    }

    render() { 
        return (
            <Layout>               
                <h3>Start Fund Raising in Ethereum</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Campaign Title </label>
                        <Input                                                         
                            value = {this.state.campaignTitle}
                            onChange = { event => this.setState( {campaignTitle : event.target.value}) } 
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Campaign Description </label>
                        <Input                                                         
                            value = {this.state.campaignDescription}
                            onChange = { event => this.setState( {campaignDescription : event.target.value}) } 
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input 
                            label = "wei"
                            labelPosition = "right"
                            value = {this.state.minimumContribution}
                            onChange = { event => this.setState( {minimumContribution : event.target.value}) } 
                        />
                    </Form.Field>




                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button 
                            loading = {this.state.loading}
                            content = "Create"
                            primary
                        />
                </Form>
            </Layout>
        );
    }
}

export default CampaignNew;