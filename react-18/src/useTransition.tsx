import React, { Suspense, useState, useTransition } from 'react'
// import Suspense from './code/suspense'
import ErrorBoundary from './errorBoundary'
import { getUser } from './api'
import { withPromise } from './utils'

const user1Promise = getUser(1)
const user1Resource = withPromise(user1Promise)

const user5Promise = getUser(5)
const user5Resource = withPromise(user5Promise)

const User = ({ resource }) => {
  const user = resource.read()
  return (
    <div>
      {user.id}
      {user.name}
    </div>
  )
}

const TransitionPage = () => {
  const [resource, setResource] = useState(user1Resource)

  const [isPending, startTransition] = useTransition()

  const update = () => {
    startTransition(() => {
      setResource(user5Resource)
    })
  }

  return (
    <div>
      <Suspense fallback={<div>loading</div>}>
        <ErrorBoundary>
          <User resource={resource} />
        </ErrorBoundary>
      </Suspense>
      <button onClick={update}>更新</button>
    </div>
  )
}

export default TransitionPage
