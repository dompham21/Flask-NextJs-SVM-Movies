import React from 'react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import verifyToken from '../services/verifyToken'

const withAuth = (WrappedComponent) => {
  return (props) => {
    const Router = useRouter()
    const [verified, setVerified] = useState(false)

    useEffect(() => {
        const auth = async () => {
            const accessToken = localStorage.getItem('accessToken')
            // if no accessToken was found,then we redirect to "/" page.
            if (!accessToken) {
              localStorage.removeItem('accessToken')
              Router.push('/login')
            } else {
              // we call the api that verifies the token.
              const result = await verifyToken(accessToken)

              if (result) {
                setVerified(result)
              } else {
                setVerified(result)
                localStorage.removeItem('accessToken')
                Router.push('/login')
              }
            }
        }
        auth()
    }, [])

    if (verified) {
      return <WrappedComponent {...props} />
    } else {
      return null
    }
  }
}

export default withAuth