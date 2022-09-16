import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import DetailCard from '../../components/detail-card'
import Navbar from '../../components/navbar'
import RoommateCard, { CardSize } from '../../components/roommate-card'
import { useLoginContext, useRequireLogin } from '../../contexts/login-context'
import styles from './index.module.scss'
import Axios from 'axios'
import { RoommateData } from '../matching'

const Profile: React.FC = () => {
  useRequireLogin()

  const { token } = useLoginContext()
  const [showDetail, setShowDetail] = useState<boolean>(false)
  const [detailUser, setDetailUser] = useState<RoommateData>()
  const [favIds, setFavIds] = useState<Array<string>>()

  const handleShowDetail = (roommateId: string, score: number) => {
    setShowDetail(true)
    setDetailUser({ roommateId, score })
  }

  const closeDetail = () => {
    setShowDetail(false)
  }

  const getFavs = () => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    }

    try {
      Axios.get(
        process.env.REACT_APP_BACKEND_DOMAIN + '/user-favlist/me',
        config,
      ).then(res => {
        console.log(res.data.data)
        setFavIds(res.data.data)
      })
    } catch (err) {
      setFavIds([])
      console.log(err)
    }

    loadFavs()
  }

  const loadFavs = () => {
    if (favIds) {
      console.log(favIds)
      return favIds.map(fav => {
        const score = Math.floor(Math.random() * 40) + 30
        return (
          <div key={fav}>
            <RoommateCard
              cardSize={CardSize.Small}
              roommateId={fav}
              score={score}
              handleShowDetail={() => handleShowDetail(fav, score)}
            />
          </div>
        )
      })
    }
  }

  useEffect(() => {
    if (!favIds) {
      getFavs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favIds])

  return (
    <div className={styles.profile}>
      <Navbar />
      <div className={classNames(styles.content, showDetail && styles.blur)}>
        <div className={styles.title}>Favorite Matches</div>
        <div className={styles.favMatches}>{loadFavs()}</div>
      </div>

      {showDetail && detailUser && (
        <div className={styles.detailedCard}>
          <DetailCard
            roommateId={detailUser.roommateId}
            score={detailUser.score}
            closeDetail={closeDetail}
          />
        </div>
      )}
    </div>
  )
}

export default Profile
