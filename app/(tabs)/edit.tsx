/**
 * Legacy Edit tab — merged into Production → Edit segment.
 * Keeps old deep links working without a separate tab bar slot.
 */
import { Redirect } from "expo-router";

export default function EditScreen() {
  return <Redirect href="/(tabs)/production?phase=post" />;
}
