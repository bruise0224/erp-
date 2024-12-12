import { defineStore } from "pinia";

const useMain = defineStore('main', { //dataStore 
    state: () => {
        return {
            user_info: {
                user_name: '',
                user_id: '',
                password: '',
                role_name: '',
                role_id: '',
            }
        }
    },

    //配合pinia-plugin-persist插件 持久化 默认存储到 sessionStorage ，key 为 store 的 id
    persist: {
        enabled: true,
    }
})

export default useMain






