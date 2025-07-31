import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router'
import App from './App'
import PromptList from './screens/PromptList'
import PromptEditor from './screens/PromptEditor'
import PromptFill from './screens/PromptFill'

createRoot(document.getElementById('root')!).render(
    // Using hash router here because Electron is a local file server and no web requests should be sent
    <StrictMode>
        <HashRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<PromptList />} />
                    <Route path="editor" element={<PromptEditor />} />
                    <Route path="filler" element={<PromptFill />} />
                </Route>
            </Routes>
        </HashRouter>
    </StrictMode>
)
