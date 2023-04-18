export interface IAnyRes{
  start:number;
  end:number;
  text:string;
  initialIndex?:number;
}
export default (code:string,start:string,end:string,conf?:{
  initialIndex?:number;
  stripComment?:boolean;
}):IAnyRes|undefined=>{
  const { initialIndex,stripComment } = conf || {}
  /**
   * TODO
   * strip comment
   */
  code = stripComment ? code : code
  if(!(start && end && code)) return
  let stack:string[] = []
  let current = 0
  let s = 0
  let e = Infinity
  let isMatched = false
  let i = initialIndex || 0
  const len = code.length
  function _reset(){
    current = 0
    stack = []
    isMatched = false
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
      if(stack.join('') === tar) {
        isMatched = true
        break
      }
    }
  }

  _while(start)

  if(!isMatched) return undefined
  
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