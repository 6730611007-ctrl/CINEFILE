<template>
  <q-page class="home-page">
    <div v-if="loading && !movies.movies.length" class="loading-state">
      <q-spinner size="40px" color="primary" />
    </div>

    <template v-else>
      <section
        class="featured-hero"
        @mouseenter="heroPaused = true"
        @mouseleave="heroPaused = false"
        @focusin="heroPaused = true"
        @focusout="resumeHero"
      >
        <Transition name="backdrop-fade">
          <div
            :key="featuredMovie?.id || 'empty-backdrop'"
            class="hero-backdrop"
            :style="heroStyle"
          />
        </Transition>
        <div class="hero-shade" />

        <div class="hero-content">
          <div class="hero-kicker">
            <q-icon name="local_movies" />
            <span>{{ featuredMovie ? 'แนะนำจากคอลเลกชันของคุณ' : 'CINEFILE ORIGINAL' }}</span>
          </div>
          <h1>{{ featuredMovie?.title || 'เรื่องโปรดของคุณ รออยู่ที่นี่' }}</h1>
          <div v-if="featuredMovie" class="hero-meta">
            <span class="hero-rating"><q-icon name="star" /> {{ ratingLabel }}</span>
            <span>{{ featuredMovie.year || 'ไม่ระบุปี' }}</span>
          </div>
          <p>
            {{
              featuredMovie?.description ||
              (isAdmin ? 'เพิ่มหนังที่น่าสนใจเพื่อให้ทุกคนเลือกชมได้' : 'เลือกชมหนังที่น่าสนใจจากรายการหนังของเรา')
            }}
          </p>
          <div class="hero-actions">
            <q-btn
              v-if="isAdmin"
              unelevated
              color="white"
              text-color="dark"
              :icon="featuredMovie ? 'play_arrow' : 'add'"
              :label="featuredMovie ? 'ดูหนังทั้งหมด' : 'เพิ่มหนังเรื่องแรก'"
              no-caps
              :to="featuredMovie ? { name: 'watchlist' } : featuredRoute"
            />
            <q-btn
              v-if="isAdmin"
              unelevated
              color="grey-9"
              text-color="white"
              icon="info"
              label="รายการหนัง"
              no-caps
              :to="{ name: 'watchlist' }"
            />
          </div>
        </div>

        <template v-if="totalMovies > 1">
          <q-btn
            class="hero-arrow hero-arrow-left"
            round
            flat
            icon="chevron_left"
            aria-label="หนังเรื่องก่อนหน้า"
            @click="showPreviousMovie"
          />
          <q-btn
            class="hero-arrow hero-arrow-right"
            round
            flat
            icon="chevron_right"
            aria-label="หนังเรื่องถัดไป"
            @click="showNextMovie"
          />
        </template>

        <div class="hero-index">
          <span>{{ String(activeSlideIndex + 1).padStart(2, '0') }}</span> /
          {{ String(totalMovies).padStart(2, '0') }}
          <div v-if="totalMovies > 1" class="hero-pagination">
            <button
              v-for="(_, index) in sortedMovies"
              :key="index"
              type="button"
              :class="{ active: index === activeSlideIndex }"
              :aria-label="`แสดงหนังเรื่องที่ ${index + 1}`"
              :aria-current="index === activeSlideIndex ? 'true' : undefined"
              @click="goToSlide(index)"
            />
          </div>
        </div>
      </section>

      <div class="home-content">
        <div v-if="loading" class="refresh-indicator">
          <q-spinner size="20px" color="primary" />
          กำลังอัปเดตรายการ
        </div>

        <div v-if="rails.length">
          <MovieRail
            v-for="rail in rails"
            :key="rail.title"
            :title="rail.title"
            :movies="rail.movies"
          />
        </div>

        <section v-else class="empty-collection">
          <q-icon name="movie_filter" />
          <h2>{{ isAdmin ? 'คอลเลกชันของคุณยังว่างอยู่' : 'ยังไม่มีหนังในรายการ' }}</h2>
          <p>
            {{
              isAdmin ? 'เพิ่มหนังเรื่องแรก แล้วโปสเตอร์จะแสดงที่นี่' : 'โปรดกลับมาตรวจสอบรายการหนังอีกครั้งภายหลัง'
            }}
          </p>
          <q-btn
            v-if="isAdmin"
            unelevated
            color="primary"
            icon="add"
            label="เพิ่มหนัง"
            no-caps
            :to="{ name: 'movie-create' }"
          />
        </section>
      </div>
    </template>
  </q-page>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import MovieRail from '@/components/MovieRail.vue'
