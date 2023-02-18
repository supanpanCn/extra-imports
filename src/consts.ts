import parseExports from './exports'

export default (code:string)=>{
  const res = parseExports(code)
  return res.filter(v=>v.type === 'variable')
}