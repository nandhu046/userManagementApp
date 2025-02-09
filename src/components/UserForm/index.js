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

  onChangeId = event => {
    this.setState({id: event.target.value, submitted: false, apiStatus: ''})
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
 
  onClearForm = () => {
      this.setState({id: '', firstName: '', lastName: '', email: '', department: '', submitted: false, apiStatus:''})
  }

  sendUserDetails = () => {
    const {addUser} = this.props
    const {id, firstName, lastName, email, department} = this.state
    addUser({id, firstName, lastName, email, department})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    this.setState({submitted: true})
    const {id, firstName, lastName, email, department} = this.state
    try {
      const validFields = fieldsChecked.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
      )
      if (validFields === 5) {
        this.setState({apiStatus: 'INITIAL'})
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
      } else {
        console.log(`only ${validFields} out of 5 is valid`)
      }
    } catch (err) {
      // console.log(err.message)
      this.setState({apiStatus: 'FAILURE', apiError: err.message})
    }
  }

  renderFormSubmitResult = () => {
    const {apiStatus, apiError, submitted} = this.state
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
      viewResult = <p className="success-msg">added successfully with id </p>
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
    console.log(`add api: ${apiStatus}`)
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
        <button type='button' className='clr-btn' onClick={this.onClearForm}>Clear</button>
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
