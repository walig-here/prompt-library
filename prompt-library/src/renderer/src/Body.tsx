import { Outlet } from 'react-router'
import React, { useState } from 'react'
import './assets/base.css'
import { ContentWidthContext } from './contexts'

const Body: React.FunctionComponent<EmptyProps> = () => {
    const [contentWidth, setContentWidth] = useState('main-content')

    return (
        <div className={contentWidth}>
            <ContentWidthContext value={{ value: contentWidth, setWidth: setContentWidth }}>
                <Outlet />
            </ContentWidthContext>
        </div>
    )
}

export default Body
