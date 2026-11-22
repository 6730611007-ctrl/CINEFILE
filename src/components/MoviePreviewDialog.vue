<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    @hide="emit('hide')"
  >
    <q-card v-if="movie" class="preview-card">
      <q-btn
        v-close-popup
        class="close-preview"
        round
        dense
        flat
        icon="close"
        aria-label="ปิดรายละเอียด"
      />
      <div class="preview-layout">
        <div class="preview-poster">
          <q-img
            class="preview-poster-backdrop"
            :src="movie.poster || fallbackPoster"
            alt=""
            aria-hidden="true"
            ratio="0.68"
            fit="cover"
          />
          <q-img
            class="preview-poster-image"
            :src="movie.poster || fallbackPoster"
            :alt="`โปสเตอร์ ${movie.title}`"
            ratio="0.68"
            fit="contain"
          />
        </div>
        <div class="preview-info">
          <div class="preview-title">{{ movie.title }}</div>
          <div class="preview-meta">
            <span>
              <q-icon name="calendar_today" />
              {{ movie.year || 'ไม่ระบุปี' }}
            </span>
            <span>
              <q-icon name="movie_filter" />
              {{ movie.genre || 'ไม่ระบุแนว' }}
            </span>
            <span v-if="Number(movie.rating) > 0" class="preview-rating">
              <q-icon name="star" />
              {{ Number(movie.rating).toFixed(1) }}/10
            </span>
          </div>
          <section class="synopsis-card" aria-label="เรื่องย่อ">
            <div class="synopsis-heading">
              <q-icon name="subject" />
              <h3>เรื่องย่อ</h3>
            </div>
            <p class="preview-description">
              {{ movie.description || 'ยังไม่มีเรื่องย่อ' }}
            </p>
          </section>
          <q-card-actions align="right" class="preview-actions">
            <q-btn
              v-if="canManage"
              v-close-popup
              unelevated
              color="negative"
              icon="edit"
              label="แก้ไขข้อมูล"
              no-caps
              :to="{ name: 'movie-edit', params: { id: movie.id } }"
            />
            <q-btn
              v-else
              v-close-popup
              unelevated
              color="negative"
              icon="play_arrow"
              label="รับชมตัวอย่าง"
              no-caps
              :href="trailerUrl(movie)"
              target="_blank"
              rel="noopener noreferrer"
            />
          </q-card-actions>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { useMovieStore } from '@/stores/movie-store.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  movie: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'hide'])
const movies = useMovieStore()
const canManage = computed(() => props.movie && movies.canManageMovie(props.movie))
const fallbackPoster =
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80'

function trailerUrl(movie) {
  const url = movie.trailerUrl?.trim()
  if (url && /^https?:\/\/\S+$/i.test(url)) return url

  const query = encodeURIComponent(`${movie.title} ตัวอย่าง`)
  return `https://www.youtube.com/results?search_query=${query}`
}
</script>

<style scoped>
.preview-card {
  position: relative;
  width: min(860px, 92vw);
  max-height: 88vh;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  background: radial-gradient(ellipse at 88% 8%, rgba(255, 84, 75, 0.08), transparent 38%), #17191f;
  color: #f5f5f7;
}

.preview-layout {
  display: grid;
  grid-template-columns: minmax(220px, 0.85fr) minmax(0, 1.15fr);
  gap: 1.5rem;
  align-items: center;
  padding: 1rem;
}

.preview-poster {
  position: relative;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 0.68;
  border-radius: 12px;
  background: #101114;
}

.preview-poster-backdrop,
.preview-poster-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.preview-poster-backdrop {
  filter: blur(12px) brightness(0.42);
  transform: scale(1.08);
}

.preview-poster-image {
  z-index: 1;
}

.preview-info {
  display: flex;
  min-width: 0;
  max-height: calc(88vh - 2rem);
  flex-direction: column;
  overflow-y: auto;
  padding: 1.5rem 1.5rem 1.5rem 0;
  scrollbar-color: rgba(255, 84, 75, 0.55) transparent;
  scrollbar-width: thin;
}

