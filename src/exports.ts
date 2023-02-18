import stripComments from 'displace-comments'

type Data = {
  key?:string;
  value?:string;
  start?:number;
  end?:number;
}

export interface Irespose{
  type:'function'|'variable'|'object';
  text:string;
  start:number;
  end:number;
  data:Data | Data[] | null;
}

function getData(this:Irespose,m:string[]){
  const {
    type,
    start,
    text
  } = this
  let item:any = {}
  switch(type){
    case 'function':{
      const key = m[6].trim()
      item.key = key.substring(0,key.length-1)
      item.value = m[5]+'()'+m[7]
      const s = text.indexOf(m[2])
      item.start = start + s
      item.end = start+s+m[2].length
      break
    }
    case 'variable':{
      const key = m[6].trim()
      item.key = key
      item.value = m[8]
      const s = text.indexOf(key)
      item.start = start+s
      item.end = start + s + m[2].length
      break
    }
    case 'object':{
      item = []
      const reg = /\{([^\}]*)\}/g
      const m = reg.exec(text)
      if(m){
        const it:Data = {}
        const strs = m[1].split(',')
        strs.forEach(v=>{
          const s = text.indexOf(v)
          item.start = start + s
          item.end = start + s + v.length
          v = v.replaceAll('\n','')
          let val = v
          if(v.indexOf(':')>-1){
            val = v.split(':')[1]
          }
          it.key = v
          it.value = val
          item.push(it)
        })
      }
      break
    }
  }
  return item as Irespose['data']
}

function getType(isVar:string|undefined){
  if(isVar){
    if(isVar.includes('function')){
      return 'function'
    }
    return 'variable'
  }
  return 'object'
}

export default (code:string)=>{
  code = stripComments(code)
  const reg = /export([\s])+((default\1+)?(\{[^\}]*?\})|(function|var|let|const)\1+(.*)?(\=(.*)?|\{[^\}]*?\}))/g
  let m = reg.exec(code)
  const res:Irespose[] = []
  while(m){
    const o:Irespose = {
      type:getType(m[5]),
      text:m[0],
      start:m.index,
      end:reg.lastIndex,
      data:null
    }
    o.data = getData.call(o,m)
    res.push(o)
    m = reg.exec(code)
  }
  return res
}