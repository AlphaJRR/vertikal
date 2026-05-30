import React from "react";
import { Pressable, Text, View, Image, ImageSourcePropType } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FeaturedTip } from "../../data/toolkitContent";

const TIP_COVERS: Record<string, ImageSourcePropType> = {
  "light-the-eyes": require("../../assets/images/couple-kiss.jpg"),
  "audio-is-70": require("../../assets/images/director-monitor.jpg"),
  "shoot-cutaway": require("../../assets/images/cinema-cam.jpg"),
  "frame-for-crop": require("../../assets/images/chicago-sunset.jpg"),
};

interface ProductionTipsListProps {
  tips: FeaturedTip[];
  onTipPress: (tip: FeaturedTip) => void;
  styles: {
    tipsList: object;
    tipCard: object;
    tipCover: object;
    tipBody: object;
    tipTitle: object;
    tipText: object;
  };
}

export function ProductionTipsList({ tips, onTipPress, styles: st }: ProductionTipsListProps) {
  return (
    <View style={st.tipsList}>
      {tips.map((tip) => (
        <Pressable
          key={tip.id}
          onPress={() => onTipPress(tip)}
          style={({ pressed }) => [st.tipCard, pressed && { opacity: 0.85 }]}
        >
          <Image
            source={TIP_COVERS[tip.id] ?? require("../../assets/images/cinema-cam.jpg")}
            style={st.tipCover}
          />
          <View style={st.tipBody}>
            <Text style={st.tipTitle}>{tip.title}</Text>
            <Text style={st.tipText} numberOfLines={3}>
              {tip.summary}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#00d4ff" style={{ marginRight: 12 }} />
        </Pressable>
      ))}
    </View>
  );
}
