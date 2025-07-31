import { Outlet } from 'react-router'
import Text from './components/Text'
import React from 'react'
import './assets/base.css'

const App: React.FunctionComponent<EmptyProps> = () => {
    return (
        <div className="main-content">
            <Text>Hello world!</Text>
            <ul>
                <li>
                    <a href="#/">
                        <Text>Prompt list</Text>
                    </a>
                </li>
                <li>
                    <a href="#/editor">
                        <Text>Prompt editor</Text>
                    </a>
                </li>
                <li>
                    <a href="#/filler">
                        <Text>Prompt filler</Text>
                    </a>
                </li>
            </ul>
            <Outlet />
        </div>
    )
}

export default App
