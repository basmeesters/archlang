/**
  * Wrapper around iterable (array or string) to make it immutatable.
  */
class Stream {
    constructor(private iterable: string,
                private cursor: number = 0,
                private length: number = -1) {
        this.length = length === -1
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

    public toString(): string {
        return this.iterable.slice(this.cursor)
    }

    /**
      * Get the size of the (remaining) stream.
      */
    public size(): number {
        return this.length
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
