<template>
  <q-page class="page-width collection-page">
    <section class="collection-heading">
      <div class="heading-copy">
        <div class="collection-kicker">
          <q-icon name="local_movies" />
          <span>{{ isAdmin ? 'CINEFILE COLLECTION' : 'CINEFILE SEARCH' }}</span>
        </div>
        <div class="heading-title">
          <h1>{{ isAdmin ? 'หนังทั้งหมด' : 'ค้นหาหนัง' }}</h1>
          <div v-if="isAdmin || searchTerm" class="collection-count">
            <q-icon name="movie_filter" />
            {{ isAdmin ? `${movies.movies.length} เรื่อง` : `พบ ${visibleMovies.length} เรื่อง` }}
          </div>
        </div>
        <p class="collection-subtitle">
          {{ isAdmin ? 'ค้นหาและจัดการคอลเลกชันภาพยนตร์ของคุณ' : 'ค้นหาจากชื่อหนัง แนวภาพยนตร์ หรือเรื่องย่อ' }}
        </p>
      </div>
      <q-btn
        v-if="isAdmin"
        class="add-movie-button"
        unelevated
        icon="add"
        label="เพิ่มหนัง"
        no-caps
        :to="{ name: 'movie-create' }"
      />
    </section>

    <div class="collection-tools">
      <q-input
        v-model="movies.filters.search"
        class="search-input"
        outlined
        dark
        color="negative"
        clearable
        aria-label="ค้นหาหนังในคอลเลกชัน"
        placeholder="ค้นหาชื่อหนัง แนว หรือเรื่องย่อ..."
      >
        <template #prepend><q-icon name="search" /></template>
      </q-input>
      <div v-if="isAdmin || searchTerm" class="result-count" aria-live="polite">
        <span>แสดง</span>
        <strong>{{ visibleMovies.length }}</strong>
        <span>{{ isAdmin ? `จาก ${movies.movies.length} เรื่อง` : 'เรื่องที่พบ' }}</span>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <q-spinner size="36px" color="negative" />
      <span>กำลังโหลดรายการหนัง...</span>
    </div>
    <div v-else-if="visibleMovies.length" class="movie-grid">
      <MovieCard
        v-for="movie in visibleMovies"
        :key="movie.id"
        :movie="movie"
        @remove="removeMovie(movie)"
      />
    </div>
    <div v-else class="empty-state">
      <div class="empty-icon">
        <q-icon :name="searchTerm ? 'search_off' : 'movie_filter'" />
      </div>
      <h2>
        {{
          !isAdmin && !searchTerm
            ? 'ค้นหาหนังที่คุณสนใจ'
            : searchTerm
              ? isAdmin
                ? 'ไม่พบหนังที่ตรงกับการค้นหา'
                : 'ยังไม่มีหนังเรื่องนี้'
              : 'ยังไม่มีหนังในรายการ'
        }}
      </h2>
      <p>
        {{
          !isAdmin && !searchTerm
            ? 'พิมพ์ชื่อหนัง แนวภาพยนตร์ หรือคำจากเรื่องย่อในช่องค้นหา'
            : searchTerm
              ? 'ลองตรวจสอบคำค้นหาหรือค้นหาด้วยคำอื่น'
              : isAdmin
                ? 'เพิ่มหนังเรื่องแรกเพื่อเริ่มต้นคอลเลกชันของคุณ'
                : 'โปรดกลับมาตรวจสอบรายการหนังอีกครั้งภายหลัง'
        }}
      </p>
      <q-btn
        v-if="searchTerm"
        flat
        color="negative"
        label="ล้างคำค้นหา"
        no-caps
        @click="movies.filters.search = ''"
      />
      <q-btn
        v-else-if="!movies.movies.length && isAdmin"
        class="add-movie-button"
        unelevated
        icon="add"
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
import { useMovieStore } from '@/stores/movie-store.js'
import { getApiErrorMessage } from '@/utils/api-error.js'

const $q = useQuasar()
const movies = useMovieStore()
const isAdmin = computed(() => movies.isAdmin)
const loading = computed(() => movies.loading)
const filteredMovies = computed(() => movies.filteredMovies)
const searchTerm = computed(() => movies.filters.search.trim())
const visibleMovies = computed(() =>
  isAdmin.value || searchTerm.value ? filteredMovies.value : [],
)

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

