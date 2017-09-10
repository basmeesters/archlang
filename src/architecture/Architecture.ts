/**
  * Architecture object that contains components and connectors connecting them.
  * This object provides means to validate the structure and translate the
  * object structure to JSON so it can be visualized.
  */
class Architecture {
    constructor(
        public settings: Settings,
        public components: Array<Component>,
        public connectors: Array<Connector>
    ) { }

    public toJson(): JsonGraph {
        return {
            nodes: this.components.map (c => c.toJson(this.settings)),
            edges: this.connectors.map((c, i) => c.toJson(`e${i}`, this.settings))
        }
    }

    /**
      * Validation method to check if the created Architecture is actually valid
      * and can be visualized. If all is well this function returns an empty
      * array, else it will return a list of error messages.
      */
    public validate(): Array<string> {
        let componentHash: {[id: string] : Component } = {}
        this.components.forEach(c => componentHash[c.id] = c)
        let errors: Array<string> = []
        for (const connector of this.connectors) {
            if (componentHash[connector.source] == undefined) {
                errors.push(`${connector.source} does not exist as component`);
            }
            if (componentHash[connector.target] == undefined) {
                errors.push(`${connector.target} does not exist as component`);
            }
        }
        return errors.filter((item, pos) => errors.indexOf(item) == pos)
    }
}
