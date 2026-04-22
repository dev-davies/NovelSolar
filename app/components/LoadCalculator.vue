<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <div class="mb-12 text-center">
      <h1 class="text-4xl font-black text-[#002888] mb-4">Solar Load Calculator</h1>
      <p class="text-gray-600 max-w-2xl mx-auto">
        Estimate your energy needs and get a recommended solar system configuration profile for your home or office.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <!-- Left Column: Appliance Selection & Inputs -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <h2 class="font-bold text-gray-800 flex items-center gap-2">
              <span class="material-symbols-outlined text-[#002888]">electrical_services</span>
              Appliance Load Details
            </h2>
            <button 
              @click="resetCalculator" 
              class="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-sm">restart_alt</span>
              Reset
            </button>
          </div>

          <div class="p-0">
            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead class="bg-gray-50/50 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                  <tr>
                    <th class="px-6 py-4">Appliance</th>
                    <th class="px-6 py-4 text-center">Quantity</th>
                    <th class="px-6 py-4 text-center">Unit Load (W)</th>
                    <th class="px-6 py-4 text-right">Total (W)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr v-for="item in appliances" :key="item.id" 
                      class="hover:bg-blue-50/30 transition-colors group"
                      :class="{'bg-blue-50/50': item.quantity > 0}">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors px-1"
                             :class="item.quantity > 0 ? 'bg-[#002888] text-white' : 'bg-gray-100 text-gray-400'">
                          <span class="material-symbols-outlined text-sm">{{ item.icon }}</span>
                        </div>
                        <span class="text-sm font-semibold" :class="item.quantity > 0 ? 'text-[#002888]' : 'text-gray-700'">
                          {{ item.name }}
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center justify-center gap-2">
                        <button @click="updateQty(item, -1)" 
                                class="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-sm active:scale-90 transition-all text-gray-400 hover:text-red-500">
                          -
                        </button>
                        <input type="number" v-model.number="item.quantity" min="0" 
                               class="w-12 text-center text-sm font-bold bg-transparent border-none focus:ring-0 p-0" />
                        <button @click="updateQty(item, 1)" 
                                class="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-sm active:scale-90 transition-all text-gray-400 hover:text-green-500">
                          +
                        </button>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <input type="number" v-model.number="item.load" 
                             class="w-16 text-center text-sm text-gray-500 bg-transparent border-none focus:ring-0 p-0" />
                    </td>
                    <td class="px-6 py-4 text-right">
                      <span class="text-sm font-bold" :class="item.quantity > 0 ? 'text-[#002888]' : 'text-gray-300'">
                        {{ item.quantity * item.load }}W
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Custom Appliance Row -->
        <div class="p-4 bg-blue-50/50 rounded-xl border border-blue-100 border-dashed flex items-center justify-between">
          <p class="text-xs text-blue-600 font-medium italic">Tip: You can manually adjust the "Unit Load" for any appliance to match your specific hardware.</p>
        </div>
      </div>

      <!-- Right Column: Summary & CTA -->
      <div class="space-y-6 lg:sticky lg:top-24">
        <div class="bg-[#002888] rounded-2xl shadow-xl shadow-blue-900/20 text-white overflow-hidden">
          <div class="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 class="font-bold flex items-center gap-2">
              <span class="material-symbols-outlined">analytics</span>
              System Estimate
            </h2>
            <span class="bg-blue-400/20 text-blue-100 text-[10px] uppercase tracking-widest font-black px-2 py-1 rounded">Live</span>
          </div>
          
          <div class="p-6 space-y-5">
            <div class="bg-white/10 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p class="text-[10px] uppercase tracking-widest font-black text-blue-200 mb-1">Total Load</p>
                <h3 class="text-3xl font-black">{{ totalLoad.toFixed(0) }}<span class="text-lg font-normal ml-1">Watts</span></h3>
              </div>
              <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <span class="material-symbols-outlined">bolt</span>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <div v-for="stat in summaryStats" :key="stat.label" class="flex justify-between items-center text-sm py-2 border-b border-white/5 last:border-0">
                <span class="text-blue-100 tracking-wide">{{ stat.label }}</span>
                <span class="font-black text-white">{{ stat.value }}{{ stat.unit }}</span>
              </div>
            </div>

            <div class="pt-4 border-t border-white/10">
              <div class="flex justify-between items-center mb-4">
                <span class="text-xs text-blue-200 font-bold uppercase tracking-widest">Est. Cost Range</span>
                <span class="text-xl font-black">₦{{ costRange.min }} - ₦{{ costRange.max }}</span>
              </div>
              <p class="text-[10px] text-blue-100/60 leading-tight italic">
                *Prices are estimates based on standard installations and component quality.
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <button 
            @click="handlePdfDownload"
            class="w-full bg-white border border-gray-200 text-gray-800 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
          >
            <span class="material-symbols-outlined">download</span>
            Download Configuration (PDF)
          </button>
          
          <NuxtLink 
            to="/quote" 
            class="w-full bg-orange-500 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-orange-500/20"
          >
            Get Final Quote &rarr;
          </NuxtLink>
        </div>

        <div class="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-2xl">support_agent</span>
            </div>
            <div>
              <h4 class="font-bold text-gray-800">Need expert help?</h4>
              <p class="text-xs text-gray-500">Free solar consultation</p>
            </div>
          </div>
          <a :href="whatsappUrl" target="_blank" class="text-sm font-bold text-[#002888] hover:underline flex items-center gap-1">
            Chat on WhatsApp
            <span class="material-symbols-outlined text-sm">arrow_outward</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import type { Appliance, SummaryStat } from '~/types'

