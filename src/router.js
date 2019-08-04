import Vue from "vue";
import Router from "vue-router";

import NoticeField from "./components/notice_field.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "noticeField",
      component: NoticeField
    }
  ]
});
