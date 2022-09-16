import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'
import Axios from 'axios'

export enum CardSize {
  Small,
  Medium,
  Large,
}

export interface RoomateCardProps {
  cardSize?: CardSize
  roommateId: string
  score: number
  expanded?: boolean
  handleShowDetail: (roommateId: string) => void
}

const RoommateCard: React.FC<RoomateCardProps> = ({
  cardSize = CardSize.Small,
  roommateId,
  score = 50,
  handleShowDetail,
}) => {
  const [avatarLink, setAvatarLink] = useState<string>(
    process.env.PUBLIC_URL + '/assets/default_avatar.png',
  )
  const [name, setName] = useState<string>()

  const loadInfo = () => {
    try {
      Axios.get(process.env.REACT_APP_BACKEND_DOMAIN + `/user-c-info/${roommateId}`).then(res => {
        const data = res.data.data
        setName(data.name)
      })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (!name) {
      loadInfo()
    }
  }, [])

  return (
    <div
      className={classNames(
        styles.roommateCard,
        cardSize === CardSize.Large && styles.roommateCardLarge,
        cardSize === CardSize.Small && styles.roommateCardSmall,
        cardSize === CardSize.Medium && styles.roommateCardMedium,
      )}
    >
      <div className={styles.leftCard}>
        <img className={styles.avatar} src={avatarLink} alt="avatar" />
      </div>
      <div className={styles.rightCard}>
        <div className={styles.matchingInfo}>
          <div className={styles.matchName}>{name}</div>
          <div className={styles.matchScore}>{score}%</div>
        </div>
        <div
          className={styles.detailBtn}
          onClick={() => handleShowDetail(roommateId)}
        >
          Detail
        </div>
      </div>
    </div>
  )
}

export default RoommateCard
