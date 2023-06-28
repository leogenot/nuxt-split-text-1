
export const between = (progress, { easing, time: [min, max] }) => {
    // remaps min-max to 0-1
    const progressValue = unref(progress)
    if (min >= progressValue) return 0
    if (max <= progressValue) return 1

    return easing(remap(progressValue, min, max))
}