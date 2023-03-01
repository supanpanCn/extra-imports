import stripComments from 'displace-comments'

export interface IanyResult{
  start:number;
  end:number;
  text:string;
  initialIndex?:number;
}

export default (code:string,start:string,end:string,initialIndex?:number):IanyResult|undefined=>{
  code = stripComments(code)
  if(!(start && end && code)) return
  let stack:string[] = []
  let current = 0
  let s = 0
  let e = Infinity
  let i = initialIndex || 0
  const len = code.length
  function _reset(){
    current = 0
    stack = []
  }

  function _while(tar:string){
    for(i;i<len;i++){
      const v = code[i]
      if(v === tar[current]){
        stack.push(v)
        current++
      }else{
        _reset()
      }
      if(stack.join('') === tar) break
    }
  }

  _while(start)
  
  _reset()
  s = i - start.length + 1

  _while(end)

  e = i + 1
  return {
    start:s,
    end:e,
    text:code.substring(s,e)
  }
}