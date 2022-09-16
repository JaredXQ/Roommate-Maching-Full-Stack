import Axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import Navbar from '../../components/navbar'
import {
  useLoginContext,
  useRequireNotLogin,
} from '../../contexts/login-context'
import styles from './index.module.scss'

const Signup: React.FC = () => {
  useRequireNotLogin()

  const { setUserId, setToken } = useLoginContext()

  const [email, setEmail] = useState<string>()
  const [username, setUsername] = useState<string>()
  const [password, setPassword] = useState<string>()
  const navigate = useNavigate()

  const handleNameChange = (newName: string) => {
    setUsername(newName)
    // console.log(newName)
  }

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail)
    // console.log(newEmail)
  }

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword)
    // console.log(newPassword)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    Axios.post(process.env.REACT_APP_BACKEND_DOMAIN + '/users', {
      username: username,
      email: email,
      password: password,
    }).then(res => {
      console.log(res)
      if (res.data.error) {
        alert('signup failed, update info')
      } else if (res.data.user._id) {
        setUserId(res.data.user._id)
        setToken(res.data.token)
        navigate('/question-intro')
      }
    })
    .catch(err => {
      alert('signup failed, update info')
    })
  }

  return (
    <div className={styles.signup}>
      <Navbar />
      <div className={styles.content}>
        <img
          className={styles.logo}
          src={process.env.PUBLIC_URL + '/assets/logo.svg'}
          alt="logo"
        />
        <form className={styles.forms} onSubmit={e => handleSubmit(e)}>
          <div className={styles.form}>
            <div className={styles.description}>Username*</div>
            <input
              type="text"
              id={'username-input'}
              required={true}
              onChange={e => handleNameChange(e.target.value)}
            />
          </div>
          <div className={styles.form}>
            <div className={styles.description}>Email*</div>
            <input
              type="email"
              id={'email-input'}
              required={true}
              onChange={e => handleEmailChange(e.target.value)}
            />
          </div>
          <div className={styles.form}>
            <div className={styles.description}>Password*</div>
            <input
              type="password"
              id={'pwd-input'}
              required={true}
              onChange={e => handlePasswordChange(e.target.value)}
            />
          </div>
          <input className={styles.btn} type="submit" value="Sign Up" />
        </form>
      </div>
    </div>
  )
}

export default Signup
