class Architecture {
    constructor(
        public components: Array<Component>,
        public connectors: Array<Connector>
    ) { }

    public toJson(): JsonGraph {
        return {
            nodes: this.components.map (c => c.toJson()),
            edges: this.connectors.map((c, i) => c.toJson(`e${i}`))
        }
    }
}
