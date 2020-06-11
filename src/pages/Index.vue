<template>
  <el-container>
    <!-- 左边菜单栏 -->
    <el-aside width="260px">
      <el-col :span="12">
        <!-- 菜单栏的标题 -->
        <div class="menu_div">
          <img :src="imgUrl_shop" alt />
          <span>外卖商家中心</span>
        </div>
        <!-- 菜单栏组件 -->
        <el-menu
          router
          unique-opened
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="transparent"
          text-color="#fff"
          active-text-color="rgb(64, 158, 255)"
        >
          <div v-for="item in new_treelist" :key="item.index">
            <!-- 二级菜单 -->
            <el-submenu v-if="item.children" :index="item.index">
              <template slot="title">
                <i :class="item.icls"></i>
                <span>{{item.title}}</span>
              </template>
              <!-- 二级子菜单 -->
              <el-menu-item v-for="child in item.children" :key="child.index" :index="child.index">
                <i :class="child.icls"></i>
                <span slot="title">{{child.title}}</span>
              </el-menu-item>
            </el-submenu>
            <!-- 一级菜单 -->
            <el-menu-item v-else :index="item.index">
              <i :class="item.icls"></i>
              <span slot="title">{{item.title}}</span>
            </el-menu-item>
          </div>
        </el-menu>
      </el-col>
    </el-aside>
    <!-- 右边容器 -->
    <el-container>
      <!-- 右边顶上的头部 -->
      <el-header>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item id="header_color" v-for="item in breadshow" :key="item.index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="phone_div">
          <el-dropdown @command="handlecommand">
            <span class="el-dropdown-link">
              <span class="username" v-html="username"></span>

              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="toMyslef">个人中心</el-dropdown-item>
              <el-dropdown-item command="exit_account">注销账号</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <img id="head_photo" :src="imgUrl" alt />
        </div>
      </el-header>
      <!-- 主要内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {
  TOKEN_API, // 验证token
  PERSONAL_API //获取个人中心数据
} from "@/api/acc_manage";
export default {
  data() {
    return {
      // treelist菜单栏数据驱动
      //index:菜单栏hash跳转
      //icls:一级菜单图标
      //title:一级菜单显示的内容
      //children:二级子菜单
      treelist: [
        {
          index: "/index/home",
          icls: "el-icon-menu",
          title: "后台首页",
          role: ["super", "normal"]
        },
        {
          index: "/index/order",
          icls: "el-icon-s-order",
          title: "订单管理",
          role: ["super", "normal"]
        },
        //商品管理 (二级菜单)
        {
          index: "3",
          icls: "el-icon-s-goods",
          title: "商品管理",
          role: ["super", "normal"],
          children: [
            {
              index: "/index/shop_list",
              icls: "el-icon-s-claim",
              title: "商品列表"
            },
            {
              index: "/index/shop_add",
              icls: "el-icon-s-claim",
              title: "商品添加"
            },
            {
              index: "/index/shop_class",
              icls: "el-icon-s-claim",
              title: "商品分类"
            }
          ]
        },
        {
          index: "/index/stroe_manage",
          icls: "el-icon-s-claim",
          title: "店铺管理",
          role: ["super"]
        },
        //账号管理 (二级菜单)
        {
          index: "4",
          icls: "el-icon-s-goods",
          title: "账号管理",
          role: ["super"],

          children: [
            {
              index: "/index/acc_list",
              icls: "el-icon-s-claim",
              title: "账号列表"
            },
            {
              index: "/index/add_acc",
              icls: "el-icon-s-claim",
              title: "添加账号"
            },
            {
              index: "/index/change_pwd",
              icls: "el-icon-s-claim",
              title: "修改密码"
            }
          ]
        },
        //销售统计 (二级菜单)
        {
          index: "6",
          icls: "el-icon-s-shop",
          title: "销售统计",
          role: ["super"],
          children: [
            {
              index: "/index/count_sale",
              icls: "el-icon-s-claim",
              title: "商品统计"
            },
            {
              index: "/index/count_order",
              icls: "el-icon-s-claim",
              title: "订单统计"
            }
          ]
        }
      ],
      //breadshow 面包屑导航
      breadshow: "",
      username: "亲，请登录",
      // 当前用户登录的头像
      imgUrl: "",
      // 商家头像
      imgUrl_shop: require("../assets/images/title.jpg")
    };
  },
  methods: {
    // 面包屑导航
    mateHash(path) {
      var arr = [];
      switch (path) {
        case "/index/home":
          arr = ["后台首页"];
          break;
        case "/index/order":
          arr = ["订单管理"];
          break;
        case "/index/shop_list":
          arr = ["商品管理", "商品列表"];
          break;
        case "/index/shop_add":
          arr = ["商品管理", "商品添加"];
          break;
        case "/index/shop_class":
          arr = ["商品管理", "商品分类"];
          break;
        case "/index/stroe_manage":
          arr = ["店铺管理"];
          break;
        case "/index/acc_list":
          arr = ["账号管理", "账号列表"];
          break;
        case "/index/add_acc":
          arr = ["账号管理", "添加账号"];
          break;
        case "/index/change_pwd":
          arr = ["账号管理", "修改密码"];
          break;
        case "/index/count_sale":
          arr = ["销售统计", "商品统计"];
          break;
        case "/index/count_order":
          arr = ["销售统计", "订单统计"];
          break;
      }

      this.breadshow = arr;
    },
    // 监听下拉菜单
    handlecommand(command) {
      switch (command) {
        case "toMyslef":
          this.$router.push("/index/mysef");
          break;
        case "exit_account":
          this.$message({
            message: "恭喜你，登录成功",
            type: "success", //提示框的类型
            center: true, //提示框文本居中
            duration: 500, //提示框显示的时间
            offset: 50 //提示框距离顶部的偏移量
          });
          // 删除本地数据
          localStorage.removeItem("token");
          // 跳转登录页面
          setTimeout(()=>{
          this.$router.push("/");
          },500)
          break;
      }
    }
  },
  // 监听,当路由发生变化的时候执行
  watch: {
    $route: {
      handler: val => {
        window.__this.mateHash(val.path);
      },
      // 深度观察监听
      deep: true
    }
  },
  created() {
    // 面包屑默认参数
    this.mateHash(this.$route.path);
    window.__this = this;
    // 验证token
    TOKEN_API(localStorage.token).then(res => {
      if (res.data.code == 0) {
        this.username = localStorage.username;
      } else {
        this.username = '<a href = "#/" class="login_agn">亲，请登录</a>';
      }
    });
    // 获取用户头像
    PERSONAL_API(localStorage.id).then(res => {
      this.imgUrl = res.data.accountInfo.imgUrl;
    });
  },
  computed: {
    // 判断用户登录的权限
    new_treelist() {
      return this.treelist.filter(i => i.role.includes(localStorage.role));
    }
  }
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  // 侧栏
  .el-aside {
    background: rgb(45, 58, 75);
    // 菜单栏的标题
    .el-col {
      width: 100%;
      height: 100%;

      .menu_div {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        font-size: 18px;
        color: #fff;
        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 5px;
        }
      }
      // 左边菜单栏的边框
      .el-menu {
        border: none;
      }
    }
  }
  // 头部
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;

    // 头部右边的头像
    .phone_div {
      display: flex;
      align-items: center;
      padding: 0px 28px;
      .username {
        color: #fff;
      }
      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin: 0px 10px;
      }
    }
  }
  // 主体内容
  .el-main {
    width: 100%;
    height: 100%;
    background: rgb(240, 242, 245);
    padding: 20px;
  }
}
</style>
<style lang="less">
body {
  background: url("../assets/images/bg.jpg") 126px -96px;
  background-size: 85%;
  // 面包屑导航样式
  #header_color {
    .el-breadcrumb__inner {
      color: white !important;
      font-size: 16px;
    }
  }
  .login_agn {
    margin-right: 20x;
    color: rgb(33, 125, 201);
    text-decoration: none;
  }
}
</style>