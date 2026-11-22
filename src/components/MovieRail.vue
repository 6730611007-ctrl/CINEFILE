<template>
  <section v-if="movies.length" class="movie-rail">
    <div class="rail-heading">
      <div>
        <div v-if="isAdmin" class="rail-kicker">คอลเลกชันของคุณ</div>
        <h2>{{ title }}</h2>
      </div>
      <div v-if="movies.length > 2" class="rail-controls">
        <q-btn
          round
          dense
          flat
          icon="chevron_left"
          aria-label="เลื่อนรายการไปทางซ้าย"
          @click="scroll(-1)"
        />
        <q-btn
          round
          dense
          flat
          icon="chevron_right"
          aria-label="เลื่อนรายการไปทางขวา"
          @click="scroll(1)"
        />
      </div>
    </div>

    <div ref="track" class="rail-track">
      <button
        v-for="movie in movies"
        :key="movie.id"
        class="movie-tile"
        type="button"
        :aria-label="`ดูรายละเอียด ${movie.title}`"
        @click="openPreview(movie)"
      >
        <div class="tile-poster">
          <q-img
            class="tile-poster-backdrop"
            :src="movie.poster || fallbackPoster"
            alt=""
            aria-hidden="true"
            ratio="0.68"
            fit="cover"
          />
          <q-img
            class="tile-poster-image"
            :src="movie.poster || fallbackPoster"
            :alt="`โปสเตอร์ ${movie.title}`"
            ratio="0.68"
            fit="contain"
          />
          <div class="tile-overlay">
            <q-icon name="play_circle" />
            <span>ดูรายละเอียด</span>
          </div>
        </div>
        <div class="tile-title">{{ movie.title }}</div>
        <div class="tile-meta">{{ movie.year || 'ไม่ระบุปี' }} · {{ movie.genre || 'ไม่ระบุแนว' }}</div>
        <div v-if="Number(movie.rating) > 0" class="tile-rating">
          <q-icon name="star" />
          {{ Number(movie.rating).toFixed(1) }}
        </div>
        <div v-if="isAdmin" class="tile-owner">
          เพิ่มโดย {{ movie.userName || `ผู้ใช้ #${movie.userId}` }}
        </div>
      </button>
    </div>

    <MoviePreviewDialog v-model="previewOpen" :movie="selectedMovie" @hide="selectedMovie = null" />
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import MoviePreviewDialog from '@/components/MoviePreviewDialog.vue'
import { useMovieStore } from '@/stores/movie-store.js'

defineProps({
  title: { type: String, required: true },
  movies: { type: Array, required: true },
})

const track = ref(null)
const previewOpen = ref(false)
const selectedMovie = ref(null)
const store = useMovieStore()
const isAdmin = computed(() => store.isAdmin)
const fallbackPoster =
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80'

function scroll(direction) {
  track.value?.scrollBy({ left: direction * 520, behavior: 'smooth' })
}

function openPreview(movie) {
  selectedMovie.value = movie
  previewOpen.value = true
}
</script>

<style scoped>
.movie-rail {
  margin-top: 2.4rem;
}

.rail-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 0.8rem;
}

.rail-kicker {
  color: #ff7770;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

h2 {
  margin: 0.15rem 0 0;
  font-size: clamp(1.15rem, 1.6vw, 1.45rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.rail-controls {
  display: flex;
  gap: 0.35rem;
}

.rail-controls :deep(.q-btn) {
  width: 34px;
  height: 34px;
  border: 1px solid rgba(255, 255, 255, 0.13);
  background: #17191f;
}

.rail-track {
  display: flex;
  gap: clamp(0.7rem, 1.3vw, 1.2rem);
  overflow-x: auto;
  padding: 0.7rem 0.15rem 1.2rem;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
}

.rail-track::-webkit-scrollbar {
  display: none;
}

.movie-tile {
  position: relative;
  display: block;
  flex: 0 0 clamp(160px, 16vw, 250px);
  min-width: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  text-align: left;
  text-decoration: none;
  scroll-snap-align: start;
  transition:
    transform 220ms ease,
    filter 220ms ease;
}

.movie-tile:hover,
.movie-tile:focus-visible {
  z-index: 1;
  filter: brightness(1.08);
  transform: translateY(-5px);
}

.tile-poster {
  position: relative;
  overflow: hidden;
  aspect-ratio: 0.68;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: #101114;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.3);
  transition:
    border-color 220ms ease,
    box-shadow 220ms ease;
}

.tile-poster-backdrop,
.tile-poster-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.tile-poster-backdrop {
  filter: blur(12px) brightness(0.42);
  transform: scale(1.08);
}

.tile-poster-image {
  z-index: 1;
  background: rgba(0, 0, 0, 0.12);
}

.movie-tile:hover .tile-poster,
.movie-tile:focus-visible .tile-poster {
  border-color: rgba(255, 255, 255, 0.42);
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.48);
}

.tile-overlay {
  position: absolute;
  z-index: 1;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.68), transparent 70%);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  opacity: 0;
  transition: opacity 180ms ease;
}

.tile-overlay .q-icon {
  font-size: 2.4rem;
}

.movie-tile:hover .tile-overlay,
.movie-tile:focus-visible .tile-overlay {
  opacity: 1;
}

.tile-title {
  overflow: hidden;
  margin-top: 0.45rem;
  font-size: 0.78rem;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tile-meta {
  overflow: hidden;
  margin-top: 0.15rem;
  color: #8d919a;
  font-size: 0.72rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tile-rating {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  margin-top: 0.3rem;
  color: #ddd;
  font-size: 0.7rem;
}

.tile-rating .q-icon {
  color: #ffc857;
  font-size: 0.9rem;
}

.tile-owner {
  overflow: hidden;
  margin-top: 0.15rem;
  color: #ff9a91;
  font-size: 0.66rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 600px) {
  .movie-rail {
    margin-top: 1.8rem;
  }

  .movie-tile {
    flex-basis: 42vw;
    max-width: 190px;
  }

  .tile-overlay {
    display: none;
  }
}
</style>
