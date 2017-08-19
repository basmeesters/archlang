const here = between(
    zeroOrMore(not(string('<here>'))),
    between(
        string('<here>'),
        zeroOrMore(not(string('</here>'))),
        string('</here>')
    ),
    always(null)
)

here
    .run('blah blah <here>hello world</here> blah')
    .fold(
        v => console.log('success ' + v.join('')),
        e => console.log('error ' +  e)
    )
