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
      <Box py={{ base: 16, md: 24 }}>
        <Container maxW="800px">
          <VStack gap={10} textAlign="center">
            {/* Headline */}
            <Text
              fontSize={{ base: '4xl', md: '5xl' }}
              fontWeight="bold"
              color="gray.800"
              lineHeight="1.1"
            >
              Your Interview Wingman
            </Text>

            {/* Features Card */}
            <Box
              bg="white"
              borderRadius="2xl"
              boxShadow="lg"
              p={{ base: 6, md: 8 }}
              w="100%"
              maxW="520px"
            >
              <VStack gap={4} align="start">
                <Text fontSize="md" color="gray.600">
                  <Text as="span" color="orange.500" fontWeight="bold" mr={2}>•</Text>
                  <Text as="span" fontWeight="semibold" color="gray.700">Question Recognition</Text>
                  <Text as="span"> — With structured talking points</Text>
                </Text>
                <Text fontSize="md" color="gray.600">
                  <Text as="span" color="orange.500" fontWeight="bold" mr={2}>•</Text>
                  <Text as="span" fontWeight="semibold" color="gray.700">Visual Task Analysis</Text>
                  <Text as="span"> — Screenshot-based problem support</Text>
                </Text>
                <Text fontSize="md" color="gray.600">
                  <Text as="span" color="orange.500" fontWeight="bold" mr={2}>•</Text>
                  <Text as="span" fontWeight="semibold" color="gray.700">99+ Languages</Text>
                  <Text as="span"> — Practice in your preferred language</Text>
                </Text>
                <Text fontSize="md" color="gray.600">
                  <Text as="span" color="orange.500" fontWeight="bold" mr={2}>•</Text>
                  <Text as="span" fontWeight="semibold" color="gray.700">Custom Context</Text>
                  <Text as="span"> — Add CV, notes, or job details</Text>
                </Text>
                <Text fontSize="md" color="gray.600">
                  <Text as="span" color="orange.500" fontWeight="bold" mr={2}>•</Text>
                  <Text as="span" fontWeight="semibold" color="gray.700">Hidden Layout</Text>
                  <Text as="span"> — Stays out of sight during screen share</Text>
                </Text>
              </VStack>
            </Box>

            {/* CTA */}
            <Link href="https://d2zadbp5zwt661.cloudfront.net/HelperTool.dmg" download>
              <Button
                size="lg"
                bg="orange.500"
                color="white"
                px={10}
                py={6}
                fontSize="md"
                fontWeight="semibold"
                borderRadius="xl"
                boxShadow="md"
                _hover={{ bg: 'orange.600', boxShadow: 'lg', transform: 'translateY(-1px)' }}
                transition="all 0.2s"
              >
                Download for macOS
              </Button>
            </Link>

            {/* Disclaimer */}
            <Text fontSize="xs" color="gray.400" maxW="400px">
              Designed to support your preparation and structured thinking, not to replace your expertise.
            </Text>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}

export default LandingPage
