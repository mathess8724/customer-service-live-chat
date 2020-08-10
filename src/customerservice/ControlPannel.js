import React, { useState, useEffect, useRef } from 'react'
import * as firebase from 'firebase'
import './ControlePannel.scss'
import FirebaseConfig from '../config/FirebaseConfig'
import agentImg from '../img/customer_agent.png'

const ControlPannel = (props) => {

    const [clients, setClients] = useState([1, 1])

    const [scroll, setScroll] = useState(100)
    useEffect(() => {



        setClients(props.clients)


    })

    function CreateRef(id) {
        let ref = React.createRef(id)
        return ref

    }
    function handleShowMsg(id) {
        let ref = window.document.getElementById(id)
        //console.log(ref)
        let currentClass = ref.children[1].className
        currentClass === 'cardBody' ? ref.children[1].className = 'cardBody cardBodyOff' : ref.children[1].className = 'cardBody'
        //console.log(currentClass)
        currentClass = ref.children[0].children[1].children[0].className
        //console.log(currentClass)
        currentClass === 'menuContainer' ? ref.children[0].children[1].children[0].className = 'menuContainer menuContainerOff' : ref.children[0].children[1].children[0].className = 'menuContainer'

        let target = `/requests/${id}/7/`
        firebase.database().ref(target).set({ 'seen': true })
    }

    function fetchData() {
        let target = `/`
        let chatRef = firebase.database().ref(target)
        chatRef.on('value', snapshot => {
            let clients = snapshot.val()

            setClients(clients)

        })
    }
    function handleSendMsg(id, msgs) {
        console.log(id)
        let msgSrc = window.document.getElementById(id).children[1].children[1].children[0].value
        msgs.push({ 'msg': msgSrc, 'pseudo': 'agent', 'seen': false })
        let target = `/requests/${id}/0/messages/`
        let ref = firebase.database().ref(target)
        ref.set(msgs)
        window.document.getElementById(id).children[1].children[1].children[0].value = ''
        const refresh = () => window.document.getElementById(id).children[1].children[0].scrollTop = 3000
        window.setTimeout(refresh, 200)
        //console.log(window.document.getElementById(id).children[1].children[0])
        target = `/requests/${id}/4/`
        firebase.database().ref(target).set({ 'agentWrite': false })
        target = `/requests/${id}/2/`
        firebase.database().ref(target).set({ 'agentSeen': false })

    }
    function handleWrite(id, value) {
        //console.log(value)
        let target = `/requests/${id}/4/`
        let write = value.length > 0 ? { 'agentWrite': true } : { 'agentWrite': false }
        firebase.database().ref(target).set(write)
    }
    function handleScroll(id) {
        const refresh = () => window.document.getElementById(id).children[1].children[0].scrollTop = 3000
        window.setTimeout(refresh, 200)
    }

    function handleService() {
        let ref = firebase.database().ref('/serviceIsOn')
        ref.set(!props.customerService)
    }
    function handleCloseChat(id) {
        //console.log('close chat : ' + id)
        let target = `/requests/${id}/1/`
        firebase.database().ref(target).set({ 'isChat': false })
    }
    function handleSeen(id, seen) {
        let target = `/requests/${id}/2/`
        firebase.database().ref(target).set({ 'agentSeen': true })

    }
    return (
        <div className='controlsBody'>
            <h1>Chat service</h1>
            {
                props.customerService ?
                    <button className={props.customerService ? 'serviceButtonOn' : 'serviceButton'} onClick={() => handleService()}>Turn service off</button>
                    :
                    <button className={props.customerService ? 'serviceButtonOn' : 'serviceButton'} onClick={() => handleService()}>Turn service on</button>
            }
            <div className="clientsContainer">
                {

                }
                {

                    props.clients.map((client, index) => (
                        <div ref={() => CreateRef(client[8].id)} key={index} id={client[8].id} className="clientCard">
                            <div style={{ cursor: 'pointer' }} className="idChatContainer">
                                <div className={!client[7].seen && client[1].isChat ? 'imgChat imgChatWaiting' : 'imgChat' +
                                    client[7].seen && !client[1].isChat ? 'imgChat imgChatSolved' : 'imgChat  imgChatTalking'

                                }>
                                    <img className='imgAgent' src={agentImg} alt="agent" />
                                </div>
                                <div onClick={() => handleShowMsg(client[8].id)} className="id">
                                    <div className="menuContainerOff">
                                        <div onClick={() => handleCloseChat(client[8].id)} className="solveButton">
                                            Close chat
                                           </div>
                                    </div>
                                    {client[8].id}
                                </div>
                            </div>
                            <div className="cardBodyOff">

                                <div className="messagesContainer">
                                    {
                                        client[0].messages.map((msg, index) => (
                                            <div className={msg.pseudo === 'agent' ? 'agentMsgContainer' : 'clientMsgContainer'}>
                                                <div className={msg.pseudo === 'agent' ? 'agentMsg' : 'clientMsg'}>
                                                    {msg.msg}
                                                </div>
                                                {
                                                    () => handleScroll(client[8].id)
                                                }
                                            </div>

                                        ))
                                    }
                                    {
                                        !client[1].isChat &&

                                        <div className="chatOff">
                                            This chat was closed
                            </div>
                                    }
                                    {
                                        client[3].clientWrite &&
                                        <div className="isWriting">
                                            Client is writing . . .
                        </div>
                                    }
                                </div>
                                <div className="footerContainer">
                                    <textarea /* onClick={ () => client[2].agentSeen === false ? handleSeen(client[8].id, true) : handleSeen(client[8].id, false)} */ onChange={(e) => handleWrite(client[8].id, e.target.value)} disabled={!client[1].isChat} className='msgInput' name="msgInput" id="" cols="30" rows="10"></textarea>
                                    <button onClick={() => handleSendMsg(client[8].id, client[0].messages)} disabled={!client[1].isChat} className="sendMsg">Send </button>

                                </div>
                            </div>

                        </div>
                    ))
                }
                {/* <button onClick={ () => test()}>click</button> */}
            </div>
        </div>
    );
};

export default ControlPannel;