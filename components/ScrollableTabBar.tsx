import React, { useEffect, useRef } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "rgba(6,6,6,0.96)",
  capsule: "#131313",
  hairline: "rgba(255,255,255,0.07)",
  text: "#fff",
  inactive: "rgba(255,255,255,0.32)",
  activeLabel: "#fff",
  activeIconBg: "rgba(232,0,10,0.14)",
  activeBorder: "rgba(232,0,10,0.5)",
  accent: "#E8000A",
} as const;

// ─── Tab definitions ──────────────────────────────────────────────────────────
type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const TAB_ICONS: Record<string, IoniconName> = {
  index: "home-outline",
  tools: "construct-outline",
  production: "film-outline",
  events: "camera-outline",
  shop: "bag-outline",
  wallpapers: "images-outline",
  more: "person-circle-outline",
};

const TAB_LABELS: Record<string, string> = {
  index: "Home",
  tools: "Tools",
  production: "Production",
  events: "Events",
  shop: "Shop",
  wallpapers: "Walls",
  more: "Account",
};

/** Only these routes appear in the tab bar — edit/notes live inside Production. */
const VISIBLE_TAB_ROUTES = new Set(Object.keys(TAB_LABELS));

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ScrollableTabBarProps extends BottomTabBarProps {
  onNewProject?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ScrollableTabBar({
  state,
  descriptors,
  navigation,
  onNewProject,
}: ScrollableTabBarProps) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const tabWidthRef = useRef<Record<string, { x: number; width: number }>>({});

  // Auto-scroll active tab into view when route changes
  useEffect(() => {
    const activeRoute = state.routes[state.index];
    const measured = tabWidthRef.current[activeRoute.name];
    if (!measured || !scrollRef.current) return;
    scrollRef.current.scrollTo({
      x: Math.max(0, measured.x - 20),
      animated: true,
    });
  }, [state.index, state.routes]);

  return (
    <View
      style={[
        s.wrapper,
        { paddingBottom: insets.bottom + 8 },
      ]}
      pointerEvents="box-none"
    >
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />

      <View style={s.row} pointerEvents="box-none">
        {/* Capsule */}
        <View style={s.capsuleOuter}>
          {/* Fade mask — left edge */}
          <LinearGradient
            colors={["rgba(19,19,19,1)", "rgba(19,19,19,0)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.fadeMaskLeft}
            pointerEvents="none"
          />
          {/* Fade mask — right edge */}
          <LinearGradient
            colors={["rgba(19,19,19,0)", "rgba(19,19,19,1)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.fadeMaskRight}
            pointerEvents="none"
          />

          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.scrollContent}
            style={s.scroll}
          >
            {state.routes
              .filter((route) => VISIBLE_TAB_ROUTES.has(route.name))
              .map((route) => {
              const index = state.routes.findIndex((r) => r.key === route.key);
              const { options } = descriptors[route.key];
              const isActive = state.index === index;
              const iconName = TAB_ICONS[route.name] ?? "ellipse-outline";
              const label = TAB_LABELS[route.name] ?? route.name;

              const onPress = () => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isActive && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              const onLongPress = () => {
                navigation.emit({
                  type: "tabLongPress",
                  target: route.key,
                });
              };

              const accessibilityLabel =
                options.tabBarAccessibilityLabel ?? label;

              return (
                <Pressable
                  key={route.key}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  accessibilityRole="button"
                  accessibilityLabel={accessibilityLabel}
                  accessibilityState={{ selected: isActive }}
                  style={s.tabTouchable}
                  onLayout={(e) => {
                    tabWidthRef.current[route.name] = {
                      x: e.nativeEvent.layout.x,
                      width: e.nativeEvent.layout.width,
                    };
                  }}
                >
                  <View
                    style={[
                      s.tabInner,
                      isActive && s.tabInnerActive,
                    ]}
                  >
                    <Ionicons
                      name={iconName}
                      size={22}
                      color={isActive ? C.accent : C.inactive}
                    />
                    <Text
                      style={[
                        s.tabLabel,
                        isActive && s.tabLabelActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* FAB */}
        <Pressable
          style={s.fab}
          onPress={onNewProject}
          accessibilityLabel="New Project"
          accessibilityRole="button"
          hitSlop={8}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 10,
    gap: 10,
  },
  capsuleOuter: {
    flex: 1,
    backgroundColor: C.capsule,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: C.hairline,
    overflow: "hidden",
  },
  fadeMaskLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 24,
    zIndex: 2,
  },
  fadeMaskRight: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 24,
    zIndex: 2,
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 4,
  },
  tabTouchable: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabInner: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 22,
    gap: 3,
    minWidth: 60,
  },
  tabInnerActive: {
    backgroundColor: C.activeIconBg,
    borderWidth: 1,
    borderColor: C.activeBorder,
  },
  tabLabel: {
    fontFamily: "DMMono_400Regular",
    fontSize: 9,
    color: C.inactive,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  tabLabelActive: {
    color: C.activeLabel,
  },

  // FAB
  fab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.accent,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
    flexShrink: 0,
  },
});
