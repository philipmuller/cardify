import { useState, useEffect } from 'react';

type KeysPressedState = {
    [key: string]: boolean;
};

export function useDetectKeyPress(targetKeys: string[]): boolean[] {
    const [keysPressed, setKeysPressed] = useState(
        targetKeys.reduce<KeysPressedState>((acc, key) => {
            acc[key] = false;
            return acc;
        }, {})
    );

    useEffect(() => {
        const downHandler = ({ key }: KeyboardEvent) => {
            if (targetKeys.includes(key)) {
                setKeysPressed(prevKeys => ({ ...prevKeys, [key]: true }));
            }
        };

        const upHandler = ({ key }: KeyboardEvent) => {
            if (targetKeys.includes(key)) {
                setKeysPressed(prevKeys => ({ ...prevKeys, [key]: false }));
            }
        };

        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);

        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, [targetKeys]);


    return targetKeys.map(key => keysPressed[key]);
}
