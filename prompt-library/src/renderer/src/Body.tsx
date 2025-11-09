import { Outlet } from 'react-router'
import React from 'react'
import './assets/base.css'

const Body: React.FunctionComponent<EmptyProps> = () => {
    return (
        <div className="main-content">
            <Outlet />
        </div>
    )
}

export default Body
