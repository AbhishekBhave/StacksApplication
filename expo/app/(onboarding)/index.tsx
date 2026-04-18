import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewToken,
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

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems[0];
      if (first?.index != null) setIndex(first.index);
    },
  ).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

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
    listRef.current?.scrollToIndex({ index: index - 1, animated: true });
  }

  const isLast = index === SLIDES.length - 1;

  return (
    <View style={styles.root}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        pagingEnabled
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        viewabilityConfig={viewabilityConfig}
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
          <View style={styles.primarySpacer} />
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
  primarySpacer: { minWidth: 100 },
  primaryText: { color: '#fff', fontWeight: '700' },
});
