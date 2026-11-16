import classicCss from './Classic.css?inline';

import contactCss from './components/Contact/Contact.css?inline';
import educationCss from './components/Education/Education.css?inline';
import listItemCss from './components/ListItem/ListItem.css?inline';
import projectCss from './components/Project/Project.css?inline';
import summaryCss from './components/Summary/Summary.css?inline';
import experienceCss from './components/Experience/Experience.css?inline';
import achievementCss from './components/Achievement/Achievement.css?inline';
import referenceCss from './components/Reference/Reference.css?inline';

import pdfCss from './ClassicPdf.css?inline';

const googleFonts = `
@import url('https://fonts.googleapis.com/css2?family=Calistoga&family=Dancing+Script&family=DM+Sans:wght@400;700&family=Great+Vibes&family=Lato:wght@400;700&family=Libre+Baskerville:wght@400;700&family=Merriweather:wght@400;700&family=Montserrat:wght@400;700&family=Noto+Serif+Georgian:wght@400;700&family=Nunito:wght@400;700&family=Open+Sans:wght@400;700&family=Outfit:wght@400;700&family=Playfair+Display:wght@400;700&family=Plus+Jakarta+Sans:wght@400;700&family=Poppins:wght@400;700&family=Roboto:wght@400;700&family=Source+Sans+3:wght@400;700&family=Urbanist:wght@400;700&display=swap');
`;

const classicPdfStyles = [
    googleFonts,
    classicCss,
    contactCss,
    educationCss,
    listItemCss,
    projectCss,
    summaryCss,
    experienceCss,
    achievementCss,
    referenceCss,
    pdfCss,
].join('\n');

export default classicPdfStyles;