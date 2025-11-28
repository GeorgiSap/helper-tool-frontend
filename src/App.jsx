import { useState, useEffect } from 'react'
import { fetchAuthSession, signOut } from 'aws-amplify/auth'
import { Authenticator, useAuthenticator, ThemeProvider } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { Box, Container, Flex, Spinner, Center } from '@chakra-ui/react'
import Header from './components/Header'
import HomeTab from './components/HomeTab'
import DevelopmentTab from './components/DevelopmentTab'

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
    } catch {
      setSession(null)
      setEmail(null)
    } finally {
      setLoading(false)
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
  return (
    <ThemeProvider theme={authTheme}>
      <Authenticator
        hideSignUp={false}
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
