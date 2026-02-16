import { View, Text, ScrollView } from 'react-native'
import React from 'react'

const profileTab = () => {
  return (
    <ScrollView className='bg-surface '
    contentInsetAdjustmentBehavior='automatic'
        >
          <View>
            <Text className='text-white'>Profile Tab</Text>
          </View>
    </ScrollView>
  )
}

export default profileTab