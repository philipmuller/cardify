import { useDetectKeyPress } from './use-key-press';

export function useDetectUniversalControlKey(): boolean {
    const [isPressingCommand, isPressingControl] = useDetectKeyPress(['Meta', 'Control']);

    return isPressingCommand || isPressingControl; 
}