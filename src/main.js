import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import { Tooltip } from "bootstrap";
import "bootstrap";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// import { fab } from '@fortawesome/free-brands-svg-icons'
import { faRotate, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";

library.add([faRotate, faCircleQuestion]);

// import './assets/main.css'

const app = createApp(App);
app.use(router);

// init bootstrap tooltip
app.directive("tooltip", {
  mounted(el, binding) {
    let tooltip = new Tooltip(el, {
      placement: binding.arg || "top",
      title: binding.value,
    });
  },
});

app.component("font-awesome-icon", FontAwesomeIcon).mount("#app");
