/**
 * Component to manage the Chat
*/
// imports
import React, {useState, useEffect} from 'react';
import {Socket} from '../utils/Socket';

// Chat Component
const Chat = ({userName}) => {
    // state management
    const [currentMsg, setCurrentMsg] = useState('');
    const [receivedMsgs, setReceivedMsgs] = useState([])
    const [msgsText, setMsgsText] = useState('')
    
    // connect user when enters to chat
    useEffect(()=>{
        Socket.emit('connected', userName);        
        // limpiar socket
        return () => { Socket.off() }
    }, [])

    // active when receivedMsgs changes
    useEffect(()=>{
        console.log('call back function');
        const lastReceivedMsg = receivedMsgs[receivedMsgs.length-1];
        if (lastReceivedMsg) setMsgsText( msgsText.concat( lastReceivedMsg, '\n' )); 
        Socket.on('messageClients', (fromName, msg) =>{
            console.log('call server');
            console.log('received ', receivedMsgs);
            console.log('received txt ', msgsText);
            setReceivedMsgs([...receivedMsgs, fromName.concat(':', msg)]); 
            console.log('received after ', receivedMsgs);
            Socket.off();
        })
        return () => {
            // avoid loop call to socket
            Socket.off();
        }
    }, [receivedMsgs])


    // manage hangdlers
    const manageSending = (e) =>{
        e.preventDefault();
        console.log('userName ', userName);
        Socket.emit('sendAll', userName, currentMsg);
        // clean message box
        setCurrentMsg('');
        // console.log('message sent');
        // console.log('msg list', receivedMsgs);
        // console.log('msg txt ', msgsText);
    }
    // manage key press in text area
    const handleKeyPress = (e) => {
        if(e.key === 'Enter'){
            manageSending(e);
        }
      }

    return (
        <>
            <div>
                <h1> {`Welcome ${userName}`} </h1>
            </div>
            <div>
                <textarea            
                    readOnly ={true}
                    value={msgsText}
                    rows='10'
                    cols='45'
                    wrap='hard'
                />
                <form onSubmit={manageSending}>
                    <textarea 
                        value={currentMsg}
                        placeholder='Please Enter a Message'
                        rows='3'
                        cols='45'
                        autoFocus
                        wrap='hard'
                        onChange={(e) => setCurrentMsg(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button> Send </button>
                </form>
            </div>
        </>
    )
}

export default Chat;