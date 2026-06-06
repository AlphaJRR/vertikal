import { Alert } from "react-native";
import { router, type Href } from "expo-router";

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
  const subject = CONTEXT_LABEL[context];
  const title = isSignedIn ? "AVA Pro Required" : "Sign in for AVA Pro";
  const message = isSignedIn
    ? `${subject} is included with AVA Pro. In-app purchase is coming soon — no web checkout in the app.`
    : `${subject} requires AVA Pro. Sign in with your account; upgrade via in-app purchase when available.`;

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