const { public: { whatsappNumber, whatsappNumberFormatted } } = useRuntimeConfig()
const whatsappUrl = computed(() => `https://wa.me/${whatsappNumber}`)
const { calculator } = useAppConfig()

const appliances = ref<Appliance[]>([
  { id: 'bulb', name: 'Normal Bulb', icon: 'lightbulb', quantity: 0, load: 60 },
  { id: 'tube', name: 'Tube Light', icon: 'fluorescent', quantity: 0, load: 18 },
  { id: 'led', name: 'LED Light', icon: 'emoji_objects', quantity: 0, load: 15 },
  { id: 'fan', name: 'Electric Fan', icon: 'mode_fan', quantity: 0, load: 70 },
  { id: 'music', name: 'Music System', icon: 'speaker', quantity: 0, load: 50 },
  { id: 'tv32', name: 'LCD/LED TV 32"', icon: 'tv', quantity: 0, load: 150 },
  { id: 'tv42', name: 'LCD/LED TV 42"', icon: 'live_tv', quantity: 0, load: 200 },
  { id: 'fridge1', name: 'Fridge (165-250L)', icon: 'kitchen', quantity: 0, load: 150 },
  { id: 'fridge2', name: 'Fridge (250-350L)', icon: 'kitchen', quantity: 0, load: 200 },
  { id: 'fridge3', name: 'Fridge (350-450L)', icon: 'kitchen', quantity: 0, load: 250 },
  { id: 'fridge4', name: 'Fridge (450L+)', icon: 'kitchen', quantity: 0, load: 300 },
  { id: 'ac1', name: 'AC 1 Ton', icon: 'ac_unit', quantity: 0, load: 1000 },
]);

const updateQty = (item, delta) => {
  item.quantity = Math.max(0, item.quantity + delta);
};

const resetCalculator = () => {
  appliances.value.forEach(item => item.quantity = 0);
};

const totalLoad = computed(() => {
  return appliances.value.reduce((acc, item) => acc + (item.quantity * item.load), 0);
});

const inverterRatingVA = computed(() => totalLoad.value * 1.2);
const panelCapacityW = computed(() => totalLoad.value * 1.25);
const panelQuantity = computed(() => Math.ceil(panelCapacityW.value / 300));
const chargeControllerA = computed(() => totalLoad.value * 1.1 / 12); // Assuming 12V system for estimate
const panelBankKw = computed(() => (panelQuantity.value * 300) / 1000);
const panelRackQty = computed(() => Math.ceil(panelQuantity.value / 6));

const summaryStats = computed(() => [
  { label: 'Inverter Rating', value: inverterRatingVA.value.toFixed(0), unit: ' VA' },
  { label: 'Solar Panel Capacity', value: panelCapacityW.value.toFixed(0), unit: ' Watts' },
  { label: 'Panel Quantity', value: panelQuantity.value, unit: ' Units' },
  { label: 'Charge Controller', value: chargeControllerA.value.toFixed(1), unit: ' Amps' },
  { label: 'Total Panel Power', value: panelBankKw.value.toFixed(1), unit: ' kW' },
  { label: 'Panel Mounting Racks', value: panelRackQty.value, unit: ' Racks' }
]);

const costRange = computed(() => {
  const load = totalLoad.value;
  const tier = calculator.priceTiers.find(
    (t: { minLoad: number; maxLoad: number | null }) => load >= t.minLoad && (t.maxLoad === null || load <= t.maxLoad)
  );
  const min = tier?.minPrice ?? 0;
  const max = tier?.maxPrice ?? 0;
  return {
    min: min.toLocaleString(),
    max: max.toLocaleString()
  };
});

const handlePdfDownload = () => {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(0, 40, 136); // #002888
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("NovelSolar Load Configuration", 20, 25);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 160, 25);

  // Table Data
  const tableHeaders = [["Appliance", "Qty", "Unit Load", "Sub-total"]];
  const tableBody = appliances.value
    .filter(item => item.quantity > 0)
    .map(item => [
      item.name,
      item.quantity,
      `${item.load}W`,
      `${item.quantity * item.load}W`
    ]);

  doc.autoTable({
    startY: 50,
    head: tableHeaders,
    body: tableBody,
    theme: 'striped',
    headStyles: { fillColor: [0, 40, 136] },
    styles: { fontSize: 9 }
  });

  // Summary Section
  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("System Summary", 20, finalY);

  const summaryData = [
    ["Total Load", `${totalLoad.value.toFixed(0)} Watts`],
    ["Inv. Rating", `${inverterRatingVA.value.toFixed(0)} VA`],
    ["Solar Panels", `${panelQuantity.value} x 300W Units`],
    ["Est. Cost Range", `NGN ${costRange.value.min} - ${costRange.value.max}`]
  ];

  doc.autoTable({
    startY: finalY + 5,
    body: summaryData,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: 'bold', width: 40 } }
  });

  // Footer / CTA
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.text(`Visit www.novelsolar.com or call ${whatsappNumberFormatted} for a formal site audit.`, 20, doc.internal.pageSize.height - 20);

  doc.save("NovelSolar_Estimate.pdf");
};
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
