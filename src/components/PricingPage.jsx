import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Box, Container, Text, Button, VStack, HStack, Link } from '@chakra-ui/react'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '',
    description: 'Try it out',
    featured: false,
    isFree: true,
    subtitle: 'Limited features',
  },
  {
    id: 'basic',
    name: 'Basic',
    price: '$9.99',
    period: '/month',
    description: 'For occasional use',
    featured: true,
    isFree: false,
    subtitle: '~10 interview hours/month',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29.99',
    period: '/month',
    description: 'For regular interviews',
    featured: false,
    isFree: false,
    subtitle: '~50 interview hours/month',
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
      <Container maxW="960px" py={16}>
        <VStack gap={8}>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            Pricing
          </Text>

          <HStack gap={4} align="stretch" justify="center" flexWrap={{ base: 'wrap', md: 'nowrap' }}>
            {plans.map((plan) => (
              <Box
                key={plan.id}
                bg="white"
                p={6}
                borderRadius="xl"
                boxShadow={plan.featured ? 'lg' : 'sm'}
                border="2px solid"
                borderColor={plan.featured ? 'orange.500' : 'gray.200'}
                w="260px"
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
                <VStack gap={4} align="stretch" h="100%">
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

                  <Box flex={1}>
                    {plan.isFree ? (
                      <Text fontSize="sm" color="gray.400" textAlign="center">
                        <Text as="span" mr={1}>✗</Text>
                        Limited features
                      </Text>
                    ) : (
                      <VStack gap={1}>
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                          <Text as="span" mr={1}>✓</Text>
                          <Text as="span" fontWeight="medium">All features</Text>
                        </Text>
                        <Text fontSize="sm" color="gray.500" textAlign="center">
                          <Text as="span" fontWeight="semibold" color="gray.600">{plan.subtitle.split(' ')[0]}</Text>
                          {' '}{plan.subtitle.split(' ').slice(1).join(' ')}
                        </Text>
                      </VStack>
                    )}
                  </Box>

                  <Box mt="auto" w="100%">
                    {plan.isFree ? (
                      <Link href="https://d2zadbp5zwt661.cloudfront.net/HelperTool.dmg" download w="100%" display="block">
                        <Button
                          variant="outline"
                          borderColor="gray.300"
                          color="gray.700"
                          w="100%"
                          py={5}
                          fontSize="md"
                          borderRadius="lg"
                          _hover={{ bg: 'gray.50' }}
                        >
                          Download
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        bg={plan.featured ? 'orange.500' : 'gray.800'}
                        color="white"
                        w="100%"
                        py={5}
                        fontSize="md"
                        borderRadius="lg"
                        boxShadow="sm"
                        _hover={{ bg: plan.featured ? 'orange.600' : 'gray.700' }}
                        onClick={() => handleSelectPlan(plan.id)}
                      >
                        Choose {plan.name}
                      </Button>
                    )}
                  </Box>
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
