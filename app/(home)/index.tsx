import { View } from "react-native";

import { ItemMover } from "@/components/item-mover";

export default function Screen() {
  return (
    <View className="flex flex-col flex-1 bg-background-primary">
      <ItemMover ticker="AAPL" />
    </View>
  );
}
