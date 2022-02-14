import type { Component, RefObject } from "react";
import { useEffect, useState } from "react";
import { useAnimatedRef } from "react-native-reanimated";

function useMeasure<T extends Component>(
  defaultWidth: number
): [RefObject<T>, number] {
  const ref = useAnimatedRef<T>();
  const [measured, setMeasured] = useState(defaultWidth);
  useEffect(() => {
    new Promise<{
      width: number;
      height: number;
      x: number;
      y: number;
      pageX: number;
      pageY: number;
    }>((resolve, reject) => {
      if (ref?.current) {
        ref.current.measure((x, y, width, height, pageX, pageY) => {
          resolve({ x, y, width, height, pageX, pageY });
        });
      } else {
        reject(new Error("measure: animated ref not ready"));
      }
    }).then((m) => {
      setMeasured(m.width);
    });
  }, [ref, measured]);
  return [ref, measured];
}

export default useMeasure;