.close-preview {
  position: absolute;
  z-index: 2;
  top: 0.65rem;
  right: 0.65rem;
  background: rgba(0, 0, 0, 0.55);
}

.preview-title {
  padding-right: 2rem;
  font-size: clamp(1.35rem, 2.5vw, 2rem);
  font-weight: 800;
  line-height: 1.2;
}

.preview-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.25rem;
  color: #c4c5cc;
  font-size: 0.78rem;
}

.preview-meta span {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.65rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.045);
}

.preview-meta .q-icon {
  color: #ff7770;
  font-size: 0.95rem;
}

.preview-meta .preview-rating {
  color: #ffd166;
}

.preview-meta .preview-rating .q-icon {
  color: #ffd166;
}

.synopsis-card {
  position: relative;
  display: flex;
  max-height: min(48vh, 440px);
  min-height: 0;
  flex: 0 1 auto;
  flex-direction: column;
  overflow: hidden;
  margin-top: 1.3rem;
  padding: 1rem 1.1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-left: 3px solid #ff544b;
  border-radius: 12px;
  background: linear-gradient(145deg, #22232b, #15161b);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
}

.synopsis-card::after {
  position: absolute;
  top: -3.5rem;
  right: -2.5rem;
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  background: rgba(255, 84, 75, 0.07);
  content: '';
  pointer-events: none;
}

.synopsis-heading {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.45rem;
  color: #ff7770;
}

.synopsis-heading .q-icon {
  font-size: 1.1rem;
}

.synopsis-heading h3 {
  margin: 0;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 750;
}

.preview-description {
  position: relative;
  z-index: 1;
  min-height: 0;
  flex: 1 1 auto;
  overflow-y: auto;
  margin: 0.65rem 0 0;
  padding-right: 0.3rem;
  color: #d3d3d9;
  font-size: 0.88rem;
  line-height: 1.75;
  white-space: pre-line;
  scrollbar-color: rgba(255, 84, 75, 0.55) transparent;
  scrollbar-width: thin;
}

.preview-actions {
  margin-top: auto;
  padding: 1.25rem 0 0;
}

.preview-actions :deep(.q-btn) {
  min-height: 40px;
  border-radius: 999px;
  font-weight: 700;
}

.close-preview:hover {
  background: rgba(255, 84, 75, 0.85);
}

@media (min-width: 601px) and (max-width: 900px) {
  .preview-card {
    width: 94vw;
  }

  .preview-layout {
    grid-template-columns: minmax(180px, 0.7fr) minmax(0, 1.3fr);
    gap: 1rem;
  }

  .preview-info {
    padding-right: 1rem;
  }

  .preview-title {
    font-size: clamp(1.25rem, 3vw, 1.7rem);
  }

  .synopsis-card {
    max-height: min(44vh, 420px);
    margin-top: 1rem;
    padding: 0.9rem;
  }

  .preview-description {
    font-size: 0.84rem;
  }
}

@media (max-width: 600px) {
  .preview-card {
    width: min(460px, 94vw);
    max-height: 90vh;
    overflow-y: auto;
  }

  .preview-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
    padding: 1rem 1rem 0;
  }

  .preview-poster {
    width: min(50vw, 220px);
    margin: 0 auto;
  }

  .preview-info {
    max-height: none;
    overflow: visible;
    padding: 1.25rem 0 1rem;
  }

  .preview-info,
  .preview-description {
    scrollbar-width: auto;
  }

  .preview-meta {
    gap: 0.35rem;
  }

  .preview-meta span {
    padding: 0.3rem 0.55rem;
  }

  .preview-title {
    padding-right: 2.5rem;
  }

  .synopsis-card {
    max-height: none;
    flex: 0 0 auto;
    overflow: visible;
    margin-top: 1rem;
    padding: 0.9rem 1rem;
  }

  .preview-description {
    overflow: visible;
    margin: 0.9rem 0 1rem;
    font-size: 0.84rem;
  }
}
</style>
