import { useState, useEffect } from 'react'
import { getCurrentUser, fetchAuthSession, signInWithRedirect, signOut } from 'aws-amplify/auth'
import { Box, Container, Flex, Text, Button, Spinner, Center, VStack, Heading } from '@chakra-ui/react'
import Header from './components/Header'
import HomeTab from './components/HomeTab'
import DevelopmentTab from './components/DevelopmentTab'

function App() {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('home')

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
      <Center h="100vh">
        <Spinner size="xl" color="orange.500" borderWidth="4px" />
      </Center>
    )
  }

  if (!user) {
    return (
      <Center h="100vh" bg="gray.50">
        <Box
          bg="white"
          p={10}
          borderRadius="xl"
          boxShadow="lg"
          textAlign="center"
          maxW="400px"
          w="90%"
        >
          <VStack gap={6}>
            <VStack gap={2}>
              <Heading size="lg" color="gray.700">
                Helper Tool
              </Heading>
              <Text color="gray.500">
                Sign in to access your dashboard
              </Text>
            </VStack>
            <Button
              size="lg"
              w="full"
              bg="orange.500"
              color="white"
              _hover={{ bg: 'orange.600' }}
              onClick={login}
            >
              Sign in with Cognito
            </Button>
          </VStack>
        </Box>
      </Center>
    )
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Header email={user.email} onLogout={logout} />

      <Container maxW="800px" py={6}>
        <Box bg="white" borderRadius="xl" boxShadow="sm" overflow="hidden">
          {/* Custom Tabs */}
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

          {/* Tab Content */}
          <Box p={6}>
            {activeTab === 'home' && <HomeTab />}
            {activeTab === 'development' && <DevelopmentTab session={session} user={user} />}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default App
