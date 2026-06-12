import { Alert } from "react-native";
import { router, type Href } from "expo-router";
import { FREE_LAUNCH } from "../constants/proAccess";

type UpgradeContext = "lesson" | "tool" | "feature";

const CONTEXT_LABEL: Record<UpgradeContext, string> = {
  lesson: "This lesson",
  tool: "This tool",
  feature: "This feature",
};

export function showProUpgradeAlert(
  isSignedIn: boolean,
  context: UpgradeContext = "tool",
): void {
  if (FREE_LAUNCH) return;

  const subject = CONTEXT_LABEL[context];
  const title = isSignedIn ? "AVA Pro Required" : "Sign in for AVA Pro";
  const message = isSignedIn
    ? `${subject} is included with AVA Pro. Subscribe via in-app purchase in the App Store — no web checkout in this app.`
    : `${subject} requires AVA Pro. Sign in with your account to unlock via App Store subscription.`;

  Alert.alert(title, message, [
    { text: "OK", style: "cancel" },
    ...(isSignedIn
      ? []
      : [
          {
            text: "Sign In",
            onPress: () => router.push("/sign-in" as Href),
          },
        ]),
  ]);
}
