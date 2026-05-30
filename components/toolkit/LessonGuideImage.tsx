import React from "react";
import { Image, Text, View } from "react-native";
import { creatorTrainingStyles as s } from "./creatorTrainingStyles";
import { normalizeToolkitImagePath } from "../../utils/lessonContentParser";

interface LessonGuideImageProps {
  path: string;
  alt?: string;
}

/**
 * Renders the single post-guide image. Uses bundled assets when mapped;
 * otherwise shows a #111111 placeholder block with optional alt caption.
 */
export function LessonGuideImage({ path, alt }: LessonGuideImageProps) {
  const normalized = normalizeToolkitImagePath(path);
  const source = resolveToolkitImageSource(normalized);

  if (source) {
    return (
      <View style={s.guideImageWrap}>
        <Image source={source} style={s.guideImage} resizeMode="cover" accessibilityLabel={alt} />
        {alt ? <Text style={s.guideImageCaption}>{alt}</Text> : null}
      </View>
    );
  }

  return (
    <View
      style={[s.guideImage, s.guideImagePlaceholder]}
      accessibilityLabel={alt ?? "Lesson reference image placeholder"}
    >
      {alt ? <Text style={s.guideImagePlaceholderLabel}>{alt}</Text> : null}
    </View>
  );
}

function resolveToolkitImageSource(
  normalizedPath: string,
): number | { uri: string } | null {
  if (/^https?:\/\//i.test(normalizedPath)) {
    return { uri: normalizedPath };
  }

  // Extend this map as toolkit PNG/JPG assets are added under assets/toolkit/.
  const bundledAssets: Record<string, number> = {};

  const filename = normalizedPath.split("/").pop() ?? normalizedPath;
  return bundledAssets[normalizedPath] ?? bundledAssets[filename] ?? null;
}
