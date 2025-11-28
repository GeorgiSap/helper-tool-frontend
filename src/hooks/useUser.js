import { useState, useEffect } from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'

export function useUser() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUserData()
  }, [])

  async function fetchUserData() {
    try {
      const session = await fetchAuthSession()
      const token = session.tokens.idToken.toString()

      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/current`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      } else {
        setError('Failed to fetch user data')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { userData, loading, error, refetch: fetchUserData }
}
