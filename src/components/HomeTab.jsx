import { Box, VStack, Button, Heading, Text, Spinner } from '@chakra-ui/react'
import { FiDownload } from 'react-icons/fi'
import { fetchAuthSession } from 'aws-amplify/auth'
import { useUser } from '../hooks/useUser'
import SubscriptionButtons from './SubscriptionButtons'

function getStatusDisplay(status) {
  const statusMap = {
    active: 'Active',
    canceled: 'Canceled',
    incomplete: 'Incomplete',
    incomplete_expired: 'Expired',
    past_due: 'Past Due',
    paused: 'Paused',
    trialing: 'Trial',
    unpaid: 'Unpaid'
  }
  return statusMap[status] || 'Not Subscribed'
}

function getStatusColor(status, tokenResetAt) {
  if (status === 'active') return 'green.500'
  if (status === 'incomplete' || status === 'incomplete_expired') return 'red.500'
  if (status === 'past_due') {
    if (tokenResetAt) {
      const resetDate = new Date(tokenResetAt * 1000)
      const now = new Date()
      const daysPastReset = (now - resetDate) / (1000 * 60 * 60 * 24)
      if (daysPastReset > 7) return 'red.500'
    }
    return 'yellow.500'
  }
  return 'gray.400'
}

function formatResetDate(epochSeconds) {
  if (!epochSeconds) return null
  const date = new Date(epochSeconds * 1000)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function TokenUsageBar({ percentage, resetAt }) {
  const usagePercent = Math.min(100, Math.max(0, percentage || 0))
  const barColor = usagePercent > 90 ? 'red.500' : usagePercent > 70 ? 'orange.500' : 'green.500'

  return (
    <Box w="full">
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Text fontSize="xs" color="gray.500">Token Usage</Text>
        <Text fontSize="xs" fontWeight="medium" color={barColor}>{usagePercent.toFixed(1)}%</Text>
      </Box>
      <Box w="full" h="8px" bg="gray.200" borderRadius="full" overflow="hidden">
        <Box
          h="full"
          w={`${usagePercent}%`}
          bg={barColor}
          borderRadius="full"
          transition="width 0.3s ease"
        />
      </Box>
      {resetAt && (
        <Text fontSize="xs" color="gray.400" mt={1} textAlign="center">
          Resets on {formatResetDate(resetAt)}
        </Text>
      )}
    </Box>
  )
}

function HomeTab() {
  const { userData, loading, error } = useUser()

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

  if (loading) {
    return (
      <Box py={12} textAlign="center">
        <Spinner size="lg" color="orange.500" />
      </Box>
    )
  }

  return (
    <Box py={12}>
      <VStack gap={8}>
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

        <Box w="full" maxW="300px" pt={4} borderTop="1px solid" borderColor="gray.200">
          <Text fontSize="sm" color="gray.500" mb={1} textAlign="center">
            Subscription
          </Text>
          <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={1}>
            <Box
              w="10px"
              h="10px"
              borderRadius="full"
              bg={getStatusColor(userData?.subscriptionStatus, userData?.tokenResetAt)}
            />
            <Text fontSize="md" fontWeight="medium" color="gray.700">
              {getStatusDisplay(userData?.subscriptionStatus)}
            </Text>
          </Box>
          {userData?.plan && (
            <Text fontSize="sm" color="orange.500" mb={3} textAlign="center">
              Plan: {userData.plan.charAt(0).toUpperCase() + userData.plan.slice(1)}
            </Text>
          )}
          {!userData?.plan && <Box mb={3} />}

          {(userData?.subscriptionStatus === 'active' || userData?.subscriptionStatus === 'past_due') && (
            <Box mb={4}>
              <TokenUsageBar
                percentage={userData?.tokenUsagePercentage}
                resetAt={userData?.tokenResetAt}
              />
            </Box>
          )}

          <SubscriptionButtons subscriptionStatus={userData?.subscriptionStatus} currentPlan={userData?.plan} />
        </Box>
      </VStack>
    </Box>
  )
}

export default HomeTab
