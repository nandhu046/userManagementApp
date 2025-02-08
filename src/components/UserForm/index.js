import {Component} from 'react'

import './index.css'

class UserForm extends Component {
  state = {id: '', firstName: '', lastName: '', email: '', department: ''}

  onChangeId = event => {
    this.setState({id: event.target.value})
  }

  onChangeFName = event => {
    this.setState({firstName: event.target.value})
  }

  onChangeLName = event => {
    this.setState({lastName: event.target.value})
  }

  onChangeEmail = event => {
    this.setState({email: event.target.value})
  }

  onChangeDepartment = event => {
    this.setState({department: event.target.value})
  }

  render() {
    const {id, firstName, lastName, email, department} = this.state
    return (
        <form className="form">
          <label htmlFor="userId">ID</label>
          <input id="userId" type="text" value={id} onChange={this.onChangeId}/>
          <label htmlFor="firstName">First Name</label>
          <input id="firstName" type="text" value={firstName} onChange={this.onChangeFName}/>
          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" type="text" value={lastName} onChange={this.onChangeLName}/>
          <label htmlFor="email">Email</label>
          <input id="email" type="text" value={email}  onChange={this.onChangeEmail}/>
          <label htmlFor="department">Department</label>
          <input id="department" type="text" value={department}  onChange={this.onChangeDepartment}/>
        </form>
     
    )
  }
}

export default UserForm
