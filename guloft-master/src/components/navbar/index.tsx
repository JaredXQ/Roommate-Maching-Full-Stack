import React, { useState } from 'react'
import styles from './index.module.scss'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { Link, useNavigate } from 'react-router-dom'
import { useLoginContext } from '../../contexts/login-context'
import Axios from 'axios'
import classNames from 'classnames'

const Navbar: React.FC = () => {
  const { logined, setUserId, setToken } = useLoginContext()

  const avatarPath = process.env.PUBLIC_URL + '/assets/default_avatar.png' // TODO
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    if (logined) {
      Axios.post(process.env.REACT_APP_BACKEND_DOMAIN + '/users/logout')
        .then(res => {
          console.log(res)
          setUserId(undefined)
          setToken(undefined)
          window.location.href = process.env.PUBLIC_URL;
          // navigate('/')
          // window.location.href = '/'
        })
        .catch(() => {
          alert('logout failed, try again')
        })
    }
  }

  return (
    <div className={styles.navbar}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div className={styles.logo}>
          <img
            className={styles.logoImg}
            src={process.env.PUBLIC_URL + '/assets/logo.svg'}
            alt="logo"
          />
          <div className={styles.brandName}>GuLoft</div>
        </div>
      </Link>
      <div className={styles.rightNav}>
        <Link to="/question-intro" style={{ textDecoration: 'none' }}>
          <div className={styles.text}>Questionnaire</div>
        </Link>
        <Link to="/matching" style={{ textDecoration: 'none' }}>
          <div className={styles.text}>Match</div>
        </Link>
        <div className={styles.profile}>
          <img className={styles.avatar} src={avatarPath} alt="avatar" />
          <div className={styles.dropdown}>
            <ArrowDropDownIcon
              className={styles.dropdownIcon}
              onClick={() => setDropdownVisible(!dropdownVisible)}
            />
            {dropdownVisible && (
              <div className={styles.dropdownContent}>
                <Link to="/profile" className={styles.text}>
                  My GuLoft
                </Link>
                <div
                  className={classNames(styles.text, styles.logoutText)}
                  onClick={handleLogout}
                >
                  Log Out
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
