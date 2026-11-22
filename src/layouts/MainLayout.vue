<template>
  <q-layout view="hHh Lpr fFf" class="app-shell">
    <q-header class="app-header">
      <q-toolbar class="page-width">
        <router-link class="brand" :to="{ name: 'dashboard' }">
          <span>CINE<span class="brand-light">FILE</span></span>
        </router-link>

        <div class="nav-links">
          <q-btn flat no-caps label="หน้าแรก" :to="{ name: 'dashboard' }" />
          <q-btn v-if="isAdmin" flat no-caps label="หนังทั้งหมด" :to="{ name: 'watchlist' }" />
        </div>

        <q-space />

        <q-badge v-if="isAdmin" color="deep-orange" class="q-mr-sm"> ADMIN </q-badge>

        <q-btn
          v-if="isAdmin"
          class="header-action"
          flat
          round
          icon="add"
          aria-label="เพิ่มหนัง"
          :to="{ name: 'movie-create' }"
        >
          <q-tooltip>เพิ่มหนัง</q-tooltip>
        </q-btn>
        <transition name="search-expand">
          <q-input
            v-if="searchOpen"
            ref="searchInput"
            v-model="searchQuery"
            class="header-search"
            outlined
            dark
            color="negative"
            dense
            placeholder="ค้นหาชื่อหนัง..."
            aria-label="ค้นหาหนัง"
            @keyup.enter="submitSearch"
            @keyup.esc="closeSearch"
          >
            <template #append>
              <q-btn flat round dense icon="search" aria-label="ค้นหาหนัง" @click="submitSearch" />
              <q-btn flat round dense icon="close" aria-label="ปิดช่องค้นหา" @click="closeSearch" />
            </template>
          </q-input>
        </transition>
        <q-btn
          v-if="!searchOpen"
          class="header-action"
          flat
          round
          icon="search"
          aria-label="เปิดช่องค้นหา"
          @click="toggleSearch"
        >
          <q-tooltip>ค้นหาหนัง</q-tooltip>
        </q-btn>
        <q-btn
          class="header-action"
          flat
          round
          icon="account_circle"
          :aria-label="isAuthenticated ? 'โปรไฟล์' : 'เข้าสู่ระบบ'"
          :to="accountRoute"
        >
          <q-tooltip>{{ isAuthenticated ? 'โปรไฟล์' : 'เข้าสู่ระบบ' }}</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth-store.js'
import { useMovieStore } from '@/stores/movie-store.js'

const auth = useAuthStore()
const movies = useMovieStore()
const router = useRouter()
const isAuthenticated = computed(() => auth.isAuthenticated)
const isAdmin = computed(() => auth.isAdmin)
const accountRoute = computed(() =>
  isAuthenticated.value ? { name: 'profile' } : { name: 'login' },
)
const searchOpen = ref(false)
const searchInput = ref(null)
const searchQuery = computed({
  get: () => movies.filters.search,
  set: (value) => {
    movies.filters.search = value ?? ''
  },
})

function toggleSearch() {
  if (searchOpen.value) {
    closeSearch()
    return
  }

  searchOpen.value = true
  nextTick(() => searchInput.value?.focus())
}

function closeSearch() {
  searchOpen.value = false
  searchQuery.value = ''
}

function submitSearch() {
  router.push({ name: 'watchlist' })
}
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background:
    radial-gradient(ellipse at 75% -10%, rgba(87, 77, 165, 0.17), transparent 38%), #101116;
  color: #f5f5f7;
}

.app-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(10, 10, 10, 0.96);
  backdrop-filter: blur(14px);
}

.app-header :deep(.q-toolbar) {
  min-height: 72px;
  padding-left: 28px;
  padding-right: 28px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #ff544b;
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-decoration: none;
}

.brand-light {
  color: #ff544b;
  font-weight: 800;
}

.nav-links {
  display: flex;
  gap: 0.4rem;
  margin-left: 2rem;
  flex-shrink: 0;
}

.nav-links :deep(.q-btn) {
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 8px 14px;
  border-radius: 6px;
}

.header-action {
  color: #e4e4e4;
  width: 44px;
  height: 44px;
}

.header-search {
  width: min(230px, 28vw);
}

.header-search :deep(.q-field__control) {
  min-height: 34px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.45);
}

.header-search :deep(.q-field--outlined .q-field__control:before) {
  border-color: rgba(255, 84, 75, 0.7);
}

.header-search :deep(.q-field__native) {
  font-size: 0.75rem;
}

.header-search :deep(.q-field__append) {
  height: 34px;
}

.search-expand-enter-active,
.search-expand-leave-active {
  overflow: hidden;
  transition:
    width 180ms ease,
    opacity 180ms ease;
}

.search-expand-enter-from,
.search-expand-leave-to {
  width: 0;
  opacity: 0;
}

@media (max-width: 1023px) {
  .app-header :deep(.q-toolbar) {
    padding-left: 16px;
    padding-right: 16px;
  }

  .nav-links {
    gap: 0.15rem;
    margin-left: 1rem;
  }
}

@media (max-width: 600px) {
  .app-header :deep(.q-toolbar) {
    min-height: 0;
    flex-wrap: wrap;
    padding-top: 4px;
    padding-bottom: 4px;
  }

  .nav-links {
    order: 1;
    flex: 0 0 100%;
    justify-content: center;
    margin-left: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .nav-links :deep(.q-btn) {
    min-height: 40px;
    padding: 6px 12px;
  }

  .header-action {
    width: 40px;
    height: 40px;
  }

  .header-search {
    width: min(145px, 38vw);
  }
}
</style>
