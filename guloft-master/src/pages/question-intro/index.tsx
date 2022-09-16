import React from 'react'
import Navbar from '../../components/navbar'
import styles from './index.module.scss'
import { Link } from 'react-router-dom'
import { useRequireLogin } from '../../contexts/login-context'

const QuestionIntro: React.FC = () => {
  useRequireLogin()
  
  return (
    <div className={styles.questions}>
      <Navbar />
      <div className={styles.startpage}>
        <img
          className={styles.logo}
          src={process.env.PUBLIC_URL + '/assets/logo.svg'}
          alt="logo"
        />
        <div className={styles.text}>
          Please fill out the questionnaire before continuing to match roommates
          on Guloft.
        </div>

        <Link to="/questions" style={{ textDecoration: 'none' }}>
          <div className={styles.btn}>Start </div>
        </Link>
      </div>
    </div>
  )
}

export default QuestionIntro
