/**
 * Nepali Land Units & Currency Calculations
 * Standard Land Measurements:
 * - Hilly / Kathmandu Valley System (Ropani-Aana-Paisa-Daam):
 *   1 Ropani = 16 Aana = 5476 sq. ft.
 *   1 Aana   = 4 Paisa  = 342.25 sq. ft.
 *   1 Paisa  = 4 Daam   = 85.5625 sq. ft.
 *   1 Daam   = 21.390625 sq. ft.
 *
 * - Terai System (Bigha-Katha-Dhur):
 *   1 Bigha = 20 Katha = 72,900 sq. ft.
 *   1 Katha = 20 Dhur  = 3,645 sq. ft.
 *   1 Dhur  = 182.25 sq. ft.
 */

export const SQFT_PER_ROPANI = 5476;
export const SQFT_PER_AANA = 342.25;
export const SQFT_PER_PAISA = 85.5625;
export const SQFT_PER_DAAM = 21.390625;

export const SQFT_PER_BIGHA = 72900;
export const SQFT_PER_KATHA = 3645;
export const SQFT_PER_DHUR = 182.25;

export const NPR_USD_EXCHANGE_RATE = 135; // 1 USD ≈ 135 NPR

/**
 * Format price in Nepali Lakhs / Crores
 * e.g., 25000000 -> "Rs. 2.5 Crore"
 *       8500000  -> "Rs. 85 Lakh"
 */
export function formatNepaliPrice(amount, { showRs = true } = {}) {
  const num = Number(amount);
  if (isNaN(num) || num <= 0) return showRs ? "Rs. 0" : "0";

  const prefix = showRs ? "Rs. " : "";

  if (num >= 10000000) {
    const crores = (num / 10000000).toFixed(2).replace(/\.00$/, "");
    return `${prefix}${crores} Crore`;
  }
  if (num >= 100000) {
    const lakhs = (num / 100000).toFixed(2).replace(/\.00$/, "");
    return `${prefix}${lakhs} Lakh`;
  }
  return `${prefix}${num.toLocaleString()}`;
}

/**
 * Convert NPR to USD
 */
export function nprToUsd(amountNpr, rate = NPR_USD_EXCHANGE_RATE) {
  const num = Number(amountNpr);
  if (isNaN(num) || num <= 0) return "$0";
  const usd = Math.round(num / rate);
  return `$${usd.toLocaleString()}`;
}

/**
 * Convert Square Feet to Ropani-Aana-Paisa-Daam (RAPD)
 */
export function sqftToRopani(sqft) {
  const area = Number(sqft);
  if (isNaN(area) || area <= 0) {
    return {
      ropani: 0,
      aana: 0,
      paisa: 0,
      daam: 0,
      totalAana: 0,
      code: "0-0-0-0",
      label: "0 Aana",
    };
  }

  let remainder = area;
  const ropani = Math.floor(remainder / SQFT_PER_ROPANI);
  remainder %= SQFT_PER_ROPANI;

  const aana = Math.floor(remainder / SQFT_PER_AANA);
  remainder %= SQFT_PER_AANA;

  const paisa = Math.floor(remainder / SQFT_PER_PAISA);
  remainder %= SQFT_PER_PAISA;

  const daam = Math.round(remainder / SQFT_PER_DAAM);

  const totalAana = (area / SQFT_PER_AANA).toFixed(2).replace(/\.00$/, "");

  let label = "";
  if (ropani > 0) {
    label += `${ropani} Ropani `;
  }
  if (aana > 0 || ropani === 0) {
    label += `${aana} Aana`;
  }
  if (paisa > 0) {
    label += ` ${paisa} Paisa`;
  }

  return {
    ropani,
    aana,
    paisa,
    daam,
    totalAana,
    code: `${ropani}-${aana}-${paisa}-${daam}`,
    label: label.trim(),
  };
}

/**
 * Convert Square Feet to Bigha-Katha-Dhur (BKD)
 */
