import test from 'ava' ;

import { iter , map , chain , enumerate , list , range , nrepeat } from '@aureooms/js-itertools' ;
import tape , { asyncIterableToArray , asyncIterableMap } from '@aureooms/js-tape' ;
import { grammar , ast , ll1 , error } from '../../../src' ;

const {
	LookaheadMismatchError ,
} = error ;

function throws ( t , G , n ) {

	t.true(ll1.is(G));

	const parser = ll1.from(G);

	const tokens = tape.fromIterable(
		chain( [
			map(
				i => ({
					"type" : "leaf" ,
					"terminal" : "x" ,
					"buffer" : "x" ,
					"position" : i ,
				}) ,
				range(n)
			) ,
			[
				{
					"type" : "leaf" ,
					"terminal" : "y" ,
					"buffer" : "y" ,
					"position" : n+1 ,
				} ,
			] ,
		] )
	) ;

	const expectedError = new RegExp( `Syntax error at ${n+1} \\(y\\)` ) ;

	const tree = parser.parse(tokens);

	const flattened = ast.flatten( tree ) ;

	const chunks = asyncIterableMap( leaf => leaf.buffer , flattened ) ;

	const output = tape.fromAsyncIterable( chunks ) ;

	//await t.throws( tape.toString( output ) , expectedError ) ;

	return tape.toString( output )
		.then( () => t.fail() )
		.catch( err => t.true(expectedError.test(err.message)) ) ;

}

throws.title = ( which , G , n ) => `Lookahead mismatch error at position ${n+1} (unexpected case - ${which}).` ;

const G1 = grammar.from( {
	"root" : "root" ,
	"start" : "start" ,
	"eof" : "$" ,
	"productions" : {
		"root" : {
			"start" : [ "&letters" , "=$" ]
		} ,
		"letters" : {
			"add" : [ "=x" , "&letters" ] ,
			"end" : [ ] ,
		} ,
	} ,
} ) ;

const G2 = grammar.from( {
	"root" : "root" ,
	"start" : "start" ,
	"eof" : "$" ,
	"productions" : {
		"root" : {
			"start" : [ "&letters" , "=$" ]
		} ,
		"letters" : {
			"add" : [ "&letter" , "&letters" ] ,
			"end" : [ ]
		} ,
		"letter" : {
			"x" : [ "=x" ]
		}
	}
} ) ;


test( 'leaf' , throws , G1 , 0 ) ;
test( 'leaf' , throws , G1 , 1 ) ;
test( 'leaf' , throws , G1 , 10 ) ;
test( 'leaf' , throws , G1 , 100 ) ;
test( 'leaf' , throws , G1 , 666 ) ;

test( 'node' , throws , G2 , 0 ) ;
test( 'node' , throws , G2 , 1 ) ;
test( 'node' , throws , G2 , 10 ) ;
test( 'node' , throws , G2 , 100 ) ;
test( 'node' , throws , G2 , 666 ) ;
