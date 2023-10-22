
export function getDayBgColor(index: any): string {
    return index === '토' ? '#c9daf8' : index === '일' ? '#f4cccc' : ''
}

export function hexToRgba(hex: string, alpha: number): number[] {
    try {
        const bigint = parseInt(hex.slice(1), 16);

        if (isNaN(bigint) || alpha < 0 || alpha > 1) {
            return [255, 255, 255, 1];
        }

        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;

        return [r, g, b, alpha]
    } catch {
        return [255, 255, 255, 1]
    }
}