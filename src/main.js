/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";
import { createPinia } from "pinia";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Styles
import "unfonts.css";

const pinia = createPinia();
const app = createApp(App);

// Eventbus
import mitt from "mitt";
const emitter = mitt();
app.config.globalProperties.emitter = emitter;

registerPlugins(app);

app.use(pinia);
app.mount("#app");
