import { alphabet } from '../grammar' ;
import compile from './compile' ;
import parse from './parse' ;

export default class Parser {

	constructor ( grammar ) {
		this.grammar = grammar ;
		this._table = null ;
	}

	//first ( rule ) {

	//}

	//follow ( rule ) {

	//}

	table ( ) {
		if ( this._table === null ) this._table = compile(this.grammar.productions) ;
		return this._table ;
	}

	parse ( tape ) {
		const table = this.table();
		return parse(this.grammar.root, this.grammar.start, this.grammar.eof, this.grammar.productions, table, tape);
	}

}
