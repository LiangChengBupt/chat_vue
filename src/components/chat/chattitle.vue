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
        <el-select v-model="selectedUser" placeholder="请选择">
          <el-option
            v-for="item in this.$store.state.users"
            :key="item.id"
            :label="item.username"
            :value="item.id">
          </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showAddPeopleDialog = false">取 消</el-button>
          <el-button type="primary" @click="inviteToGroup">添 加</el-button>
        </span>
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
      userInfo: null, // 当前用户信息
      selectedUser: null // 用户选择的用户
    };
  },
  computed: mapState(["sessions","users", "currentSession", "errorImgUrl"]),
  methods: {
    inviteToGroup () {
      let currenGroupId = this.$store.state.groups.find(obj => obj.username == this.$store.state.currentSession.username).id;
      this.getRequest("/user/invite?groupid="+currenGroupId+"&userid="+this.selectedUser)
      .then(response => {
        if (response > 0) {
          console.log("success");
        } else {
          console.log("fail");
        }
        this.showAddPeopleDialog = false
      })
      .catch(error => {
        console.error(error);
        // this.$message({
        //   message: '添加用户到群聊失败',
        //   type: 'error'
        // });
        this.showAddPeopleDialog = false
      })
    },
    closeAddPeopleDialog () {
      this.showAddPeopleDialog = false
      this.selectedUser = null // 重置选择的用户
    },
    handleClick() {
        const { currentSession } = this.$store.state;
      if (currentSession && !currentSession.username.includes('群')) {
        this.openUserInfoDialog(currentSession);
      } else {
        this.openAddPeopleDialog();
      }
    },
    openAddPeopleDialog() {
      this.showAddPeopleDialog = true; // 打开群聊拉人窗口
      // currentSession && currentSession.username != '群聊'
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
