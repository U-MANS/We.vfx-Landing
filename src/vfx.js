import { VFX } from '@vfx-js/core';

let instance = null;

export function getVFX() {
    if (!instance) {
        try {
            instance = new VFX({ zIndex: 5 });
        } catch (err) {
            console.warn('VFX-JS not available:', err.message);
            return null;
        }
    }
    return instance;
}
