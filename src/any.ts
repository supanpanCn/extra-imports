import stripComments from 'displace-comments'

interface Ires{
  start:number;
  end:number;
  text:string;
}

export default (code:string,start:string,end:string):Ires|undefined=>{
  code = stripComments(code)
  if(!(start && end && code)) return
  let stack:string[] = []
  let current = 0
  let s = 0
  let e = Infinity
  function _reset(){
    current = 0
    stack = []
  }
  let i = 0
  for(i;i<code.length;i++){
    const v = code[i]
    if(v === start[current]){
      stack.push(v)
      current++
    }
    if(stack.join('') === start) break
    _reset()
  }
  s = i
  for(i;i<code.length;i++){
    const v = code[i]
    if(v === end[current]){
      stack.push(v)
      current++
    }
    if(stack.join('') === start) break
    _reset()
  }
  e = i
  return {
    start:s,
    end:e,
    text:code.substring(s,e)
  }
}