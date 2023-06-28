<template>
  <div id="list">
    <ul v-if="currentList == '群聊'">
      <!--群聊列表-->
      <p style="padding: 2px 4px; height: 20px">群聊列表</p>
      <!-- </li> --> 
      <li
          v-for="item in groups"
          :class="{
            active: currentSession
              ? item.username === currentSession.username
              : false,
          }"
          v-on:click="changeCurrentSession(item)"
        >
          <!--   :class="[item.id === currentSession ? 'active':'']" -->
          <div style="display: flex; justify-content: space-between">
            <div>
              <el-badge
                :is-dot="isDot[user.username + '#' + item.username]"
                style=""
              >
                <el-image
                  class="avatar"
                  :preview-src-list="[item.groupProfile]"
                  :src="item.groupProfile"
                  :alt="item.groupName"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </el-badge>
              <p class="name">{{ item.groupName }}</p>
            </div>
            <!-- <div>
              <el-badge
                :value="item.userStateId == 1 ? '在线' : '离线'"
                :type="item.userStateId == 1 ? 'danger' : 'info'"
              ></el-badge>
            </div> -->
          </div>
        </li>
    </ul>
    <!--机器人-->
    <ul v-if="currentList == '机器人'">
      <p style="padding: 2px 4px; height: 20px">快来和机器人聊天吧！</p>
      <li
        :class="{
          active: currentSession ? '机器人' == currentSession.username : false,
        }"
        v-on:click="changeCurrentSession(robotObj)"
      >
        <img
          class="avatar"
          src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2548892998,499717296&fm=26&gp=0.jpg"
        />
        <p class="name">瓦力(智能回复)</p>
      </li>
    </ul>
    <!--用户列表-->
    <el-scrollbar
      wrap-class="userList"
      wrap-style="height:600px;"
      view-style="height:100%;"
      :native="false"
    >
      <ul v-if="currentList == '私聊'">
        <p style="padding: 2px 4px; height: 20px">用户列表</p>
        <li
          v-for="item in users"
          :key="item.username"
          :class="{
            active: currentSession
              ? item.username === currentSession.username
              : false,
          }"
          v-on:click="changeCurrentSession(item)"
        >
          <!--   :class="[item.id === currentSession ? 'active':'']" -->
          <div style="display: flex; justify-content: space-between">
            <div>
              <el-badge
                :is-dot="isDot[user.username + '#' + item.username]"
                style=""
              >
                <el-image
                  class="avatar"
                  :preview-src-list="[item.userProfile]"
                  :src="item.userProfile"
                  :alt="item.nickname"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </el-badge>
              <p class="name">{{ item.nickname }}</p>
            </div>
            <div>
              <el-badge
                :value="item.userStateId == 1 ? '在线' : '离线'"
                :type="item.userStateId == 1 ? 'danger' : 'info'"
              ></el-badge>
            </div>
          </div>
        </li>
      </ul>
    <ul v-if="currentList == '申请'">
        <p style="padding: 2px 4px; height: 20px">好友申请列表</p>
        <li v-for="request in friendRequests" :key="request.username">
          <div style="display: flex;justify-content: space-between ">
            <div>
              <el-badge :is-dot="isDot[user.username + '#' + request.username]" style="">
                <el-image
                  class="avatar"
                  :preview-src-list="[request.userProfile]"
                  :src="request.userProfile"
                  :alt="request.nickname"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </el-badge>
              <p class="name" style="font-size: 14px;">{{ request.nickname }}</p>
            </div>
            <div class="dropdown-container" style="position: relative; left: -15px;">
              <el-dropdown trigger="hover">
                <span class="el-dropdown-link">
                  <i class="el-icon-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-button  @click="rejectFriend(request.id)">
                        拒绝
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button  @click="acceptFriend(request.id)">
                        接受
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </li>
      </ul>


    </el-scrollbar>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "list",
  data() {
    return {
      user: this.$store.state.currentUser,
      friends:[],
      friendRequests:[],
      chatObj: { username: "群聊", nickname: "群聊" }, //群聊实体对象（为方法复用而构造，对于User对象）
      robotObj: {
        username: "机器人",
        nickname: "机器人",
        userProfile:
          "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2548892998,499717296&fm=26&gp=0.jpg",
      },
    };
  },
  computed: mapState([
    //'sessions',//this.sessions映射成this.$store.state.sessions
    "users",
    "groups",
    "currentSession",
    "isDot",
    "currentList",
  ]),
  created() {
    const currentUserId = this.user.id;
    // 在组件创建时获取好友列表
    this.getRequest("/user/getFriends?userid="+currentUserId).then(resp => {
        console.log("获取好友列表");
        if(resp){
            this.friends=resp;
        }
                
    })

    this.getRequest("/user/getFriendFrom?userid="+currentUserId).then(resp => {
        console.log("获取好友申请列表");
        console.log(resp);
        if (resp) {
            this.friendRequests = resp;
        }
    });
    console.log(this.friendRequests);
  },
  methods: {
    changeCurrentSession: function (currentSession) {
      this.$store.commit("changeCurrentSession", currentSession);
    },
    rejectFriend: function(id){
        const currentUserId = this.user.id; // 当前用户的 ID
        console.log("拒绝申请");
        this.getRequest("/user/disagreeRequest?fromId="+id+"&toId="+currentUserId).then(resp => {
            console.log(resp);
        });
        this.getRequest("/user/getFriends?userid="+currentUserId).then(resp => {
            console.log("获取好友列表");
            if(resp){
                this.friends=resp;
            }
                    
        });
        this.getRequest("/user/getFriendFrom?userid="+currentUserId).then(resp => {
        console.log("获取好友申请列表");
        console.log(resp);
        if (resp) {
            this.friendRequests = resp;
        }
    });
    },
    acceptFriend: function(id){
        const currentUserId = this.user.id; // 当前用户的 ID
        console.log("同意申请");
        this.getRequest("/user/agreeRequest?fromId="+id+"&toId="+currentUserId).then(resp => {
            console.log(resp);
        });
        this.getRequest("/user/getFriends?userid="+currentUserId).then(resp => {
            console.log("获取好友列表");
            if(resp){
                this.friends=resp;
            }
                    
        });
        this.getRequest("/user/getFriendFrom?userid="+currentUserId).then(resp => {
        console.log("获取好友申请列表");
        console.log(resp);
        if (resp) {
            this.friendRequests = resp;
        }
    });
    },
    output(x) {
        console.log(x);
    },
  },
};
</script>

<style lang="scss" scoped>
#list {
  ul {
    margin-left: 0px;
    padding-left: 0px;
    margin-left: 2px;
  }
  li {
    padding-top: 14px;
    padding-bottom: 14px;
    //padding-right: 40px;
    //border-bottom: 1px solid #292C33;
    list-style: none;
    cursor: pointer;
    &:hover {
      background-color: #d8d6d6;
    }
  }
  li.active {
    /*注意这个是.不是冒号:*/
    background-color: #c8c6c6;
  }
  .avatar {
    border-radius: 2px;
    width: 30px;
    height: 30px;
    vertical-align: middle;
  }
  .name {
    display: inline-block;
    margin-left: 15px;
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .stateItem {
    //在线状态的样式
    /*position: absolute;*/
    left: 160px;
    margin-left: 100px;
    margin-right: 10px;
  }
  .userList {
    max-height: 600px;
  }
  .el-scrollbar__wrap.default-scrollbar__wrap {
    overflow-x: auto;
  }
}
</style>
