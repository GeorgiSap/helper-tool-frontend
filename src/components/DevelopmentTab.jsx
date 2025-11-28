import './DevelopmentTab.css'

function DevelopmentTab({ session, user }) {
  const idToken = session.tokens.idToken.toString()
  const accessToken = session.tokens.accessToken.toString()
  const payload = session.tokens.idToken.payload

  function copyToClipboard(text, buttonId) {
    navigator.clipboard.writeText(text)
    const button = document.getElementById(buttonId)
    const originalText = button.textContent
    button.textContent = '✓ Copied!'
    button.style.backgroundColor = '#28a745'
    setTimeout(() => {
      button.textContent = originalText
      button.style.backgroundColor = '#FF9900'
    }, 2000)
  }

  return (
    <div className="development-tab">
      <div className="info-box">
        <h3>User Information</h3>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email || 'N/A'}</p>
        <p><strong>Email Verified:</strong> {payload.email_verified ? 'Yes' : 'No'}</p>
        <p><strong>User ID:</strong> {user.userId}</p>
        <p><strong>Token Expires:</strong> {new Date(payload.exp * 1000).toLocaleString()}</p>

        <hr />

        <h3>ID Token (for testing)</h3>
        <textarea readOnly value={idToken} />
        <button id="copyIdBtn" onClick={() => copyToClipboard(idToken, 'copyIdBtn')}>
          Copy ID Token
        </button>

        <h3>Access Token (for API calls)</h3>
        <textarea readOnly value={accessToken} />
        <button id="copyAccessBtn" onClick={() => copyToClipboard(accessToken, 'copyAccessBtn')}>
          Copy Access Token
        </button>
      </div>
    </div>
  )
}

export default DevelopmentTab
