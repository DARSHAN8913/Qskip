function outer() {
    const name="something";
    
   function inner (){
    console.log(name);
   }
   return inner;
}
const m= outer();
m();
