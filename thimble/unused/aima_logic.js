function tt_entails?(KB,alpha){
  //KB: knowledge base, a sentence in PL
  //alpha: query, sentence in PL
  
  var symbols=KB.get_symbols().concat(alpha.get_symbols());
  return tt_check_all(KB,alpha,symbols,{});
}

function tt_check_all(KB,alpha,symbols,model){
  if(symbols.length==0){
    if(pl_true?(KB,model)){
       return pl_true?(alpha,model);
       }
    else{
       return true;
       }
  }
  else{
       var P=symbols.pop();
       var modelt=model;
       modelt[P]=true;
       var modelf=model;
       modelf[P]=false;
       return (tt_check_all(KB,alpha,symbols,modelt)) && (tt_check_all(KB,alpha,symbols,modelf));
       }
}
       
function pl_resolution(KB,alpha){
       //KB: knowledge base
       //alpha: query
       var clauses=KB.getClauses().append(not alpha);
       var neue={};
       while(True){
       
       }
       
       }
       

       
       