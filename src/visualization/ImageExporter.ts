declare let saveAs: any // FileSaver.js function
declare let unescape: any

class ImageExporter {
    constructor() {
        this.setUpSaveButton()
    }

    private setUpSaveButton(): void {
        const obj = this;
        d3.select('#export').on('click', function(){
            const svg = d3.select("#graph")
            const svgString = obj.getSVGString(svg.node());
            obj.svgString2Image(svgString, svg.node(), obj.save);
        });
    }

    private save(dataBlob: any, filesize: any): void {
        saveAs( dataBlob, 'architecture.png' );
    }

    private getSVGString(svgNode: SVGSVGElement): string {
        svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
        const cssStyleText = this.getCSSStyles(svgNode);
        this.appendCSS( cssStyleText, svgNode );

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgNode);

        return svgString;
    }

    private getCSSStyles(parentElement: SVGSVGElement): string {
        var extractedCSSText = "";
        const stylesheets = document.styleSheets as any;
        for (const stylesheet of stylesheets)
            for (const rule of stylesheet.cssRules)
                extractedCSSText += rule.cssText;

        return extractedCSSText;
    }

    private appendCSS(cssText: string, element: SVGSVGElement): void {
        const styleElement = document.createElement("style");
        styleElement.setAttribute("type","text/css");
        styleElement.innerHTML = cssText;
        const refNode = element.hasChildNodes() ? element.children[0] : null;
        element.insertBefore(styleElement, refNode);
    }

    private svgString2Image(
        svgString: string,
        svg: SVGSVGElement,
        callback: any): void {

        const width = svg.getBBox().width;
        const height = svg.getBBox().height;

        const format = "png";
        const imgsrc = 'data:image/svg+xml;base64,' +
            btoa(unescape(encodeURIComponent(svgString)));

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d") as any;

        canvas.width = width;
        canvas.height = height;

        const image = new Image();
        image.onload = () => {
            context.clearRect ( 0, 0, width, height );
            context.drawImage(image, 0, 0, width, height);

            canvas.toBlob( (blob: any) => {
                const filesize = Math.round( blob.length/1024 ) + ' KB';
                callback( blob, filesize );
            });
        };

        image.src = imgsrc;
    }
}
