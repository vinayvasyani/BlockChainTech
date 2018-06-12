import React, {Component} from 'react';
import {Form, Input, Button, Message} from 'semantic-ui-react';
import web3 from '../../../Ethereum/web3';
import Campaign from '../../../Ethereum/campaign';
import Layout from '../../../components/Layout';

import {Link, Router} from '../../../routes';


class RequestNew extends Component { 
    state = {
        value : '',
        description : '',
        recipient : '',
        errorMessage : '',
        loading : false
    }

    static async getInitialProps(props) {  
        return {
            address : props.query.address
        }
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const address = this.props.address;
        const {description, recipient, value } = this.state;
        const campaign = Campaign(address);        

        try { 
            this.setState({loading:true, errorMessage : ''});            
            //Fetch Accounts from metamask 
            const accounts = await web3.eth.getAccounts();
            //Add New Request 
            await campaign.methods.createRequest( 
                                        description, 
                                        recipient,  
                                        web3.utils.toWei(value , 'ether' ) 
                                    ).send({ 
                                        from : accounts[0] 
                                    });
                                    
            //Refresh Page to reflect changes to contract. 
            //
            //Router.replace(`/campaigns/${this.props.address}/requests`); //ES 2015 syntax 
            Router.pushRoute(`/campaigns/${this.props.address}/requests`); 
        }
        catch(error){            
            this.setState({errorMessage : error.message.split("\n")[0]});
        }
        this.setState({loading:false});
    }

    render() { 
        return (
            <Layout> 
                <Link route = {`/campaigns/${this.props.address}/requests`}>                  
                        Back                   
                </Link>
                <h3> Add New Request</h3>
                <Form onSubmit= {this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label> Description </label>
                        <Input 
                            value = {this.state.description} 
                            onChange = {event => { this.setState( { description : event.target.value })} }
                            />
                    </Form.Field>
                    <Form.Field>
                        <label> Amount in Ether </label>
                        <Input 
                            value = {this.state.value} 
                            onChange = {event => { this.setState( { value : event.target.value })} }
                            label ="ether" 
                            labelPosition ="right"
                            />
                    </Form.Field>
                    <Form.Field>
                        <label> Recipient </label>
                        <Input 
                            value = {this.state.recipient} 
                            onChange = {event => { this.setState( { recipient : event.target.value })} }
                            />
                    </Form.Field>

                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button 
                        loading = {this.state.loading}
                        content = "Request"
                        primary />
                </Form>
            </Layout>
        );
    }    
}

export default RequestNew;