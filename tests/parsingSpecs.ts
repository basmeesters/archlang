declare let describe: any
declare let expect: any
declare let it: any
declare let jasmine: any

describe("parsing package" , () => {
    streamSpec();
    parserSpec();
    parserCombinatorSpecs();
    architectureParserSpec();
})
