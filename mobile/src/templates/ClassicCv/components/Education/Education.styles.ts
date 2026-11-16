
import { StyleSheet } from 'react-native';

import themes from '../../styles/colors';
import createSizes from '../../styles/sizes';

export default function createStyles(
    themeIndex: any,
    sizeValue = 1,
    heading: any,
    body: any
) {
    const colors = themeIndex || themes[0];
    const sizes = createSizes(sizeValue);

    return StyleSheet.create({
        container: {
            marginVertical: sizes.step,
        },

        title: {
            color: colors.white,
            borderBottomWidth: sizeValue,
            borderColor: colors.white,
            fontSize: sizes.fontChapterTitles,
            fontFamily: heading.fontBold,
            paddingBottom: sizes.step / 2,
        },

        educationItem: {
            marginTop: sizes.step,
        },

        years: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: sizes.step * 0.5,
        },

        yearText: {
            color: colors.white,
            fontFamily: body.fontBold || body.font,
            fontSize: sizes.fontTextSmall,
        },

        schoolName: {
            color: colors.white,
            fontFamily: heading.fontBold,
            fontSize: sizes.fontTitles,
            marginBottom: sizes.step * 0.5,
        },

        content: {
            color: colors.white,
            fontFamily: body.font,
            fontSize: sizes.fontText,
            marginBottom: sizes.step * 0.5,
        },
    });
}
