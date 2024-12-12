<template>
  <el-container class="layout-container-demo">
    <el-aside class="myMenu" :width="myMenuWidth">
      <el-scrollbar>
        <div class="adminMenu" v-show="showMenu">
          <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" :collapse="isCollapse"
            background-color="#ffffff" text-color="rgb(22, 43, 100)" active-text-color="rgb(87, 202, 235)" router
            @open:="onOpen" @close:="onClose">
            <el-menu-item>
              <template #title><span class="logo">旅行社管理系统</span></template>
            </el-menu-item>
            <el-menu-item index="/welcome">
              <el-icon>
                <briefcase></briefcase>
              </el-icon>
              <template #title><span>首页</span></template>
            </el-menu-item>
            <el-sub-menu index="/USER_INFO">
              <template #title>
                <el-icon>
                  <grid></grid>
                </el-icon>
                <span>用户管理</span>
              </template>
              <el-menu-item index="/USER_INFO/USER_INFO">
                <el-icon>
                  <location></location>
                </el-icon>
                <template #title>用户管理</template>
              </el-menu-item>
              <!--USER_INFO##el-menu-item##-->
            </el-sub-menu>

            <el-sub-menu index="/BOOK_INFO">
              <template #title>
                <el-icon>
                  <grid></grid>
                </el-icon>
                <span>团队维护</span>
              </template>
              <el-menu-item index="/BOOK_INFO/BOOK_INFO">
                <el-icon>
                  <location></location>
                </el-icon>
                <template #title>旅行团信息</template>
              </el-menu-item>
              <!--BOOK_INFO##el-menu-item##-->
            </el-sub-menu>
            <el-sub-menu index="/BORROW_INFO">
              <template #title>
                <el-icon>
                  <grid></grid>
                </el-icon>
                <span>资源维护</span>
              </template>
              <el-menu-item index="/BORROW_INFO/BORROW_INFO">
                <el-icon>
                  <location></location>
                </el-icon>
                <template #title>酒店信息</template>
              </el-menu-item>
              <!-- <el-menu-item index="/BORROW_INFO/PRE_BORROW_INFO">
                <el-icon>
                  <location></location>
                </el-icon>
                <template #title>借阅意向清单</template>
              </el-menu-item> -->
              <!--BORROW_INFO##el-menu-item##-->
            </el-sub-menu>
            <el-sub-menu index="/VISIT_INFO">
              <template #title>
                <el-icon>
                  <grid></grid>
                </el-icon>
                <span>资源添加</span>
              </template>
              <el-menu-item index="/VISIT_INFO/VISIT_INFO">
                <el-icon>
                  <location></location>
                </el-icon>
                <template #title>酒店添加</template>
              </el-menu-item>
              <!--VISIT_INFO##el-menu-item##-->
            </el-sub-menu>
            <!-- <el-sub-menu index="/DISTRIBUTION_INFO">
              <template #title>
                <el-icon>
                  <grid></grid>
                </el-icon>
                <span>3D分布</span>
              </template>
              <el-menu-item index="/DISTRIBUTION_INFO/DISTRIBUTION_INFO">
                <el-icon>
                  <location></location>
                </el-icon>
                <template #title>3D分布</template>
              </el-menu-item>
            </el-sub-menu> -->
            <!--DISTRIBUTION_INFO##el-menu-item##-->
            <el-sub-menu index="/COLLECT_INFO">
              <template #title>
                <el-icon>
                  <grid></grid>
                </el-icon>
                <span>基础信息</span>
              </template>
              <el-menu-item index="/COLLECT_INFO/COLLECT_INFO">
                <el-icon>
                  <location></location>
                </el-icon>
                <template #title>送签社管理</template>
              </el-menu-item>
              <!--COLLECT_INFO##el-menu-item##-->
            </el-sub-menu>
            <!--###el-sub-menu###-->

          </el-menu>
        </div>

        <!-- 根据权限组菜单 -->
        <div class="roleMenu" v-show="!showMenu">
          <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" :collapse="isCollapse"
            background-color="#ffffff" text-color="rgb(22, 43, 100)" active-text-color="rgb(87, 202, 235)" router
            @open:="onOpen" @close:="onClose">
            <el-menu-item>
              <template #title><span class="logo">旅游管理系统</span></template>
            </el-menu-item>
            <el-menu-item index="/welcome">
              <el-icon>
                <briefcase></briefcase>
              </el-icon>
              <template #title><span>首页</span></template>
            </el-menu-item>

            <el-sub-menu v-for="menuSub in menuData" :index="menuSub.id">
              <template #title>
                <el-icon>
                  <grid></grid>
                </el-icon>
                <span>{{ menuSub.label }}</span>
              </template>
              <el-menu-item v-for="menuItem in menuSub.children" :index="menuItem.id">
                <el-icon>
                  <location></location>
                </el-icon>
                <template #title>{{ menuItem.label }}</template>
              </el-menu-item>
            </el-sub-menu>

          </el-menu>
        </div>
      </el-scrollbar>
    </el-aside>

    <el-container class="myContent">
      <el-header class="myHeader">
        <div v-show="!isExpand" class="expandDiv">
          <el-button class="expandBtn" @click="foldHandle()">
            <el-icon>
              <Expand />
            </el-icon>
          </el-button>
        </div>
        <div v-show="isExpand" class="foldDiv">
          <el-button class="foldBtn" @click="foldHandle()">
            <el-icon>
              <Fold />
            </el-icon>
          </el-button>
        </div>

        <div class="dynamicTabs">
          <el-tabs v-model="activeTab" type="card" closable @tab-remove="removeTab" @tab-click="clickTab">
            <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name">
            </el-tab-pane>
          </el-tabs>
        </div>

        <div class="quitDiv">
          <span style="margin-right: 10px;">{{ user_info.user_id }}</span>
          <el-button circle @click="quitHandle()">
            <el-icon>
              <SwitchButton />
            </el-icon>
          </el-button>
        </div>
      </el-header>

      <el-main class="myMain">
        <div>
          <router-view></router-view>
        </div>
      </el-main>

      <!--      <el-footer class="myFooter">Footer</el-footer>-->

    </el-container>

  </el-container>
