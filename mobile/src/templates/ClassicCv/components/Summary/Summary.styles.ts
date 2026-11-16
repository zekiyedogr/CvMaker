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

        section: {
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
            margin: 0,
            fontSize: sizes.fontText,
            fontFamily: body.font,
            color: colors.secondColor,
            lineHeight: sizes.fontText * 1.4,
            textAlign: 'left',
        },

        editButton: {
            position: 'absolute',
            top: -10,
            right: 0,
            zIndex: 2,
        },
    });
}