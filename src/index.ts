export { IImportResponse, default as parseImports } from "./imports.js";
export { IExportsResponse, default as parseExports } from "./exports";
export { IVariablesRespose, default as parseVariables } from "./consts";
export { IFunctionResponse, default as parseFunctions } from "./functions";
export { ICommentsResponse, default as parseComments } from "./comment";
export { IAnyRes, default as parseAny } from "./any.js";
export { IScriptResponse, default as parseScriptCode } from "./scripts";
export { INoteResponse, default as parseNote } from "./note";

// import parseComment from './comment.js'
const commentCode = `<!-- 这是登录组件  -->
<div>
    登录
</div>
<!-- 这是登录组件  --><!-- 这是登录组件  -->
<!-- 这是登录组件  -->
</template>

// 123
//4

/**
 * name:'a'
 * age:b
*/

/*
5
*/

/**
     * 1
    */



// gelixian

/**
* 扩展路由信息
* @unrouter {boolean} true 启用unrouter
* @name {string} AutoRouter 设置路由名称
* @alias {string} aliasName 设置路由别名
* @redirect {string} /redirectUrl 设置路由重定向
* @auth {array} ["a","b","c"] 设置路由权限
* @customKey {object} {
*  isLogin:true,
*  a:1
* } 其他信息
*/

/**
* 123
*/

`
// parseComment(commentCode)
