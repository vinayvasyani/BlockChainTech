/**
 * Author : Vinay Vasyani
 * Component To place Header and Page Content inject through props.children. 
 * This will be used on every page we create in the application. 
 */
import React from 'react'; 
import {Container} from 'semantic-ui-react';
import Header from './Header.js';
import Head from 'next/head';


export default (props) => {
    //Note :
    // Container tag will put the content in teh center with left right spaces empty. So wide monitors can be used with no problems
    // Anything inside Head tag is put in the <head> element of HTML page. Since Layout will be used everywhere, we used CSS link  be inside Head
    return (
        <Container>
             <Head>
                <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>     
            </Head>

            <Header /> 

            {props.children}            
        </Container>
    );
    
}