import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../../components/navbar'
import styles from './index.module.scss'
import ProgressBar from '../../archieve/progress-bar'
import { infoQ1, infoQ2, infoQ3 } from './questionDetails'
const questionComps = [infoQ1, infoQ2, infoQ3]

export const PersonalInfo = [
  'Your College',
  'Your major & year',
  'Your gender',
  'Your sleeping schedule?',
  'Do you cook?',
  'Do you smoke?',
  'Are you Introvert?',
  'Do you plan to have pets?',
  'Are you fairly clean?',
  'Do you play loud music?',
]

export const MatchingInfo = [
  'Same major roommate?',
  'Different gender roommate?',
  'Roommates smoke?',
  'Same sleeping schedule?',
  'Eat together?',
  'Out going roommates?',
  'Roommate have pets?',
  'Fairly clean roommate?',
  'Roommate play loud music?',
]

const Questions: React.FC = () => {
  let { id } = useParams()
  if (id == undefined) id = '0'
  const pageIndex = parseInt(id)

  //!TODO doesn't work yet
  //!TODO doesn't work yet
  const [reached, setReached] = useState(0)
  console.log(reached)
  if (pageIndex > reached) setReached(pageIndex)

  let section
  if (pageIndex == 0) {
    section = (
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

        <Link to="/questions/1" style={{ textDecoration: 'none' }}>
          <div className={styles.btn}>Start </div>
        </Link>
      </div>
    )
  } else if (pageIndex < 11) {
    section = (
      <div>
        <div>{questionComps[pageIndex - 1]}</div>
        <div className={styles.progressBar}>
          <button className={styles.btn}>Your info</button>
          <ProgressBar
            questions={PersonalInfo}
            isDone={false}
            curr={pageIndex - 1}
            highlight={reached - 1}
          />
          <button className={styles.btn}>Matching info</button>
        </div>
      </div>
    )
  } else if (pageIndex == 11) {
    section = (
      <div className={styles.progressBar}>
        <button className={styles.btn}>Your info</button>
        <ProgressBar
          questions={PersonalInfo}
          isDone={true}
          curr={pageIndex - 1}
          highlight={reached - 1}
        />
        <button className={styles.btn}>Matching info</button>
      </div>
    )
  } else if (pageIndex < 21) {
    section = (
      <div className={styles.progressBar}>
        <button className={styles.btn}>
          <a href={'/questions/11'}>Your info</a>
        </button>
        <button className={styles.btn}>Matching info</button>
        <ProgressBar
          questions={MatchingInfo}
          isDone={false}
          curr={pageIndex - 12}
          highlight={reached - 12}
        />
      </div>
    )
  } else {
    section = (
      <div className={styles.progressBar}>
        <button className={styles.btn}>Your info</button>
        <button className={styles.btn}>Matching info</button>
        <ProgressBar
          questions={MatchingInfo}
          isDone={true}
          curr={pageIndex - 12}
          highlight={reached - 12}
        />
      </div>
    )
  }

  return (
    <div className={styles.questions}>
      <Navbar />
      {section}
    </div>
  )
}

export default Questions
