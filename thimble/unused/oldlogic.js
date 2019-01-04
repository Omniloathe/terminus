function remove_redundant(clause){
  var seen=[];
  for(var i=0;i<clause.length;i++){
    if(!seen.includes(clause[i])){
      seen.push(clause[i]);
    }
  }
  return seen;
}

function is_unit(clause){
  return clause.length===1;
}

function has_contradiction(clauses){
  for(var i=0;i<clauses.length;i++){
    if(is_unit(clauses[i])){
      if(clauses.includes([-clauses[i][0]])){
        return true;
      }
    }
  }
  return false;
}



var Argument={
  clauses: [],
  atoms:[],
  addClause: function(clause){
    this.clauses.push(clause);
  },
  disp: function(){
    this.clauses.forEach(function(clause){
      console.log("[");
      console.log(clause.toString());
      console.log("]");
    });
  }

};

//Argument.addClause([-1,2,3]);
//Argument.disp();