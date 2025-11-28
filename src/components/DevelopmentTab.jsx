import { Box, Text, Textarea, Button, Grid, Heading, VStack } from '@chakra-ui/react'
import { FiCopy } from 'react-icons/fi'

function DevelopmentTab({ session, user }) {
  const idToken = session.tokens.idToken.toString()
  const accessToken = session.tokens.accessToken.toString()
  const payload = session.tokens.idToken.payload

  function copyToClipboard(text, label) {
    navigator.clipboard.writeText(text)
    alert(`${label} copied!`)
  }

  return (
    <Box py={6}>
      <VStack gap={6} align="stretch">
        <Box bg="white" p={6} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <Heading size="md" mb={4}>User Information</Heading>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
            <Box>
              <Text fontSize="sm" color="gray.500">Username</Text>
              <Text fontWeight="medium">{user.username}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Email</Text>
              <Text fontWeight="medium">{user.email || 'N/A'}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Email Verified</Text>
              <Text fontWeight="medium">{payload.email_verified ? 'Yes' : 'No'}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">User ID</Text>
              <Text fontWeight="medium" fontSize="sm">{user.userId}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Token Expires</Text>
              <Text fontWeight="medium">{new Date(payload.exp * 1000).toLocaleString()}</Text>
            </Box>
          </Grid>
        </Box>

        <Box bg="white" p={6} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <Heading size="md" mb={2}>ID Token</Heading>
          <Text fontSize="sm" color="gray.500" mb={2}>For testing purposes</Text>
          <Textarea
            value={idToken}
            readOnly
            fontFamily="mono"
            fontSize="xs"
            rows={4}
            bg="gray.50"
          />
          <Button
            size="sm"
            mt={3}
            onClick={() => copyToClipboard(idToken, 'ID Token')}
          >
            <FiCopy style={{ marginRight: 8 }} />
            Copy ID Token
          </Button>
        </Box>

        <Box bg="white" p={6} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <Heading size="md" mb={2}>Access Token</Heading>
          <Text fontSize="sm" color="gray.500" mb={2}>For API calls</Text>
          <Textarea
            value={accessToken}
            readOnly
            fontFamily="mono"
            fontSize="xs"
            rows={4}
            bg="gray.50"
          />
          <Button
            size="sm"
            mt={3}
            onClick={() => copyToClipboard(accessToken, 'Access Token')}
          >
            <FiCopy style={{ marginRight: 8 }} />
            Copy Access Token
          </Button>
        </Box>
      </VStack>
    </Box>
  )
}

export default DevelopmentTab