import { useMovieStore } from '@/stores/movie-store.js'
import { getApiErrorMessage } from '@/utils/api-error.js'

const $q = useQuasar()
const movies = useMovieStore()
const isAdmin = computed(() => movies.isAdmin)
const loading = computed(() => movies.loading)
const currentSlide = ref(0)
const heroPaused = ref(false)
const sortedMovies = computed(() => [...movies.movies].sort((a, b) => Number(b.id) - Number(a.id)))
const totalMovies = computed(() => movies.movies.length)
const activeSlideIndex = computed(() =>
  totalMovies.value ? currentSlide.value % totalMovies.value : 0,
)
const featuredMovie = computed(() => sortedMovies.value[activeSlideIndex.value] || null)
const heroStyle = computed(() =>
  featuredMovie.value?.poster ? { backgroundImage: `url("${featuredMovie.value.poster}")` } : {},
)
const featuredRoute = computed(() =>
  featuredMovie.value
    ? { name: 'movie-edit', params: { id: featuredMovie.value.id } }
    : { name: 'movie-create' },
)
const ratingLabel = computed(() =>
  Number(featuredMovie.value?.rating) > 0
    ? `${Number(featuredMovie.value.rating).toFixed(1)}`
    : 'แนะนำ',
)
const rails = computed(() => {
  const groups = new Map()

  for (const movie of sortedMovies.value) {
    const title = movie.genre?.trim() || 'รายการหนัง'
    if (!groups.has(title)) groups.set(title, [])
    groups.get(title).push(movie)
  }

  return [...groups.entries()].map(([title, groupMovies]) => ({ title, movies: groupMovies }))
})

let slideTimer

onMounted(() => {
  load()
  slideTimer = window.setInterval(() => {
    if (!heroPaused.value) showNextMovie()
  }, 6000)
})

onUnmounted(() => window.clearInterval(slideTimer))

async function load() {
  try {
    await movies.loadMovies()
  } catch (error) {
    $q.notify({ type: 'negative', message: getApiErrorMessage(error) })
  }
}

function showNextMovie() {
  if (totalMovies.value > 1) currentSlide.value = (activeSlideIndex.value + 1) % totalMovies.value
}

function showPreviousMovie() {
  if (totalMovies.value > 1) {
    currentSlide.value = (activeSlideIndex.value - 1 + totalMovies.value) % totalMovies.value
  }
}

function goToSlide(index) {
  currentSlide.value = index
}

function resumeHero(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) heroPaused.value = false
}
</script>

<style scoped>
.home-page {
  min-height: calc(100vh - 100px);
  padding: 0 0 3rem;
  background: #101010;
}

.featured-hero {
  position: relative;
  display: flex;
  min-height: clamp(460px, 72vh, 760px);
  align-items: flex-end;
  overflow: hidden;
  margin: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background:
    radial-gradient(ellipse at 70% 30%, rgba(80, 72, 94, 0.62), transparent 40%),
    linear-gradient(120deg, #25232a, #111113 70%);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.35);
}

.hero-backdrop,
.hero-shade {
  position: absolute;
  inset: 0;
}

.hero-backdrop {
  background-position: center 38%;
  background-size: cover;
  opacity: 0.82;
  transform: scale(1.04);
}

.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
  transition: opacity 0.55s ease;
}

.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
  opacity: 0;
}

