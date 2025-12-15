import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { fetchAuthSession, signOut, getCurrentUser } from 'aws-amplify/auth'
import { Authenticator, useAuthenticator, ThemeProvider } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { Box, Container, Flex, Spinner, Center } from '@chakra-ui/react'
import Header from './components/Header'
import HomeTab from './components/HomeTab'
import DevelopmentTab from './components/DevelopmentTab'
import LandingPage from './components/LandingPage'
import PricingPage from './components/PricingPage'

const authTheme = {
  name: 'helper-tool-theme',
  tokens: {
    colors: {
      background: {
        primary: { value: '#F7FAFC' },
      },
      font: {
        interactive: { value: '#ED8936' },
      },
      brand: {
        primary: {
          10: { value: '#FFF5EB' },
          20: { value: '#FEEBD2' },
          40: { value: '#FBD5A7' },
          60: { value: '#ED8936' },
          80: { value: '#DD6B20' },
          90: { value: '#C05621' },
          100: { value: '#9C4221' },
        },
      },
    },
    components: {
      button: {
        primary: {
          backgroundColor: { value: '#ED8936' },
          _hover: {
            backgroundColor: { value: '#DD6B20' },
          },
        },
      },
      tabs: {
        item: {
          _active: {
            color: { value: '#ED8936' },
            borderColor: { value: '#ED8936' },
          },
        },
      },
    },
  },
}

// Protected dashboard content
function Dashboard() {
  const { user: authUser, signOut: amplifySignOut } = useAuthenticator()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('home')

  useEffect(() => {
    loadSession()
  }, [authUser])

  async function loadSession() {
    try {
      const authSession = await fetchAuthSession()
      setSession(authSession)
      setEmail(authSession.tokens?.idToken?.payload?.email)

      // Check for pending plan from pricing page
      const pendingPlan = localStorage.getItem('pendingPlan')
      if (pendingPlan) {
        localStorage.removeItem('pendingPlan')
        handlePendingCheckout(pendingPlan, authSession)
      }
    } catch {
      setSession(null)
      setEmail(null)
    } finally {
      setLoading(false)
    }
  }

  async function handlePendingCheckout(plan, authSession) {
    try {
      const token = authSession.tokens.idToken.toString()
      const response = await fetch(`${import.meta.env.VITE_API_URL}/stripe/checkout-url?plan=${plan}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        if (data.url) {
          window.location.href = data.url
        }
      }
    } catch (error) {
      console.error('Pending checkout failed:', error)
    }
  }

  async function handleLogout() {
    await signOut()
    amplifySignOut()
    navigate('/')
  }

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="orange.500" borderWidth="4px" />
      </Center>
    )
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Header email={email} onLogout={handleLogout} />

      <Container maxW="800px" py={6}>
        <Box bg="white" borderRadius="xl" boxShadow="sm" overflow="hidden">
          <Flex borderBottom="1px solid" borderColor="gray.200">
            <Box
              as="button"
              flex={1}
              py={3}
              fontWeight="medium"
              borderBottom="3px solid"
              borderColor={activeTab === 'home' ? 'orange.500' : 'transparent'}
              color={activeTab === 'home' ? 'orange.500' : 'gray.500'}
              bg={activeTab === 'home' ? 'white' : 'gray.50'}
              onClick={() => setActiveTab('home')}
              _hover={{ bg: 'gray.100' }}
              transition="all 0.2s"
            >
              Home
            </Box>
            <Box
              as="button"
              flex={1}
              py={3}
              fontWeight="medium"
              borderBottom="3px solid"
              borderColor={activeTab === 'development' ? 'orange.500' : 'transparent'}
              color={activeTab === 'development' ? 'orange.500' : 'gray.500'}
              bg={activeTab === 'development' ? 'white' : 'gray.50'}
              onClick={() => setActiveTab('development')}
              _hover={{ bg: 'gray.100' }}
              transition="all 0.2s"
            >
              Development
            </Box>
          </Flex>

          <Box p={6}>
            {activeTab === 'home' && <HomeTab />}
            {activeTab === 'development' && <DevelopmentTab session={session} user={authUser} />}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

// Protected route wrapper with Authenticator
function ProtectedRoute() {
  return (
    <ThemeProvider theme={authTheme}>
      <Authenticator
        hideSignUp={false}
        socialProviders={['google']}
        components={{
          Header() {
            return (
              <Box textAlign="center" py={6}>
                <Box fontSize="2xl" fontWeight="bold" color="gray.700">
                  Helper Tool
                </Box>
              </Box>
            )
          },
        }}
      >
        <Dashboard />
      </Authenticator>
    </ThemeProvider>
  )
}

// Public landing page wrapper - redirects to /app if authenticated
function PublicLanding() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    getCurrentUser()
      .then(() => navigate('/app', { replace: true }))
      .catch(() => setChecking(false))
  }, [navigate])

  if (checking) {
    return (
      <Center h="100vh" bg="gray.50">
        <Spinner size="xl" color="orange.500" borderWidth="4px" />
      </Center>
    )
  }

  return <LandingPage />
}

// Public pricing page wrapper - redirects to /app if authenticated
function PublicPricing() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    getCurrentUser()
      .then(() => navigate('/app', { replace: true }))
      .catch(() => setChecking(false))
  }, [navigate])

  if (checking) {
    return (
      <Center h="100vh" bg="gray.50">
        <Spinner size="xl" color="orange.500" borderWidth="4px" />
      </Center>
    )
  }

  return <PricingPage />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLanding />} />
        <Route path="/pricing" element={<PublicPricing />} />
        <Route path="/app" element={<ProtectedRoute />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
