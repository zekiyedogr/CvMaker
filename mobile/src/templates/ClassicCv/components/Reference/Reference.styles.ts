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
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: sizes.step,
            width: '100%',
        },

        item: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            flex: 1,
            minWidth: 0,
            paddingRight: sizes.step,
        },

        name: {
            fontFamily: body.font,
            fontSize: sizes.fontText,
            fontWeight: '700',
            color: colors.secondColor,
            textAlign: 'left',
            width: '100%',
        },

        position: {
            margin: 0,
            fontFamily: body.font,
            fontSize: sizes.fontText,
            color: colors.secondColor,
            textAlign: 'left',
            width: '100%',
        },

        contact: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            gap: sizes.step,
            width: '100%',
        },

        contactTitle: {
            fontFamily: body.font,
            fontSize: sizes.fontTextSmall,
            color: colors.secondColor,
        },

        contactInfo: {
            fontFamily: body.font,
            fontSize: sizes.fontTextSmall,
            color: colors.secondColor,
        },
    });
}
