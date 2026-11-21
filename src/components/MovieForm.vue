<template>
  <q-form class="movie-form" @submit="submit">
    <div class="form-grid">
      <q-input
        v-model="form.title"
        outlined
        dark
        label="ชื่อหนัง"
        :rules="[(value) => Boolean(value?.trim()) || 'กรุณากรอกชื่อหนัง']"
      />
      <q-input v-model="form.year" outlined dark label="ปีที่ฉาย" type="number" min="1888" />
      <q-input v-model="form.genre" outlined dark label="แนวหนัง" placeholder="เช่น Drama, Sci-Fi" />
      <q-input
        v-model="form.rating"
        outlined
        dark
        label="คะแนน (0–10)"
        type="number"
        min="0"
        max="10"
        step="0.1"
      />
      <q-input v-model="form.poster" outlined dark label="ลิงก์โปสเตอร์" type="url" />
      <q-input
        v-model="form.trailerUrl"
        outlined
        dark
        label="ลิงก์ตัวอย่างหนัง"
        type="url"
        placeholder="เว้นว่างเพื่อค้นหาตัวอย่างบน YouTube"
      />
      <q-input
        v-model="form.description"
        class="form-description"
        outlined
        dark
        label="เรื่องย่อ"
        type="textarea"
        autogrow
      />
    </div>

    <div class="row justify-end q-gutter-sm q-mt-lg">
      <q-btn flat label="ยกเลิก" no-caps :to="{ name: 'watchlist' }" />
      <q-btn unelevated color="primary" icon="check" label="บันทึกหนัง" type="submit" no-caps />
    </div>
  </q-form>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  movie: { type: Object, default: null },
})
const emit = defineEmits(['submit'])
const blankMovie = () => ({
  title: '',
  year: '',
  genre: '',
  rating: 0,
  poster: '',
  trailerUrl: '',
  description: '',
})
const form = reactive(blankMovie())

watch(
  () => props.movie,
  (movie) => {
    const values = { ...(movie || {}) }
    delete values.status
    Object.assign(form, blankMovie(), values)
  },
  { immediate: true },
)

function submit() {
  emit('submit', {
    title: form.title.trim(),
    year: form.year === '' ? '' : Number(form.year),
    rating: form.rating === '' ? 0 : Number(form.rating),
    genre: form.genre,
    poster: form.poster,
    trailerUrl: form.trailerUrl,
    description: form.description,
  })
}
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  column-gap: 18px;
  row-gap: 18px;

  align-items: start;
}

.form-grid :deep(.q-field) {
  width: 100%;
  min-width: 0;
}

.form-grid :deep(.q-field__control) {
  min-height: 60px;
}

.form-grid :deep(.q-field__bottom) {
  padding-top: 6px;
}

.form-description {
  grid-column: 1 / -1;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
    row-gap: 16px;
  }

  .form-description {
    grid-column: auto;
  }
}
</style>
