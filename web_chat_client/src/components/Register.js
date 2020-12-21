/**
 * User Register component
 */
 
 export const Register = ({name, setName, status, setConnectMe}) => {
    // valid registration
    const validRegister = (e) =>{
      e.preventDefault();
      // check name is not empty
      if (name !== ''){
            setConnectMe(true);
            console.log('try to connect me ', name);
      }
    }
    return (
        <div>
            <form onSubmit = {validRegister} >
                <label>Enter your name:</label>
                <input value={name} onChange={e => setName(e.target.value)} style={{marginLeft:'1.2rem'}}/>
                <button style={{marginLeft:'0.4rem'}}>Go to Chat</button>
            </form>
            <br/>
            <label style={{color:'red'}}>{status}</label>
        </div>
    )
 }

 export default Register;
 