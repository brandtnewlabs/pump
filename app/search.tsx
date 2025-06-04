import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg font-semibold text-text-primary">
          Search Screen
        </Text>
        <Text className="text-sm text-text-secondary mt-2">
          Search for stocks, crypto, and more
        </Text>
      </View>
    </SafeAreaView>
  );
}
