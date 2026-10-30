import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, saved) {
    return saved ?? (to.path === from.path ? {} : { top: 0 })
  },
  routes: [
    { path: '/', component: () => import('../views/HomeView.vue'), meta: { title: '今天吃什么' } },
    {
      path: '/explore',
      component: () => import('../views/ExploreView.vue'),
      meta: { title: '找好吃的' },
    },
    {
      path: '/rankings',
      component: () => import('../views/RankingView.vue'),
      meta: { title: '校园榜单' },
    },
    {
      path: '/dishes/:id',
      component: () => import('../views/DishDetailView.vue'),
      meta: { title: '菜品详情' },
    },
    {
      path: '/canteens/:id',
      component: () => import('../views/CanteenDetailView.vue'),
      meta: { title: '食堂漫游' },
    },
    {
      path: '/favorites',
      component: () => import('../views/FavoritesView.vue'),
      meta: { title: '我的收藏' },
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: '页面未找到' },
    },
  ],
})
router.afterEach((to) => (document.title = `${String(to.meta.title)} · 食堂雷达`))
export default router
