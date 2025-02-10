import './index.css'

const fieldsChecked = []   // Using const variable instead of class component for make it simple
const ErrorBoundary = props => {
  const {id=null, firstName=null, lastName=null, email=null, department=null, isSubmitted=null} = props

  const validate = () => {
    if (id !== null) {       // on getting each field entered value. validation takes place 
      const condition = /^\d+$/.test(id)
      if (id.length > 0 && condition === false) {
        fieldsChecked[0] = 0
        return <p className='verify-msg'>Id should be a number</p>
      }
      if (condition) {
        fieldsChecked[0] = 1
      } else {
        fieldsChecked[0] = 0
      }
    } else if (firstName !== null) {
      const condition = /^[A-Za-z]+$/.test(firstName)
      if (firstName.length > 0 && condition === false) {
        fieldsChecked[1] = 0
        return <p className='verify-msg'>provide alphabets only</p>
      }
      if (condition) {
        fieldsChecked[1] = 1
      } else {
        fieldsChecked[1] = 0
      }
    } else if (lastName !== null) {
      const condition = /^[A-Za-z]+$/.test(lastName)
      if (lastName.length > 0 && condition === false) {
        fieldsChecked[2] = 0
        return <p className='verify-msg'>provide alphabets only</p>
      }
      if (condition) {
        fieldsChecked[2] = 1
      } else {
        fieldsChecked[2] = 0
      } 
    } else if (email !== null) {
      const condition = /^[a-zA-Z@._0-9]+$/.test(email)
      if (email.length > 0 && condition === false) {
        fieldsChecked[3] = 0
        return <p className='verify-msg'>can have alphabets,@,. only</p>
      }
      if (condition) {
        fieldsChecked[3] = 1
      } else {
        fieldsChecked[3] = 0
      }
    } else if (department !== null) {
      const condition = /^[a-zA-Z\s-]+$/.test(department)
      if (department.length > 0 && condition === false) {
        fieldsChecked[4] = 0
        return <p className='verify-msg'>can have alphabets,-,spaces only</p>
      }
      if (condition) {
        fieldsChecked[4] = 1
      } else {
        fieldsChecked[4] = 0
      }
    } else if (isSubmitted) {              // on submit form. warns for empty fields 
      return <p className='verify-msg'>*Required</p>
    }
    return null
  }

  return <>{validate()}</>
}

export {ErrorBoundary, fieldsChecked}
