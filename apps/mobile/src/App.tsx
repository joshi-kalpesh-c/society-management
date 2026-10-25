import "../global.css";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text, View } from "react-native";

export default function App() {
  // Skeleton: resident + security surfaces per SCREENS-AND-API.md.
  // Component layer: React Native Reusables (add when first screens land).
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-semibold">Society Management</Text>
        <Text className="mt-2 text-center text-slate-500">
          Mobile skeleton — sign-in, dues, visitor approvals arrive in later
          phases.
        </Text>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
