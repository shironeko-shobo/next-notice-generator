import Vue from "vue";
import Router from "vue-router";

import CreateField from "./components/notice_create_field.vue";
import ViewField from "./components/notice_view_field.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "createField",
      component: CreateField
    },
    {
      path: "/view",
      name: "viewField",
      component: ViewField
    }
  ]
});
