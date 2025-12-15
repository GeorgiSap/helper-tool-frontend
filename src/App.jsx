import { useState, useEffect } from 'react'
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

function AppContent() {
  const { user: authUser, signOut: amplifySignOut } = useAuthenticator()
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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null) // null = loading
  const [showAuth, setShowAuth] = useState(false)
  const [currentPage, setCurrentPage] = useState('landing') // 'landing', 'pricing'

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      await getCurrentUser()
      setIsAuthenticated(true)
    } catch {
      setIsAuthenticated(false)
    }
  }

  // Loading state
  if (isAuthenticated === null) {
    return (
      <Center h="100vh" bg="gray.50">
        <Spinner size="xl" color="orange.500" borderWidth="4px" />
      </Center>
    )
  }

  // Not authenticated - show landing page, pricing, or auth
  if (!isAuthenticated && !showAuth) {
    if (currentPage === 'pricing') {
      return (
        <PricingPage
          onSignIn={() => setShowAuth(true)}
          onSelectPlan={() => setShowAuth(true)}
          onBack={() => setCurrentPage('landing')}
        />
      )
    }
    return (
      <LandingPage
        onSignIn={() => setShowAuth(true)}
        onPricing={() => setCurrentPage('pricing')}
      />
    )
  }

  // Show authenticator (either user clicked sign in, or is authenticated)
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
        <AppContent />
      </Authenticator>
    </ThemeProvider>
  )
}

export default App
