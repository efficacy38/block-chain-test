import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap"

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// import { fab } from '@fortawesome/free-brands-svg-icons'
import { faRotate } from '@fortawesome/free-solid-svg-icons'

library.add(faRotate)

// import './assets/main.css'

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)

app
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')
