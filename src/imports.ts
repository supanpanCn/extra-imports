import { doRegex,regex } from 'su-helpers'
interface Irespose{
  text:string;
  start:number;
  end:number;
  import:string;
  from:string;
  extra:{
    from:{
      start:number;
      end:number;
    } | null;
    import:{
      start:number;
      end:number;
    } | null
  }
}

function getAbsolutePos(this:Irespose,key:keyof Pick<Irespose,'from'|'import'> ){
  const {
    text,
    start
  } = this
  const childCode = this[key]
  const s = start + text.indexOf(childCode)
  return {
    start:s,
    end:s+childCode.length
  }
}

export default (code:string)=>{
  const reg = regex.importRE
  const res:Irespose[] = []
  doRegex(reg,code,(m)=>{
    const imp = m[4] ? m[4].trim() : m[3].trim()
    const o:Irespose = {
      text:m[0],
      start:m.index,
      end:reg.lastIndex,
      import:imp,
      from:m[6],
      extra:{
        import:null,
        from:null
      }
    }
    if(imp){
      o.extra.import = getAbsolutePos.call(o,'import')
    }
    o.extra.from = getAbsolutePos.call(o,'from')
    res.push(o)
  })
  return res
}