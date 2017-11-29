export interface Term<T extends number | string = string> {
  '@id': string;
  token: T;
  title: string;
}

export class Vocabulary<T extends number | string = string> implements Iterable<Term<T>> {
  protected _terms: Term<T>[];
  protected _byToken: any = {};  // can't declare indexer with generics

  constructor(terms: Term<T>[]) {
    this._terms = terms;
    for (const term of terms) {
      this._byToken[term.token] = term;
    }
  }

  public terms() {
    return this._terms;
  }

  public byToken(token: T): Term<T> {
    const term = this._byToken[token];
    if (term === undefined) {
      throw Error(`${token} token doesn't exist in vocabulary`);
    } else {
      return term;
    }
  }

  [Symbol.iterator]() {
    let counter = 0;
    const terms = this._terms;

    return <Iterator<Term<T>>>{

      next(): IteratorResult<Term<T>> {
        if (counter < terms.length) {
          return { done: false, value: terms[counter++] };
        } else {
          return { done: true, value: undefined } as any as IteratorResult<Term<T>>;
        }
      }
    };
  }
}
