import React, { useState, useEffect, startTransition } from 'react'

const UpdatePriority = () => {
  const [state, setState] = useState('')

  useEffect(() => {
    console.log('state', state)
  })

  const update = () => {
    setState((s) => s + '0')
    startTransition(() => {
      setState((s) => s + 'A')
    })
    setState((s) => s + 'B')
    startTransition(() => {
      setState((s) => s + 'C')
    })
    setState((s) => s + 'D')
  }
  return (
    <div>
      <div>{state}</div>
      <button onClick={update}>更新</button>
    </div>
  )
}

export default UpdatePriority
