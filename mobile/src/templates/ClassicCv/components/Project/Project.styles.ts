
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

        projectInner: {
            position: 'relative',
            flexDirection: 'row',
            width: '100%',
        },

        projectLine: {
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: sizes.lineHeight,
            backgroundColor: colors.white,
        },

        projectContent: {
            flex: 1,
            minWidth: 0,
            paddingLeft: sizes.leftPadding * 0.5,
            gap: sizes.leftPadding * 0.5,
            paddingTop: sizes.step,
        },

        projectItem: {
            position: 'relative',
            gap: sizes.step * 0.5,
            minWidth: 0,
        },

        projectHeading: {
            position: 'relative',
            flexDirection: 'column',
            alignItems: 'stretch',
        },

        projectBullet: {
            position: 'absolute',
            left: -sizes.leftPadding + 4,
            top: 0,
            width: 12 * sizeValue,
            height: 12 * sizeValue,
            borderRadius: 999,
            backgroundColor: colors.white,
        },

        projectName: {
            color: colors.white,
            fontFamily: body.fontBold || body.font,
            fontSize: sizes.fontTitles,
        },

        projectDate: {
            width: '100%',
            color: colors.white,
            fontFamily: body.font,
            fontSize: sizes.fontTextSmall,
            textAlign: 'right',
        },

        projectDescriptions: {
            gap: sizes.step,
        },

        projectDescription: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: sizes.step * 0.5,
            minWidth: 0,
        },

        descriptionBullet: {
            color: colors.white,
            fontSize: sizes.fontText,
            flexShrink: 0,
        },

        descriptionText: {
            color: colors.white,
            fontFamily: body.font,
            fontSize: sizes.fontText,
            lineHeight: sizes.fontText * 1.3,
            flexShrink: 1,
        },

        projectLink: {
            width: '100%',
            color: colors.white,
            fontFamily: body.font,
            fontSize: sizes.fontText,
            textAlign: 'right',
            textDecorationLine: 'underline',
        },
    });
}
