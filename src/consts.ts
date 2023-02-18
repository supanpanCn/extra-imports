import parseExports from './exports'

export default (code:string)=>{
  let res = parseExports(code)
  res = res.filter(v=>v.type === 'variable')
  return res
}