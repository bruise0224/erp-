import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//全局注册 elements图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import "@/mockjs/index";

//pinia
import {createPinia} from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
const pinia = createPinia()
pinia.use(piniaPersist)

const Vue = createApp(App);
Vue.use(router).use(ElementPlus).use(pinia).mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    Vue.component(key, component)
}
