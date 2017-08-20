const description: Parser = between(
    char('"'),
    zeroOrMore(not(string('"'))),
    char('"'),
)

const node: Parser = sequence(
    [takeLeft(zeroOrMore(not(string(" "))), string(" ")),
     takeLeft(description, string(" ")),
     takeLeft(description, string("\n"))]
)

node
    .run('n1 "Some title" "some description"\n')
    .fold(
        v => console.log('success ' + v.map(a => a.join(""))),
        e => console.log('error ' +  e)
    )
