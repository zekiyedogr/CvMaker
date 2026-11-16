
const puppeteer = require('puppeteer');
const fs = require('fs');

async function test() {
    try {
        const chromePath = await puppeteer.executablePath();

        console.log('Puppeteer:', require('puppeteer/package.json').version);
        console.log('Chrome yolu:', chromePath);
        console.log('Dosya mevcut mu:', fs.existsSync(chromePath));

        console.log('Chrome başlatılıyor...');

        const browser = await puppeteer.launch({
            headless: true,
            dumpio: true,
            enableExtensions: true
        });

        console.log('Chrome başarıyla başlatıldı!');

        await browser.close();
    } catch (error) {
        console.error('TEST HATASI:', error);
    }
}

test();