.collection-page {
  min-height: 70vh;
  padding-top: clamp(1.5rem, 3.5vw, 3rem);
  padding-bottom: 5rem;
}

.collection-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding: clamp(1.25rem, 3vw, 2rem);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  background:
    radial-gradient(ellipse at 92% 15%, rgba(255, 84, 75, 0.14), transparent 34%),
    linear-gradient(120deg, rgba(31, 31, 37, 0.96), rgba(18, 19, 24, 0.96));
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.2);
}

.collection-kicker {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #ff7770;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.collection-kicker .q-icon {
  font-size: 1rem;
}

.heading-title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.8rem;
  margin-top: 0.5rem;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 850;
  letter-spacing: -0.045em;
  line-height: 1.1;
}

.collection-count {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.7rem;
  border: 1px solid rgba(255, 84, 75, 0.25);
  border-radius: 999px;
  background: rgba(255, 84, 75, 0.09);
  color: #ffc0bc;
  font-size: 0.75rem;
  font-weight: 700;
}

.collection-count .q-icon {
  color: #ff7770;
  font-size: 0.95rem;
}

.collection-subtitle {
  margin: 0.6rem 0 0;
  color: #a4a8b3;
  font-size: 0.88rem;
}

.add-movie-button {
  min-height: 44px;
  flex: 0 0 auto;
  padding: 0 1.15rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #ff625a, #d9343d);
  color: #fff;
  font-weight: 750;
  box-shadow: 0 8px 20px rgba(217, 52, 61, 0.24);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;
}

.add-movie-button:hover {
  box-shadow: 0 12px 26px rgba(217, 52, 61, 0.34);
  transform: translateY(-2px);
}

.collection-tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin: 0 0 1.25rem;
}

.search-input {
  width: min(640px, 100%);
}

.search-input :deep(.q-field__control) {
  min-height: 48px;
  border-radius: 13px;
  background: rgba(23, 25, 31, 0.78);
}

.search-input :deep(.q-field--outlined .q-field__control:before) {
  border-color: rgba(255, 255, 255, 0.13);
}

.search-input :deep(.q-field--outlined .q-field__control:hover:before) {
  border-color: rgba(255, 84, 75, 0.55);
}

.search-input :deep(.q-field--outlined.q-field--focused .q-field__control:after) {
  border-color: #ff625a;
}

.search-input :deep(.q-field__prepend .q-icon) {
  color: #ff7770;
}

.result-count {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.35rem;
  color: #9296a0;
  font-size: 0.78rem;
}

.result-count strong {
  color: #f5f5f7;
  font-size: 0.88rem;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 245px), 1fr));
  align-items: stretch;
  gap: 1.15rem;
}

.loading-state,
.empty-state {
  display: flex;
  min-height: 300px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  background:
    radial-gradient(ellipse at 50% 0%, rgba(255, 84, 75, 0.08), transparent 56%),
    rgba(23, 25, 31, 0.58);
  text-align: center;
}

.loading-state {
  color: #a4a8b3;
  font-size: 0.9rem;
}

.empty-icon {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  border: 1px solid rgba(255, 84, 75, 0.22);
  border-radius: 50%;
  background: rgba(255, 84, 75, 0.09);
  color: #ff7770;
}

.empty-icon .q-icon {
  font-size: 1.7rem;
}

.empty-state h2 {
  margin: 0;
  font-size: 1.2rem;
}

.empty-state p {
  max-width: 420px;
  margin: 0;
  color: #a4a8b3;
  font-size: 0.86rem;
  line-height: 1.6;
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

  .collection-page {
    padding-top: 1.25rem;
  }

  .collection-heading {
    flex-direction: column;
    align-items: stretch;
    gap: 1.1rem;
    border-radius: 18px;
  }

  .add-movie-button {
    align-self: flex-start;
  }

  .collection-tools {
    align-items: stretch;
    flex-direction: column;
    gap: 0.65rem;
  }

  .search-input {
    width: 100%;
  }

  .result-count {
    justify-content: flex-end;
  }

  .movie-grid {
    gap: 0.8rem;
  }
}

@media (max-width: 390px) {
  .collection-count {
    font-size: 0.7rem;
  }
}
</style>