</template>

<script>
import { ref, onMounted, watch, computed } from "vue";
import { Briefcase, Eleme, Film, Grid, Location, SwitchButton } from "@element-plus/icons-vue";
import axios from "axios";
import dayjs from 'dayjs'
import { useRouter, useRoute } from 'vue-router'
import  useMain  from '@/store/storeData'
import { storeToRefs } from 'pinia'

const mainData = useMain()
let { user_info } = storeToRefs(mainData)


export default {
  name: "index.vue",
  components: {
    Eleme, Film, Grid, Briefcase, Location
  },

  setup() {
    //权限控制



    const router = useRouter()
    const route = useRoute()
    //根据用户权限动态显示菜单
    const showMenu = ref(true)
    const menuData = ref([])

    const quitHandle = () => {
      let params = {
        user_id: user_info.value.user_id,
      }
      axios.post('/USER_INFO/logout', params)
        .then(res => {})
      router.push('/Login')
    }
    const isExpand = ref(true)
    const foldHandle = () => {
      isExpand.value = !isExpand.value;
      isCollapse.value = !isCollapse.value;
    }
    const myMenuWidth = computed(() => {
      return isExpand.value ? '200px' : '64px'
    })


    const activeMenu = ref('/')
    watch(route, async (newRoute, oldRoute) => {
      if (editableTabs.value.length >= 10) {
      }
      const arr = []
      editableTabs.value.forEach(item => {
        arr.push(item.name)
      });

      const res = arr.indexOf(route.path)
      if (res == -1) {
        editableTabs.value.push({
          title: route.name,
          name: route.path,
        })
      }
      activeTab.value = route.path
      activeMenu.value = route.path
    })


    const isCollapse = ref(false);

    function onOpen() {
      //console.log("菜单展开函数,")
    }

    function onClose() {
      //console.log("菜单折叠函数,")
    }


    let tabIndex = 1
    const activeTab = ref('/welcome')
    const editableTabs = ref([
      {
        title: '首页',
        name: '/welcome',
      }
    ])


    const clickTab = (clickName) => {
      router.push(clickName.props.name)
    }

    const addTab = (targetName) => {
      const newTabName = `${++tabIndex}`
      editableTabs.value.push({
        title: 'New Tab',
        name: newTabName,
        content: 'New Tab content',
      })
      activeTab.value = newTabName
    }

    const removeTab = (targetName) => {
      const tabs = editableTabs.value
      let activeName = activeTab.value
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }

      activeTab.value = activeName
      editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
    }

    let time = ref(null);
    let name = ref('默认值');
    const item = {
      date: "2016-05-02",
      name: "Tom",
      address: "No. 189, Grove St, Los Angeles"
    };

    function onGet() {
      //console.log("开始获取api数据↓")
      axios.get('http://localhost:8081/api/data/123')
        .then(res => {
          if (res.status == 200) {
            name.value = res.data
          }
          //console.log("获取完api数据:", res.data)
        })
    }

    onMounted(() => {

      time.value = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')

      if (route.path !== '/welcome') {
        editableTabs.value.push({
          title: route.name,
          name: route.path,
        })
        activeTab.value = route.path
        activeMenu.value = route.path
      }
    });


    return {
      user_info,
      //动态显示菜单
      showMenu,
      menuData,
      quitHandle,
      clickTab,
      isExpand,
      foldHandle,
      myMenuWidth,
      router,
      route,

      isCollapse,
      onOpen,
      onClose,

      activeTab,
      editableTabs,
      removeTab,
      addTab,

      time,
      name,
      item,
      onGet
    }
  }
}
</script>

<style scoped>
.logo {
  height: 50px;
  color: rgb(red, green, blue);
  text-align: center;
  line-height: 50px;
  font-weight: bold;
  font-size: 20px;
}

.layout-container-demo {
  display: flex;
  flex-direction: row;

  background-color: red;
  height: 100vh;
}

.myMenu {
  background-color: #ffffff;
  color: #333;
  text-align: center;
  line-height: 50px;
}

.myContent {
  flex: 1;
  background-color: #f0f5fd;

  display: flex;
  flex-direction: column;
}

.myHeader {

  width: 100%;
  height: 50px;
  overflow: hidden;

  background-color: #ffffff;
  color: #333333;
  text-align: center;
  font-size: 15px;
  line-height: 20px;

  display: flex;
  justify-content: space-between;
  align-items: center;

}

.expandDiv {
  position: relative;
  left: -20px;
  width: 50px;
  margin-left: 0;
}

.foldDiv {
  position: relative;
  left: -20px;
  width: 50px;
  margin-left: 0;
}

.dynamicTabs {
  flex: 1;
}

.quitDiv {
  width: 160px;
}


.myMain {
  background-color: #f0f5fd;
  color: #333;
  text-align: center;
  line-height: 5px;

}

.myFooter {
  background-color: blue;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.right {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  float: right;
  padding-right: 20px;
}

.line {
  padding-left: 10px;
  padding-right: 10px;
}


.logout {
  margin-top: 2.5px;
}
</style>  