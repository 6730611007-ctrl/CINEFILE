<template>
  <q-page class="form-page">
    <div class="page-width">
      <div class="eyebrow">
        {{ editing ? 'อัปเดตคอลเลกชัน' : 'เพิ่มลงในคอลเลกชัน' }}
      </div>
      <h1>{{ editing ? 'แก้ไขข้อมูลหนัง' : 'เพิ่มหนังเรื่องใหม่' }}</h1>
      <p class="form-intro">บันทึกรายละเอียดไว้ เพื่อกลับมาดูหรือให้คะแนนได้ทุกเมื่อ</p>

      <div v-if="loading" class="loading-state"><q-spinner size="36px" color="primary" /></div>
      <q-card v-else class="form-card">
        <q-card-section>
          <MovieForm :movie="movie" @submit="saveMovie" />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import MovieForm from '@/components/MovieForm.vue'
import { useMovieStore } from '@/stores/movie-store.js'
import { getApiErrorMessage } from '@/utils/api-error.js'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const movies = useMovieStore()
const movie = ref(null)
const loading = ref(false)
const editing = computed(() => Boolean(route.params.id))

onMounted(loadMovie)

async function loadMovie() {
  if (!editing.value) return

  loading.value = true
  try {
    await movies.loadMovies()
    movie.value = movies.movies.find((item) => String(item.id) === String(route.params.id))
    if (!movie.value) {
      $q.notify({ type: 'warning', message: 'ไม่พบหนังเรื่องนี้ในรายการของคุณ' })
      await router.replace({ name: 'watchlist' })
    }
  } catch (error) {
    $q.notify({ type: 'negative', message: getApiErrorMessage(error) })
  } finally {
    loading.value = false
  }
}

async function saveMovie(values) {
  try {
    if (editing.value) {
      await movies.updateMovie(route.params.id, values)
      $q.notify({ type: 'positive', message: 'บันทึกการแก้ไขแล้ว' })
    } else {
      await movies.addMovie(values)
      $q.notify({ type: 'positive', message: 'เพิ่มหนังลงในรายการแล้ว' })
    }
    await router.push({ name: 'watchlist' })
  } catch (error) {
    $q.notify({ type: 'negative', message: getApiErrorMessage(error) })
  }
}
</script>

<style scoped>
.page-width {
  width: min(840px, calc(100% - 40px));
  margin: 0 auto;
}

.form-page {
  min-height: 100vh;
  padding-top: 2rem;
  padding-bottom: 4rem;

  background-image:
    linear-gradient(rgba(10, 10, 16, 0.68), rgba(10, 10, 16, 0.78)), url('/image/cinema6-bg.png');

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.eyebrow {
  color: #a897ff;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

h1 {
  margin: 0.4rem 0;
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 750;
  letter-spacing: -0.04em;
}

.form-intro {
  margin: 0 0 1.6rem;
  color: #a4a8b3;
}

.form-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  background: #17191f;
}

.loading-state {
  display: grid;
  min-height: 280px;
  place-items: center;
}

@media (max-width: 600px) {
  .page-width {
    width: calc(100% - 28px);
  }

  .form-page {
    padding-top: 2rem;
  }
}
</style>
