import { generateUrlProxyGoogle } from './utils/proxy-google.js';
import { IdealistaDevelopment, IdealistaProperty } from './utils/class.idealista.js';
import { Browser } from './utils/class.browser.js';


(async () => {
    const URL_PAGE = "https://www.idealista.com/obra-nueva/37088850/"
    const headless = true
    console.log('Inicializamos el browser')

    const browser = new Browser()
    await browser.init({ headless })
    const page = await browser.newPage();

    //Esto tiene que estar desahilitado en modo de desarrollo
    if(headless)
        await page.route((url) => url.href.startsWith("https://translate.google.com/websitetranslationui"), route => route.abort())

    console.log('Empezamos la extraccion del Developments')

    if (URL_PAGE.includes("idealista")) {
        let urlProxy = generateUrlProxyGoogle(URL_PAGE);
        await page.goto(urlProxy, { waitUntil: 'networkidle' })
    } else {
        await page.goto(URL_PAGE, { waitUntil: 'networkidle' })
    }

    const idealistaDevelopment = new IdealistaDevelopment(page);
    let allLinksProperties = await idealistaDevelopment.getAllLinks();

    console.log('Movemos el raton automatico por la pantalla')
    await browser.moveMouse(page);


    console.log('Urls de las propiedades')
    console.log(allLinksProperties);

    console.log('Empezamos con la estraccion de las Propiedades')
    let dataProperties = []
    for await (let linkProperty of allLinksProperties) {
        await page.goto(linkProperty, { waitUntil: 'networkidle' })
        await page.screenshot({ path: 'stealth.png', fullPage: true })

        let property = new IdealistaProperty(linkProperty, page)
        dataProperties.push(await property.extractData())
    }

    console.log(dataProperties)

    console.log('Todo terminado')
    await browser.close();
})();
