function start(): void {
    const result = ArchitectureParser.parseGraph(exampleInput)
    if (result instanceof Success) {
        const graph = result.value as Architecture
        const errors = graph.validate()
        if (errors.length > 0) {
            errors.forEach(e => console.log(e))
        } else {
            new DagreGraph(graph.toJson());
        }
    } else {
        console.log(result.value)
    }
}
