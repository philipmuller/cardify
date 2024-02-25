import { useDetectKeyPress } from "./use-key-press";

export function useKeyboardShortcut(
  targetKeys: string[],
  effect: () => void,
  combos?: number[][],
): boolean[] {
  const keysPressed = useDetectKeyPress(targetKeys);

  if (combos == null) {
    if (keysPressed.every((keyPressed) => keyPressed)) {
      effect();
    }
  } else {
    for (let combo of combos) {
      var comboPressed = true;
      for (let idx of combo) {
        if (!keysPressed[idx]) {
          comboPressed = false;
          break;
        }
      }

      if (comboPressed) {
        effect();
      }
    }
  }

  return keysPressed;
}
