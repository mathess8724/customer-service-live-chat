import React from 'react'
import './Home.scss'
import * as firebase from 'firebase'
import CustomerService from '../customerservice/CustomerService';

const Home = (props) => {
    return (
        <div>

            hello from home 
            {
                props.customerService ? <p>customerService is available</p> : <p>no customer service available now</p>
            }

            {
                props.customerService && <CustomerService />
            }
        </div>
    );
};

export default Home;