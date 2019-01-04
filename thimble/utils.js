if(Array.prototype.equals)
  console.warn("Array.prototype.equals already exists");

Array.prototype.equals=function(array){
  if(!array)
    return false;
  
  if(this.length!==array.length)
    return false;
  
  for(let i=0,l=this.length;i<l;i++){
    if(this[i] instanceof Array && array[i] instanceof Array){
      if(!this[i].equals(array[i]))
        return false;
    }
    else if(this[i]!=array[i]){
      return false;
    }
  }
  return true;
}

if(Array.prototype.myArrStr)
  console.warn("How does Array.prototype.myArrStr already exist");

Array.prototype.myArrStr=function(){
  let arr=[];
  this.forEach(e => {
    if(e instanceof Array)
      arr.push(e.myArrStr());
    else
      arr.push(e.toString());
  });
  return "["+arr.join(",")+"]";
}

if(Object.prototype.myCopy)
  console.warn("Object.prototype.myCopy already exists");

Object.prototype.myCopy=function(){
  return Object.assign({},this);
}

if(Object.prototype.getProps)
  console.warn("Object.prototype.getProps already exists");

Object.prototype.getProps=function(){
  return this.getOwnPropertyNames();
}

if(Object.prototype.hasProp)
  console.warn("Object.prototype.hasProp already exists");

Object.prototype.hasProp=function(pname){
  return this.hasOwnProperty(pname);
}

