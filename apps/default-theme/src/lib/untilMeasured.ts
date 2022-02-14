import type { RefObject } from "react";
import type Reanimated from "react-native-reanimated";
import * as ReanimatedUtils from "react-native-reanimated";

type BoundsOrNull = null | ReturnType<typeof ReanimatedUtils.measure>;
/**
 * Use this to measure from JS. A callback is triggered with null, or the bounds.
 *
 */
function measureOrNull(
  ref: RefObject<Reanimated.View>,
  callback: (bounds: BoundsOrNull) => void
) {
  "worklet";
  let bounds;
  try {
    bounds = ReanimatedUtils.measure(ref);
  } catch (error) {
    ReanimatedUtils.runOnJS(callback)(null);
    return;
  }
  if (!bounds) {
    ReanimatedUtils.runOnJS(callback)(null);
  } else if (bounds.height === 0) {
    ReanimatedUtils.runOnJS(callback)(null);
  } else {
    ReanimatedUtils.runOnJS(callback)(bounds);
  }
}

function untilMeasured(ref: RefObject<Reanimated.View>) {
  return new Promise<NonNullable<BoundsOrNull>>(async (resolve) => {
    let bounds;
    for (let i = 0; i < 100; i++) {
      console.log("measuring");
      bounds = await new Promise<BoundsOrNull>((resolve) => {
        ReanimatedUtils.runOnUI(measureOrNull)(ref, resolve);
      });

      if (bounds) {
        console.log(`Took ${i} attempts to measure`);
        resolve(bounds);
        return;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }

    throw new Error("COULD_NOT_MEASURE");
  });
}

export default untilMeasured;
