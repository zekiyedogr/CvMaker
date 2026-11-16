export interface FontFamily {
    id: number;
    font: string;
    fontBold: string;
    name: string;
    html: string;
}

const fontFamilyList: FontFamily[] = [
    { id: 0, font: 'Nunito-Regular', fontBold: 'Nunito-Bold', name: 'Nunito', html: '"Nunito", sans-serif' },
    { id: 1, font: 'Lato-Regular', fontBold: 'Lato-Bold', name: 'Lato', html: '"Lato", sans-serif' },
    { id: 3, font: 'PlayfairDisplay-Regular', fontBold: 'PlayfairDisplay-Bold', name: 'Playfair Display', html: '"Playfair Display", serif' },
    { id: 2, font: 'Montserrat-Regular', fontBold: 'Montserrat-Bold', name: 'Montserrat', html: '"Montserrat", sans-serif' },
    { id: 4, font: 'Poppins-Regular', fontBold: 'Poppins-Bold', name: 'Poppins', html: '"Poppins", sans-serif' },
    { id: 5, font: 'Calistoga-Regular', fontBold: 'Calistoga-Regular', name: 'Calistoga', html: '"Calistoga", serif' },
    { id: 6, font: 'DMSans-Regular', fontBold: 'DMSans-Bold', name: 'DM Sans', html: '"DM Sans", sans-serif' },
    { id: 7, font: 'LibreBaskerville-Regular', fontBold: 'LibreBaskerville-Bold', name: 'Libre Baskerville', html: '"Libre Baskerville", serif' },
    { id: 8, font: 'Merriweather-Regular', fontBold: 'Merriweather-Bold', name: 'Merriweather', html: '"Merriweather", serif' },
    { id: 9, font: 'OpenSans-Regular', fontBold: 'OpenSans-Bold', name: 'Open Sans', html: '"Open Sans", sans-serif' },
    { id: 10, font: 'Outfit-Regular', fontBold: 'Outfit-Bold', name: 'Outfit', html: '"Outfit", sans-serif' },
    { id: 11, font: 'PlusJakartaSans-Regular', fontBold: 'PlusJakartaSans-Bold', name: 'Plus Jakarta Sans', html: '"Plus Jakarta Sans", sans-serif' },
    { id: 12, font: 'Roboto-Regular', fontBold: 'Roboto-Bold', name: 'Roboto', html: '"Roboto", sans-serif' },
    { id: 13, font: 'SourceSans3-Regular', fontBold: 'SourceSans3-Bold', name: 'Source Sans 3', html: '"Source Sans 3", sans-serif' },
    { id: 14, font: 'Urbanist-Regular', fontBold: 'Urbanist-Bold', name: 'Urbanist', html: '"Urbanist", sans-serif' },
    { id: 15, font: 'NotoSerifGeorgian-Regular', fontBold: 'NotoSerifGeorgian-Bold', name: 'Noto Serif Georgian', html: '"Noto Serif Georgian", serif' },
    { id: 16, font: 'GreatVibes-Regular', fontBold: 'GreatVibes-Regular', name: 'Great Vibes', html: '"Great Vibes", cursive' },
    { id: 17, font: 'DancingScript-Regular', fontBold: 'DancingScript-Regular', name: 'Dancing Script', html: '"Dancing Script", cursive' },
];

export default fontFamilyList;