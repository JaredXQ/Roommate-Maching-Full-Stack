import React, { useContext, useEffect, useState } from 'react'
import Axios from 'axios'
import Loading from '../components/loading'
import { useNavigate } from 'react-router'

export interface LoginContext {
  userId?: string
  setUserId: React.Dispatch<React.SetStateAction<string | undefined>>
  token?: string
  setToken: React.Dispatch<React.SetStateAction<string | undefined>>
  logined: boolean
}

const context = React.createContext({} as LoginContext)

export const useLoginContext = () => useContext(context)

export const useRequireLogin = () => {
  const { logined } = useLoginContext()
  const navigate = useNavigate()

  if (!logined) {
    // location.href = '/login'
    navigate('/login')
  }
}

export const useRequireNotLogin = () => {
  const { logined } = useLoginContext()
  const navigate = useNavigate()

  if (logined) {
    // location.href = '/'
    navigate('/')
  }
}

export const LoginProvider: React.FC = ({ children }) => {
  const [initialized, setInitialized] = useState<boolean>(false)
  const [logined, setLogined] = useState<boolean>(false)
  const [userId, setUserId] = useState<string>()
  const [token, setToken] = useState<string>()

  const getUserId = async () => {
    try {
      const res = await Axios.get(
        process.env.REACT_APP_BACKEND_DOMAIN + '/auth/session',
      )
      return res.data.userId
    } catch (error) {
      console.error('Error:', error)
      return undefined
    }
  }

  useEffect(() => {
    const initialize = async () => {
      // request for user info
      const id = await getUserId()

      // if logined
      if (id || userId) {
        setUserId(id)
        // setToken(res.token)
        setLogined(true)
      }

      setInitialized(true)
    }

    initialize()
  }, [userId])

  if (!initialized) {
    return (
      <>
        <Loading />
      </>
    )
  }

  return (
    <context.Provider
      value={{
        userId,
        setUserId,
        token,
        setToken,
        logined,
      }}
    >
      {children}
    </context.Provider>
  )
}
