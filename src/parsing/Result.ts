/**
  * Result of parsing, can either be a success or a failure.
  */
abstract class Result {
    constructor(
        public value: any,
        public rest: Stream
    ) {   }

    /**
      * Apply a function over the value and return a new Result.
      */
    public abstract map: (fn: (val: any) => any) => Result;

    /**
      * Apply a function over both the value and the remainder.
      */
    public abstract chain: (fn: (val: any, rest: Stream) => any) => any;

    /**
      * Fold the result providing both success and failure functions.
      */
    public abstract fold: (
        success: (val: any, rest: Stream) => any,
        failure: (val: any, rest: Stream) => any
    ) => any;
}

class Success extends Result {
    /** see super */
    public map = (fn: (val: any) => any) =>
        new Success(fn(this.value), this.rest)

    /** see super */
    public chain = (fn: (val: any, rest: Stream) => any) =>
        fn(this.value, this.rest)

    /** see super */
    public fold = (
        success: (val: any, rest: Stream) => any,
        _failure: (val: any, rest: Stream) => any
    ) => success(this.value, this.rest)
}

class Failure extends Result {
    /** see super */
    public map = (fn: (val: any) => any) => this

    /** see super */
    public chain = (fn: (val: any, rest: Stream) => any) => this

    /** see super */
    public fold = (
        _success: (val: any, rest: Stream) => any,
        failure: (val: any, rest: Stream) => any
    ) => failure(this.value, this.rest)
}
