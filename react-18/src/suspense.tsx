import React, { Suspense } from 'react'
// import Suspense from './code/suspense'
import ErrorBoundary from './errorBoundary'
import { getUser } from './api'
import { withPromise } from './utils'

const userPromise = getUser(2)
const userResource = withPromise(userPromise)

const User = () => {
  const user = userResource.read()
  return (
    <div>
      {user.id}
      {user.name}
    </div>
  )
}

class SuspensePage extends React.Component {
  render() {
    return (
      <div>
        <div>header</div>
        <Suspense fallback={<div>loading</div>}>
          <ErrorBoundary>
            <User />
          </ErrorBoundary>
        </Suspense>
        <div>footer</div>
      </div>
    )
  }
}

export default SuspensePage
