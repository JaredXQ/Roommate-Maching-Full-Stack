import Axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import Navbar from '../../components/navbar'
import {
  useLoginContext,
  useRequireNotLogin,
} from '../../contexts/login-context'
import styles from './index.module.scss'

const Login: React.FC = () => {
  useRequireNotLogin()

  const { setUserId, setToken } = useLoginContext()

  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()
  const navigate = useNavigate()

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

    Axios.post(process.env.REACT_APP_BACKEND_DOMAIN + '/users/login', {
      email: email,
      password: password,
    })
      .then(res => {
        console.log(res)
        if (res.data.error) {
          console.log('error')
        } else if (res.data.user._id) {
          console.log(res.data.user._id)
          setUserId(res.data.user._id)
          setToken(res.data.token)
          navigate('/question-intro')
        }
      })
      .catch(() => {
        alert('login failed, try again')
      })
  }

  return (
    <div className={styles.login}>
      <Navbar />
      <div className={styles.auth}>
        <img
          className={styles.logo}
          src={process.env.PUBLIC_URL + '/assets/logo.svg'}
          alt="logo"
        />
        <form className={styles.forms} onSubmit={e => handleSubmit(e)}>
          <div className={styles.form}>
            <div className={styles.description}>Email</div>
            <input
              type="email"
              required={true}
              onChange={e => handleEmailChange(e.target.value)}
            />
          </div>
          <div className={styles.form}>
            <div className={styles.description}>Password</div>
            <input
              type="password"
              required={true}
              onChange={e => handlePasswordChange(e.target.value)}
            />
          </div>
          <input className={styles.btn} type="submit" value="Log In" />
        </form>
      </div>
    </div>
  )
}

export default Login
