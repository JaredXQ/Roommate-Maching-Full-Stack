import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'
import classNames from 'classnames'
import CloseIcon from '@mui/icons-material/Close'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import Axios from 'axios'
import { useLoginContext } from '../../contexts/login-context'

export interface DetailCardProps {
  roommateId: string
  score: number
  closeDetail: () => void
}

const DetailCard: React.FC<DetailCardProps> = ({
  roommateId,
  score = 50,
  closeDetail,
}) => {
  const { token } = useLoginContext()

  const [avatarLink, setAvatarLink] = useState<string>(
    process.env.PUBLIC_URL + '/assets/default_avatar.png',
  )
  const [name, setName] = useState<string>('Pigeon No.114514')
  const [gender, setGender] = useState<string>('Male')
  const [college, setCollege] = useState<string>('UIUC')
  const [year, setYear] = useState<number>(2023)
  const [email, setEmail] = useState<string>()

  const [msg, setMsg] = useState<string>('')
  const handleMsgChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMsg(e.target.value)
  }

  const [bookmarked, setBookmarked] = useState<boolean>(false)

  const handleBookmarked = () => {
    setBookmarked(!bookmarked)

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    }

    if (bookmarked) {
      Axios.delete(
        process.env.REACT_APP_BACKEND_DOMAIN + `/user-favlist/${roommateId}`,
        config,
      )
    } else {
      Axios.post(
        process.env.REACT_APP_BACKEND_DOMAIN + '/user-favlist/me',
        { userID: roommateId },
        config,
      )
    }
  }

  const loadInfo = () => {
    try {
      Axios.get(
        process.env.REACT_APP_BACKEND_DOMAIN + `/user-c-info/${roommateId}`,
      ).then(res => {
        console.log(res.data.data)
        const data = res.data.data
        setName(data.name)
        setGender(data.gender)
        setCollege(data.college)
        setYear(data.year)
        setEmail(data.email)
      })
    } catch (err) {
      console.log(err)
    }
  }

  const loadBookmark = () => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    }

    Axios.get(
      process.env.REACT_APP_BACKEND_DOMAIN +
        `/user-favlist/verify/${roommateId}`,
      config,
    ).then(res => {
      setBookmarked(res.data.data)
    })
  }

  useEffect(() => {
    if (!email) {
      loadInfo()
      loadBookmark()
    }
  }, [])

  return (
    <div className={styles.detailCard}>
      <CloseIcon className={styles.close} onClick={closeDetail} />
      <div className={styles.leftCard}>
        <img className={styles.avatar} src={avatarLink} alt="avatar" />
        <div className={styles.info}>
          <div className={styles.matchName}>{name}</div>
          <div className={styles.matchScore}>Matching Score: {score}%</div>
        </div>
        {bookmarked ? (
          <BookmarkIcon
            className={styles.bookmark}
            onClick={handleBookmarked}
          />
        ) : (
          <BookmarkBorderIcon
            className={styles.bookmark}
            onClick={handleBookmarked}
          />
        )}
      </div>
      <div className={styles.rightCard}>
        <div className={styles.matchingInfo}>
          <div className={styles.matchDescription}>
            <div className={styles.matchTitle}>Gender:</div>
            <div className={styles.matchTitle}>College:</div>
            <div className={styles.matchTitle}>Year:</div>
          </div>
          <div className={styles.matchInfos}>
            <div className={styles.matchInfo}>{gender}</div>
            <div className={styles.matchInfo}>{college}</div>
            <div className={styles.matchInfo}>{year}</div>
          </div>
        </div>
        <textarea
          rows={5}
          cols={5}
          className={styles.message}
          onChange={e => handleMsgChange(e)}
        ></textarea>
        <div className={styles.btns}>
          <div className={classNames(styles.btn, styles.profile)}>Profile</div>
          <div
            className={classNames(styles.btn, styles.invite)}
            onClick={() => {
              window.open(
                `mailto:${email}?subject=GuLoft%20--%20Interest%20In%20Being%20Roommate&body=${msg}`,
              )
            }}
          >
            Invite
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailCard
