import * as Updates from "expo-updates";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

/** Temporary JR diagnostics — confirms which OTA bundle is running on device. */
export function UpdateDebugLine() {
  const updateId = Updates.updateId ?? "embedded";
  const shortId =
    updateId.length > 8 ? `${updateId.slice(0, 8)}…` : updateId;
  const runtimeVersion = Updates.runtimeVersion ?? "?";
  const channel = Updates.channel ?? "—";

  return (
    <View style={styles.wrap}>
      <Text style={styles.text} selectable>
        Bundle {shortId} · RV {runtimeVersion} · {channel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 20,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  text: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 10,
    fontFamily: "DMMono_400Regular",
    letterSpacing: 0.3,
  },
});
