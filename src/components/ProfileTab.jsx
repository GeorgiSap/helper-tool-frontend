import { useState } from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'
import './ProfileTab.css'

function ProfileTab({ email, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false)

  async function downloadDMG() {
    try {
      const authSession = await fetchAuthSession()
      const token = authSession.tokens.idToken.toString()

      const response = await fetch(`${import.meta.env.VITE_API_URL}/download/dmg`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.downloadUrl) {
          window.location.href = data.downloadUrl
        }
      } else {
        alert('Failed to get download URL')
      }
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to initiate download')
    }
  }

  return (
    <div className="profile-tab">
      <div className="profile-section">
        <div className="profile-icon" onClick={() => setShowDropdown(!showDropdown)}>
          <svg viewBox="0 0 24 24" width="48" height="48" fill="#666">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          {showDropdown && (
            <div className="dropdown">
              <button onClick={onLogout}>Logout</button>
            </div>
          )}
        </div>
        <p className="auth-status">Authenticated as <strong>{email}</strong></p>
        <button className="download-btn" onClick={downloadDMG}>Download DMG</button>
      </div>
    </div>
  )
}

export default ProfileTab
