import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import installPlugins from './modules'

function bootstrap() {
  const app = createApp(App)
  installPlugins(app)
  app.mount('#app')
}
bootstrap()