import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'virtual:uno.css';
import './style.less';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/useAuthStore';

const pinia = createPinia();
const app = createApp(App);
app.use(pinia).use(router);

const authStore = useAuthStore();
authStore.initAuth().finally(() => {
  app.mount('#app');
});
