import './assets/main.css'

import { Route, Routes } from 'react-router'
import Body from './Body'
import PromptList from './screens/PromptList'
import PromptEditor from './screens/PromptEditor'
import PromptFill from './screens/PromptFill'

const App: React.FunctionComponent<EmptyProps> = () => {
    // Using hash router here because Electron is a local file server and no web requests should be sent
    return (
        <Routes>
            <Route path="/" element={<Body />}>
                <Route index element={<PromptList />} />
                <Route path="editor" element={<PromptEditor />} />
                <Route path="filler" element={<PromptFill />} />
            </Route>
        </Routes>
    )
}

export default App
