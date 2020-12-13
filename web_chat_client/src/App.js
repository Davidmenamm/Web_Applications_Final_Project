/**
 * Main page, for users to register before using web chat room
*/
import {socket} from './components/Socket'

const App = () => {
  // test realtime communication
  const test = socket.emit('conectado', 'Nuevo cliente!');
  console.log(test);
  return (
    <div>
        Testing Realtime communication between browser client and web server
    </div>
  );
}
export default App;
