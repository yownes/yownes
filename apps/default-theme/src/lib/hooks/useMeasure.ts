import type { RefObject } from "react";
import type Reanimated from "react-native-reanimated";
import { useEffect, useState } from "react";
import { useAnimatedRef } from "react-native-reanimated";

import untilMeasured from "../untilMeasured";

function useMeasure<T extends Reanimated.View>(
  defaultWidth: number
): [RefObject<T>, number] {
  const ref = useAnimatedRef<T>();
  const [measured, setMeasured] = useState(defaultWidth);
  useEffect(() => {
    try {
      untilMeasured(ref).then((e) => setMeasured(e.width));
    } catch (err) {
      console.warn(err);
    }
  }, [ref, measured]);
  return [ref, measured];
}

export default useMeasure;
