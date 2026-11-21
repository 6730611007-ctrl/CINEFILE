<template>
  <q-page class="profile-page">
    <div class="page-width">
      <h1>โปรไฟล์</h1>
      <p class="intro">ข้อมูลบัญชีและการตั้งค่าของคุณ</p>

      <q-card class="profile-card">
        <q-card-section class="row items-center q-gutter-md">
          <q-avatar size="76px" color="primary" text-color="white" class="profile-avatar">
            {{ initials }}
          </q-avatar>
          <div>
            <div class="profile-name">{{ auth.user?.name }}</div>
            <div class="profile-email">
              {{ auth.user?.email || auth.user?.username }}
            </div>
          </div>
        </q-card-section>
        <q-separator dark />
        <q-card-section class="profile-info">
          <div>
            <span>ชื่อที่ใช้แสดง</span>
            <strong>{{ auth.user?.name || '—' }}</strong>
          </div>
          <div>
            <span>อีเมลหรือชื่อผู้ใช้</span>
            <strong>{{ auth.user?.email || auth.user?.username || '—' }}</strong>
          </div>
          <div>
            <span>สิทธิ์บัญชี</span>
            <strong>{{ auth.user?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้ทั่วไป' }}</strong>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            outline
            color="negative"
            icon="logout"
            label="ออกจากระบบ"
            no-caps
            @click="logout"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth-store.js'

const router = useRouter()
const $q = useQuasar()
const auth = useAuthStore()
const initials = computed(() =>
  (auth.user?.name || 'U')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join(''),
)

async function logout() {
  try {
    await auth.logout()
    await router.replace({ name: 'dashboard' })
  } catch {
    $q.notify({ type: 'negative', message: 'ออกจากระบบไม่สำเร็จ กรุณาลองอีกครั้ง' })
  }
}
</script>

<style scoped>
.page-width {
  width: min(840px, calc(100% - 40px));
  margin: 0 auto;
}

.profile-page {
  min-height: 100vh;
  width: 100%;
  background-image:
    linear-gradient(rgba(8, 8, 14, 0.72), rgba(8, 8, 14, 0.82)), url('/image/cinema3-bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
}

h1 {
  margin: 0.4rem 0;
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 750;
  letter-spacing: -0.04em;
}

.intro {
  margin: 0 0 1.6rem;
  color: #a4a8b3;
}

.profile-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  background: #17191f;
}

.profile-avatar {
  font-size: 1.4rem;
  font-weight: 700;
}

.profile-name {
  font-size: 1.2rem;
  font-weight: 700;
}

.profile-email,
.profile-info span {
  color: #a4a8b3;
}

.profile-info {
  display: grid;
  gap: 1.3rem;
}

.profile-info div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.profile-info strong {
  text-align: right;
  font-weight: 500;
}

@media (max-width: 600px) {
  .page-width {
    width: calc(100% - 28px);
  }

  .profile-page {
    padding-top: 2rem;
  }

  .profile-info div {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.2rem;
  }

  .profile-info strong {
    text-align: left;
  }
}
</style>
