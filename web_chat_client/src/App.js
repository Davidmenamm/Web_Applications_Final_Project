/**
 * Main page, for users to register before using web chat room
*/
import React, {useState, useEffect} from 'react';
import Register from './components/Register';
import Chat from './components/Chat';
import {Socket} from './utils/Socket';

// application container
const App = () => {
    // state managemet
    const [isRegistered, setIsRegistered] = useState(false);
    const [connectMe, setConnectMe] = useState(false);
    const [name, setName] = useState('');
    const [statusMsg, setStatusMsg] = useState('');
        
    // connect user when enters to chat
    useEffect(()=>{
        console.log('use effect connect me ', connectMe);
        if (connectMe){
            console.log('connect me ', name);
            Socket.emit('connectme', name);            
            setConnectMe(false); 
        }
        Socket.on('validAccess', (validation, response) =>{
            console.log('on valid access ', validation, response);
            if(validation === 'YES'){
                setIsRegistered(true); 
            }
            setStatusMsg(response);
        })

        // Aquí se debe limpiar socket
        return () => { Socket.off() }
    }, [connectMe, name])

    // app container
    return (
        <div style={{margin:'4rem'}}>
            { isRegistered ?
            <Chat userName={name}/> 
            :
            <Register name={name} setName={setName} status={statusMsg} setConnectMe={setConnectMe}/>
            }
        </div>
    );
}
export default App;
