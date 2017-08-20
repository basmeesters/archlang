/**
  * Result of parsing, can either be a success or a failure.
  */
abstract class Result {
    constructor(public value: any, public rest) {   }

    /**
      * Apply a function over the value and return a new Result.
      */
    public abstract map: (fn: (val: string) => any) => Result;

    /**
      * Apply a function over both the value and the remainder.
      */
    public abstract chain: (fn: (val: any, rest: any) => any) => any;

    /**
      * Fold the result providing both success and failure functions.
      */
    public abstract fold: (success: any, failure: any) => Result;
}

class Success extends Result {
    /** see super */
    public map = (fn) => new Success(fn(this.value), this.rest)

    /** see super */
    public chain = (fn) => fn(this.value, this.rest)

    /** see super */
    public fold = (success, _failure) => success(this.value, this.rest)
}

class Failure extends Result {
    /** see super */
    public map = (fn) => this

    /** see super */
    public chain = (fn) => this

    /** see super */
    public fold = (_success, failure) => failure(this.value, this.rest)
}
