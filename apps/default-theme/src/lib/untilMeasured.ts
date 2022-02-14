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
      bounds = await new Promise<BoundsOrNull>((res) => {
        ReanimatedUtils.runOnUI(measureOrNull)(ref, res);
      });

      if (bounds) {
        resolve(bounds);
        return;
      } else {
        await new Promise((res) => setTimeout(res, 0));
      }
    }

    throw new Error("COULD_NOT_MEASURE");
  });
}

export default untilMeasured;
