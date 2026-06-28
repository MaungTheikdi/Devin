import type { Lang, MenuCategory, PaymentMethod } from './types'

type Dict = Record<string, { my: string; en: string }>

const dict: Dict = {
  // App / nav
  appName: { my: 'KTV POS', en: 'KTV POS' },
  dashboard: { my: 'ဒက်ရှ်ဘုတ်', en: 'Dashboard' },
  rooms: { my: 'အခန်းများ', en: 'Rooms' },
  menu: { my: 'မီနူး', en: 'Menu' },
  sales: { my: 'ရောင်းအား', en: 'Sales' },
  settings: { my: 'ဆက်တင်', en: 'Settings' },

  // Statuses
  available: { my: 'အားနေ', en: 'Available' },
  occupied: { my: 'သုံးနေ', en: 'Occupied' },

  // Room actions
  openRoom: { my: 'အခန်းဖွင့်မည်', en: 'Open Room' },
  manage: { my: 'စီမံမည်', en: 'Manage' },
  checkout: { my: 'ဘေလ်ရှင်းမည်', en: 'Checkout' },
  addOrder: { my: 'အော်ဒါတင်မည်', en: 'Add Order' },
  elapsed: { my: 'ကြာချိန်', en: 'Elapsed' },
  hourlyRate: { my: 'နာရီခ', en: 'Hourly Rate' },
  roomCharge: { my: 'အခန်းခ', en: 'Room Charge' },
  running: { my: 'စတင်ချိန်', en: 'Started' },

  // Order / cart
  order: { my: 'အော်ဒါ', en: 'Order' },
  orderItems: { my: 'မှာထားသော ပစ္စည်းများ', en: 'Ordered Items' },
  noItems: { my: 'ပစ္စည်း မရှိသေးပါ', en: 'No items yet' },
  qty: { my: 'အရေအတွက်', en: 'Qty' },
  price: { my: 'စျေးနှုန်း', en: 'Price' },
  itemsTotal: { my: 'ပစ္စည်းစုစုပေါင်း', en: 'Items Total' },

  // Bill
  bill: { my: 'ဘေလ်', en: 'Bill' },
  subtotal: { my: 'စုစုပေါင်း', en: 'Subtotal' },
  serviceCharge: { my: 'ဝန်ဆောင်ခ', en: 'Service Charge' },
  total: { my: 'စုစုပေါင်း ကျသင့်ငွေ', en: 'Total' },
  paymentMethod: { my: 'ငွေပေးချေမှု', en: 'Payment' },
  confirmCheckout: { my: 'ဘေလ်ရှင်းပြီး အခန်းပိတ်မည်', en: 'Confirm & Close Room' },
  receipt: { my: 'ပြေစာ', en: 'Receipt' },
  print: { my: 'ပရင့်ထုတ်မည်', en: 'Print' },
  close: { my: 'ပိတ်မည်', en: 'Close' },
  duration: { my: 'ကြာချိန်', en: 'Duration' },

  // Menu management
  addItem: { my: 'ပစ္စည်းအသစ်ထည့်မည်', en: 'Add Item' },
  editItem: { my: 'ပစ္စည်းပြင်မည်', en: 'Edit Item' },
  name: { my: 'အမည် (English)', en: 'Name (English)' },
  nameMy: { my: 'အမည် (မြန်မာ)', en: 'Name (Myanmar)' },
  category: { my: 'အမျိုးအစား', en: 'Category' },
  save: { my: 'သိမ်းမည်', en: 'Save' },
  cancel: { my: 'ပယ်ဖျက်မည်', en: 'Cancel' },
  delete: { my: 'ဖျက်မည်', en: 'Delete' },
  edit: { my: 'ပြင်မည်', en: 'Edit' },
  available_label: { my: 'ရောင်းရန်', en: 'Available' },
  unavailable: { my: 'ကုန်သွားသည်', en: 'Out of stock' },

  // Categories
  cat_beer: { my: 'ဘီယာ', en: 'Beer' },
  cat_drink: { my: 'အချိုရည်', en: 'Drinks' },
  cat_food: { my: 'အစားအစာ', en: 'Food' },
  cat_snack: { my: 'အဆာပြေ', en: 'Snacks' },
  cat_other: { my: 'အခြား', en: 'Other' },

  // Payment
  pay_cash: { my: 'ငွေသား', en: 'Cash' },
  pay_kpay: { my: 'KPay', en: 'KPay' },
  pay_wave: { my: 'WavePay', en: 'WavePay' },
  pay_card: { my: 'ကတ်', en: 'Card' },

  // Dashboard
  roomsOccupied: { my: 'သုံးနေသော အခန်း', en: 'Rooms Occupied' },
  todaySales: { my: 'ယနေ့ ရောင်းအား', en: "Today's Sales" },
  todayBills: { my: 'ယနေ့ ဘေလ်အရေအတွက်', en: "Today's Bills" },
  liveRoomCharge: { my: 'လက်ရှိ အခန်းခ (running)', en: 'Live Room Charges' },
  recentSales: { my: 'မကြာသေးမီက ရောင်းအား', en: 'Recent Sales' },
  noSales: { my: 'ရောင်းအား မရှိသေးပါ', en: 'No sales yet' },

  // Sales page
  date: { my: 'ရက်စွဲ', en: 'Date' },
  room: { my: 'အခန်း', en: 'Room' },
  view: { my: 'ကြည့်မည်', en: 'View' },
  totalRevenue: { my: 'စုစုပေါင်း ရငွေ', en: 'Total Revenue' },

  // Settings
  shopName: { my: 'ဆိုင်အမည်', en: 'Shop Name' },
  serviceChargePct: { my: 'ဝန်ဆောင်ခ (%)', en: 'Service Charge (%)' },
  billWholeHour: {
    my: 'နာရီအပြည့်ဖြင့်သာ တွက်မည်',
    en: 'Bill by whole started hour',
  },
  language: { my: 'ဘာသာစကား', en: 'Language' },
  resetData: { my: 'ဒေတာအားလုံး ပြန်လည်စတင်မည်', en: 'Reset all data' },
  resetConfirm: {
    my: 'ဒေတာအားလုံးကို ဖျက်မှာ သေချာပါသလား?',
    en: 'Are you sure you want to erase all data?',
  },

  // Misc
  emptyRoomsTitle: { my: 'အခန်းဖွင့်ထားခြင်း မရှိသေးပါ', en: 'No room is open' },
  perHour: { my: '/နာရီ', en: '/hr' },
}

export function makeT(lang: Lang) {
  return (key: keyof typeof dict | string): string => {
    const entry = dict[key]
    if (!entry) return key
    return entry[lang]
  }
}

export type TFn = ReturnType<typeof makeT>

export function categoryLabel(t: TFn, c: MenuCategory): string {
  return t(`cat_${c}`)
}

export function paymentLabel(t: TFn, p: PaymentMethod): string {
  return t(`pay_${p}`)
}
