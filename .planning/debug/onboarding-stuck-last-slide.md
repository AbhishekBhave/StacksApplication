# Debug: Onboarding carousel — no Continue on last slide

**UAT:** Phase 1, Test 6  
**Symptom:** User reaches four intro slides but cannot continue to home; no visible way to finish onboarding.

## Hypothesis

Footer `Continue` only renders when `index === SLIDES.length - 1` (`isLast`).  
`index` is updated only via `FlatList` `onViewableItemsChanged` + `itemVisiblePercentThreshold: 60`. On horizontal paging, the last page may not register as “viewable” enough, so `index` stays &lt; 3 and the primary slot shows `primarySpacer` instead of `Pressable`.

## Evidence

- `expo/app/(onboarding)/index.tsx`: `isLast` gates the Continue button; index from viewability callbacks only.

## Fix direction (applied)

1. Sync `index` from `onMomentumScrollEnd` when the user swipes (`contentOffset.x / width`).
2. **Primary fix:** Footer always shows a primary action — **Next** (not an empty spacer) calls `scrollToIndex` with `getItemLayout`; **Continue** on the last slide finishes onboarding. No reliance on viewability to reveal the CTA.
3. `onScrollToIndexFailed` falls back to `scrollToOffset`.
4. `snapToInterval={width}` and `decelerationRate="fast"` for more predictable horizontal paging on some Android builds.

## Follow-up

- Re-run UAT Test 6 on device/simulator after pulling commit `a95e77c` (or later).
