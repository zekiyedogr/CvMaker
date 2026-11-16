import { StyleSheet } from 'react-native';

import themes from '../../styles/colors';
import createSizes from '../../styles/sizes';

export default function createStyles(
    themeIndex: typeof themes[number] | undefined,
    sizeValue: number = 1,
    heading: { font: string; fontBold: string },
    body: { font: string }
) {
    const colors = themeIndex || themes[0];
    const sizes = createSizes(sizeValue);

    return StyleSheet.create({
        container: {
            position: 'relative',
            flexDirection: 'column',
            width: '100%',
            gap: sizes.step,
        },

        title: {
            color: colors.mainColor,
            borderBottomWidth: sizeValue,
            borderColor: colors.white,
            fontSize: sizes.fontChapterTitles,
            fontFamily: heading.fontBold,
            paddingBottom: sizes.step / 2,
        },

        content: {
            flexDirection: 'column',
            gap: sizes.step,
            width: '100%',
        },

        item: {
            flexDirection: 'column',
            width: '100%',
        },

        name: {
            fontFamily: body.font,
            fontSize: sizes.fontText,
            fontWeight: '700',
            color: colors.secondColor,
            textAlign: 'left',
        },

        footer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: sizes.step,
            width: '100%',
        },

        issuer: {
            flex: 1,
            fontFamily: body.font,
            fontSize: sizes.fontText,
            color: colors.secondColor,
            textAlign: 'left',
        },

        date: {
            flexShrink: 0,
            fontFamily: body.font,
            fontSize: sizes.fontText,
            color: colors.secondColor,
            textAlign: 'right',
        },
    });
}
