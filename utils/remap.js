// same as https://processing.org/reference/map_.html
// ex: reMap(1, 0, 5) -> 0.2
export const remap = (value, low1, high1, low2 = 0, high2 = 1) => {
    return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1)
}