import { reversed } from '@aureooms/js-itertools' ;
import first from './first' ;

/**
 * Generate FOLLOW set for any rule given the FOLLOW sets for the nonterminals.
 *
 * @param {Array} FOLLOW
 * @param {Array} rule
 * @returns {Set}
 */
export default function follow ( FOLLOW , rule ) {
	return first( FOLLOW , reversed(rule)) ;
}
