import {Component} from 'react'

import RotatingLines from 'react-loader-spinner'

import axios from 'axios'

import UserForm from '../UserForm'

import ErrorBoundary from '../ErrorBoundary'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class UserList extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    users: [],
    error: '',
    addClicked: false,
  }

  componentDidMount() {
    this.getUsersApi()
  }

  changeAddStatus = () => {
    this.setState(prevState => ({
      addClicked: !prevState.addClicked
    }))
  }

  getUsersApi = async () => {
    try {
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/users',
      )
      const usersList = response.data
      this.setState({users: usersList, apiStatus: apiStatusConstants.success})
    } catch (errObj) {
      this.setState({
        error: errObj.message,
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  loadingView = () => (
    <RotatingLines
      height="50"
      width="50"
      color="black"
      strokeWidth="5"
      animationDuration="0.75"
      ariaLabel="rotating-lines-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  )

  // User component used to generate each user. Defined within the same class for better understanding
  User = data => {
    const {userDetails} = data
    const {id, name} = userDetails
    const {users} = this.state

    const onDelUser = () => {
      const newList = users.filter(user => user.id !== id)
      this.setState({users: newList, error: `User ${id} is deleted`})
      console.log(`user id-${id} deleted...`)
    }

    return (
      <>
        <li className="list-item">
          <div className="info-container">
            <p>{id}.</p>
            <p className="name">{name}</p>
          </div>
          <div className="edit-container">
            <button type="button" className="edit-btn">
              Edit
            </button>
            <button
              type="button"
              className="edit-btn del-btn"
              onClick={onDelUser}
            >
              Delete
            </button>
          </div>
        </li>
        <hr className="hr-line" />
      </>
    )
  }

  successView = () => {
    const {users, error} = this.state

    return (
      <>
        {error !== '' &&
           <p className="event-result">{error}</p>}

        {users.length === 0 ? (
          <p className="warn-msg">Nothing here for now</p>
        ) : (
          <ul className="users-container">
            {users.map(info => (
              <this.User key={info.id} userDetails={info} />
            ))}
          </ul>
        )}
      </>
    )
  }

  failureView = () => {
    const {error} = this.state
    console.log(error)
    return <p className="warn-msg">{error}</p>
  }

  renderViewOnApiStatus = () => {
    const {apiStatus} = this.state
    let uiToDisplay
    if (apiStatus === 'SUCCESS') {
      uiToDisplay = this.successView()
    } else if (apiStatus === 'FAILURE') {
      uiToDisplay = this.failureView()
    } else {
      uiToDisplay = this.loadingView()
    }
    return uiToDisplay
  }

  render() {
    const {apiStatus, addClicked} = this.state
    console.log(apiStatus)
    return (
      <div className="main-container">
        <div className="header">
          <h1 className="main-heading">User Management Dashboard</h1>
          <button
            type="button"
            className={addClicked?"back-btn add-btn" :"add-btn"} 
            onClick={this.changeAddStatus}
          >
            {addClicked ? 'Go back' : 'Add user'}
          </button>
        </div>

        <div className="content-container">
          {addClicked === false ? this.renderViewOnApiStatus() : <UserForm />}
        </div>
      </div>
    )
  }
}

export default UserList
