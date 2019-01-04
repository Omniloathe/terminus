QUnit.test( "regex engine match one test", function( assert ) {
  assert.ok(re_matchOne('a','a')===true,"exact match");
  assert.ok(re_matchOne('.','z')===true,"wildcard match");
  assert.ok(re_matchOne('','h')===true,"empty pattern match");
  assert.ok(re_matchOne('a','b')===false,"exact mismatch");
  assert.ok(re_matchOne('p','')===false,"empty text mismatch");
});

QUnit.test("regex engine match same length string", function(assert){
  assert.ok(re_match('a.c','abc')===true,"basic test");
});

QUnit.test("^ character",
function(assert){
  assert.ok(re_search("^abc","abc")===true,"test1");
  assert.ok(re_search("^abcd","abcd")===true,"test2");
  assert.notOk(re_search("^abcd","bacbd")===true,"ftest1");
});

QUnit.test("matches starting anywhere",
           function(assert){
  assert.ok(re_search("bc","abcd")===true,"test1");
});

QUnit.test("? character",
           function(assert){
  assert.ok(re_search("ab?c","ac")===true,"test1");
  assert.ok(re_search("ab?c","abc")===true,"test2");
  assert.ok(re_search("a?b?c?","ac")===true,"test3");
  assert.ok(re_search("a?b?c?","a")===true,"test4");
  assert.ok(re_search("c?","")===true,"test5");
});

QUnit.test("* character",
          function(assert){
  assert.ok(re_search("a*","")===true,"test1");
  assert.ok(re_search("a*","aaaaaaa")===true,"test2");
  assert.ok(re_search("a*b","aaaaaaaab")===true,"test3");
})
