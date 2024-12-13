const routers = [
    {
        path: '/',
        component: () => import('@/views/Login.vue'),
    },
    {
        name: 'login',
        path: '/Login',
        component: () => import('@/views/Login.vue')
    },
    {
        name: '404',
        path: '/:catchAll(.*)*',
        component: () => import('@/views/404.vue')
    },
    {
        name: 'layout',
        path: '/Layout',
        component: () => import('@/views/Layout/index.vue'),
        children: [
            {
                name: '首页',
                path: '/Welcome',
                component: () => import('@/views/Welcome/index.vue'),
            },
            //##路由-文件夹##
            {
                path:'/COLLECT_INFO',
                component:()=>import('@/views/COLLECT_INFO/index.vue'),
                children:[
                    //COLLECT_INFO##路由-文件##
                    {
                        path:'COLLECT_INFO',
                        name:'送签社管理',
                        component:()=> import('@/views/COLLECT_INFO/COLLECT_INFO.vue')
                    },
                ]
            },
            
            {
                path: '/DISTRIBUTION_INFO',
                component: () => import('@/views/DISTRIBUTION_INFO/index.vue'),
                children: [
                    //DISTRIBUTION_INFO##路由-文件##
                    {
                        path: 'DISTRIBUTION_INFO',
                        name: '3D分布',
                        component: () => import('@/views/DISTRIBUTION_INFO/DISTRIBUTION_INFO.vue')
                    },
                ]
            },

            {
                path: '/VISIT_INFO',
                component: () => import('@/views/VISIT_INFO/index.vue'),
                children: [
                    //VISIT_INFO##路由-文件##
                    {
                        path: 'VISIT_INFO',
                        name: '酒店添加',
                        component: () => import('@/views/VISIT_INFO/VISIT_INFO.vue')
                    },
                ]
            },

            {
                path: '/BORROW_INFO',
                component: () => import('@/views/BORROW_INFO/index.vue'),
                children: [
                    //BORROW_INFO##路由-文件##                    
                    {
                        path:'PRE_BORROW_INFO',
                        name:'借阅意向清单',
                        component:()=> import('@/views/BORROW_INFO/PRE_BORROW_INFO.vue')
                    },
                                        
                    {
                        path: 'BORROW_INFO',
                        name: '酒店信息',
                        component: () => import('@/views/BORROW_INFO/BORROW_INFO.vue')
                    },
                ]
            },

            {
                path: '/BOOK_INFO',
                component: () => import('@/views/BOOK_INFO/index.vue'),
                children: [
                    //BOOK_INFO##路由-文件##
                    {
                        path: 'BOOK_INFO',
                        name: '旅行团信息',
                        component: () => import('@/views/BOOK_INFO/BOOK_INFO.vue')
                    },
                ]
            },
            {
                name: '用户管理模块',
                path: '/USER_INFO',
                component: () => import('@/views/USER_INFO/index.vue'),
                children: [
                    //USER_INFO##路由-文件##
                    {
                        name: '用户管理',
                        path: 'USER_INFO',
                        component: () => import('@/views/USER_INFO/USER_INFO.vue')
                    },
                ]
            },
            {
                name: '修改信息模块',
                path: '/AMEND_INFO',
                component: () => import('@/views/AMEND_INFO/index.vue'),
                children: [
                    //USER_INFO##路由-文件##
                    {
                        name: '修改信息',
                        path: 'AMEND_INFO',
                        component: () => import('@/views/AMEND_INFO/AMEND_INFO.vue')
                    },
                ]
            },
        ]
    },
]

export default routers