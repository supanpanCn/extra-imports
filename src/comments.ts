import { regex,Mixin,runArr,checkIsClosed,createLog } from 'su-helpers'

interface line{
  s:number;
  e:number
}

type ResponseLine = Mixin<Omit<Response,'lines'|'type'>,{
  type?:'@';
  key?:string;
  value?:string;
  remark?:string
}>;

interface Response{
    type:'single'|'multiple';
    text:string;
    start:number;
    end:number;
    lines?:ResponseLine[]
}

interface MessageKey{
  UN_SUPPORT:string
}

const matchs = [
  {
    start: "/*",
    reg:regex.multilineCommentsRE
  },
  {
    start: "//",
    reg:regex.singlelineCommentsRE
  },
];

const messages = new Map<keyof MessageKey,string>([
  ['UN_SUPPORT','不支持解析换行注释']
])

const log = createLog<MessageKey>(messages,'extract-modules-parseComments')

function caculateNewLines(code:string,s:number):line[]{
  const res:line[] = [];
  let i = 0;
  let p = s
  code+='\n'
  while (i < code.length) {
    if (code[i] === "\n") {
      const e = s+i
      res.push({
        s: p ,
        e: s+i
      });
      p = e+1;
    }
    i++;
  }
  return res;
}

function discern(c: string,j:number, o: string) {
  let pre = j;
  for (let i = 0; i < matchs.length; i++) {
    const { start } = matchs[i];
    j = pre;
    if (start[0] === c) {
      let p = 1;
      j++;
      while (p < start.length) {
        if (o[j] !== start[p]) break;
        p++;
        j++;
      }
      if (o.substring(pre, j) === start) {
        return matchs[i];
      }
    }
  }
}

export default (
  code: string,
  m?: {
    start: string;
    reg: RegExp
  }
): Response[]=> {
  Array.isArray(m) && matchs.push(m);
  const res:Response[] = []
  for (let i = 0; i < code.length; i++) {
    const v = code[i];
    const { reg } = discern(v, i, code) || {};
    if (reg instanceof RegExp) {
      reg.lastIndex = i - 1 > 0 ? i - 1 : 0;
      const m2 = reg.exec(code);
      if (m2) {
        const lines = caculateNewLines(m2[0], m2.index) || [];
        lines.pop()
        if (!lines.length) {
          lines.push({
            s: m2.index,
            e: reg.lastIndex
          });
        }
        
        const o:Response = {
            type:lines.length === 1 ? 'single':'multiple',
            text:m2[0],
            start:i,
            end:reg.lastIndex
        }

        res.push(o)

        if(o.type === 'multiple'){
            o.lines = []
            lines.shift()
            runArr<{s:number,e:number}>(lines,({s,e})=>{
              const line:ResponseLine = {
                text: code.substring(s, e),
                start:s,
                end:e,
              }
              o.lines?.push(line)
              const {isClosed} = checkIsClosed(line.text,['{','}'])
              if(isClosed){
                let m = /@([^{]*)[\s]\{([^}]*)\}(.*)/g.exec(line.text)
                if(m){
                  line.key = m[1]
                  line.value = m[2]
                  line.remark = m[3].trim()
                }
              }else{
                log('UN_SUPPORT','yellow')
                return 'break'
              }
            })
        }
        
        i = reg.lastIndex - 1;
      }
    }
  }

  return res;
}