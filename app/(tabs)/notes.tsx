/**
 * Legacy Shoot/Notes tab — merged into Production → Pre-Prod / Day Of.
 */
import { Redirect } from "expo-router";

export default function NotesScreen() {
  return <Redirect href="/(tabs)/production?phase=pre" />;
}
