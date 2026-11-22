const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/pages/DashboardPage.vue'),
      },
      {
        path: 'watchlist',
        name: 'watchlist',
        component: () => import('@/pages/WatchlistPage.vue'),
      },
      {
        path: 'movies/new',
        name: 'movie-create',
        component: () => import('@/pages/MovieFormPage.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'movies/:id/edit',
        name: 'movie-edit',
        component: () => import('@/pages/MovieFormPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/pages/ProfilePage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { guestOnly: true },
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
]

export default routes
