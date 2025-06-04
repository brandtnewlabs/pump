import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Screen() {
  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg font-semibold text-text-primary">Chat</Text>
        <Text className="text-sm text-text-secondary mt-2">
          Chat with your friends and family
        </Text>
      </View>
    </SafeAreaView>
  );
}
