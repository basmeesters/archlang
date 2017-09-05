/**
  * Object that finds all _archlang_ <code> blocks on the page and replaces them
  * with the visualization. The generated HTML makes use of the Material Design
  * Lite library to give a pleasing UI.
  */
class Gui {
    constructor() { }

    public replaceCodeBlocksWithVisualizations() {
        let counter = 0;
        const obj = this;
        $("pre > code").each(function(this: any) {
            if($(this).attr("class")) {
                const input = $(this).text();
                const id = `graph-${counter}`
                $($(this).parent()).replaceWith(obj.htmlTemplate(counter));
                obj.createArchitecture(window.innerWidth, 250, id, input)
                counter += 1;
            }
        })
    }

    // HTML template that draws the visualization in a container with a toolbar.
    private htmlTemplate(counter: number) {
        const id = `graph-${counter}`;
        return `
            <div class="demo-card-wide mdl-card mdl-shadow--3dp">
                <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                    <header class="mdl-layout__header">
                        <div class="mdl-layout__header-row">
                            <!-- Navigation. We hide it in small screens. -->
                            <nav class="mdl-navigation mdl-layout">
                                <button id="${id}-export"
                                        class="mdl-button mdl-js-button">
                                    Export
                                </button>
                            </nav>
                        </div>
                    </header>
                    <main class="mdl-layout__content">
                    <svg id="${id}"></svg>
                    </main>
                </div>
            </div>
        `
    }

    // Create a single architecture in using the SVG ID given.
    private createArchitecture(
        width: number,
        height: number,
        svgId: string,
        input: string
    ): void {
        const result = ArchitectureParser.parseGraph(input)
        if (result instanceof Success) {
            const graph = result.value as Architecture
            const errors = graph.validate()
            if (errors.length > 0) {
                errors.forEach(e => console.log(e))
            } else {
                new DagreGraph(graph.toJson(), width, height, svgId);
                new ImageExporter(svgId)
            }
        } else {
            console.log(result.value)
        }
    }
}
