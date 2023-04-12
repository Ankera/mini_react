import { useState } from 'react'
import SuspensePage from './suspense'
import StartTranstitionPage from './startTransition'
import UpdatePriority from './updatePriority'
import TransitionPage from './useTransition'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <SuspensePage />
      <hr />
      <StartTranstitionPage />
      <hr />
      <UpdatePriority />
      <hr />
      <TransitionPage />
    </div>
  )
}

export default App