.hero-shade {
  background:
    linear-gradient(
      90deg,
      rgba(10, 10, 12, 0.96) 0%,
      rgba(10, 10, 12, 0.78) 32%,
      rgba(10, 10, 12, 0.12) 76%
    ),
    linear-gradient(0deg, #101010 0%, rgba(16, 16, 16, 0.82) 12%, rgba(16, 16, 16, 0.12) 62%);
}

.hero-content {
  position: relative;
  z-index: 1;
  width: min(660px, 75%);
  padding: 2rem clamp(1.5rem, 5.2vw, 5.5rem) clamp(4.5rem, 9vh, 7rem);
}

.hero-kicker {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #ff625a;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.09em;
}

.hero-kicker .q-icon {
  font-size: 1rem;
}

h1 {
  max-width: 720px;
  margin: 0.85rem 0 0.65rem;
  font-size: clamp(2.5rem, 5.2vw, 4.8rem);
  font-weight: 850;
  letter-spacing: -0.04em;
  line-height: 1.04;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.55);
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #d7d7d9;
  font-size: 0.76rem;
  font-weight: 700;
}

.hero-rating {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #8bd19c;
}

.hero-content p {
  display: -webkit-box;
  overflow: hidden;
  max-width: 550px;
  margin: 0.9rem 0 1.1rem;
  color: #d0cfd2;
  font-size: 0.86rem;
  line-height: 1.55;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.hero-actions :deep(.q-btn) {
  min-height: 36px;
  padding: 0 1rem;
  border-radius: 22px;
  font-size: 0.78rem;
  font-weight: 700;
}

.hero-index {
  position: absolute;
  z-index: 2;
  right: clamp(1.5rem, 5.2vw, 5.5rem);
  bottom: 2rem;
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.72rem;
}

.hero-index span {
  color: white;
  font-weight: 700;
}

.hero-pagination {
  display: flex;
  justify-content: flex-end;
  gap: 0.3rem;
  margin-top: 0.5rem;
}

.hero-pagination button {
  width: 1.3rem;
  height: 3px;
  padding: 0;
  border: 0;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.38);
  cursor: pointer;
  transition:
    width 180ms ease,
    background-color 180ms ease;
}

.hero-pagination button.active {
  width: 2.2rem;
  background: #f04444;
}

.hero-pagination button:focus-visible {
  outline: 2px solid white;
  outline-offset: 3px;
}

.hero-arrow {
  position: absolute;
  z-index: 2;
  top: 50%;
  color: white;
  background: rgba(15, 15, 15, 0.55);
  transform: translateY(-50%);
}

.hero-arrow:hover {
  background: rgba(15, 15, 15, 0.85);
}

.hero-arrow-left {
  left: 0.75rem;
}

.hero-arrow-right {
  right: 0.75rem;
}

.home-content {
  width: min(100% - 9vw, 1760px);
  margin: 0 auto;
  padding: 1.4rem 0 4rem;
}

.refresh-indicator {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  color: #aaa;
  font-size: 0.78rem;
}

.empty-collection,
.loading-state {
  display: flex;
  min-height: 230px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  text-align: center;
}

.empty-collection > .q-icon {
  color: #ff625a;
  font-size: 2.4rem;
}

.empty-collection h2 {
  margin: 0;
  font-size: 1.15rem;
}

.empty-collection p {
  margin: 0 0 0.4rem;
  color: #999;
  font-size: 0.84rem;
}

.loading-state {
  min-height: 60vh;
}

@media (max-width: 700px) {
  .featured-hero {
    min-height: clamp(480px, 72vh, 620px);
  }

  .hero-content {
    width: 100%;
    padding: 1.4rem 1.25rem 5.25rem;
  }

  h1 {
    font-size: clamp(2.2rem, 11vw, 3.5rem);
  }

  .hero-shade {
    background:
      linear-gradient(90deg, rgba(10, 10, 12, 0.78), rgba(10, 10, 12, 0.18)),
      linear-gradient(0deg, #101010 0%, rgba(16, 16, 16, 0.78) 18%, rgba(16, 16, 16, 0.08) 100%);
  }

  .hero-index {
    right: 1.25rem;
    bottom: 1rem;
  }

  .hero-arrow-left {
    right: 3.5rem;
    left: auto;
  }

  .hero-arrow-right {
    right: 0.5rem;
  }

  .hero-arrow {
    top: 1rem;
    transform: none;
  }

  .home-content {
    width: calc(100% - 2rem);
    padding-top: 0.8rem;
  }
}
</style>
