import chromiumAws from 'chrome-aws-lambda';
import { chromium } from 'playwright-extra';
import extras from 'puppeteer-extra-plugin-stealth';

export class Browser {
    #browser
    #context

    constructor() {
        chromium.use(extras())
    }

    async init({ headless = true }) {
        this.#browser = await chromium.launch({
            slowMo: 100,
            args: ['--window-size=1400,900',
                '--remote-debugging-port=9222',
                "--remote-debugging-address=0.0.0.0", // You know what your doing?
                '--disable-gpu', "--disable-features=IsolateOrigins,site-per-process", '--blink-settings=imagesEnabled=true'
            ],
            executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe' || await chromiumAws.executablePath,
            headless: headless || chromiumAws.headless,
            logger: {
                isEnabled: (name, severity) => name === 'browser',
                log: (name, severity, message, args) => console.log(`${name} ${message}`)
            },
            bypassCSP: true
        });

        this.#context = await this.#browser.newContext({
            userAgent: "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.5304.91 Mobile Safari/537.36",
            locale: 'es-ES',
            timezoneId: 'Europe/Berlin',
            permissions: ["geolocation", "notifications", "midi", "background-sync", "camera", 'ambient-light-sensor', 'accelerometer',
                'gyroscope', 'magnetometer', 'accessibility-events', 'clipboard-read', 'clipboard-write', 'payment-handler'],
        })

    }

    async newPage() {
        return await this.#browser.newPage()
    }

    /*
    Mueve el mouse por la pagina que se le pase por parametro
    */
    async moveMouse(page) {
        await page.mouse.move(0, 0);
        await page.mouse.down();
        await page.mouse.move(0, 100);
        await page.mouse.move(100, 100);
        await page.mouse.move(100, 0);
        await page.mouse.move(0, 0);
        await page.mouse.up();
    }

    async close() {
        await this.#browser.close();
    }
}