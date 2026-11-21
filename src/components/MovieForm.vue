<template>
  <q-form class="movie-form" @submit="submit">
    <div class="form-grid">
      <q-input
        v-model="form.title"
        outlined
        dark
        color="negative"
        label="ชื่อหนัง"
        :rules="[(value) => Boolean(value?.trim()) || 'กรุณากรอกชื่อหนัง']"
      />
      <q-input
        v-model="form.year"
        outlined
        dark
        color="negative"
        label="ปีที่ฉาย"
        type="number"
        min="1888"
      />
      <q-input
        v-model="form.genre"
        outlined
        dark
        color="negative"
        label="แนวหนัง"
        placeholder="เช่น Drama, Sci-Fi"
      />
      <q-input
        v-model="form.rating"
        outlined
        dark
        color="negative"
        label="คะแนน (0–10)"
        type="number"
        min="0"
        max="10"
        step="0.1"
      />
      <q-input v-model="form.poster" outlined dark color="negative" label="ลิงก์โปสเตอร์" type="url" />
      <q-input
        v-model="form.trailerUrl"
        outlined
        dark
        color="negative"
        label="ลิงก์ตัวอย่างหนัง"
        type="url"
        placeholder="เว้นว่างเพื่อค้นหาตัวอย่างบน YouTube"
      />
      <q-input
        v-model="form.description"
        class="form-description"
        outlined
        dark
        color="negative"
        label="เรื่องย่อ"
        type="textarea"
        autogrow
      />
    </div>

    <div class="form-actions">
      <q-btn class="cancel-button" flat label="ยกเลิก" no-caps :to="{ name: 'watchlist' }" />
      <q-btn class="save-button" unelevated icon="check" label="บันทึกหนัง" type="submit" no-caps />
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
  column-gap: 20px;
  row-gap: 18px;
  align-items: start;
}

.form-grid :deep(.q-field) {
  width: 100%;
  min-width: 0;
}

.form-grid :deep(.q-field__control) {
  min-height: 58px;
  border-radius: 12px;
  background: rgba(9, 10, 14, 0.32);
  transition: background-color 180ms ease;
}

.form-grid :deep(.q-field--outlined .q-field__control:before) {
  border-color: rgba(255, 255, 255, 0.13);
}

.form-grid :deep(.q-field--outlined .q-field__control:hover:before) {
  border-color: rgba(255, 84, 75, 0.5);
}

.form-grid :deep(.q-field__label) {
  color: #b6b8c0;
}

.form-grid :deep(.q-field--focused .q-field__label) {
  color: #ff7770;
}

.form-grid :deep(.q-field__native) {
  color: #f5f5f7;
}

.form-grid :deep(.q-field__control:hover) {
  background: rgba(9, 10, 14, 0.52);
}

.form-grid :deep(.q-field__bottom) {
  padding-top: 6px;
}

.form-description :deep(.q-field__control) {
  min-height: 128px;
  align-items: flex-start;
}

.form-description :deep(textarea.q-field__native) {
  min-height: 88px;
  line-height: 1.6;
}

.form-description {
  grid-column: 1 / -1;
}

.form-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 1.4rem;
  padding-top: 1.2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.cancel-button,
.save-button {
  min-height: 44px;
  border-radius: 999px;
  font-weight: 700;
}

.cancel-button {
  padding: 0 1rem;
  color: #b6b8c0;
}

.save-button {
  padding: 0 1.3rem;
  background: linear-gradient(135deg, #ff625a, #d9343d);
  color: #fff;
  box-shadow: 0 8px 20px rgba(217, 52, 61, 0.24);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;
}

.save-button:hover {
  box-shadow: 0 12px 26px rgba(217, 52, 61, 0.34);
  transform: translateY(-2px);
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
    row-gap: 14px;
  }

  .form-description {
    grid-column: auto;
  }
}

@media (max-width: 420px) {
  .form-actions {
    align-items: stretch;
    flex-direction: column-reverse;
  }

  .cancel-button,
  .save-button {
    width: 100%;
  }
}
</style>
