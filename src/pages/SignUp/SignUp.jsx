import React from 'react'
import './SignUp.css'
const SignUp = () => {
  return (
    <div className='container'>
           
        <div className='login'>
             <h1>Login Form</h1>
            
        <form>
            <label>Naveen: </label>
            <input type="text" placeholder='Enter your name..'/><br/>
             <label>Email: </label>
            <input type="email" placeholder='Enter email..'/><br/>
            <label>Password: </label>
            <input type="password" placeholder='Enter password..'/><br/>
            <label>Confirm Password: </label>
            <input type="password" placeholder='Enter password again..'/><br/>

        </form>
        </div>
        
    </div>
  )
}
export default SignUp