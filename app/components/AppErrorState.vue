<template>
  <div class="error-shell">
    <div class="error-glow error-glow-left" />
    <div class="error-glow error-glow-right" />

    <div class="error-card">
      <p class="error-kicker">{{ statusLabel }}</p>
      <div class="error-code">{{ normalizedStatusCode }}</div>
      <h1 class="error-title">{{ resolvedTitle }}</h1>
      <p class="error-description">{{ resolvedMessage }}</p>

      <div class="error-actions">
        <button
          v-if="showRetry"
          type="button"
          class="error-button error-button-primary"
          @click="$emit('retry')"
        >
          Try Again
        </button>
        <button
          v-if="showBack"
          type="button"
          class="error-button error-button-secondary"
          @click="$emit('back')"
        >
          Go Back
        </button>
        <NuxtLink
          :to="homeTo"
          class="error-button"
          :class="showRetry ? 'error-button-secondary' : 'error-button-primary'"
        >
          Back to Home
        </NuxtLink>
      </div>

      <div v-if="showSearch" class="error-search">
        <label class="error-search-label" for="error-search-input">
          Search products and services
        </label>
        <div class="error-search-row">
          <input
            id="error-search-input"
            v-model="searchQuery"
            type="text"
            placeholder="Search solar products, batteries, inverters..."
            @keyup.enter="emitSearch"
          >
          <button type="button" class="error-search-button" @click="emitSearch">
            Search
          </button>
        </div>
      </div>

      <div class="error-links">
        <p class="error-links-title">Popular pages</p>
        <div class="error-links-grid">
          <NuxtLink
            v-for="link in quickLinks"
            :key="link.to"
            :to="link.to"
            class="error-link-chip"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface QuickLink {
  label: string
  to: string
}

interface Props {
  statusCode?: number
  title?: string
  message?: string
  homeTo?: string
  showRetry?: boolean
  showBack?: boolean
  showSearch?: boolean
  quickLinks?: QuickLink[]
}

const props = withDefaults(defineProps<Props>(), {
  statusCode: 500,
  title: '',
  message: '',
  homeTo: '/',
  showRetry: false,
  showBack: true,
  showSearch: false,
  quickLinks: () => ([
    { label: 'Shop Products', to: '/products' },
    { label: 'Solar Calculator', to: '/calculator' },
    { label: 'Get a Quote', to: '/quote' },
    { label: 'Contact Us', to: '/contact' }
  ])
})

defineEmits<{
  retry: []
  back: []
  search: [query: string]
}>()

const searchQuery = ref('')

const normalizedStatusCode = computed(() => props.statusCode || 500)

const statusLabel = computed(() => {
  if (normalizedStatusCode.value === 404) return '404 Error'
  if (normalizedStatusCode.value >= 500) return 'Server Error'
  return 'Unexpected Error'
})

const resolvedTitle = computed(() => {
  if (props.title) return props.title
  if (normalizedStatusCode.value === 404) return 'Page Not Found'
  if (normalizedStatusCode.value >= 500) return 'Something Went Wrong'
  return 'We Hit a Problem'
})

const resolvedMessage = computed(() => {
  if (props.message) return props.message
  if (normalizedStatusCode.value === 404) {
    return 'The page you requested is unavailable. You can head back home or jump to one of the sections below.'
  }

  return 'An unexpected error interrupted this page. Please try again, or return to a stable part of the site.'
})

const emit = defineEmits<{
  retry: []
  back: []
  search: [query: string]
}>()

const emitSearch = () => {
  const query = searchQuery.value.trim()
  if (!query) return
  emit('search', query)
}
</script>

<style scoped>
.error-shell {
  position: relative;
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1.5rem;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(0, 40, 136, 0.12), transparent 32%),
    radial-gradient(circle at bottom right, rgba(249, 115, 22, 0.12), transparent 28%),
    linear-gradient(145deg, #f6f8fc 0%, #ffffff 50%, #eef4ff 100%);
}

.error-glow {
  position: absolute;
  width: 18rem;
  height: 18rem;
  border-radius: 999px;
  filter: blur(60px);
  opacity: 0.45;
}

.error-glow-left {
  top: -4rem;
  left: -2rem;
  background: rgba(14, 165, 233, 0.24);
}

.error-glow-right {
  right: -4rem;
  bottom: -6rem;
  background: rgba(249, 115, 22, 0.18);
}

.error-card {
  position: relative;
  z-index: 1;
  width: min(100%, 44rem);
  padding: 2.5rem;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 2rem;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(18px);
  text-align: center;
}

.error-kicker {
  margin-bottom: 0.75rem;
  color: #f97316;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.error-code {
  font-size: clamp(4.5rem, 16vw, 8rem);
  line-height: 0.9;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.06em;
}

.error-title {
  margin-top: 1rem;
  color: #0f172a;
  font-size: clamp(1.8rem, 4vw, 2.75rem);
  font-weight: 700;
  letter-spacing: -0.04em;
}

.error-description {
  max-width: 34rem;
  margin: 1rem auto 0;
  color: #475569;
  font-size: 1rem;
  line-height: 1.75;
}

.error-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  justify-content: center;
  margin-top: 2rem;
}

.error-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 11rem;
  padding: 0.9rem 1.4rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.error-button:hover {
  transform: translateY(-1px);
}

.error-button-primary {
  background: linear-gradient(135deg, #002888 0%, #1d4ed8 100%);
  color: #ffffff;
  box-shadow: 0 18px 30px rgba(0, 40, 136, 0.22);
}

.error-button-secondary {
  background: #ffffff;
  color: #0f172a;
  border-color: rgba(148, 163, 184, 0.35);
}

.error-search {
  margin-top: 2rem;
  padding: 1.25rem;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 1.25rem;
  background: rgba(248, 250, 252, 0.8);
}

.error-search-label {
  display: block;
  margin-bottom: 0.75rem;
  color: #334155;
  font-size: 0.9rem;
  font-weight: 600;
}

.error-search-row {
  display: flex;
  gap: 0.75rem;
}

.error-search-row input {
  flex: 1;
  min-width: 0;
  padding: 0.9rem 1rem;
  border: 1px solid rgba(148, 163, 184, 0.4);
  border-radius: 999px;
  background: #ffffff;
  color: #0f172a;
  outline: none;
}

.error-search-row input:focus {
  border-color: #1d4ed8;
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.12);
}

.error-search-button {
  padding: 0.9rem 1.2rem;
  border: none;
  border-radius: 999px;
  background: #0f172a;
  color: #ffffff;
  font-weight: 600;
}

.error-links {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(148, 163, 184, 0.22);
}

.error-links-title {
  color: #64748b;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.error-links-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 1rem;
}

.error-link-chip {
  padding: 0.7rem 1rem;
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 999px;
  background: #ffffff;
  color: #0f172a;
  font-size: 0.92rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.error-link-chip:hover {
  transform: translateY(-1px);
  border-color: #1d4ed8;
  color: #1d4ed8;
}

@media (max-width: 640px) {
  .error-card {
    padding: 2rem 1.25rem;
    border-radius: 1.5rem;
  }

  .error-actions,
  .error-search-row {
    flex-direction: column;
  }

  .error-button,
  .error-search-button {
    width: 100%;
  }
}
</style>