export function sqftToBigha(sqft) {
  const area = Number(sqft);
  if (isNaN(area) || area <= 0) {
    return {
      bigha: 0,
      katha: 0,
      dhur: 0,
      code: "0-0-0",
      label: "0 Katha",
    };
  }

  let remainder = area;
  const bigha = Math.floor(remainder / SQFT_PER_BIGHA);
  remainder %= SQFT_PER_BIGHA;

  const katha = Math.floor(remainder / SQFT_PER_KATHA);
  remainder %= SQFT_PER_KATHA;

  const dhur = Math.round(remainder / SQFT_PER_DHUR);

  let label = "";
  if (bigha > 0) label += `${bigha} Bigha `;
  if (katha > 0 || bigha === 0) label += `${katha} Katha `;
  if (dhur > 0) label += `${dhur} Dhur`;

  return {
    bigha,
    katha,
    dhur,
    code: `${bigha}-${katha}-${dhur}`,
    label: label.trim(),
  };
}

/**
 * Get nearby landmarks & amenities based on city
 */
export function getNearbyAmenities(city = "") {
  const normalized = city.trim().toLowerCase();

  if (normalized.includes("lalitpur") || normalized.includes("patan")) {
    return [
      { category: "Healthcare", name: "Nepal Mediciti Hospital", distance: "2.1 km", time: "6 min drive", icon: "hospital" },
      { category: "Shopping", name: "Bhatbhateni Supermarket (Pulchowk)", distance: "1.4 km", time: "4 min drive", icon: "shopping" },
      { category: "Education", name: "The British School / St. Mary's", distance: "1.8 km", time: "5 min drive", icon: "school" },
      { category: "Transit", name: "Ring Road (Ekantakuna Chowk)", distance: "0.9 km", time: "3 min drive", icon: "transit" },
      { category: "Dining & Cafe", name: "Jhamsikhel Restaurant Hub", distance: "1.2 km", time: "4 min drive", icon: "coffee" },
      { category: "Airport", name: "Tribhuvan Int'l Airport (TIA)", distance: "7.5 km", time: "18 min drive", icon: "plane" },
    ];
  }

  if (normalized.includes("bhaktapur")) {
    return [
      { category: "Healthcare", name: "Bhaktapur Cancer Hospital", distance: "2.3 km", time: "7 min drive", icon: "hospital" },
      { category: "Shopping", name: "Bhatbhateni Supermarket (Radhe Radhe)", distance: "1.5 km", time: "5 min drive", icon: "shopping" },
      { category: "Education", name: "Khwopa Engineering College", distance: "1.9 km", time: "6 min drive", icon: "school" },
      { category: "Heritage", name: "Bhaktapur Durbar Square", distance: "2.0 km", time: "6 min drive", icon: "landmark" },
      { category: "Transit", name: "Araniko Highway Access", distance: "0.8 km", time: "2 min drive", icon: "transit" },
      { category: "Airport", name: "Tribhuvan Int'l Airport (TIA)", distance: "9.2 km", time: "22 min drive", icon: "plane" },
    ];
  }

  if (normalized.includes("pokhara")) {
    return [
      { category: "Healthcare", name: "Gandaki Medical College Hospital", distance: "2.5 km", time: "7 min drive", icon: "hospital" },
      { category: "Leisure", name: "Phewa Lake & Lakeside Promenade", distance: "1.2 km", time: "4 min drive", icon: "lake" },
      { category: "Shopping", name: "Bhatbhateni Supermarket (Pokhara)", distance: "1.8 km", time: "5 min drive", icon: "shopping" },
      { category: "Education", name: "Gandaki Boarding School", distance: "3.2 km", time: "9 min drive", icon: "school" },
      { category: "Airport", name: "Pokhara Int'l Airport", distance: "4.8 km", time: "12 min drive", icon: "plane" },
      { category: "Transit", name: "Prithvi Chowk Bus Hub", distance: "2.1 km", time: "6 min drive", icon: "transit" },
    ];
  }

  // Default Kathmandu / Valley
  return [
    { category: "Healthcare", name: "Grande Int'l / Teaching Hospital", distance: "2.8 km", time: "8 min drive", icon: "hospital" },
    { category: "Shopping", name: "Bhatbhateni Supermarket", distance: "1.2 km", time: "4 min drive", icon: "shopping" },
    { category: "Education", name: "Lincoln School / Ullens School", distance: "2.4 km", time: "7 min drive", icon: "school" },
    { category: "Transit", name: "Ring Road Access", distance: "0.7 km", time: "2 min drive", icon: "transit" },
    { category: "Airport", name: "Tribhuvan Int'l Airport (TIA)", distance: "6.0 km", time: "15 min drive", icon: "plane" },
    { category: "Banking", name: "Commercial Banks & ATMs", distance: "0.4 km", time: "5 min walk", icon: "bank" },
  ];
}
