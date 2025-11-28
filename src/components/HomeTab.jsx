import { Box, VStack, Button, Heading, Text } from '@chakra-ui/react'
import { FiDownload } from 'react-icons/fi'
import { fetchAuthSession } from 'aws-amplify/auth'

function HomeTab() {
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
    <Box py={12}>
      <VStack gap={6}>
        <VStack gap={2}>
          <Heading size="lg" color="gray.700">
            Welcome to Helper Tool
          </Heading>
          <Text color="gray.500">
            Download the latest version of the application
          </Text>
        </VStack>

        <Button
          size="lg"
          bg="gray.800"
          color="white"
          _hover={{ bg: 'gray.700' }}
          onClick={downloadDMG}
          px={8}
          py={6}
          fontSize="md"
        >
          <FiDownload style={{ marginRight: 8 }} />
          Download DMG
        </Button>
      </VStack>
    </Box>
  )
}

export default HomeTab
