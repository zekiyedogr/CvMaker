import { getClassicHtml } from './ClassicHtml';
import classicPdfStyles from './ClassicPdfStyles';
import api from '../../../services/api';

export const createClassicPdf = async (profile: any) => {
    try {
        const html = getClassicHtml(profile);
        const css = classicPdfStyles;

        const response = await api.post(
            '/pdf',
            { html, css },
            { responseType: 'blob' }
        );

        const pdfBlob = new Blob(
            [response.data],
            { type: 'application/pdf' }
        );

        const pdfUrl = window.URL.createObjectURL(pdfBlob);

        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `${profile.personalInformation.firstName} ${profile.personalInformation.lastName} CV.pdf`;

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(pdfUrl);

    } catch (error: any) {
        if (error.response?.data instanceof Blob) {
            const errorText = await error.response.data.text();
            console.error('PDF BACKEND ERROR:', errorText);
        } else {
            console.error('PDF ERROR:', error);
        }

        throw error;
    }
};