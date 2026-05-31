import React from "react";
import { Linking, StyleSheet, Text, View, type TextStyle } from "react-native";
import { brandColors } from "../../constants/theme";
import {
  parseLessonTextField,
  resolveGuidedLinkHref,
  type ContentSegment,
} from "../../utils/lessonContentParser";

interface LessonRichTextProps {
  text: string;
  style: TextStyle;
  linkStyle?: TextStyle;
  onOpenLesson?: (lessonId: string) => void;
}

function handleLinkPress(
  href: string,
  label: string,
  onOpenLesson?: (lessonId: string) => void,
) {
  const resolved = resolveGuidedLinkHref(href, label);
  if (resolved.kind === "lesson") {
    onOpenLesson?.(resolved.lessonId);
    return;
  }
  void Linking.openURL(resolved.url);
}

function segmentTextStyle(baseStyle: TextStyle): TextStyle {
  const flat = StyleSheet.flatten(baseStyle) ?? {};
  const { flex, flexGrow, flexShrink, flexBasis, alignSelf, ...textStyle } = flat;
  return textStyle;
}

function renderSegments(
  segments: ContentSegment[],
  baseStyle: TextStyle,
  linkStyle: TextStyle,
  onOpenLesson?: (lessonId: string) => void,
) {
  const innerStyle = segmentTextStyle(baseStyle);

  return segments.map((segment, index) => {
    if (segment.type === "text") {
      return (
        <Text key={`text-${index}`} style={innerStyle}>
          {segment.value}
        </Text>
      );
    }

    return (
      <Text
        key={`link-${index}-${segment.href}`}
        style={linkStyle}
        onPress={() => handleLinkPress(segment.href, segment.label, onOpenLesson)}
        accessibilityRole="link"
      >
        {segment.label}
      </Text>
    );
  });
}

export function LessonRichText({
  text,
  style,
  linkStyle,
  onOpenLesson,
}: LessonRichTextProps) {
  const { segments } = parseLessonTextField(text);
  const resolvedLinkStyle = linkStyle ?? {
    color: brandColors.alphaRed,
    textDecorationLine: "underline" as const,
  };
  const flat = StyleSheet.flatten(style) ?? {};
  const layoutStyle =
    flat.flex != null || flat.flexGrow != null || flat.flexShrink != null
      ? {
          flex: flat.flex,
          flexGrow: flat.flexGrow,
          flexShrink: flat.flexShrink,
          alignSelf: flat.alignSelf,
        }
      : null;

  const content = (
    <Text style={segmentTextStyle(style)}>
      {renderSegments(segments, style, resolvedLinkStyle, onOpenLesson)}
    </Text>
  );

  if (layoutStyle) {
    return <View style={layoutStyle}>{content}</View>;
  }

  return content;
}
