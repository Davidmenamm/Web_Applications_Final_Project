/**
 * Main page, for users to register before using web chat room
*/
import React, {useState, useEffect} from 'react';
import Register from './components/Register';
import Chat from './components/Chat';

// application container
const App = () => {
    // state managemet
    const [isRegistered, setIsRegistered] = useState(false);
    const [name, setName] = useState("");

    // print change of name
    useEffect(() =>{
        console.log('name is', name);
    }, [name])

    // app container
    return (
        <div>
            { isRegistered ?
            <Chat userName={name}/> 
            :
            <Register name={name} setName={setName} setRegistered={setIsRegistered}/>
            }
        </div>
    );
}
export default React.memo(App);
