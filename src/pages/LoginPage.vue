<template>
  <q-layout view="lHh Lpr lFf" class="auth-layout">
    <q-page-container>
      <q-page class="auth-page">
        <div class="auth-shell">
          <section class="auth-art">
            <div class="brand">
              <span>CINEFILE</span>
            </div>
            <div class="art-copy">
              <div class="eyebrow">A LITTLE SPACE FOR GREAT FILMS</div>
              <h1>ทุกเรื่องที่คุณรัก<br />อยู่ในที่เดียว</h1>
              <p>ค้นหาและเก็บหนังเรื่องโปรดไว้ในคอลเลกชันของคุณ</p>
            </div>
            <div class="film-strip">
              <q-icon name="local_movies" /><span>YOUR FILMS. YOUR STORY</span>
            </div>
          </section>

          <section class="auth-panel">
            <div class="auth-card">
              <div class="mobile-brand brand">
                <q-icon name="movie_filter" />
                <span>CINEFILE</span>
              </div>
              <q-btn
                flat
                no-caps
                icon="arrow_back"
                label="กลับหน้าหลัก"
                class="back-home-btn"
                @click="goHome"
              />
              <h2>ยินดีต้อนรับ</h2>
              <p class="auth-subtitle">เข้าสู่ระบบหรือสร้างบัญชีเพื่อเริ่มต้น</p>

              <q-tabs
                v-model="mode"
                class="auth-tabs"
                active-color="primary"
                indicator-color="primary"
                align="left"
                no-caps
              >
                <q-tab name="login" label="เข้าสู่ระบบ" />
                <q-tab name="register" label="สมัครสมาชิก" />
              </q-tabs>

              <q-tab-panels v-model="mode" animated class="auth-panels">
                <q-tab-panel name="login" class="q-pa-none">
                  <q-form class="auth-form" @submit="submitLogin">
                    <q-input
                      v-model="loginForm.identifier"
                      outlined
                      dark
                      color="white"
                      bg-color="transparent"
                      label="อีเมลหรือชื่อผู้ใช้"
                      autocomplete="username"
                      lazy-rules
                      :rules="[(value) => Boolean(value?.trim()) || 'กรุณากรอกอีเมลหรือชื่อผู้ใช้']"
                    />
                    <q-input
                      v-model="loginForm.password"
                      outlined
                      dark
                      color="white"
                      bg-color="transparent"
                      label="รหัสผ่าน"
                      :type="showPassword ? 'text' : 'password'"
                      autocomplete="current-password"
                      lazy-rules
                      :rules="[(value) => Boolean(value) || 'กรุณากรอกรหัสผ่าน']"
                    >
                      <template #append>
                        <q-icon
                          :name="showPassword ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="showPassword = !showPassword"
                        />
                      </template>
                    </q-input>
                    <q-btn
                      class="full-width submit-button"
                      unelevated
                      color="primary"
                      label="เข้าสู่ระบบ"
                      type="submit"
                      no-caps
                      :loading="loading"
                    />
                  </q-form>
                </q-tab-panel>

                <q-tab-panel name="register" class="q-pa-none">
                  <q-form class="auth-form" @submit="submitRegister">
                    <q-input
                      v-model="registerForm.name"
                      outlined
                      dark
                      color="white"
                      bg-color="transparent"
                      label="ชื่อที่ใช้แสดง"
                      autocomplete="name"
                      lazy-rules
                      :rules="[(value) => Boolean(value?.trim()) || 'กรุณากรอกชื่อ']"
                    />
                    <q-input
                      v-model="registerForm.email"
                      outlined
                      dark
                      color="white"
                      bg-color="transparent"
                      label="อีเมล"
                      type="email"
                      autocomplete="email"
                      lazy-rules
                      :rules="[(value) => Boolean(value) || 'กรุณากรอกอีเมล']"
                    />
                    <q-input
                      v-model="registerForm.password"
                      outlined
                      dark
                      color="white"
                      bg-color="transparent"
                      label="รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)"
                      type="password"
                      autocomplete="new-password"
                      lazy-rules
                      :rules="[(value) => value?.length >= 8 || 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร']"
                    />
                    <q-btn
                      class="full-width submit-button"
                      unelevated
                      color="primary"
                      label="สร้างบัญชี"
                      type="submit"
                      no-caps
                      :loading="loading"
                    />
                  </q-form>
                </q-tab-panel>
              </q-tab-panels>
              <div class="mock-notice">
                <q-icon name="info" />
                ระบบทดลองใช้ MockAPI ซึ่งไม่เข้ารหัสรหัสผ่านหรือบังคับสิทธิ์ฝั่งเซิร์ฟเวอร์
              </div>
            </div>
          </section>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth-store.js'
