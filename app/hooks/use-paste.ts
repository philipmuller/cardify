import { useKeyboardShortcut } from "./use-keyboard-shortcut";

export function useDetectPaste(effect: () => void): boolean[] {
    const [isPressingCmd, isPressingCtrl, isPressingV] = useKeyboardShortcut(['Meta', 'Control', 'v'], effect, [[0, 2], [0, 1]]);

    return [ isPressingCmd || isPressingCtrl, isPressingV ];
}