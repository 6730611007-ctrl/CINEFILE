<template>
  <q-page class="page-width watchlist-page">
    <div class="page-heading">
      <div>
        <h1>หนังทั้งหมด</h1>
        <p>
          {{ isAuthenticated ? 'ค้นหาได้ทุกเรื่อง และจัดการได้เฉพาะหนังที่คุณเพิ่ม' : 'ค้นหาและเลือกดูหนังที่น่าสนใจ' }}
        </p>
      </div>
      <q-btn
        v-if="isAdmin"
        unelevated
        color="primary"
        icon="add"
        label="เพิ่มหนัง"
        no-caps
        :to="{ name: 'movie-create' }"
      />
    </div>

    <div class="filters">
      <q-input
        v-model="movies.filters.search"
        class="search-input"
        outlined
        dark
        dense
        clearable
        placeholder="ค้นหาชื่อหนัง แนว หรือเรื่องย่อ"
      >
        <template #prepend><q-icon name="search" /></template>
      </q-input>
    </div>

    <div v-if="loading" class="loading-state"><q-spinner size="36px" color="primary" /></div>
    <div v-else-if="filteredMovies.length" class="movie-grid">
      <MovieCard
        v-for="movie in filteredMovies"
        :key="movie.id"
        :movie="movie"
        @remove="removeMovie(movie)"
      />
    </div>
    <div v-else class="empty-state">
      <q-icon :name="movies.movies.length ? 'search_off' : 'movie_filter'" />
      <h2>{{ movies.movies.length ? 'ไม่พบหนังที่ตรงกับการค้นหา' : 'ยังไม่มีหนังในรายการ' }}</h2>
      <p>
        {{
          movies.movies.length
            ? 'ลองเปลี่ยนคำค้นหาของคุณ'
            : isAdmin
              ? 'เพิ่มหนังเรื่องแรกเพื่อเริ่มต้นคอลเลกชันของคุณ'
              : 'โปรดกลับมาตรวจสอบรายการหนังอีกครั้งภายหลัง'
        }}
      </p>
      <q-btn
        v-if="!movies.movies.length && isAdmin"
        unelevated
        color="primary"
        label="เพิ่มหนัง"
        no-caps
        :to="{ name: 'movie-create' }"
      />
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import MovieCard from '@/components/MovieCard.vue'
import { useAuthStore } from '@/stores/auth-store.js'
import { useMovieStore } from '@/stores/movie-store.js'
import { getApiErrorMessage } from '@/utils/api-error.js'

const $q = useQuasar()
const auth = useAuthStore()
const movies = useMovieStore()
const isAuthenticated = computed(() => auth.isAuthenticated)
const isAdmin = computed(() => movies.isAdmin)
const loading = computed(() => movies.loading)
const filteredMovies = computed(() => movies.filteredMovies)

onMounted(load)

async function load() {
  try {
    await movies.loadMovies()
  } catch (error) {
    $q.notify({ type: 'negative', message: getApiErrorMessage(error) })
  }
}

async function removeMovie(movie) {
  try {
    await movies.deleteMovie(movie.id)
    $q.notify({ type: 'positive', message: 'ลบหนังออกจากรายการแล้ว' })
  } catch (error) {
    $q.notify({ type: 'negative', message: getApiErrorMessage(error) })
  }
}
</script>

<style scoped>
.page-width {
  width: min(1160px, calc(100% - 40px));
  margin: 0 auto;
}

.watchlist-page {
  min-height: 70vh;
  padding-top: 1rem;
  padding-bottom: 4rem;
}

.page-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
}

h1 {
  margin: 0.4rem 0;
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 750;
  letter-spacing: -0.04em;
}

.page-heading p,
.empty-state p {
  color: #a4a8b3;
}

.filters {
  display: flex;
  gap: 0.8rem;
  margin: 2rem 0 1.3rem;
}

.search-input {
  flex: 1;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.loading-state,
.empty-state {
  display: flex;
  min-height: 280px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: 18px;
  text-align: center;
}

.empty-state > .q-icon {
  color: #a897ff;
  font-size: 2.5rem;
}

.empty-state h2 {
  margin: 0;
  font-size: 1.2rem;
}

@media (max-width: 950px) {
  .movie-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .page-width {
    width: calc(100% - 28px);
  }

  .watchlist-page {
    padding-top: 2rem;
  }

  .page-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .filters {
    flex-direction: column;
  }
}
</style>
