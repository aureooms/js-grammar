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
					"terminal" : ")" ,
					"buffer" : ")" ,
					"position" : n+1 ,
				} ,
			] ,
		] )
	) ;

	const expectedError = new RegExp( `Syntax error at ${n+1} \\(\\)\\)` ) ;

	const tree = parser.parse(tokens);

	const flattened = ast.flatten( tree ) ;

	const chunks = asyncIterableMap( leaf => leaf.buffer , flattened ) ;

	const output = tape.fromAsyncIterable( chunks ) ;

	//for ( const i of range(n) ) t.is( await output.read(), 'x') ;
	//await t.throws( () => output.read() , expectedError ) ;

	//await t.throws( () => tape.toString( output ) , expectedError ) ;

	return tape.toString( output )
		.then( () => t.fail() )
		.catch( err => t.true(expectedError.test(err.message)) ) ;

}

throws.title = ( which , G , n ) => `Lookahead mismatch error at position ${n+1} (follow case).` ;

const G1 = grammar.from( {
	"root" : "root" ,
	"start" : "start" ,
	"eof" : "$" ,
	"productions" : {
		"root" : {
			"start" : [ "&expr" , "=$" ]
		} ,
		"expr" : {
			"prn" : [ "=(" , "&expr" , "=)"  ] ,
			"add" : [ "=x" , "&expr" ] ,
			"end" : [ ]
		}
	}
} ) ;


test( throws , G1 , 0 ) ;
test( throws , G1 , 1 ) ;
test( throws , G1 , 10 ) ;
test( throws , G1 , 100 ) ;
test( throws , G1 , 666 ) ;
