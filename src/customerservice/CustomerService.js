import React, { useState, useRef, useEffect } from 'react'
import './CustomerService.scss'
import agentImg from '../img/customer_agent.png'
import * as firebase from 'firebase'
import loader from '../img/loader.svg'


function CustomerService (){

    const [isChat,setIsChat] =useState (false)
    const [nbMsg,setNbMsg] = useState (null)
    const [msgIsShow,setMsgIsShow] =useState(false)
    const [localChatId,setLocalChatId] = useState()
    const [msgs,setMsgs] = useState([])
    const [array1,setArray1] = useState([1, 2, 3])
    const [agentWrite,setAgentWrite] = useState(false)
    const [clienttWrite,setClienttWrite] = useState(false)
    const [agentSeen,setAgentSeen] = useState(false)
    const [clientSeen,setClientSeen] = useState(false)
    const [chatStarted,setChatStarted] = useState()

    const msgInput = useRef('msgInput')
    const bodyChat = useRef('bodyChat')

    const [testArray,setTestArray] = useState(
        {
            "requests" : 
                {
                    "id1" : [
                        {
                           "messages" : [
                            {
                                "msg" : "hello",
                                "pseudo" : "agent"
                            },
                            {
                                "msg" : "hello",
                                "pseudo" : "client"
                            }
                           ]
                        },
                        {
                            "isChat" : true
                        }
                        
                    ]
                }
             
        }
    )

    const agentImgContainer = useRef('agentImg')
    const msgBody = useRef('msgBody')

    function handleShowMsg(){
        setMsgIsShow(!msgIsShow)
        setTimeout(bodyChat.current.scrollTop =  10000*10000, 1000)
    }
    function handleStartChat(){
        localStorage.setItem('chatId', 'chat-' + Date.now())
        let newChat = [{
            'messages' : [{
                'name' : 'Mathew',
                'msg' : 'Hello, I am Mathew, how can I help you?',
                'pseudo' : 'agent',
                'seen' : false
            }
            ]
        },
        {'isChat' : true },
        {'agentSeen' : false},
        {'clientSeen' : false},
        {'agentWrite' : false},
        {'clientWrite' : false},
        {'solved' : false},
        {"seen": false},
        {'id' : "chat-" + Date.now()}
    ]
            
    
        let target = `/requests/chat-${Date.now()}`
        let ref = firebase.database().ref(target)
            ref.set(newChat)

        fetchData()
    }

    function handleSend(msg){
        console.log(msg)
        msgInput.current.value = ''
        //let newMsg = Date.now()
        //setMsgs(prevState =>({ ...prevState, newMsg : msg}))
        let localId = localStorage.getItem('chatId')
        let target = `/requests/${localId}/0/messages`
        let newMsgs = msgs
            msgs.push({'pseudo' : 'client', 'msg': msg})
        let msgRef = firebase.database().ref(target)
            msgRef.set(newMsgs)
            window.setTimeout( () => fetchData(), 100)
           
             target = `/requests/${localChatId}/3`
            firebase.database().ref(target).set({'clientWrite' : false})
            
    }
    function handleSolveChat(){
        
        if (window.confirm(`This chat  will be closed, are you sure?`)) {
            let target = `/requests/${localChatId}/6/`
            console.log(target)
            let ref = firebase.database().ref(target)
                ref.set({solved : true})
                localStorage.removeItem('chatId')
                fetchData()
                handleShowMsg()
        } else {
            
        }
    }
    function test(){
        
        window.setTimeout( () => fetchData(), 3000)
    }
    function handleWrite(value){
        let write = value.length > 0 ? {'clientWrite' : true} : {'clientWrite' : false}
        let target = `/requests/${localChatId}/3`
        firebase.database().ref(target).set(write)
    }
    function fetchData(){
        let localId = localStorage.getItem('chatId')
        setLocalChatId(localId)
        //console.log(localId)
        let target = `/requests/${localId}`
        let chatRef = firebase.database().ref(target)
           chatRef.on( 'value', snapshot => {
               let msgs = snapshot.val()  
               //console.log(msgs)             
               snapshot.val() ?  setMsgs(msgs[0].messages) : setMsgs([])
               !snapshot.val() && localStorage.removeItem('chatId')    
                snapshot.val() && setIsChat(msgs[1].isChat)
                snapshot.val() && setAgentWrite(msgs[4].agentWrite)
                snapshot.val() && setClienttWrite(msgs[5].clientWrite)
                snapshot.val() && setAgentSeen(msgs[2].agentSeen)
                snapshot.val() && setChatStarted(msgs[7].seen)
                let scrolH = bodyChat.current.scrollHeight
                //console.log(scrolH)
                bodyChat.current.scrollTop = scrolH
            })
    }
    useEffect(() => {


        fetchData()
       
       
      },[])

      

    return (
        <div className="customerServicebody">
            <div  ref={msgBody} className={ msgIsShow ? 'customerServiceCardOn' : 'customerServiceCard'}>
               <div className="customerServiceCardheader">
                  <img style={{height:'40px'}} src={agentImg} alt=""/>
                  <div onClick={ () => handleShowMsg()} style={{cursor:'pointer'}}>
                      Customer Service
                  </div>
                  <div style={{cursor :'pointer'}} onClick={ () => handleShowMsg()}>
                      -
                  </div>
                  <div style={{cursor :'pointer'}} onClick={ () => handleSolveChat()}>
                      x
                  </div>
               </div>
                <div className="customerServiceCardBody" ref={bodyChat}>
                      {
                          !localChatId &&
                      
                      <div className="welcomeMsg">
                          <p style={{textAlign:'center'}}>A live agent are avaiable for help you!</p>
                          <button  onClick={ () => handleStartChat()} className="startChatButton">
                              Start live chat!
                          </button>
                          
                      </div>
                        }                        
                        {
                            
                            
                            //console.log(msgs),
                            msgs.map((msg,index) =>(
                                <div className={ msg.pseudo === 'agent' ? "msgAgentContainer" : 'msgClientContainer'}>
                                    <p>{msg.msg}</p>
                                   
                                </div>
                                
                            ))
                            
                        
                            
                        }
                        
                        {
                        !isChat &&
                        localChatId &&
                        <div className="chatOff">
                                This chat was closed
                            </div>
                        }
                        {
                            agentWrite &&
                        <div className="isWriting">
                           Mathew is writing . . .
                        </div>
                        }
                        {
                            agentSeen && !agentWrite ? <div className="seen">Seen</div> : <div></div>                            
                        }
                        {
                            isChat && !chatStarted ? <div className="loaderContainer">Looking for agent ... <img className='loader' src={loader} alt=""/></div> : <div></div>
                        }
                </div>
                <div className="customerServiceCardFooter">
                    <textarea onChange={ (e) => handleWrite(e.target.value)} disabled={!isChat} ref={msgInput} className='msgInput'name="msgInput" id="" cols="30" rows="10"></textarea>
                    <button disabled={!isChat} onClick={ () => handleSend(msgInput.current.value)} className="sendMsg">
                        Send
                    </button>
                    
                </div>
            </div>
            <div ref={agentImgContainer} onClick={ () => handleShowMsg()} className={ msgIsShow ? 'agentImgContainerOn' : 'agentImgContainer'}>
            <img className='agentImg' src={agentImg} alt=""/>
            <div className="nbMsg">
                {
                    
                    nbMsg ? nbMsg > 1 ? nbMsg + ' messages !' : nbMsg + ' message !' : ''
                }
            </div>
            </div>
            
        </div>
        
    )


}


export default CustomerService;