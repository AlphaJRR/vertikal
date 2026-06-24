import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import {
  BIO_HOME_HORIZONTAL_PADDING,
  BIO_SLIDESHOW_INTERVAL_MS,
  BIO_SLIDESHOW_RESUME_MS,
  BIO_SLIDES,
  type BioSlide,
} from "../../constants/homeBio";

/** Portrait slide frame — matches 576×1024 bio assets (9:16). */
const PORTRAIT_ASPECT = 9 / 16;

export function BioSlideshow() {
  const { width: screenWidth } = useWindowDimensions();
  const slideWidth = screenWidth - BIO_HOME_HORIZONTAL_PADDING * 2;
  const slideHeight = slideWidth / PORTRAIT_ASPECT;

  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const resumeAutoplay = useCallback(() => {
    clearResumeTimer();
    setPaused(false);
  }, [clearResumeTimer]);

  const pauseAutoplay = useCallback(() => {
    setPaused(true);
    clearResumeTimer();
    resumeTimerRef.current = setTimeout(() => {
      setPaused(false);
      resumeTimerRef.current = null;
    }, BIO_SLIDESHOW_RESUME_MS);
  }, [clearResumeTimer]);

  useEffect(() => {
    return () => clearResumeTimer();
  }, [clearResumeTimer]);

  useEffect(() => {
    if (paused || BIO_SLIDES.length <= 1 || slideWidth <= 0) return;

    const timer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % BIO_SLIDES.length;
      scrollRef.current?.scrollTo({
        x: nextIndex * slideWidth,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, BIO_SLIDESHOW_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [activeIndex, paused, slideWidth]);

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    if (slideWidth <= 0) return;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
    const clamped = Math.max(0, Math.min(index, BIO_SLIDES.length - 1));
    setActiveIndex(clamped);
    resumeAutoplay();
  };

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingHorizontal: BIO_HOME_HORIZONTAL_PADDING,
          height: slideHeight,
        },
      ]}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        style={{ width: slideWidth, height: slideHeight }}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      >
        {BIO_SLIDES.map((item, index) => (
          <BioSlideItem
            key={`bio-slide-${index}`}
            item={item}
            slideWidth={slideWidth}
            slideHeight={slideHeight}
            onPause={pauseAutoplay}
          />
        ))}
      </ScrollView>
    </View>
  );
}

type BioSlideItemProps = {
  item: BioSlide;
  slideWidth: number;
  slideHeight: number;
  onPause: () => void;
};

function BioSlideItem({
  item,
  slideWidth,
  slideHeight,
  onPause,
}: BioSlideItemProps) {
  return (
    <Pressable
      onPress={onPause}
      style={[
        { width: slideWidth, height: slideHeight },
        item.cutoutOnDark ? styles.cutoutSlide : null,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Pause bio slideshow"
    >
      <Image
        source={item.source}
        style={[
          styles.slideImage,
          item.cutoutOnDark ? styles.cutoutImage : null,
        ]}
        resizeMode={item.resizeMode ?? "contain"}
        accessibilityIgnoresInvertColors
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 8,
    backgroundColor: "#0a0a0a",
    overflow: "hidden",
  },
  slideImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },
  cutoutSlide: {
    backgroundColor: "#0a0a0a",
    justifyContent: "center",
  },
  cutoutImage: {
    backgroundColor: "transparent",
  },
});
