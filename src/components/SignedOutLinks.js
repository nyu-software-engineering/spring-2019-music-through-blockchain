import React from 'react'
import { NavLink } from 'react-router-dom'

const SignedOutLinks = () => {
    return (
        <div style={{position: 'relative', top: 55, }}>
            <h3 style={{display:'inline', padding: 15}}><NavLink to='/signup' style={{textDecoration: 'none', color: 'white'}}>Sign Up</NavLink></h3>
            <h3 style={{display:'inline', padding: 15}}><NavLink to='/signin' style={{textDecoration: 'none', color: 'white'}}>Log In</NavLink></h3>
            <h3 style={{display:'inline', padding: 15}}><NavLink to='/howto' style={{textDecoration: 'none', color: 'white'}}>How to Get Started</NavLink></h3>
        </div>
    )

}

export default SignedOutLinks