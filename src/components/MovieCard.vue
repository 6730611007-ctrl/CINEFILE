<template>
  <q-card class="movie-card">
    <div class="poster-wrap">
      <q-img
        class="poster-backdrop"
        :src="movie.poster || fallbackPoster"
        alt=""
        aria-hidden="true"
        ratio="0.72"
        fit="cover"
      />
      <q-img
        class="movie-poster"
        :src="movie.poster || fallbackPoster"
        :alt="`${movie.title} poster`"
        ratio="0.72"
        fit="contain"
      />
    </div>

    <q-card-section class="movie-details">
      <div class="row items-start justify-between no-wrap">
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
      <div v-if="canManage" class="row items-center q-gutter-sm q-mt-md">
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
    </q-card-section>

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
  </q-card>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useMovieStore } from '@/stores/movie-store.js'

const props = defineProps({
  movie: { type: Object, required: true },
})

defineEmits(['remove'])

const movies = useMovieStore()
const canManage = computed(() => movies.canManageMovie(props.movie))
const isAdmin = computed(() => movies.isAdmin)
const confirmingDelete = ref(false)
const ratingLabel = computed(() =>
  Number(props.movie.rating) > 0 ? `${Number(props.movie.rating).toFixed(1)}/10` : '—',
)
const fallbackPoster =
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80'
</script>

<style scoped>
.movie-card {
  overflow: hidden;
  height: 100%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  background: #17191f;
}

.poster-wrap {
  position: relative;
  overflow: hidden;
  aspect-ratio: 0.72;
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

.movie-details {
  padding: 1rem;
}

.movie-title {
  max-width: 65%;
  font-size: 1.05rem;
  font-weight: 700;
}

.movie-rating {
  white-space: nowrap;
  color: #dedfe4;
  font-size: 0.82rem;
}

.movie-meta,
.movie-owner,
.movie-description {
  color: #a4a8b3;
  font-size: 0.82rem;
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
  min-height: 2.4rem;
  margin: 0.75rem 0 0;
}

.delete-dialog {
  min-width: min(360px, 90vw);
  border-radius: 16px;
  background: #17191f;
}
</style>
