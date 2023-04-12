import React from 'react'

class Suspense extends React.Component {
  state = {
    loading: false,
  }

  componentDidCatch(error) {
    if (typeof error.then === 'function') {
      this.setState({ loading: true })

      error.then(() => this.setState({ loading: false }))
    }
  }

  render() {
    const { fallback, children } = this.props
    const { loading } = this.state
    return loading ? fallback : children
  }
}

export default Suspense
