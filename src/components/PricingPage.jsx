import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Box, Container, Text, Button, VStack, HStack } from '@chakra-ui/react'

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$9',
    period: '/month',
    tokens: '3.5M tokens',
    description: 'For occasional use',
    featured: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19',
    period: '/month',
    tokens: '10M tokens',
    description: 'For regular interviews',
    featured: true,
  },
]

function PricingPage() {
  const navigate = useNavigate()

  function handleSelectPlan(planId) {
    localStorage.setItem('pendingPlan', planId)
    navigate('/app')
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" borderBottom="1px solid" borderColor="gray.200" py={4}>
        <Container maxW="800px">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Text
              as={RouterLink}
              to="/"
              fontSize="xl"
              fontWeight="bold"
              color="gray.700"
              _hover={{ textDecoration: 'none' }}
            >
              Helper Tool
            </Text>
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
        </Container>
      </Box>

      {/* Pricing */}
      <Container maxW="800px" py={16}>
        <VStack gap={8}>
          <VStack gap={2} textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" color="gray.800">
              Simple Pricing
            </Text>
            <Text fontSize="md" color="gray.600">
              Choose a plan that fits your needs
            </Text>
          </VStack>

          <HStack gap={6} align="stretch" flexWrap="wrap" justify="center">
            {plans.map((plan) => (
              <Box
                key={plan.id}
                bg="white"
                p={6}
                borderRadius="xl"
                boxShadow={plan.featured ? 'lg' : 'sm'}
                border="2px solid"
                borderColor={plan.featured ? 'orange.500' : 'gray.200'}
                w="280px"
                position="relative"
              >
                {plan.featured && (
                  <Box
                    position="absolute"
                    top="-12px"
                    left="50%"
                    transform="translateX(-50%)"
                    bg="orange.500"
                    color="white"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    Popular
                  </Box>
                )}
                <VStack gap={4} align="stretch">
                  <VStack gap={1}>
                    <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                      {plan.name}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {plan.description}
                    </Text>
                  </VStack>

                  <Box textAlign="center" py={2}>
                    <Text as="span" fontSize="4xl" fontWeight="bold" color="gray.800">
                      {plan.price}
                    </Text>
                    <Text as="span" fontSize="md" color="gray.500">
                      {plan.period}
                    </Text>
                  </Box>

                  <Text fontSize="sm" color="gray.600" textAlign="center">
                    {plan.tokens}
                  </Text>

                  <Button
                    bg={plan.featured ? 'orange.500' : 'gray.800'}
                    color="white"
                    _hover={{ bg: plan.featured ? 'orange.600' : 'gray.700' }}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    Choose {plan.name}
                  </Button>
                </VStack>
              </Box>
            ))}
          </HStack>

          <Text fontSize="xs" color="gray.400" textAlign="center" maxW="400px">
            All plans include access to the desktop app. Cancel anytime.
          </Text>
        </VStack>
      </Container>
    </Box>
  )
}

export default PricingPage
