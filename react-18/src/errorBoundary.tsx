import React from 'react'

class ErrorBoundary extends React.Component {
  state = {
    hadError: false,
    error: null,
  }

  static getDerivedStateFromError(error: error) {
    return {
      hasEror: true,
      error,
    }
  }

  render() {
    if (this.state.hasEror) {
      return this.state.error.errorMessage
    } else {
      return this.props.children
    }
  }
}

export default ErrorBoundary
