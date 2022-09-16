import React from 'react'
import styles from './index.module.scss'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'

export interface MatchCardProps {
  refresh: () => void
}

const MatchCard: React.FC<MatchCardProps> = ({ refresh }) => {
  return (
    <div className={styles.matchCard} onClick={refresh}>
      <div className={styles.text}>Go Match</div>
      <ArrowRightIcon className={styles.arrow} />
    </div>
  )
}

export default MatchCard
