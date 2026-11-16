
const puppeteer = require('puppeteer');

const generatePdf = async (html, css) => {
    let browser;
    let step = 'Start';

    try {
        step = 'Browser is starting';

        browser = await puppeteer.launch({
            headless: true,
            dumpio: true,
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            args: process.platform === 'linux'
                ? ['--no-sandbox', '--disable-setuid-sandbox']
                : [],
        });

        step = 'New page is being created';

        const page = await browser.newPage();

        step = 'Viewport ayarlanıyor';

        await page.setViewport({
            width: 794,
            height: 1123,
            deviceScaleFactor: 1,
        });

        step = 'HTML and CSS are loading';

        await page.setContent(
            `<!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <style>${css}</style>
                </head>
                <body>${html}</body>
            </html>`,
            { waitUntil: 'networkidle0' }
        );

        step = 'Print media ayarlanıyor';

        await page.emulateMediaType('print');

        step = 'Loading font and image information';

        step = 'PDF is being created';

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: true,
            displayHeaderFooter: false,
            margin: {
                top: '0mm',
                right: '0mm',
                bottom: '0mm',
                left: '0mm',
            },
        });

        return pdfBuffer;

    } catch (error) {
        console.error('PDF ERROR STAGE:', step);
        console.error('PDF REAL ERROR:', error.stack || error);
        throw error;

    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

module.exports = { generatePdf };
