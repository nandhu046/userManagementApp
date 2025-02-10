import {Component} from 'react'

import axios from 'axios'

import ClipLoader from 'react-spinners/ClipLoader'

import {ErrorBoundary, fieldsChecked} from '../ErrorBoundary'

import './index.css'

class UserForm extends Component {
  state = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    submitted: false,
    apiStatus: '',
    apiError: '',
  }

  // to persist previous data we updating state after initial render

  componentDidMount() {
    const {editStatus} = this.props
    if (editStatus) {
      const {editData} = this.props
      const {id, name, email, department} = editData
      const firstName = name.split(' ')[0]
      const lastName = name.split(' ')[1]
      this.setState({id, firstName, lastName, email, department})
    }
  }

  // on every input field change we updating api status as well to resubmit form

  onChangeId = event => {
    const {editStatus} = this.props
    if (editStatus === false) {
      this.setState({id: event.target.value, submitted: false, apiStatus: ''})
    }
  }

  onChangeFName = event => {
    this.setState({
      firstName: event.target.value,
      submitted: false,
      apiStatus: '',
    })
  }

  onChangeLName = event => {
    this.setState({
      lastName: event.target.value,
      submitted: false,
      apiStatus: '',
    })
  }

  onChangeEmail = event => {
    this.setState({email: event.target.value, submitted: false, apiStatus: ''})
  }

  onChangeDepartment = event => {
    this.setState({
      department: event.target.value,
      submitted: false,
      apiStatus: '',
    })
  }

  // clear form

  onClearForm = () => {
    this.setState({
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      submitted: false,
      apiStatus: '',
    })
  }

  // to add new User we send data to UserList Component

  sendUserDetails = () => {
    const {addUser} = this.props
    const {id, firstName, lastName, email, department} = this.state
    const d = {id, firstName, lastName, email, department}
    addUser(d)
  }

  // we send updated data of specific user data. to UserList

  sendUpdatedData = () => {
    const {updateUser} = this.props
    const {id, firstName, lastName, email, department} = this.state
    const d = {id, firstName, lastName, email, department}
    updateUser(d)
  }

  // based on form like 'add' or 'edit'. doing api call on Form submit

  onSubmitForm = async event => {
    event.preventDefault()
    this.setState({submitted: true})
    const {id, firstName, lastName, email, department} = this.state
    try {
      const validFields = fieldsChecked.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
      )
      if (validFields === 5) {
        const {editStatus} = this.props
        this.setState({apiStatus: 'INITIAL'})
        if (editStatus === true) {
          const responseObj = await axios.put(
            'https://jsonplaceholder.typicode.com/users/1',
            {
              id,
              firstName,
              lastName,
              email,
              department,
              headers: {
                'Content-Type': 'multipart/form-data', // Required for FormData
              },
            },
          )
          this.setState({apiStatus: 'SUCCESS'}, this.sendUpdatedData)
        } else {
          const responseObj = await axios.post(
            'https://jsonplaceholder.typicode.com/users',
            {
              id,
              firstName,
              lastName,
              email,
              department,

              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
          this.setState({apiStatus: 'SUCCESS'}, this.sendUserDetails)
        }
      } else {
        console.log(`only ${validFields} out of 5 is valid`)
      }
    } catch (err) {
      // console.log(err.message)
      this.setState({apiStatus: 'FAILURE', apiError: err.message})
    }
  }

  // on api status render view

  renderFormSubmitResult = () => {
    const {apiStatus, apiError, submitted} = this.state
    const {newId} = this.props
    let viewResult
    if (apiStatus === 'INITIAL') {
      viewResult = (
        <ClipLoader
          size={35}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      )
    } else if (apiStatus === 'SUCCESS') {
      const {editData, editStatus} = this.props
      viewResult = (
        <p className="success-msg">
          {' '}
          {editStatus
            ? `user Id - ${editData.id} updated successfully`
            : `added successfully with Id - ${newId}`}
        </p>
      )
    } else {
      viewResult = (
        <p className="failed-msg">
          {submitted && apiError === '' ? 'Enter Valid details' : apiError}
        </p>
      )
    }
    return viewResult
  }

  render() {
    const {
      id,
      firstName,
      lastName,
      email,
      department,
      submitted,
      apiStatus,
    } = this.state
    const {editStatus} = this.props
    console.log({apiStatus})

    return (
      <form className="form" onSubmit={this.onSubmitForm}>
        <label htmlFor="userId">ID</label>
        <input id="userId" type="text" value={id} onChange={this.onChangeId} />
        {submitted && id.length === 0 ? (
          <ErrorBoundary isSubmitted={submitted} />
        ) : (
          <ErrorBoundary id={id} />
        )}
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={this.onChangeFName}
        />
        {submitted && firstName.length === 0 ? (
          <ErrorBoundary isSubmitted={submitted} />
        ) : (
          <ErrorBoundary firstName={firstName} />
        )}
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={this.onChangeLName}
        />
        {submitted && lastName.length === 0 ? (
          <ErrorBoundary isSubmitted={submitted} />
        ) : (
          <ErrorBoundary lastName={lastName} />
        )}
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={this.onChangeEmail}
        />
        {submitted && email.length === 0 ? (
          <ErrorBoundary isSubmitted={submitted} />
        ) : (
          <ErrorBoundary email={email} />
        )}
        <label htmlFor="department">Department</label>
        <input
          id="department"
          type="text"
          value={department}
          onChange={this.onChangeDepartment}
        />
        {submitted && department.length === 0 ? (
          <ErrorBoundary isSubmitted={submitted} />
        ) : (
          <ErrorBoundary department={department} />
        )}
        {editStatus === false && (
          <button type="button" className="clr-btn" onClick={this.onClearForm}>
            Clear
          </button>
        )}
        <button
          type="submit"
          className="submit-btn"
          onClick={this.onSubmitForm}
        >
          Submit
        </button>
        {submitted && (
          <div className="result-container">
            {this.renderFormSubmitResult()}
          </div>
        )}
      </form>
    )
  }
}

export default UserForm
