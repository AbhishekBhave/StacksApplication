import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Slide = { id: string; title: string; body: string };

const SLIDES: Slide[] = [
  { id: '1', title: 'Link your bank', body: 'See real spending so advice matches your life.' },
  { id: '2', title: 'You stay in control', body: 'We use read-only data and clear boundaries.' },
  { id: '3', title: 'Better day-to-day calls', body: 'Stacks helps you decide what you can afford.' },
  { id: '4', title: 'You are ready', body: 'Continue to your home screen.' },
];

const { width } = Dimensions.get('window');

export default function OnboardingCarouselScreen() {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);

  const getItemLayout = useRef(
    (_: unknown, i: number) => ({
      length: width,
      offset: width * i,
      index: i,
    }),
  ).current;

  /** Keep footer in sync when the user swipes (buttons use explicit Next / Continue). */
  function syncIndexFromOffset(x: number) {
    const nextIndex = Math.round(x / Math.max(width, 1));
    const clamped = Math.min(Math.max(nextIndex, 0), SLIDES.length - 1);
    setIndex(clamped);
  }

  function onMomentumScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    syncIndexFromOffset(e.nativeEvent.contentOffset.x);
  }

  function onScrollToIndexFailed(info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) {
    const offset = info.averageItemLength * info.index;
    listRef.current?.scrollToOffset({ offset, animated: true });
  }

  const renderItem: ListRenderItem<Slide> = ({ item }) => (
    <View style={[styles.slide, { width }]}>
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideBody}>{item.body}</Text>
    </View>
  );

  async function onContinue() {
    await AsyncStorage.setItem('onboarding_done', 'true');
    router.replace('/(app)/home');
  }

  function onBack() {
    if (index <= 0) return;
    const prev = index - 1;
    setIndex(prev);
    listRef.current?.scrollToIndex({ index: prev, animated: true });
  }

  function onNext() {
    if (index >= SLIDES.length - 1) return;
    const next = index + 1;
    setIndex(next);
    listRef.current?.scrollToIndex({ index: next, animated: true });
  }

  const isLast = index === SLIDES.length - 1;

  return (
    <View style={styles.root}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        getItemLayout={getItemLayout}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollToIndexFailed={onScrollToIndexFailed}
        pagingEnabled
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        snapToInterval={width}
        decelerationRate="fast"
      />
      <View style={styles.footer}>
        {index > 0 ? (
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.secondary}>
            <Text style={styles.secondaryText}>Back</Text>
          </Pressable>
        ) : (
          <View style={styles.secondary} />
        )}
        <Text style={styles.dots}>
          {SLIDES.map((s, i) => (i === index ? '● ' : '○ '))}
        </Text>
        {isLast ? (
          <Pressable accessibilityRole="button" onPress={onContinue} style={styles.primary}>
            <Text style={styles.primaryText}>Continue</Text>
          </Pressable>
        ) : (
          <Pressable accessibilityRole="button" onPress={onNext} style={styles.primary}>
            <Text style={styles.primaryText}>Next</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 48 },
  slide: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', gap: 12 },
  slideTitle: { fontSize: 24, fontWeight: '700' },
  slideBody: { fontSize: 16, lineHeight: 22, color: '#333' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    gap: 8,
  },
  secondary: { minWidth: 72, paddingVertical: 10, alignItems: 'center' },
  secondaryText: { color: '#1565c0', fontWeight: '600' },
  dots: { flex: 1, textAlign: 'center', color: '#444' },
  primary: {
    minWidth: 100,
    backgroundColor: '#111',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '700' },
});
