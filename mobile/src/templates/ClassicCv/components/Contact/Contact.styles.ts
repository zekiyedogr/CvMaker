
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

        contactItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: sizes.step,
            marginTop: sizes.step,
            minWidth: 0,
        },

        contactIcon: {
            color: colors.white,
            fontSize: sizes.mIcon,
            width: sizes.mIcon,
            flexShrink: 0,
        },

        contactText: {
            fontFamily: body.font,
            fontSize: sizes.fontText,
            color: colors.white,
            flexShrink: 1,
        },
    });
}