import { getApiErrorMessage } from '@/utils/api-error.js'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const mode = ref(route.query.mode === 'register' ? 'register' : 'login')
const loading = ref(false)
const showPassword = ref(false)
const loginForm = reactive({ identifier: '', password: '' })
const registerForm = reactive({ name: '', email: '', password: '' })
const goHome = () => {
  router.push('/')
}

async function submitLogin() {
  loading.value = true
  try {
    await auth.login(loginForm)
    await redirectAfterAuth()
  } catch (error) {
    $q.notify({ type: 'negative', message: getApiErrorMessage(error) })
  } finally {
    loading.value = false
  }
}

async function submitRegister() {
  loading.value = true
  try {
    await auth.register(registerForm)
    await redirectAfterAuth()
  } catch (error) {
    $q.notify({ type: 'negative', message: getApiErrorMessage(error) })
  } finally {
    loading.value = false
  }
}

async function redirectAfterAuth() {
  const requestedRedirect = route.query.redirect
  const redirect =
    typeof requestedRedirect === 'string' &&
    requestedRedirect.startsWith('/') &&
    !requestedRedirect.startsWith('//')
      ? requestedRedirect
      : '/'
  await router.replace(redirect)
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  padding: 2rem;
}

.auth-layout {
  min-height: 100vh;
  width: 100%;
  background-image:
    linear-gradient(rgba(8, 8, 14, 0.72), rgba(8, 8, 14, 0.82)), url('/image/cinema4-bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
}

.auth-shell {
  display: grid;
  width: min(1000px, 100%);
  min-height: min(680px, calc(100vh - 180px));
  grid-template-columns: 1fr 1fr;
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 26px;
  background: linear-gradient(
    180deg,
    rgba(35, 24, 28, 0.92) 0%,
    rgba(24, 18, 24, 0.96) 55%,
    rgba(14, 14, 20, 0.98) 100%
  );
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.32);
}

.auth-art {
  position: relative;
  padding: 56px 48px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100%;
  color: #f5f2ee;

  background: linear-gradient(
    180deg,
    rgba(35, 24, 28, 0.92) 0%,
    rgba(24, 18, 24, 0.96) 55%,
    rgba(14, 14, 20, 0.98) 100%
  );
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #f5f5f7;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.brand .q-icon {
  color: #b7aaff;
  font-size: 1.6rem;
}

.art-copy {
  max-width: 400px;
}

.eyebrow {
  color: #c4b8ff;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.art-copy h1 {
  margin: 1rem 0;
  font-size: clamp(2.4rem, 5vw, 3.8rem);
  line-height: 1.12;
  letter-spacing: -0.05em;
}

.art-copy p,
.auth-subtitle {
  color: #a4a8b3;
}

.film-strip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #a4a8b3;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
}

.film-strip .q-icon {
  color: #b7aaff;
}

.auth-panel {
  display: grid;
  align-items: center;
  padding: 2.5rem;
}

.auth-card {
  width: min(360px, 100%);
  margin: 0 auto;
}

.auth-card h2 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.auth-subtitle {
  margin: 0.4rem 0 1.5rem;
  font-size: 0.9rem;
}

.auth-tabs {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.auth-panels {
  margin-top: 1.2rem;
  background: transparent;
}

.auth-form {
  display: grid;
  gap: 0.3rem;
}

.submit-button {
  min-height: 46px;
  margin-top: 0.6rem;
}

.mock-notice {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 1.4rem;
  color: #8d919e;
  font-size: 0.75rem;
  line-height: 1.5;
}

.mock-notice .q-icon {
  flex: none;
  color: #a897ff;
}

.mobile-brand {
  display: none;
}

.back-home-btn {
  position: absolute;
  top: 24px;
  right: 30px;
  z-index: 10;
  color: white;
  background: red;
}

@media (max-width: 760px) {
  .auth-page {
    padding: 1rem;
  }

  .auth-shell {
    min-height: 0;
    grid-template-columns: 1fr;
    border-radius: 20px;
  }

  .auth-art {
    display: none;
  }

  .auth-panel {
    padding: 2rem 1.4rem;
  }

  .mobile-brand {
    display: flex;
    margin-bottom: 1.8rem;

    .back-home-btn {
      top: 15px;
      right: 15px;
      font-size: 12px;
    }
  }
}
</style>
