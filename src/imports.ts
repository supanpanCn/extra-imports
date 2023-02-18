import stripComments from 'displace-comments'

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
  code = stripComments(code)
  const reg = /import([\s])+(\{[^}]*?\}|.*?)\1from\1+('|")(.*)?\3;?/g
  let m = reg.exec(code)
  const res:Irespose[] = []
  while(m){
    const o:Irespose = {
      text:m[0],
      start:m.index,
      end:reg.lastIndex,
      import:m[2],
      from:m[4],
      extra:{
        import:null,
        from:null
      }
    }
    o.extra.import = getAbsolutePos.call(o,'import')
    o.extra.from = getAbsolutePos.call(o,'from')
    res.push(o)
    m = reg.exec(code)
  }
  return res
}