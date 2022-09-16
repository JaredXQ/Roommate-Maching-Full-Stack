import classNames from 'classnames'
import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/navbar'
import { useLoginContext } from '../../contexts/login-context'
import styles from './index.module.scss'

const Home: React.FC = () => {
  const { logined } = useLoginContext()

  return (
    <div className={styles.home}>
      <div className={styles.content}>
        <Navbar />
        <img
          className={styles.logo}
          src={process.env.PUBLIC_URL + '/assets/logo.svg'}
          alt="logo"
        />
        <div className={styles.text}>
          Do you know? Out of a total of{' '}
          <span className={styles.numtext}>2,333</span> people, there are{' '}
          <span className={styles.numtext}>144</span> who choose exactly the
          same answer as you do. <br />{' '}
          <span className={styles.numtext}>514</span> people have two questions
          that are the same as yours. <br />
          Maybe there will be the one you are looking for.
        </div>
        {!logined && (
          <div className={styles.auth}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <div className={classNames(styles.btn, styles.loginBtn)}>
                Log In
              </div>
            </Link>
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <div className={classNames(styles.btn, styles.signupBtn)}>
                Sign Up
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
