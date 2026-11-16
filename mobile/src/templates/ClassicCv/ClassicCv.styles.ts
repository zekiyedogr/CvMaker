
import { StyleSheet } from 'react-native';

import themes from './styles/colors';
import createSizes from './styles/sizes';
import general from '../../constants/colors';

export default function createStyles(
    themeIndex: typeof themes[number] | undefined,
    sizeValue: number = 1,
    heading: { font: string; fontBold: string },
    scale: number = 1
) {
    const colors = themeIndex || themes[0];
    const sizes = createSizes(sizeValue);

    return StyleSheet.create({

        // MAIN CONTAINER
        container: {
            width: '100%',
            aspectRatio: 794 / 1123,
            flexDirection: 'row',
            overflow: 'hidden',
            backgroundColor: general.white,
        },

        // LEFT COLUMN
        left: {
            width: '33.33%',
            flexGrow: 0,
            flexShrink: 0,
            backgroundColor: colors.mainColor,
            padding: sizes.leftPadding * 0.4,
        },

        // RIGHT COLUMN
        right: {
            width: '66.66%',
            flexGrow: 0,
            flexShrink: 0,
            padding: sizes.leftPadding * 0.4,
        },

        // PHOTO
        imgContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: sizes.step * scale,
            position: 'relative',
        },

        profileImg: {
            width: 90 * sizeValue,
            height: 90 * sizeValue,
            aspectRatio: 1,
            borderRadius: 9999,
            borderColor: colors.white,
            borderWidth: 3,
        },

        photoEditButton: {
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 10,
        },

        // CONTACT
        innerContainer: {
            paddingTop: sizes.leftPadding * 0.4 * scale,
            position: 'relative',
        },

        contactEditButton: {
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 10,
        },

        // NAME
        nameContainer: {
            justifyContent: 'center',
            padding: sizes.leftPadding * 0.8 * scale,
            margin: sizes.leftPadding * 0.8 * scale,
        },

        nameHeader: {
            position: 'relative',
        },

        name: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },

        firstName: {
            fontSize: sizes.fontNameSize * scale,
            color: colors.secondColor,
            fontFamily: heading.font,
        },

        lastName: {
            fontSize: sizes.fontNameSize * scale,
            color: colors.mainColor,
            fontFamily: heading.fontBold,
        },

        profession: {
            fontSize: sizes.fontProfSize * scale,
            color: colors.secondColor,
            flexWrap: 'wrap',
            fontFamily: heading.font,
            textAlign: 'center'
        },

        line: {
            width: sizes.lineWidth * scale,
            height: sizes.lineHeight * scale,
            backgroundColor: colors.mainColor,
            marginTop: sizes.step * scale,
        },

        // EDIT BUTTONS
        editbutton: {
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 10,
        },

    });
}
