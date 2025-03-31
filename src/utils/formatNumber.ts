export function formatNumber(num: number): string {
    const absNum = Math.abs(num);

    if (absNum >= 1e9) {
        return (num / 1e9).toFixed(1) + 'B';
    }
    if (absNum >= 1e6) {
        return (num / 1e6).toFixed(1) + 'M';
    }
    if (absNum >= 1e3) {
        return (num / 1e3).toFixed(1) + 'K';
    }

    return num.toString();
}

// Examples:
// formatNumber(2774167652) => "2.8B"
// formatNumber(277416765) => "277.4M"
// formatNumber(277416) => "277.4K"
// formatNumber(277) => "277" 