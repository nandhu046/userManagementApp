import {Component} from 'react'

import RotatingLines from 'react-loader-spinner'

import axios from 'axios'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class UserList extends Component {
  state = {apiStatus: apiStatusConstants.initial, users: [], error: ''}

  componentDidMount() {
    this.getUsersApi()
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
      this.setState({users: newList})
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
    const {users} = this.state

    return (
        <>{users.length === 0? <p className='warn-msg'>Nothing here for now</p>:
      <ul className="users-container">
        {users.map(info => (
          <this.User key={info.id} userDetails={info} />
        ))}
      </ul>}
      </>
    )  
  }

  failureView = () => {
    const {error} = this.state

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
    const {error, apiStatus} = this.state
    console.log(apiStatus, error)
    return (
      <div className="main-container">
        <div className="header">
          <h1 className="main-heading">User Management Dashboard</h1>
          <button type="button" className="add-btn">
            Add
          </button>
        </div>
        <div className="content-container">{this.renderViewOnApiStatus()}</div>
      </div>
    )
  }
}

export default UserList
