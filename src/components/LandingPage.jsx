import { Link as RouterLink } from 'react-router-dom'
import { Box, Container, Text, Button, VStack, Link } from '@chakra-ui/react'

function LandingPage() {
  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" borderBottom="1px solid" borderColor="gray.200" py={4}>
        <Container maxW="800px">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Text fontSize="xl" fontWeight="bold" color="gray.700">
              Helper Tool
            </Text>
            <Box display="flex" gap={2}>
              <Button
                as={RouterLink}
                to="/pricing"
                variant="ghost"
                color="gray.600"
                fontWeight="medium"
                _hover={{ color: 'orange.500' }}
              >
                Pricing
              </Button>
              <Button
                as={RouterLink}
                to="/app"
                variant="ghost"
                color="gray.600"
                fontWeight="medium"
                _hover={{ color: 'orange.500' }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero */}
      <Container maxW="800px" py={16}>
        <VStack gap={8} textAlign="center">
          <VStack gap={4}>
            <Text fontSize="4xl" fontWeight="bold" color="gray.800" lineHeight="1.2">
              Think Clearly Under Interview Pressure
            </Text>
            <Text fontSize="lg" color="gray.600" maxW="600px">
              A desktop app that listens to your interview, transcribes questions in real-time,
              and provides structured points to help you reason through answers — discretely.
            </Text>
          </VStack>

          {/* CTA */}
          <VStack gap={2}>
            <Link href="https://d2zadbp5zwt661.cloudfront.net/HelperTool.dmg" download>
              <Button
                size="lg"
                bg="orange.500"
                color="white"
                px={8}
                _hover={{ bg: 'orange.600' }}
              >
                Download for macOS
              </Button>
            </Link>
            <Text fontSize="sm" color="gray.500" fontStyle="italic">
              Preview release
            </Text>
          </VStack>

          {/* Disclaimer */}
          <Text fontSize="xs" color="gray.400" maxW="400px">
            Designed to support preparation and structured thinking, not to replace your expertise.
          </Text>
        </VStack>
      </Container>
    </Box>
  )
}

export default LandingPage
