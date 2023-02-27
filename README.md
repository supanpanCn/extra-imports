# extract-modules
  Parses the string to get its body and location information
# Usage
* parseImports(code)  
  ```js
  import { parseImports } from 'extract-modules'
  parseImports(`
    import a from 'b';
    import 'extract-modules';
    import { c } from "d"
  `) 
  /** output
     [
        {
          text: "import a from 'b';",
          start: 5,
          end: 23,
          import: 'a',
          from: 'b',
          extra: { import: {start:12,end:13}, from: {start:20,end:21} }
        },
        {
          text: "import 'extract-modules';",
          start: 28,
          end: 53,
          import: undefined,
          from: 'extract-modules',
          extra: { import: null, from: {start:36,end:51} }
        },
        {
          text: 'import { c } from "d"',
          start: 58,
          end: 79,
          import: ' c ',
          from: 'd',
          extra: { import: {start:66,end:69}, from: {start:77,end:78} }
        }
    ]
   */
  ```

* parseExports(code)  
  ```js
  import { parseExports } from 'extract-modules'
  parseExports(`
    export const a = 



    function(){
      alert(1)
    }

    export let h = ()=>{
      
    }
    export let c = function(){

    }

    export const a = 



    ()=>{
      console.log(1)
    }


    export default {
      a,
      b:1,
      c:{
        d:1
      }
    }
    export function c(){
      const a = 1;
      const _b = ()=>{
        console.log(1)
      }
    };
    export let a
    export let b = 1; 
    export let d = {
      a:1,
      b:{
        c:{
          d:2
        }
      }
    }
  `) 
  /** output
   [
    {
      end:63,
      key:'a',
      start:5,
      text:'export const a = \n\n\n\n    function(){\n      alert(1)\n    }\n'
      value:'function(){\n      alert(1)\n    }'
    },
    {
      end:101
      key:'h'
      start:68
      text:'export let h = ()=>{\n      \n    }'
      value:'()=>{\n      \n    }'
    }
    ...
    {
      end:281
      key:'default'
      start:209
      text:'export default {\n      a,\n      b:1,\n      c:{\n        d:1\n      }\n    }'
      value:'{\n      a,\n      b:1,\n      c:{\n        d:1\n      }\n    }'
    }
   ]
   */
  
  ```

* parseVariables(code)  
  ```js
  import { parseVariables } from 'extract-modules'
  parseVariables(`
    const a = 1;
    let b = 1
    const c = {

    }
    const d = {
      c:{

      }
    }
    const {e} = {
      e:1
    }
    const f = 
    {
      f:{
        f2:2
      }
    }
    const h = function(){
      console.log(1)
    }
  `) 
  /** output
     [
      {
        end:18
        key:'a'
        start:0
        text:'const a = 1;'
        value:'1;'
      },
      ...
      end:188
      key:'f'
      start:130
      text:'const f = \n    {\n      f:{\n        f2:2\n      }\n    }'
      value:'{\n      f:{\n        f2:2\n      }\n    }'
    ]
   */
  ```

* parseFunctions(code,start,end)  
  ```js
  import { parseFunctions } from 'extract-modules'
  parseFunctions(`
      const b = function(){
      console.log('b')
      }
      function a(){

      }
      const c = ()=>{

      }
      const d = 
      ()=>{
        
      }
  `) 
  /** output
    [
      {
        end:56
        start:0
        text:'const b = function(){\n      console.log('b')\n    }'
      },
      ...
      {
        end:146
        start:108
        text:'const d = \n    ()=>{\n      \n    }'
      }
    ]
   */
  ```
* parseComments(code)  
  ```js
  import {parseAny} from 'extract-modules'
  parseComments(`
  /**
   * @name {sp} 姓名
   * @age {27} 年龄
  */
  // 解析
  `) 
  /** output
   [
    {
      end:47,
      start:41,
      text:'// 解析\n',
      type:'single',
    },
    {
      end:40,
      lines:[{
        end:21
        key:'name'
        remark:'姓名'
        start:5
        text:' * @name {sp} 姓名'
        value:'sp'
      },{
        end:37
        key:'age'
        remark:'姓名'
        start:22
        text:' * @age {27} 年龄'
        value:'27'
      }],
      start:1,
      text:`\/\*\*\n * @name {sp} 姓名\n * @age {27} 年龄\n\*\/`,
      type:'multiple',
    }
   ]
   */
  ```

* parseAny(code,start,end)  
  ```js
  import {parseAny} from 'extract-modules'
  parseAny('123jmn456','3','4') 
  /** output
   {
    start:2,
    end:7,
    text:'3jmn4'
   }
   */
  ```

