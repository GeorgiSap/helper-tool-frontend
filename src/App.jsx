import { useState, useEffect } from 'react'
import { getCurrentUser, fetchAuthSession, signInWithRedirect, signOut } from 'aws-amplify/auth'
import ProfileTab from './components/ProfileTab'
import DevelopmentTab from './components/DevelopmentTab'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const currentUser = await getCurrentUser()
      const authSession = await fetchAuthSession()

      if (!authSession.tokens) {
        throw new Error('No tokens')
      }

      const email = authSession.tokens.idToken?.payload?.email

      setUser({ ...currentUser, email })
      setSession(authSession)
    } catch {
      setUser(null)
      setSession(null)
    } finally {
      setLoading(false)
    }
  }

  function login() {
    signInWithRedirect()
  }

  async function logout() {
    await signOut()
    setUser(null)
    setSession(null)
  }

  if (loading) {
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container">
        <div className="status">Not Authenticated</div>
        <button onClick={login}>Login with Cognito</button>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`tab ${activeTab === 'development' ? 'active' : ''}`}
          onClick={() => setActiveTab('development')}
        >
          Development
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'profile' && (
          <ProfileTab email={user.email} onLogout={logout} />
        )}
        {activeTab === 'development' && (
          <DevelopmentTab session={session} user={user} />
        )}
      </div>
    </div>
  )
}

export default App
