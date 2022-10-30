class IdealistaSelector {
    //Development
    static DEVELOPMENT_LINKS_PROPERTIES = '.table__new-dev-typologies .table .table__row'

    //Property
    static PROPERTY_REFERENCE = "#module-contact-container > section > div > div.ide-box-contact.module-contact-gray.contact-data-container > div.ad-reference-container > p.txt-ref"
    static PROPERTY_SHORT_DESCRIPTION = "#main > div > main > section.detail-info.ide-box-detail-first-picture.ide-box-detail--reset.overlay-box > div.main-info__title > h1 > span"
    static PROPERTY_LONG_DESCRIPTION = "#main > div > main > section.detail-info.ide-box-detail-first-picture.ide-box-detail--reset.overlay-box > div.commentsContainer > div.comment > div.adCommentsLanguage"
    static PROPERTY_PRICE = "#main > div > main > section.detail-info.ide-box-detail-first-picture.ide-box-detail--reset.overlay-box > div.info-data > span > span"

    static PROPERTY_MAIN_IMAGE = "#main > div > main > picture > div > img"
    static PROPERTY_IMAGENES = "#main-multimedia .image img"
    static PROPERTY_ICONO_PLANO = "#main > div > main > section.detail-info.ide-box-detail-first-picture.ide-box-detail--reset.overlay-box > div.fake-anchors.corevitals-fixed-height > button.fa-button.btn.icon-plan.with-text"

    /*Falta por implementar*/
    static PROPERTY_VIDEO = "#grid-multimedia > div > video > source:nth-child(1)"
    static PROPERTY_VIDEO_306 = "#visit-3d-content > iframe"
}


export class IdealistaDevelopment {
    #page;

    constructor(page) {
        this.#page = page;
    }

    async getAllLinks() {
        let LinksProperties = [];

        const links = await this.#page.$$(IdealistaSelector.DEVELOPMENT_LINKS_PROPERTIES);

        for await (let link of links) {
            LinksProperties.push(await link.getAttribute("href"))
        }

        return LinksProperties;
    }
}


export class IdealistaProperty {
    #url
    #page;

    constructor(url, page) {
        this.#url = url
        this.#page = page
    }

    async #getReference(){
        let reference = await this.#page.$(IdealistaSelector.PROPERTY_REFERENCE)
        return await reference.innerText()
    }

    async #getShortDescription(){
        let shortDescription = await this.#page.$(IdealistaSelector.PROPERTY_SHORT_DESCRIPTION)
        return await shortDescription.innerText()
    }

    async #getLongDescription(){
        let longDescription = await this.#page.$(IdealistaSelector.PROPERTY_LONG_DESCRIPTION)
        return await longDescription?.innerText()
    }

    async #getPrice(){
        let price = await this.#page.$(IdealistaSelector.PROPERTY_PRICE)
        return await price.innerText()
    }

    async #getMainImages(){
        let mainImage = await this.#page.$(IdealistaSelector.PROPERTY_MAIN_IMAGE)
        return (await mainImage.getAttribute("src")).replace("-L-L", "").replace("-L-P", "")
    }

    async #getImages(){
        let images = await this.#page.$$(IdealistaSelector.PROPERTY_IMAGENES)
        let isPlano = await this.#page.$(IdealistaSelector.PROPERTY_ICONO_PLANO)

        let imagesUrl = [];
        let count = 0;
        for await (let image of images) {
            if(isPlano && count === 0) {
                count++;
                continue;
            }

            let src = (await image.getAttribute("data-service")).replace(",WEB_DETAIL", "")
            imagesUrl.push(src)
            count++;
        }
        
        return imagesUrl;
    }

    async #getPlanos(){
        let images = await this.#page.$$(IdealistaSelector.PROPERTY_IMAGENES)
        let plano = await this.#page.$(IdealistaSelector.PROPERTY_ICONO_PLANO)
        if(plano){
            return (await images[0].getAttribute("data-service")).replace(",WEB_DETAIL", "")
        }
        return null
    }

    async extractData(){
        let data = {
            "reference": await this.#getReference(),
            "shortDescription": await this.#getShortDescription(),
            "longDescription": await this.#getLongDescription(),
            "price": await this.#getPrice(),
            "mainImage": await this.#getMainImages(),
            "images": await this.#getImages(),
            "planos": await this.#getPlanos()
        }

        return data
    }

}