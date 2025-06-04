import { withLayoutContext } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import tailwindColors from "@/tailwind-colors";
import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";

const { Navigator } = createMaterialTopTabNavigator();

// Constants
const SCREEN_WIDTH = Dimensions.get("window").width;
// Dividing by 3.5 to show approximately 3.5 tabs at once for better scrolling UX
const TAB_ITEM_WIDTH = SCREEN_WIDTH / 3.5;

const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

interface TabConfig {
  name: string;
  title: string;
}

const TABS: TabConfig[] = [
  {
    name: "index",
    title: "Movers",
  },
  {
    name: "news",
    title: "News",
  },
  {
    name: "featured",
    title: "Featured",
  },
  {
    name: "live",
    title: "Live",
  },
  {
    name: "watchlist",
    title: "Watchlist",
  },
];

const TAB_SCREEN_OPTIONS: MaterialTopTabNavigationOptions = {
  tabBarStyle: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  tabBarActiveTintColor: tailwindColors.primary[400],
  tabBarInactiveTintColor: tailwindColors.base[500],
  tabBarScrollEnabled: true,
  tabBarIndicatorStyle: {
    backgroundColor: tailwindColors.primary[400],
    borderRadius: 4,
    height: 2,
  },
  tabBarLabelStyle: {
    fontSize: 14,
    fontFamily: "inter-semibold",
  },
  tabBarItemStyle: {
    width: TAB_ITEM_WIDTH,
  },
};

export default function TabLayout() {
  return (
    <SafeAreaView
      edges={["top"]}
      className="flex flex-col flex-1 bg-background-primary"
    >
      <StatusBar style="light" />
      <MaterialTopTabs
        screenOptions={TAB_SCREEN_OPTIONS}
        initialLayout={{ width: SCREEN_WIDTH }}
      >
        {TABS.map((tab) => (
          <MaterialTopTabs.Screen
            key={tab.name}
            name={tab.name}
            options={{ title: tab.title }}
          />
        ))}
      </MaterialTopTabs>
    </SafeAreaView>
  );
}
