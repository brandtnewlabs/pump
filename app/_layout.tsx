import "../global.css";

import { Tabs } from "expo-router";
import {
  ReanimatedLogLevel,
  configureReanimatedLogger,
} from "react-native-reanimated";

import { useFontLoader } from "@/hooks/useFontLoader";
import tailwindColors from "@/tailwind-colors";
import { Octicons } from "@expo/vector-icons";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

// Types
interface TabConfig {
  name: string;
  title: string;
  iconName: keyof typeof Octicons.glyphMap;
}

// Configuration
const TAB_CONFIGS: readonly TabConfig[] = [
  { name: "(home)", title: "Home", iconName: "home" },
  { name: "search", title: "Search", iconName: "search" },
  { name: "notifications", title: "Notifications", iconName: "bell" },
  { name: "portfolio", title: "Portfolio", iconName: "person" },
  { name: "chat", title: "Chat", iconName: "comment-discussion" },
] as const;

const TAB_SCREEN_OPTIONS: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarShowLabel: false,
  tabBarStyle: {
    backgroundColor: tailwindColors.background.primary,
    borderTopColor: tailwindColors.base[900],
    borderTopWidth: 1,
  },
  tabBarItemStyle: {
    marginTop: 8,
  },
  tabBarActiveTintColor: tailwindColors.primary[400],
  tabBarInactiveTintColor: tailwindColors.base[500],
};

export default function RootLayout() {
  const { fontsLoaded } = useFontLoader();

  if (!fontsLoaded) {
    return null; // TODO: Add splash screen hide logic here
  }

  const renderTabIcon = (iconName: keyof typeof Octicons.glyphMap) => {
    const TabIcon = ({ color }: { color: string }) => (
      <Octicons name={iconName} size={24} color={color} />
    );
    TabIcon.displayName = `TabIcon-${iconName}`;
    return TabIcon;
  };

  const renderTabScreen = (tab: TabConfig) => (
    <Tabs.Screen
      key={tab.name}
      name={tab.name}
      options={{
        title: tab.title,
        tabBarIcon: renderTabIcon(tab.iconName),
      }}
    />
  );

  return (
    <Tabs screenOptions={TAB_SCREEN_OPTIONS}>
      {TAB_CONFIGS.map(renderTabScreen)}
    </Tabs>
  );
}
