import React from 'react'
import { Redirect, Route } from 'react-router-dom'

export default function ProtectedRoute({component:Component,...rest}) {
    return (
        <Route {...rest} render={
            props=>{
                if(localStorage.userId != undefined){
                    return <Component {...props}/>
                }else{
                    return <Redirect to='/login'/>      
                }
            }
        }/>
    )
}
