import React, {Component} from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import Campaign from '../Ethereum/campaign';
import web3 from '../Ethereum/web3';
import { Router } from '../routes';

class ContributeForm extends Component {
    state = {
        value : '',
        errorMessage : '', 
        loading : false
    }
    //Take the contribution in Ether and add to Campaign Contract. The address will come from parent componet passed in props
    //Note: We are assigning onSubmit a function instead of onSubmit() direct method so we can access this object 
    onSubmit = async (event) => {
        const address = this.props.address;
        const campaign = Campaign(address);
        

        try { 
            this.setState({loading:true, errorMessage : ''});            
            //Fetch Accounts from metamask 
            const accounts = await web3.eth.getAccounts();
            //Contribute 
            await campaign.methods.contribute().send({
                from : accounts[0],
                value : web3.utils.toWei( this.state.value, 'ether' )
            });
            //Refresh Page to reflect changes to contract. 
            Router.replace(`/campaigns/${this.props.address}`); //ES 2015 syntax 
        }
        catch(error){            
            this.setState({errorMessage : error.message.split("\n")[0]});
        }
        this.setState({loading:false});
    }

    
    render() {
        return ( 
            <Form onSubmit= {this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label> Amount to Contribute </label>
                    <Input 
                        value = {this.state.value}
                        onChange = { (event) => { this.setState( { value : event.target.value}) } }
                        label ="ether" 
                        labelPosition ="right" /> 
                </Form.Field>
                <Message error header="Oops!" content={this.state.errorMessage} />
                <Button 
                loading = {this.state.loading}
                content = "Contribute"
                primary />
            </Form>
        ) ;

    }
}

export default ContributeForm;