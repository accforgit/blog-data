import React from 'react'

class NotFound extends React.Component {
  render () {
    if (this.props.staticContext) {
      this.props.staticContext.isNotFound = true
    }
    return (
      <h2 className="not-found">404</h2>
    )
  }
}

export default NotFound
