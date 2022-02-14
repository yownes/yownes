import type { Theme } from "../../lib/theme";

export interface IconProps {
  size?: number;
  color?: keyof Theme["colors"];
}
