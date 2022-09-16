import React from 'react'
import Navbar from '../navbar'
import styles from './index.module.scss'

const Loading: React.FC = () => {
  return (
    <div className={styles.loadingPage}>
      <Navbar />
      <h1 className={styles.message}>
        Loading...
      </h1>
    </div>
  )
}

export default Loading
