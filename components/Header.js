/**
 * Author : Vinay Vasyani
 * Header file to construct top bar using Menu semantic component. 
 */
import React from 'react'; 
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes'; //Makes children with onclick navigation to route

export default () => {
    //Note: when we want to use JSX and pass in an Object literal, we use {{ jsxcode }}
    //outer {} is for javascript. inner {} is for object literal. 
    return (
        <Menu style = {{ marginTop: '10px' }}>
            <Link route ="/">
                <a className = "item">
                   Seed Ether
                </a>
            </Link> 
        
            <Menu.Menu position='right'>
                <Link route ="/">
                    <a className = "item">
                    Campaigns
                    </a>
                </Link> 

                <Link route ="/campaigns/new">
                    <a className = "item">
                        +
                    </a>
            </Link> 
            </Menu.Menu>
        </Menu>
    );
}