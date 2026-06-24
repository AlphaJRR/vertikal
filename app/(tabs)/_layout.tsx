import { Tabs, useRouter, type Href } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { TabScreenLayout } from "../../components/TabScreenLayout";
import { ScrollableTabBar } from "../../components/ScrollableTabBar";

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenLayout={TabScreenLayout}
      tabBar={(props) => (
        <ScrollableTabBar
          {...props}
          onNewProject={() => router.push("/projects/new" as Href)}
        />
      )}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: "#060606" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: "Tools",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="construct-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="production"
        options={{
          title: "Production",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="film-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="camera-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bag-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallpapers"
        options={{
          title: "Walls",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="images-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="edit"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
