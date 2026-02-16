import { View, Text, ScrollView } from 'react-native'
import React from 'react'

const ChatsTab = () => {
  return (
    <ScrollView className='bg-surface '
      contentInsetAdjustmentBehavior='automatic'
    >
      <View>
        <Text className='text-white'>ChatsTab</Text>
      </View>
    </ScrollView>
  )
}

export default ChatsTab