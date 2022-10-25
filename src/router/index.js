import Vue from 'vue'
import VueRouter from 'vue-router'
import User from '../views/User.vue'
import Index from '../views/Index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/user',
    name: 'User',
    component: User
  },
  {
    path: '/',
    name: 'Index',
    component: Index
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,form,next)=>{
  next();
})

export default router
