<template>
  <q-card class="stat-card">
    <q-card-section class="row items-start justify-between no-wrap">
      <div>
        <div class="stat-label">{{ label }}</div>
        <div class="stat-value">{{ value }}</div>
        <div class="stat-helper">{{ helper }}</div>
      </div>
      <q-icon :name="icon" class="stat-icon" :class="`text-${color}`" />
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  helper: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, default: 'primary' },
})
</script>

<style scoped>
.stat-card {
  height: 100%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  background: #17191f;
}

.stat-label,
.stat-helper {
  color: #a4a8b3;
  font-size: 0.85rem;
}

.stat-value {
  margin: 0.3rem 0;
  font-size: 2rem;
  font-weight: 700;
}

.stat-icon {
  font-size: 1.8rem;
}
</style>
