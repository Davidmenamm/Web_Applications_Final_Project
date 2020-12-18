/**
 * User Register component
 */
// imports
 import React, {useState} from 'react'
 
 
 export const Register = ({name, setName, setRegistered}) => {
    // valid registration
    const validRegister = (e) =>{
      e.preventDefault();
      // check name is not empty
      if (name !== ''){
          setRegistered(true);
      }
    }
    return (
        <div>
            <form onSubmit = {validRegister}>
                <label>Enter your name</label>
                <input value={name} onChange={e => setName(e.target.value)}/>
                <button>Go to Chat</button>
            </form>
        </div>
    )
 }

 export default Register;
 