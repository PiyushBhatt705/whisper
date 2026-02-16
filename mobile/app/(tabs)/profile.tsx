import { View, Text, ScrollView, Pressable } from 'react-native'
import React from 'react'
import { useAuth } from '@clerk/clerk-expo'

const profileTab = () => {
  const {signOut } = useAuth()
  return (
    <ScrollView className='bg-surface '
    contentInsetAdjustmentBehavior='automatic'
        >
          <View>
            <Text className='text-white'>Profile Tab</Text>
            <Pressable onPress={() => signOut()} className='bg-red-600 px-4 py-2 rounded-lg'>
              <Text>Signout</Text>
            </Pressable>
          </View>
    </ScrollView>
  )
}

export default profileTab