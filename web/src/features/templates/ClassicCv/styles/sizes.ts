export default function createSizes(value = 1) {
    return {
        sizeValue: value,
        compatibilityValue: 1,
        step: 5 * value,

        leftPadding: 20 * value,
        horizontalPadding: 20 * value,
        verticalPadding: 20 * value,

        sIcon: 5 * value,
        mIcon: 11 * value,

        fontChapterTitles: 14 * value,
        fontTitles: 11 * value,
        fontText: 10 * value,
        fontTextSmall: 8 * value,
        fontTextXSmall: 7 * value,
        fontNameSize: 27 * value,
        fontLastNameSize: 27 * value,
        fontProfSize: 15 * value,

        lineWidth: 50 * value,
        lineHeight: 3 * value,
    };
}
