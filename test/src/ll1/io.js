import test from 'ava' ;
import fs from 'fs' ;

import { map , enumerate } from '@aureooms/js-itertools' ;
import stream , { asyncIterableMap } from '@aureooms/js-stream' ;
import { grammar , ast , ll1 } from '../../../src' ;

test( "A convoluted `'010101'.replace(/0/g, 'a').replace(/1/g, 'b')` that reads from a file!" , async t => {

	const filepath = 'test/data/010101.txt' ;
	const encoding = 'utf8' ;
	const expected = 'ababab' ;

	const G = grammar.from( {
		"start" : "bits" ,
		"eof" : "\n" , // read untile newline
		"productions" : {
			"bits" : {
				"add" : [ "&bit" , "&bits" ] ,
				"end" : [ ] ,
			} ,
			"bit" : [
				[ "=0" ] ,
				[ "=1" ] ,
			] ,
		} ,
	} ) ;

	t.true(ll1.is(G));

	const parser = ll1.from(G);

	const readStream = fs.createReadStream(
		filepath ,
		{
			encoding: encoding ,
			highWaterMark: 1024 ,
		}
	) ;

	const tokens = stream.map(
		a => ({
			"type" : "leaf" ,
			"terminal" : a ,
			"buffer" : a ,
		}) ,
		stream.fromReadStream( readStream )
	) ;

	const tree = await parser.parse(tokens);

	const m = ( children , match , ctx ) => ast.cmap( async child => await ast.transform( child , match , ctx ) , children ) ;

	const transformed = await ast.transform( tree , {
		"bits" : {
			"add" : ( tree , match ) =>  ({
				"type" : "node" ,
				"nonterminal" : "letters" ,
				"production" : "yetanotherletter" ,
				"children" : m( tree.children , match ) ,
			}) ,
			"end" : ( ) =>  ({
				"type" : "node" ,
				"nonterminal" : "letters" ,
				"production" : "done" ,
				"children" : [ ] ,
			}) ,
		} ,
		"bit" : [
			tree => ({
				"type" : "node" ,
				"nonterminal" : "letter" ,
				"production" : "aaa" ,
				"children" : ast.cmap( leaf => ({
					"type" : "leaf" ,
					"terminal" : "a" ,
					"buffer" : "a" ,
				}) , tree.children ) ,
			}) ,
			tree => ({
				"type" : "node" ,
				"nonterminal" : "letter" ,
				"production" : "bbb" ,
				"children" : ast.cmap( leaf => ({
					"type" : "leaf" ,
					"terminal" : "b" ,
					"buffer" : "b" ,
				}) , tree.children ) ,
			}) ,
		] ,
	} ) ;

	const got = await stream.toString( stream.fromAsyncIterable( asyncIterableMap( leaf => leaf.buffer , ast.flatten( transformed ) ) ) ) ;
	t.is( got , expected ) ;

});