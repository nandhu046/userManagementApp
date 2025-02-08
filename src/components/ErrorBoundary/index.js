import './index.css'

const ErrorBoundary = props => {
  const {delId} = props

  return <p className="del-msg">user {delId} deleted</p>
}

export default ErrorBoundary
