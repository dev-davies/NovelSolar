<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-slate-50 py-20 lg:py-32 relative overflow-hidden">
      <!-- Decorative Elements -->
      <div
        class="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-100/50 blur-3xl mix-blend-multiply opacity-70"
      />
      <div
        class="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-orange-100/50 blur-3xl mix-blend-multiply opacity-70"
      />

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
          Build the Future of
          <span class="text-[#002888] relative inline-block"
            >Energy<svg
              class="absolute -bottom-2 left-0 w-full h-3 text-[#ea580c] opacity-50"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
            >
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="4" fill="transparent" /></svg
          ></span>
        </h1>
        <p class="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Join a team of passionate engineers, innovators, and thinkers dedicated to making sustainable energy
          accessible across Nigeria.
        </p>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-24 bg-white relative">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Empty State Container -->
        <div
          class="bg-white rounded-3xl border border-slate-200 p-10 md:p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden"
        >
          <!-- Subtle background pattern -->
          <div
            class="absolute inset-0 opacity-[0.03]"
            style="background-image: radial-gradient(#002888 1px, transparent 1px); background-size: 24px 24px"
          />

          <div class="relative z-10 flex flex-col items-center">
            <!-- Icon -->
            <div
              class="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-8 border-8 border-white shadow-sm ring-1 ring-slate-100"
            >
              <span class="material-symbols-outlined text-4xl text-[#002888]">work_history</span>
            </div>

            <h2 class="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">No Open Positions</h2>

            <p class="text-slate-500 mb-8 max-w-lg text-center leading-relaxed">
              We currently don't have any open roles. However, we're always looking for exceptional talent. Check back
              soon or follow us on our social channels for future updates!
            </p>

            <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <NuxtLink
                to="/contact"
                class="inline-flex items-center justify-center gap-2 bg-[#002888] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-900 transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                Contact Us
                <span class="material-symbols-outlined text-sm">mail</span>
              </NuxtLink>
              <NuxtLink
                to="/"
                class="inline-flex items-center justify-center gap-2 bg-slate-50 text-slate-700 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-100 border border-slate-200 transition-all active:scale-95"
              >
                Back to Home
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Culture mini-section -->
        <div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div class="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-[#ea580c]">
              <span class="material-symbols-outlined">bolt</span>
            </div>
            <h3 class="font-bold text-slate-900 mb-2">Impact Driven</h3>
            <p class="text-sm text-slate-500">
              Every role directly contributes to powering homes and businesses with clean energy.
            </p>
          </div>
          <div>
            <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-[#002888]">
              <span class="material-symbols-outlined">psychology</span>
            </div>
            <h3 class="font-bold text-slate-900 mb-2">Continuous Growth</h3>
            <p class="text-sm text-slate-500">
              Learn from industry experts and grow alongside a fast-scaling tech and energy company.
            </p>
          </div>
          <div>
            <div
              class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-emerald-600"
            >
              <span class="material-symbols-outlined">diversity_3</span>
            </div>
            <h3 class="font-bold text-slate-900 mb-2">Inclusive Culture</h3>
            <p class="text-sm text-slate-500">
              We believe diverse perspectives drive the best engineering and business solutions.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#imports'

useHead({
  title: 'Careers | NovelSolar',
  meta: [
    {
      name: 'description',
      content: 'Join the NovelSolar team and help us build the future of sustainable energy in Nigeria.',
    },
  ],
})
</script>
