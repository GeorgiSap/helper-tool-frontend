import { useState, useRef } from 'react'
import {
  Box,
  Flex,
  Text,
  HStack,
  Button,
  Portal,
} from '@chakra-ui/react'
import { FiLogOut, FiChevronDown } from 'react-icons/fi'

function Header({ email, onLogout }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  return (
    <Box
      as="header"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      px={6}
      py={3}
      position="sticky"
      top={0}
      zIndex={100}
    >
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
        <Text fontSize="xl" fontWeight="bold" color="orange.500">
          Helper Tool
        </Text>

        <Box position="relative" ref={menuRef}>
          <Button
            variant="ghost"
            onClick={() => setIsOpen(!isOpen)}
            rightIcon={<FiChevronDown />}
            fontWeight="normal"
          >
            <HStack spacing={2}>
              <Box
                w={8}
                h={8}
                borderRadius="full"
                bg="orange.500"
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="sm"
                fontWeight="bold"
              >
                {email?.charAt(0).toUpperCase()}
              </Box>
              <Text fontSize="sm" display={{ base: 'none', md: 'block' }}>
                {email}
              </Text>
            </HStack>
          </Button>

          {isOpen && (
            <Box
              position="absolute"
              right={0}
              top="100%"
              mt={2}
              bg="white"
              borderRadius="lg"
              boxShadow="lg"
              border="1px solid"
              borderColor="gray.200"
              minW="200px"
              py={2}
              zIndex={1000}
            >
              <Box px={4} py={2} borderBottom="1px solid" borderColor="gray.100">
                <Text fontWeight="medium" fontSize="sm">{email}</Text>
                <Text fontSize="xs" color="gray.500">Signed in</Text>
              </Box>
              <Box
                as="button"
                w="full"
                px={4}
                py={2}
                display="flex"
                alignItems="center"
                gap={2}
                fontSize="sm"
                color="red.500"
                _hover={{ bg: 'red.50' }}
                onClick={() => {
                  setIsOpen(false)
                  onLogout()
                }}
              >
                <FiLogOut />
                Sign out
              </Box>
            </Box>
          )}
        </Box>
      </Flex>

      {isOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          onClick={() => setIsOpen(false)}
          zIndex={99}
        />
      )}
    </Box>
  )
}

export default Header
