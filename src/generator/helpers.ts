import { complement, compose, flip, includes, isEmpty } from 'ramda';

export const included = flip(includes);
export const notIncluded = compose(complement, flip(includes));
export const isNotEmpty = complement(isEmpty);
