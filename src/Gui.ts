class Gui {
    constructor() { }

    public replaceCodeWithVisualization() {
        let counter = 0;
        const obj = this;
        $("pre > code").each(function(this: any) {
            if($(this).attr("class")) {
                const width = $(this).attr("width");
                const height = $(this).attr("height");
                const input = $(this).text();
                const id = `graph-${counter}`
                $($(this).parent()).replaceWith(obj.htmlTemplate(counter));
                obj.createArchitecture(window.innerWidth, 415, id, input)
                counter += 1;
            }
        })
    }

    private htmlTemplate(counter: number) {
        return `
            <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
              <header class="mdl-layout__header">
                <div class="mdl-layout__header-row">
                  <!-- Navigation. We hide it in small screens. -->
                  <nav class="mdl-navigation mdl-layout">
                    <button id='export-${counter}'
                            class="mdl-button mdl-js-button">
                            Export
                    </button>
                  </nav>
                </div>
              </header>
              <main class="mdl-layout__content">
                <svg id="graph-${counter}"></svg>
              </main>
          </div>
        `
    }

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
                new ImageExporter()
            }
        } else {
            console.log(result.value)
        }
    }
}
