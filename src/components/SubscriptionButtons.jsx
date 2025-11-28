import { Button, VStack, HStack, Text } from '@chakra-ui/react'
import { FiCreditCard, FiRefreshCw, FiSettings } from 'react-icons/fi'
import { fetchAuthSession } from 'aws-amplify/auth'

function SubscriptionButtons({ subscriptionStatus, currentPlan }) {
  // Statuses that show Subscribe button
  const showSubscribe = !subscriptionStatus ||
    subscriptionStatus === 'canceled' ||
    subscriptionStatus === 'incomplete_expired'

  // Statuses that show Billing Portal button (all except subscribe-only statuses)
  const showBillingPortal = subscriptionStatus &&
    subscriptionStatus !== 'canceled' &&
    subscriptionStatus !== 'incomplete_expired'

  // Show Change Plan only if active and has a plan
  const showChangePlan = subscriptionStatus === 'active' && currentPlan

  async function handleSubscribe(plan) {
    try {
      const session = await fetchAuthSession()
      const token = session.tokens.idToken.toString()

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
      } else {
        alert('Failed to start checkout')
      }
    } catch (error) {
      console.error('Subscribe failed:', error)
      alert('Failed to start checkout')
    }
  }

  async function handleBillingPortal() {
    try {
      const session = await fetchAuthSession()
      const token = session.tokens.idToken.toString()

      const response = await fetch(`${import.meta.env.VITE_API_URL}/stripe/billing-url`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.url) {
          window.location.href = data.url
        }
      } else {
        alert('Failed to open billing portal')
      }
    } catch (error) {
      console.error('Billing portal failed:', error)
      alert('Failed to open billing portal')
    }
  }

  async function handleChangePlan(plan) {
    try {
      const session = await fetchAuthSession()
      const token = session.tokens.idToken.toString()

      const response = await fetch(`${import.meta.env.VITE_API_URL}/stripe/change-plan?plan=${plan}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json().catch(() => ({}))
      if (response.ok) {
        if (data.url) {
          window.location.href = data.url
        } else {
          alert(`Plan updated to ${plan.charAt(0).toUpperCase() + plan.slice(1)}`)
          window.location.reload()
        }
      } else if (data.error?.includes('Plan updated')) {
        // Backend returns 400 but plan was updated successfully
        alert(`Plan updated to ${plan.charAt(0).toUpperCase() + plan.slice(1)}`)
        window.location.reload()
      } else {
        alert(data.error || 'Failed to change plan')
      }
    } catch (error) {
      console.error('Change plan failed:', error)
      alert('Failed to change plan')
    }
  }

  return (
    <VStack gap={3} align="stretch">
      {showSubscribe && (
        <VStack gap={2} align="stretch">
          <Text fontSize="xs" color="gray.500" textAlign="center">Choose a plan</Text>
          <HStack gap={2}>
            <Button
              flex={1}
              bg="orange.500"
              color="white"
              _hover={{ bg: 'orange.600' }}
              onClick={() => handleSubscribe('basic')}
            >
              <FiCreditCard style={{ marginRight: 8 }} />
              Basic
            </Button>
            <Button
              flex={1}
              bg="orange.600"
              color="white"
              _hover={{ bg: 'orange.700' }}
              onClick={() => handleSubscribe('pro')}
            >
              <FiCreditCard style={{ marginRight: 8 }} />
              Pro
            </Button>
          </HStack>
        </VStack>
      )}

      {showBillingPortal && (
        <Button
          variant="outline"
          borderColor="gray.300"
          _hover={{ bg: 'gray.50' }}
          onClick={handleBillingPortal}
        >
          <FiSettings style={{ marginRight: 8 }} />
          Billing Portal
        </Button>
      )}

      {showChangePlan && (
        <Button
          variant="outline"
          borderColor="orange.300"
          color="orange.500"
          _hover={{ bg: 'orange.50' }}
          onClick={() => handleChangePlan(currentPlan === 'basic' ? 'pro' : 'basic')}
        >
          <FiRefreshCw style={{ marginRight: 8 }} />
          {currentPlan === 'basic' ? 'Upgrade to Pro' : 'Switch to Basic'}
        </Button>
      )}
    </VStack>
  )
}

export default SubscriptionButtons
