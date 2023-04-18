export { IImportResponse, default as parseImports } from "./imports.js";
export { IExportsResponse, default as parseExports } from "./exports";
export { IVariablesRespose, default as parseVariables } from "./consts";
export { IFunctionResponse, default as parseFunctions } from "./functions";
export { ICommentsResponse, default as parseComments } from "./comment";
export { IAnyRes, default as parseAny } from "./any.js";
export { IScriptResponse, default as parseScriptCode } from "./scripts";
export { INoteResponse, default as parseNote } from "./note";

import parseNote from './note.js'

parseNote(`
/**
 * 扩展路由信息
 * @unrouter {boolean} true 启用unrouter
 * @auth {array} ['a','b','cd']  路由权限
 * @name {string} login 路由名称
 * @age 27
 * @age2 {
 *  aa:3
 * }
 * @love {array} ['唱歌']
 * @love2 {object} {
 *  a:1
 * }
 * @love3 {k:1} 
 * @love4 {object} {k:1} 
 * @other {object} { 
 * } meta
 */
`)
