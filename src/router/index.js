import {createRouter,createWebHistory} from 'vue-router'//引入vue底层路由包,函数
import routes from './routes'//引入路由文件  ./当前文件的路径

const router=createRouter({//创建router对象
    history:createWebHistory(),//参数,   ...
    routes
})

export default router//导出该文件