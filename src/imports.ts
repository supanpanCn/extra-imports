import { doRegex,regex } from 'su-helpers'
export interface IimportResult{
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

function getAbsolutePos(this:IimportResult,key:keyof Pick<IimportResult,'from'|'import'> ){
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
  const res:IimportResult[] = []
  doRegex(reg,code,(m)=>{
    const imp = m[4] ? m[4].trim() : m[3] ? m[3].trim() : ''
    const o:IimportResult = {
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