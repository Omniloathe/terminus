QUnit.test("evaluate PL: A",function(assert){
  let sentence=str_to_pl("A");
  let model1={'A':true};
  assert.ok(sentence.evaluate(model1)===true,"test A true in model");
  let model2={};
  assert.notOk(sentence.evaluate(model2)===true,"test A not in model");
  let model3={'A':false};
  assert.notOk(sentence.evaluate(model3)===true,"test A false in model");
});
QUnit.test("evaluate PL: !A",function(assert){
  let sentence=str_to_pl("!A");
  assert.ok(sentence.toString()==="(NOT A)","Sanity check");
  let model1={'A':false};
  assert.ok(sentence.evaluate(model1)===true,"A false");
  let model2={'A':true};
  assert.notOk(sentence.evaluate(model2)===true,"A true");
  let model3={};
  assert.notOk(sentence.evaluate(model3)===true,"no A");
  
});
QUnit.test("evaluate PL: A & !B",function(assert){
  let sentence=str_to_pl("A & !B");
  assert.ok(sentence.toString()==="(A AND (NOT B))","Sanity check");
  assert.ok((sentence instanceof And)===true,"sanity check 2");
  let model1={'A':true,'B':false};
  assert.ok(sentence.evaluate(model1)===true,"A true B false");
  let model2={'A':true,'B':true};
  assert.ok(sentence.clauses[0].evaluate(model2)===true,"part1");
  assert.ok(sentence.clauses[1].evaluate(model2)===false,"part 2");
  
  assert.notOk(sentence.evaluate(model2)===true,"A true B true");
  let model3={};
  assert.ok(sentence.evaluate(model3)===undefined,"empty model");
});
QUnit.test("evaluate PL: B1_1 <-> (P1_2 | P2_1)",function(assert){
  let sentence=str_to_pl("B1_1 <-> (P1_2 | P2_1)");
  let model1={'B1_1':true,'P1_2':true};
  assert.ok(sentence.evaluate(model1)===true,"B1_1 true P1_2 true");
  let model2={'B1_1':true,'P1_2':false,'P2_1':false};
  assert.ok(sentence.evaluate(model2)===false,"B11 true P12 false P32 false");
});
QUnit.test("testing get_symbols",function(assert){
  let sentence=str_to_pl("(P & Q) <-> !(R | S)");
  //console.log(`List of symbols: ${get_symbols(sentence)}`);
  assert.ok(get_symbols(sentence).length===4,"ok?");
});

QUnit.test("testing encoding of CNF clause",function(assert){
  let symtab={'A':1,'B':2,'C':3,'D':4};
  let subcl1=new Or([new Not(new Atom('A')),new Atom('B')]);
  let subcl2=new Atom('C');
  let subcl3=new Not(new Atom('B'));
  let clause=new And([subcl1,subcl2,subcl3]);
  let cnf=convert_cnf(clause);
  let encoded=encode_cnf(cnf,symtab);
  //console.log("Encoded CNF: "+encoded.myArrStr());
  assert.ok(encoded.equals([[-1,2],[3],[-2]]),"test");
  
});

QUnit.test("dpll subroutine testing",function(assert){
  let KB=new KnowledgeBase();
  KB.add_clause(str_to_pl("A | !B"));
  KB.add_clause(str_to_pl("!B | !C"));
  KB.add_clause(str_to_pl("C | A"));
  let cnf=convert_cnf(KB.sentence);
  let clauses=cnf.clauses;
  //console.log(KB.symbols);
 // console.log(find_pure_symbol(clauses,KB.symbols,{}));
  assert.ok(find_pure_symbol(clauses,KB.symbols,{}).equals(['A',true]),"find pure symbol test 1");
  assert.ok(find_pure_symbol(clauses,KB.symbols,{'B':false}).equals(['A',true]),"find pure symbol test 2");
  //console.log(find_unit_clause(clauses,{}));
  assert.ok(find_unit_clause(clauses,{}).equals([null,null]),"find unit clause test 1");
  assert.ok(find_unit_clause(clauses,{'B':true}).equals(['A',true]),"find unit clause test 2");
  assert.ok(find_unit_clause(clauses,{'A':true,'B':true}).equals(['C',false]),"find unit clause test 3");
  
});

QUnit.test("tt-entails test",function(assert){
  let KB=new KnowledgeBase();
  let r1=str_to_pl("!P1_1");
  KB.add_clause(r1);
  let r2=str_to_pl("B1_1 <-> (P1_2 | P2_1)");
  KB.add_clause(r2);
  let r3=str_to_pl("B2_1 <-> (P1_1 | (P2_2 | P3_1))");
  KB.add_clause(r3);
  let r4=str_to_pl("!B1_1");
  KB.add_clause(r4);
  let r5=str_to_pl("B2_1");
  KB.add_clause(r5);
  let alpha=str_to_pl("B1_1");
  assert.ok(tt_entails(KB,alpha)===true,"tt-entails");
  KB.add_clause(new Not(alpha));
  //console.log(KB.symbols);
  assert.ok(dpll_satisfiable(KB)===true,"dpll-satisfiable");
});

QUnit.test("dpll satisfiability stuff",function(assert){
  let KB=new KnowledgeBase();
  KB.add_clause(str_to_pl("A -> B"));
  KB.add_clause(str_to_pl("A"));
  KB.add_clause(str_to_pl("!B"));
  assert.ok(dpll_satisfiable(KB)===false,"modus ponens");
});