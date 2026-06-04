<template>
  <div class="bg-slate-50 min-h-screen">
    <!-- Hero Section -->
    <section class="relative bg-[#002888] py-24 lg:py-32 overflow-hidden">
      <div class="absolute inset-0 opacity-10 pointer-events-none">
        <div class="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div
          class="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"
        />
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6">About Novel Solar</h1>
        <p class="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed font-medium">
          Empowering households and businesses across the nation to generate their own clean energy.
        </p>
      </div>
    </section>

    <!-- Our Network Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-[#002888] text-sm font-black uppercase tracking-widest mb-3">Our Network</h2>
            <h3 class="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">
              Empowering clean energy generation nationwide.
            </h3>
            <p class="text-slate-600 text-lg leading-relaxed mb-6">
              Our mission is to empower households and businesses across the nation to generate their own clean energy
              through solar power. We are dedicated to achieving this goal by assisting each customer individually.
            </p>
            <p class="text-slate-600 text-lg leading-relaxed">
              With a network of over <strong>30 stores</strong> strategically located throughout Nigeria, a team of
              customer service professionals, and a group of highly trained engineers, we are fully committed to
              delivering exceptional value through our premium products and services.
            </p>
          </div>
          <div class="relative">
            <div class="aspect-square bg-slate-100 rounded-3xl overflow-hidden shadow-xl shadow-slate-200">
              <img src="/images/PowerAuditEngineer.png" alt="Novel Solar Network" class="w-full h-full object-cover" />
            </div>
            <div
              class="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden lg:flex flex-col gap-1 items-center justify-center min-w-[140px]"
            >
              <span class="text-[#ea580c] font-black text-4xl">30+</span>
              <span class="text-slate-500 font-bold text-xs uppercase tracking-wider">Stores Nationwide</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Services Section -->
    <section class="py-20 bg-slate-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-[#002888] text-sm font-black uppercase tracking-widest mb-3">Our Services</h2>
        <h3 class="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">
          Reliable and sustainable energy solutions
        </h3>

        <div class="space-y-6 text-slate-600 text-lg leading-relaxed text-left">
          <p>
            Our solar company is committed to providing reliable and sustainable energy solutions to our customers. We
            believe that every individual and business should have access to affordable and clean energy, and we strive
            to make this a reality for all.
          </p>
          <p>
            Our team of engineers and experts are well-equipped to provide customized solutions tailored to meet the
            specific energy needs of our customers. We offer a range of products and services, including solar panels,
            inverters, and batteries, all of which are designed to deliver maximum efficiency and reliability.
          </p>
          <p>
            At our solar company, we understand that transitioning to solar energy can be a significant decision. That's
            why we are dedicated to providing comprehensive support to our customers every step of the way. From initial
            consultations to installation and maintenance, our team is here to ensure that the transition is seamless
            and stress-free.
          </p>
        </div>
      </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Why Choose Us?</h2>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Reason 1 -->
          <div
            class="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-lg transition-shadow duration-300"
          >
            <div class="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-[#002888] mb-6">
              <span class="material-symbols-outlined text-3xl">engineering</span>
            </div>
            <h4 class="text-xl font-black text-slate-900 mb-3">Highly Trained Engineers</h4>
            <p class="text-slate-600 leading-relaxed">
              Our team comprises skilled engineers with technical expertise in solar energy and installation, supported
              by excellent customer service professionals.
            </p>
          </div>

          <!-- Reason 2 -->
          <div
            class="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-lg transition-shadow duration-300"
          >
            <div class="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-[#ea580c] mb-6">
              <span class="material-symbols-outlined text-3xl">support_agent</span>
            </div>
            <h4 class="text-xl font-black text-slate-900 mb-3">Experienced Post-Sales</h4>
            <p class="text-slate-600 leading-relaxed">
              With our experienced sales team and comprehensive post-sales services, we are committed to providing
              continued support and assistance even after purchase.
            </p>
          </div>

          <!-- Reason 3 -->
          <div
            class="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-lg transition-shadow duration-300"
          >
            <div class="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
              <span class="material-symbols-outlined text-3xl">verified</span>
            </div>
            <h4 class="text-xl font-black text-slate-900 mb-3">Reliable Warranty</h4>
            <p class="text-slate-600 leading-relaxed">
              To offer our customers additional assurance and protection, we provide reliable warranty coverage for all
              our products and installations.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 lg:py-24 bg-slate-50">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="bg-[#002888] rounded-3xl p-10 md:p-16 text-center shadow-xl shadow-blue-900/20 relative overflow-hidden"
        >
          <div
            class="absolute inset-0 opacity-10"
            style="background-image: radial-gradient(white 1px, transparent 1px); background-size: 24px 24px"
          />

          <div class="relative z-10">
            <h2 class="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight">
              Want to Switch to Solar Energy?
            </h2>
            <p class="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Make the transition seamless and stress-free. Let our team of experts guide you every step of the way.
            </p>

            <NuxtLink
              to="/contact"
              class="inline-flex items-center justify-center gap-2 bg-white text-[#002888] px-10 py-4 rounded-xl font-black uppercase tracking-wider hover:bg-slate-50 transition-all shadow-md active:scale-95"
            >
              Contact Us Today
              <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#imports'

useHead({
  title: 'About Us | Novel Solar',
  meta: [
    {
      name: 'description',
      content:
        'Our mission is to empower households and businesses across Nigeria to generate their own clean energy through solar power.',
    },
  ],
})
</script>
