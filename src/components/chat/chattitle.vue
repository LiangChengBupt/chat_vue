<template>
  <div class="chatTitle">
    <span class="titleName">{{
      this.$store.state.currentSession.nickname
        ? this.$store.state.currentSession.nickname
        : ""
    }}</span>
    <el-button class="moreBtn" size="small" icon="el-icon-more" @click="handleClick"></el-button>
    <el-dialog :visible="showAddPeopleDialog" @close="closeAddPeopleDialog">
        <h3>添加用户</h3>
        <!-- 群聊拉人的内容 -->
        <!-- ... -->
    </el-dialog>
    <el-dialog :visible="showUserInfoDialog" @close="closeUserInfoDialog">
        <h3>用户信息</h3>
        <!-- 用户信息展示的内容 -->
        <div class="profile-content" style="display: flex; justify-content: center; align-items: center;">
            <div class="profile-image">
              <img :src="this.currentSession.userProfile" alt="用户头像">
            </div>
            <div class="profile-divider"></div>
            <div class="profile-details">
              <p><strong>用户名：</strong>{{ this.currentSession.username }}</p>
              <p><strong>昵称：</strong>{{ this.currentSession.nickname }}</p>
            </div>
          </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "chattitle",
  data() {
    return {
      user: JSON.parse(window.sessionStorage.getItem("user")),
      showAddPeopleDialog: false, // 控制群聊拉人窗口的显示
      showUserInfoDialog: false, // 控制用户信息展示窗口的显示
      userInfo: null // 当前用户信息
    };
  },
  computed: mapState(["sessions", "currentSession", "errorImgUrl"]),
  methods: {
    handleClick() {
        const { currentSession } = this.$store.state;
      if (currentSession && currentSession.username !== '群聊') {
        this.openUserInfoDialog(currentSession);
      } else {
        this.openAddPeopleDialog();
      }
    },
    openAddPeopleDialog() {
      this.showAddPeopleDialog = true; // 打开群聊拉人窗口
      currentSession && currentSession.username != '群聊'
    },
    closeAddPeopleDialog() {
      this.showAddPeopleDialog = false; // 关闭群聊拉人窗口
    },
    openUserInfoDialog(userInfo) {
      this.userInfo = userInfo; // 设置当前用户信息
      this.showUserInfoDialog = true; // 打开用户信息展示窗口
    },
    closeUserInfoDialog() {
      this.showUserInfoDialog = false; // 关闭用户信息展示窗口
      this.userInfo = null; // 清空当前用户信息
    },
  }
};
</script>

<style scoped>
.chatTitle {
  height: 50px;
  width: 100%;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  border-bottom: 0.5px solid #c7d2db;
}
.moreBtn {
  background-color: #eee;
  border: 0;
  height: 40px;
}
.titleName {
  margin: 10px 20px;
}
</style>
