<template>
  <q-page class="form-page">
    <div class="page-width">
      <div class="eyebrow">
        <q-icon name="local_movies" />
        {{ editing ? 'อัปเดตคอลเลกชัน' : 'เพิ่มลงในคอลเลกชัน' }}
      </div>
      <h1>{{ editing ? 'แก้ไขข้อมูลหนัง' : 'เพิ่มหนังเรื่องใหม่' }}</h1>
      <p class="form-intro">บันทึกรายละเอียดไว้ เพื่อกลับมาดูหรือให้คะแนนได้ทุกเมื่อ</p>

      <div v-if="loading" class="loading-state">
        <q-spinner size="36px" color="negative" />
        <span>กำลังโหลดข้อมูลหนัง...</span>
      </div>
      <q-card v-else class="form-card">
        <q-card-section class="form-card-section">
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
  width: min(960px, calc(100% - 40px));
  margin: 0 auto;
}

.form-page {
  min-height: 100vh;
  padding-top: clamp(2rem, 5vw, 4rem);
  padding-bottom: 5rem;
  background-color: #101116;
  background-image:
    radial-gradient(ellipse at 85% 0%, rgba(255, 84, 75, 0.13), transparent 36%),
    linear-gradient(rgba(8, 9, 13, 0.82), rgba(8, 9, 13, 0.94)), url('/image/cinema6-bg.png');
  background-size: auto, auto, cover;
  background-position: center;
  background-repeat: no-repeat;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: #ff7770;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.eyebrow .q-icon {
  font-size: 1.1rem;
}

h1 {
  margin: 0.65rem 0 0;
  font-size: clamp(2rem, 4.5vw, 3.2rem);
  font-weight: 850;
  letter-spacing: -0.045em;
  line-height: 1.12;
}

.form-intro {
  margin: 0.7rem 0 1.7rem;
  color: #a4a8b3;
  font-size: 0.9rem;
  line-height: 1.6;
}

.form-card {
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 22px;
  background:
    radial-gradient(ellipse at 100% 0%, rgba(255, 84, 75, 0.055), transparent 40%),
    rgba(22, 23, 29, 0.94);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.34);
  backdrop-filter: blur(18px);
}

.form-card-section {
  padding: clamp(1.1rem, 3vw, 2rem);
}

.loading-state {
  display: flex;
  min-height: 280px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  background: rgba(22, 23, 29, 0.8);
  color: #a4a8b3;
  font-size: 0.88rem;
}

@media (max-width: 600px) {
  .page-width {
    width: calc(100% - 28px);
  }

  .form-page {
    padding-top: 1.75rem;
  }

  .form-intro {
    margin-bottom: 1.25rem;
  }

  .form-card {
    border-radius: 18px;
  }
}
</style>
