import React from 'react'
import './Login.css'
const Login = () => {
  return (
    <div className='container'>
           
        <div className='login'>
             <h1>Login Form</h1>
            
        <form>
            <label>Email: </label>
            <input type="email" placeholder='Enter email..'/><br/>
             <label>Password: </label>
            <input type="password" placeholder='Enter password..'/><br/>

        </form>
        </div>
        
    </div>
  )
}
export default Login