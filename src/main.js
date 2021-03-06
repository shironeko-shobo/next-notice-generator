import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import shortkey from "vue-shortkey";

Vue.config.productionTip = false;
Vue.use(shortkey);

Vue.directive("notice", {
  bind: el => {
    let currentElementX;
    let currentElementY;
    let event;

    const mouseDown = e => {
      if (e.type === "mousedown") {
        event = e;
      } else {
        event = e.changedTouches[0];
      }

      currentElementY = event.pageY - el.offsetTop;
      currentElementX = event.pageX - el.offsetLeft;

      el.style.cursor = "move";

      document.body.addEventListener("mousemove", mouseMove, false);
      el.addEventListener("mouseup", mouseUp, false);
      document.body.addEventListener("mouseleave", mouseUp, false);
    };

    const mouseMove = e => {
      if (e.type === "mousemove") {
        event = e;
      } else {
        event = e.changedTouches[0];
      }

      e.preventDefault();

      el.style.top = event.pageY - currentElementY + "px";
      el.style.left = event.pageX - currentElementX + "px";
    };

    const mouseUp = () => {
      document.body.removeEventListener("mousemove", mouseMove, false);
      el.removeEventListener("mouseup", mouseUp, false);

      el.style.cursor = "pointer";
    };

    el.addEventListener("mousedown", mouseDown, false);
  }
});

new Vue({
  router,
  store,
  vuetify,
  shortkey,
  render: h => h(App)
}).$mount("#app");

Vue.config.devtools = true;
