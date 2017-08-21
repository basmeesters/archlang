/**
  * Originally taken from:
  * https://medium.com/@chetcorcos/introduction-to-parsers-644d1b5d7f3d and
  * modified to work with TypeScript.
  */
class Stream {
    constructor(private iterable: string,
                private cursor: number = 0,
                private length: number = undefined) {
        this.length = length === undefined
            ? iterable.length - this.cursor
            : length
    }

    /**
      * Get the first value from the iterable.
      */
    public head(): string {
        if (this.length <= 0) {
            throw new TypeError('index out of range')
        }
        return this.iterable[this.cursor]
    }

    /**
      * Consume the stream by moving the cursor.
      */
    public move(distance: number): Stream {
        return new Stream(
            this.iterable,
            this.cursor + distance,
            this.length - distance
        )
    }
}
