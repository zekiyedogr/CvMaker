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

        inner: {
            position: 'relative',
            flexDirection: 'row',
            width: '100%',
        },

        line: {
            position: 'absolute',
            left: -sizeValue,
            top: 0,
            bottom: 0,
            width: sizeValue,
            backgroundColor: colors.mainColor,
        },

        content: {
            flexDirection: 'column',
            width: '100%',
            minWidth: 0,
            paddingLeft: sizes.leftPadding,
            gap: sizes.leftPadding,
        },

        item: {
            position: 'relative',
            flexDirection: 'column',
            minWidth: 0,
            gap: sizes.step,
        },

        heading: {
            position: 'relative',
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: sizes.step,
            minWidth: 0,
        },

        bullet: {
            position: 'absolute',
            left: -sizes.leftPadding - 5,
            top: 0,
            width: 12 * sizeValue,
            height: 12 * sizeValue,
            borderRadius: 999,
            backgroundColor: colors.mainColor,
            flexShrink: 0,
        },

        company: {
            flex: 1,
            minWidth: 0,
            fontFamily: body.font,
            fontSize: sizes.fontText,
            fontWeight: '700',
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

        position: {
            margin: 0,
            fontFamily: body.font,
            fontSize: sizes.fontText,
            color: colors.secondColor,
            textAlign: 'left',
            lineHeight: sizes.fontText * 1.3,
        },

        descriptions: {
            flexDirection: 'column',
            gap: sizes.step,
            paddingLeft: sizes.leftPadding,
        },

        description: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: sizes.step,
        },

        descriptionBullet: {
            flexShrink: 0,
            fontFamily: body.font,
            fontSize: sizes.fontText,
            color: colors.secondColor,
        },

        descriptionText: {
            flex: 1,
            fontFamily: body.font,
            fontSize: sizes.fontText,
            color: colors.secondColor,
            textAlign: 'left',
            lineHeight: sizes.fontText * 1.3,
        },
    });
}
