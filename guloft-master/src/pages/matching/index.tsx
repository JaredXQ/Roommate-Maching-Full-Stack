import Axios from 'axios'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import DetailCard from '../../components/detail-card'
import Loading from '../../components/loading'
import MatchCard from '../../components/match-card'
import Navbar from '../../components/navbar'
import RoommateCard, { CardSize } from '../../components/roommate-card'
import { useLoginContext, useRequireLogin } from '../../contexts/login-context'
import styles from './index.module.scss'

export interface RoommateData {
  roommateId: string
  score: number
}

const Matching: React.FC = () => {
  useRequireLogin()
  const { token } = useLoginContext()
  const [showDetail, setShowDetail] = useState<boolean>(false)
  const [detailUser, setDetailUser] = useState<RoommateData>()
  const [roommates, setRoommates] = useState<Array<RoommateData>>()

  const handleShowDetail = (roommateId: string, score: number) => {
    setShowDetail(true)
    setDetailUser({ roommateId, score })
  }

  const closeDetail = () => {
    setShowDetail(false)
  }

  const refresh = () => {
    // refresh matching page
    setRoommates(undefined)
  }

  const getMatchResult = () => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    }

    Axios.get(
      process.env.REACT_APP_BACKEND_DOMAIN + '/matching-result/me',
      config,
    ).then(res => {
      try {
        console.log(res.data.data)
        setRoommates(res.data.data)
      } catch (err) {
        console.log(err)
      }
    })
  }

  useEffect(() => {
    if (!roommates) {
      getMatchResult()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roommates])

  if (!roommates) {
    return (
      <div className={styles.matching}>
        <Navbar />
        <Loading />
      </div>
    )
  }

  return (
    <div className={styles.matching}>
      <Navbar />
      <div className={classNames(styles.content, showDetail && styles.blur)}>
        <div className={styles.top}>
          <div className={styles.large}>
            <RoommateCard
              cardSize={CardSize.Large}
              roommateId={roommates[0].roommateId}
              score={roommates[0].score}
              handleShowDetail={() =>
                handleShowDetail(roommates[0].roommateId, roommates[0].score)
              }
            />
          </div>
          <div className={styles.medium}>
            <RoommateCard
              cardSize={CardSize.Medium}
              roommateId={roommates[1].roommateId}
              score={roommates[1].score}
              handleShowDetail={() =>
                handleShowDetail(roommates[1].roommateId, roommates[1].score)
              }
            />
            <RoommateCard
              cardSize={CardSize.Medium}
              roommateId={roommates[2].roommateId}
              score={roommates[2].score}
              handleShowDetail={() =>
                handleShowDetail(roommates[2].roommateId, roommates[2].score)
              }
            />
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.small}>
            <RoommateCard
              cardSize={CardSize.Small}
              roommateId={roommates[3].roommateId}
              score={roommates[3].score}
              handleShowDetail={() =>
                handleShowDetail(roommates[3].roommateId, roommates[3].score)
              }
            />
            <RoommateCard
              cardSize={CardSize.Small}
              roommateId={roommates[4].roommateId}
              score={roommates[4].score}
              handleShowDetail={() =>
                handleShowDetail(roommates[4].roommateId, roommates[4].score)
              }
            />
            <RoommateCard
              cardSize={CardSize.Small}
              roommateId={roommates[5].roommateId}
              score={roommates[5].score}
              handleShowDetail={() =>
                handleShowDetail(roommates[5].roommateId, roommates[5].score)
              }
            />
            <MatchCard refresh={refresh} />
          </div>
        </div>
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

export default Matching
