import React, { useEffect, useState } from 'react';
import './App.css';
import CustomerService from './customerservice/CustomerService'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import ControlPannel from './customerservice/ControlPannel';
import Home from './home/Home';
import FirebaseConfig from './config/FirebaseConfig'
import * as firebase from'firebase'

function App() {

  const [serviceIsOn,setServiceIsOn] = useState(false)
  const [clients,setClients] = useState([])
  const [scroll,setScroll] = useState(3000)

  useEffect(() => {

    firebase.initializeApp(FirebaseConfig)
    const customerService = firebase.database().ref('/serviceIsOn')
          customerService.on('value', snapshot => {
            setServiceIsOn(snapshot.val())
          })
          
            let target = `/`
            let chatRef = firebase.database().ref(target)
            chatRef.on( 'value', snapshot => {
                let clients = snapshot.val()  
                let newRef = clients.requests
       
                /*  Object.values(newRef).map((client,index) => (
                     console.log(client)
                 )) */
                 let newArray = Object.values(newRef)
                 //console.log(newArray)
                 //console.log(Object.values(newRef))
                 //setClients(newArray)
                 let newArray2 = []
        for(let client in clients){
            //console.log(Object.values(clients[client]))
            newArray2.push(Object.values(clients[client]))
        }
        console.log(newArray2[0])
        setClients(newArray2[0])
        setScroll(3500)
                
             })
          
  },[])

  return (


    <Router>
    <div className="App">
      {
        //serviceIsOn && <CustomerService />
      }
      <Switch>         
      <Route exact path='/' children={ <Home customerService = {serviceIsOn} /> }></Route>
      <Route exact path='/controls' children={ <ControlPannel scroll={scroll} customerService = {serviceIsOn} clients={clients}/> }></Route>
      <Route component={Home}></Route>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
