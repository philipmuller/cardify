import { useKeyboardShortcut } from "./use-keyboard-shortcut";

export function useDetectPaste(): [boolean, boolean] {
    const [isPressingCmd, isPressingCtrl, isPressingV] = useKeyboardShortcut(['Meta', 'Control', 'v'], () => {}, [[0, 2], [1, 2]]);

    return [isPressingCmd || isPressingCtrl, isPressingV];
}