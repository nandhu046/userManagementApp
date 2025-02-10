import {Component} from 'react'

import RotatingLines from 'react-loader-spinner'

import axios from 'axios'

import UserForm from '../UserForm'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

let addedUserId = null
let editUserId = null

// User component generates each user UI.

const User = data => {
  const {userDetails, users, getEditStatus, onDeleteGetUsers} = data
  const {id, name} = userDetails

  // edit click makes form shown by this state update
  const onEditUser = () => {
    getEditStatus()
    editUserId = id
  }

  // Delete user and update user List
  const onDelUser = () => {
    const newList = users.filter(user => user.id !== id)
    onDeleteGetUsers(id, newList)
  }

  return (
    <>
      <li className="list-item">
        <div className="info-container">
          <p>{id}.</p>
          <p className="name">{name}</p>
        </div>
        <div className="edit-container">
          <button type="button" className="edit-btn" onClick={onEditUser}>
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

class UserList extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    users: [],
    error: '',
    addClicked: false,
    editClicked: false,
  }

  // start API call

  componentDidMount() {
    this.getUsersApi()
  }

  // button click changes active tab to display

  changeStatus = () => {
    const {addClicked, editClicked} = this.state
    if (
      (addClicked === false && editClicked === false) ||
      (addClicked && editClicked === false)
    ) {
      this.setState(prevState => ({
        addClicked: !prevState.addClicked,
      }))
    } else {
      this.setState({
        editClicked: false, // change both button status with single button-'back'
      })
    }
  }

  // initial users API
  getUsersApi = async () => {
    try {
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/users',
      )
      const usersList = response.data
      const modifyData = usersList.map(i => ({
        id: i.id,
        name: i.name,
        email: i.email,
        department: i.company.name,
      }))

      this.setState({users: modifyData, apiStatus: apiStatusConstants.success})
    } catch (errObj) {
      this.setState({
        error: errObj.message,
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  // add Api after all fields validation done
  addNewUser = newUser => {
    const {users} = this.state

    const checkUser = users.filter(i => i.id === parseInt(newUser.id))
    const userObj = {
      id: users.length + 1,
      name: `${newUser.firstName} ${newUser.lastName}`,
      email: newUser.email,
      department: newUser.department,
    }
    if (checkUser.length >= 1) {
      this.setState(prevState => ({users: [...prevState.users, userObj]}))
      addedUserId = userObj.id
    } else {
      const userObj1 = {
        ...userObj,
        id: parseInt(newUser.id),
      }
      this.setState(prevState => ({users: [...prevState.users, userObj1]}))
      addedUserId = userObj1.id
    }
  }

  // updating object which is 'edited' remaining will be same

  updateUserData = updatedData => {
    const {users} = this.state
    const {id, firstName, lastName, email, department} = updatedData
    const modifiedUser = {
      id,
      name: `${firstName} ${lastName}`,
      email,
      department,
    }
    const usersList = users.map(i => {
      if (i.id === modifiedUser.id) {
        return modifiedUser
      }
      return i
    })
    this.setState({users: [...usersList]})
  }

  // specific function to render Loading view on api call

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

  // update state on 'edit click'

  onEdit = () => {
    this.setState({editClicked: true})
  }

  // update state on 'delete click'

  onDelete = (id, newList) => {
    this.setState({users: newList, error: `User ${id} is deleted`})
    console.log(`user id-${id} deleted...`)
  }

  // rendering list of users on 'success'

  successView = () => {
    const {users, error} = this.state

    users.sort((a, b) => a.id - b.id)
    
    
    return (
      <>
        {(error !== '' && users.length >= 1) && <p className="event-result">{error}</p>}

        {users.length === 0 ? (
          <p className="warn-msg">Nothing here for now</p>
        ) : (
          <ul className="users-container">
            {users.map(info => (
              <User
                key={info.id}
                userDetails={info}
                users={users}
                getEditStatus={this.onEdit}
                onDeleteGetUsers={this.onDelete}
              />
            ))}
          </ul>
        )}
      </>
    )
  }

  // on api failure

  failureView = () => {
    const {error} = this.state
    console.log(error)
    return <p className="warn-msg">{error}</p>
  }

  // render specific view on api status

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
    const {apiStatus, addClicked, users, editClicked} = this.state
    console.log(`get api: ${apiStatus}`)
    const editUserData =
      editUserId !== null && users.filter(i => i.id === editUserId)[0]
    console.log(users)
    return (
      <div className="main-container">
        <div className="header">
          <h1 className="main-heading">User Management Dashboard</h1>
          <button
            type="button"
            className={
              addClicked || editClicked ? 'back-btn add-btn' : 'add-btn'
            }
            onClick={this.changeStatus}
          >
            {addClicked || editClicked ? 'Go back' : 'Add user'}
          </button>
        </div>

        <div className="content-container">
          {addClicked === false && editClicked === false ? (
            this.renderViewOnApiStatus()
          ) : (
            <UserForm
              addUser={this.addNewUser}
              newId={addedUserId}
              editStatus={editClicked}
              editData={editUserData}
              updateUser={this.updateUserData}
            />
            // on any button click form will be displayed
          )}
        </div>
      </div>
    )
  }
}

export default UserList
