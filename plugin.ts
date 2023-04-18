import type { Options } from 'tsup'
import { resolve } from 'node:path'


export default [{
    name:'transfrom-require',
    setup(plugin){
        const params = {
            filter:/\.js$/,
            namespace:'file'
        }
        plugin.onResolve(params,(args)=>{
            if(args.path === './comments.js'){
                return {
                    path: resolve('src',args.path),
                    namespace:'file'
                }
            }
            return null
        })

        plugin.onLoad(params,(args)=>{
            return null
        })
    }
}] as Options['esbuildPlugins']