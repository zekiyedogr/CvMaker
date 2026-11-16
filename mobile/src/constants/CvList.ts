
import type { ComponentType } from 'react';

import fontFamilyList from './fontFamilyList';
import createSizes from './createSizes';

import Classic from '../templates/ClassicCv/ClassicCv';
import ClassicColors from '../templates/ClassicCv/styles/colors';
import type { CvTheme } from '../templates/ClassicCv/styles/colors';
import ClassicSizes from '../templates/ClassicCv/styles/sizes';

import type { FontFamily } from './fontFamilyList';

const classicThemes: (CvTheme & { id: number })[] = ClassicColors.map(
    (theme, index) => ({
        ...theme,
        id: index + 1,
    })
);

export interface CvLimits {
    contactLimit: number;
    educationLimit: number;
    skillLimit: number;
    skillTitle: number;
    langLimit: number;
    hobbyLimit: number;
    projectLimit: number;
    descripLimit: number;
    expLimit: number;
    responLimit: number;
    certifLimit: number;
    awardLimit: number;
    referenceLimit: number;
}

export interface CvSettings {
    theme: CvTheme & { id: number };
    sizes: ReturnType<typeof createSizes>;
    limits: CvLimits;
    heading: FontFamily;
    body: FontFamily;
}

export interface CvTemplate {
    templateId: number;
    key: string;
    name: string;
    limits: CvLimits;
    themes: (CvTheme & { id: number })[];
    theme: CvTheme & { id: number };
    sizes: typeof ClassicSizes;
    sizeValue: number;
    heading: FontFamily;
    body: FontFamily;
    component: ComponentType<any>;
}

const CvList: CvTemplate[] = [
    {
        templateId: 1,
        key: 'Classic',
        name: 'Classic',

        limits: {
            contactLimit: 3,
            educationLimit: 1,
            skillLimit: 4,
            skillTitle: 1,
            langLimit: 2,
            hobbyLimit: 2,
            projectLimit: 1,
            descripLimit: 2,
            expLimit: 2,
            responLimit: 2,
            certifLimit: 2,
            awardLimit: 2,
            referenceLimit: 2,
        },

        themes: classicThemes,
        theme: classicThemes[0],

        sizes: ClassicSizes,
        sizeValue: 1.3,

        heading: fontFamilyList[3],
        body: fontFamilyList[1],

        component: Classic,
    },
];

export default CvList;
