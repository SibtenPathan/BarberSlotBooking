import { View, Text } from 'react-native';

export default function TestStyles() {
  return (
    <View className="flex-1 items-center justify-center bg-red-500">
      <Text className="text-white text-4xl font-bold">
        🎨 Tailwind Works!
      </Text>
      <View className="w-32 h-32 bg-blue-500 rounded-full mt-4" />
      <Text className="text-yellow-300 text-2xl mt-4">
        NativeWind is Active
      </Text>
    </View>
  );
}
