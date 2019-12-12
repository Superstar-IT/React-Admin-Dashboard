import React, { Component } from 'react'
import { connect } from 'react-redux'

@connect(({ user }) => ({ user }))
class Logout extends Component {

  componentDidMount() {
    this.logout();
  }

  logout = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'user/LOGOUT',
    })
  }

  render() {
    return (
      <div />
    )
  }
}

export default Logout
