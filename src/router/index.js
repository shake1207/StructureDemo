import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/index';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: { requiresAuth: false },
    component: () => import('@/views/login.vue')
  },
  {
    path: '/main',
    redirect: '/main',
    component: () => import('@/layout/main.vue'),
    meta: { requiresAuth: false },
    children: [
      {
        path: '/main',
        name: 'main',
        component: () => import('@/views/index.vue')
      },
      {
        path: '/favorite',
        name: 'favorite',
        component: () => import('@/views/favorite/index.vue')
      }
    ]
  },
  {
    path: '/sample',
    name: 'sample',
    meta: { requiresAuth: false },
    component: () => import('@/views/sample/sample.vue'),
    props: route => ({
      ...route.params
    })
  },
  // {
  //   path: "/upload",
  //   name: "upload",
  //   component: () => import("@/views/upload/Upload.vue")
  // },
  {
    path: '/errorPage',
    name: 'errorPage',
    component: () => import('@/views/errorPage.vue')
  },
  {
    path: '*',
    redirect: '/main'
  }
];

const router = new VueRouter({
  // mode: 'history',
  // base: '/structure/dist',
  routes
});

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => console.warn(err));
};
router.beforeEach((to, from, next) => {
  // 如果 router 轉跳的頁面需要驗證 requiresAuth: true
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 如果沒有 token
    const token = store.state.Authenticate.token;

    if (!token) {
      next({ path: '/login' });
      return;
    }
    next();
    return;
  }
  next();
});
export default router;
