import test from 'ava' ;

import { iter , map , enumerate , list , range , nrepeat , ncycle } from '@aureooms/js-itertools' ;
import stream , { asyncIterableToArray , asyncIterableMap } from '@aureooms/js-stream' ;
import { grammar , ast , ll1 } from '../../../src' ;

async function flatten ( t , n ) {

	const G = grammar.from( {
		"start" : "letters" ,
		"eof" : "$" ,
		"productions" : {
			"letters" : {
				"add" : [ "&letter" , "&letters" ] ,
				"end" : [ ] ,
			} ,
			"letter" : {
				"x" : [ "=x" ] ,
			} ,
		} ,
	} ) ;

	t.true(ll1.is(G));

	const parser = ll1.from(G);

	const tokens = stream.fromIterable(
		map(
			i => ({
				"type" : "leaf" ,
				"terminal" : "x" ,
				"buffer" : "x" ,
				"position" : i ,
			}) ,
			range(n)
		)
	) ;

	const tree = await parser.parse(tokens);

	const got = await stream.toString( stream.fromAsyncIterable( asyncIterableMap( leaf => leaf.buffer , ast.flatten( tree ) ) ) ) ;

	const expected = list(nrepeat('x', n)).join('') ;

	t.is( got , expected ) ;

}

flatten.title = ( _ , n ) => `No recursion: flatten repetition of a single letter x${n} times.` ;

test( flatten , 1000 ) ;
test( flatten , 10000 ) ;
test( flatten , 100000 ) ;


async function materialize ( t , n ) {

	const G = grammar.from( {
		"start" : "letters" ,
		"eof" : "$" ,
		"productions" : {
			"letters" : {
				"add" : [ "&letter" , "&letters" ] ,
				"end" : [ ] ,
			} ,
			"letter" : {
				"x" : [ "=x" ] ,
			} ,
		} ,
	} ) ;

	t.true(ll1.is(G));

	const parser = ll1.from(G);

	const tokens = stream.fromIterable(
		map(
			i => ({
				"type" : "leaf" ,
				"terminal" : "x" ,
				"buffer" : "x" ,
				"position" : i ,
			}) ,
			range(n)
		)
	) ;

	const tree = await parser.parse(tokens);

	const materialized = await ast.materialize(tree) ;

	const got = await stream.toString( stream.fromAsyncIterable( asyncIterableMap( leaf => leaf.buffer , ast.flatten( materialized ) ) ) ) ;

	const expected = list(nrepeat('x', n)).join('') ;

	t.is( got , expected ) ;

}

materialize.title = ( _ , n ) => `No recursion: materialize repetition of a single letter x${n} times.` ;

test( materialize , 1000 ) ;
test( materialize , 10000 ) ;
test( materialize , 100000 ) ;