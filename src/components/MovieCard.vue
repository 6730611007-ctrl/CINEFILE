<template>
  <q-card class="movie-card">
    <button
      class="movie-preview-button"
      type="button"
      :aria-label="`ดูรายละเอียด ${movie.title}`"
      @click="previewOpen = true"
    >
      <div class="poster-wrap">
        <q-img
          class="poster-backdrop"
          :src="movie.poster || fallbackPoster"
          alt=""
          aria-hidden="true"
          ratio="0.78"
          fit="cover"
        />
        <q-img
          class="movie-poster"
          :src="movie.poster || fallbackPoster"
          :alt="`โปสเตอร์ ${movie.title}`"
          ratio="0.78"
          fit="contain"
        />
        <div class="poster-overlay">
          <q-icon name="play_circle" />
          <span>ดูรายละเอียด</span>
        </div>
      </div>
      <div class="movie-details">
        <div class="movie-heading">
          <div class="movie-title ellipsis-2-lines">{{ movie.title }}</div>
          <div class="movie-rating"><q-icon name="star" color="amber" /> {{ ratingLabel }}</div>
        </div>
        <div class="movie-meta">{{ movie.year || 'ปีไม่ระบุ' }} · {{ movie.genre || 'ไม่ระบุแนว' }}</div>
        <div v-if="isAdmin" class="movie-owner">
          เพิ่มโดย {{ movie.userName || `ผู้ใช้ #${movie.userId}` }}
        </div>
        <p class="movie-description ellipsis-2-lines">
          {{ movie.description || 'ยังไม่มีเรื่องย่อ' }}
        </p>
      </div>
    </button>

    <div v-if="canManage" class="movie-actions">
      <q-btn
        dense
        flat
        round
        icon="edit"
        color="grey-4"
        aria-label="แก้ไขหนัง"
        :to="{ name: 'movie-edit', params: { id: movie.id } }"
      />
      <q-btn
        dense
        flat
        round
        icon="delete_outline"
        color="negative"
        aria-label="ลบหนัง"
        @click="confirmingDelete = true"
      />
    </div>

    <q-dialog v-model="confirmingDelete">
      <q-card class="delete-dialog">
        <q-card-section class="text-h6">ลบเรื่องนี้ออกจากรายการ?</q-card-section>
        <q-card-section class="text-grey-5">
          “{{ movie.title }}” จะถูกลบออกจากรายการของคุณ
        </q-card-section>
        <q-card-actions align="right">
          <q-btn v-close-popup flat label="ยกเลิก" no-caps />
          <q-btn
            v-close-popup
            unelevated
            color="negative"
            label="ลบหนัง"
            no-caps
            @click="$emit('remove')"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <MoviePreviewDialog v-model="previewOpen" :movie="movie" />
  </q-card>
</template>

<script setup>
import { computed, ref } from 'vue'
import MoviePreviewDialog from '@/components/MoviePreviewDialog.vue'
import { useMovieStore } from '@/stores/movie-store.js'

const props = defineProps({
  movie: { type: Object, required: true },
})

defineEmits(['remove'])

const movies = useMovieStore()
const canManage = computed(() => movies.canManageMovie(props.movie))
const isAdmin = computed(() => movies.isAdmin)
const confirmingDelete = ref(false)
const previewOpen = ref(false)
const ratingLabel = computed(() =>
  Number(props.movie.rating) > 0 ? `${Number(props.movie.rating).toFixed(1)}/10` : '—',
)
const fallbackPoster =
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80'
</script>

<style scoped>
.movie-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  background: #17191f;
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

.movie-card:hover,
.movie-card:focus-within {
  border-color: rgba(255, 84, 75, 0.34);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.28);
  transform: translateY(-3px);
}

.movie-preview-button {
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  text-align: left;
}

.movie-preview-button:focus-visible {
  outline: 2px solid #ff625a;
  outline-offset: -3px;
}

.poster-wrap {
  position: relative;
  overflow: hidden;
  height: clamp(190px, 54vw, 220px);
  background: #101114;
}

.poster-backdrop,
.movie-poster {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.poster-backdrop {
  filter: blur(12px) brightness(0.42);
  transform: scale(1.08);
}

.movie-poster {
  z-index: 1;
  background: rgba(0, 0, 0, 0.12);
}

.poster-overlay {
  position: absolute;
  z-index: 2;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.64), transparent 70%);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  opacity: 0;
  transition: opacity 180ms ease;
}

.poster-overlay .q-icon {
  font-size: 2.4rem;
}

.movie-preview-button:hover .poster-overlay,
.movie-preview-button:focus-visible .poster-overlay {
  opacity: 1;
}

.movie-details {
  padding: 0.9rem 0.95rem 0.35rem;
}

.movie-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.45rem;
}

.movie-title {
  min-width: 0;
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.35;
}

.movie-rating {
  flex: 0 0 auto;
  white-space: nowrap;
  color: #dedfe4;
  font-size: 0.72rem;
}

.movie-meta,
.movie-owner,
.movie-description {
  color: #a4a8b3;
  font-size: 0.74rem;
  line-height: 1.5;
}

.movie-owner {
  margin-top: 0.3rem;
  color: #ff9a91;
  font-size: 0.72rem;
}

.movie-meta {
  margin-top: 0.35rem;
}

.movie-description {
  min-height: 2.2rem;
  margin: 0.55rem 0 0;
}

.movie-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: auto;
  padding: 0 0.7rem 0.65rem;
}

.delete-dialog {
  min-width: min(360px, 90vw);
  border-radius: 16px;
  background: #17191f;
}
</style>
