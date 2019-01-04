function re_matchOne(pattern,text){
  if(pattern===""){
    return true;
  } 
  else if(text===""){
    return false;
  } 
  else if(pattern==='.'){
    return true;
  }
  else{
    return pattern===text;
  }
}

function re_matchQuestion(pattern,text){
  return (re_match(pattern.slice(2),text) || 
         (re_matchOne(pattern[0],text[0]) && re_match(pattern.slice(2),text.slice(1))));
}

function re_matchStar(pattern,text){
  return (re_match(pattern.slice(2),text) || 
         (re_matchOne(pattern[0],text[0]) && re_match(pattern,text.slice(1))));
}

function re_match(pattern,text){
  if(pattern===""){
    return true;
  } 
  else if(pattern==="$" && text===""){
    return true;
  } 
  else if(pattern[1]==="?"){
    return re_matchQuestion(pattern,text);
  }
  else if(pattern[1]==="*"){
    return re_matchStar(pattern,text);
  }
  else{
    return re_matchOne(pattern[0],text[0]) && re_match(pattern.slice(1),text.slice(1));
  } 
}

/*
function re_search(pattern,text){
  if(pattern[0]==="^"){
    return re_match(pattern.slice(1),text);
  }
  else if(text===""){
    return re_match(pattern,text);
  }
  else{
    return text.split("").some(function(_,index){
      return re_match(pattern,text.slice(index))
    });
  }
  */

function re_search(pattern, text) {
  if (pattern[0] === "^") {
    return re_match(pattern.slice(1), text)
  } else {
    return re_match(".*" + pattern, text)
  }
}