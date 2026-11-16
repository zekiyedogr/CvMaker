
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

        listContent: {
            marginTop: sizes.step,
            gap: sizes.step * 0.4,
        },

        listRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: sizes.step * 0.5,
            minWidth: 0,
        },

        bullet: {
            color: colors.white,
            fontSize: sizes.fontText,
            lineHeight: sizes.fontText * 1.25,
            flexShrink: 0,
        },

        content: {
            color: colors.white,
            fontFamily: body.font,
            fontSize: sizes.fontText,
            lineHeight: sizes.fontText * 1.25,
            flexShrink: 1,
        },
    });
}
