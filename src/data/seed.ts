import type { AppState, MenuItem, Room } from '../types'

const room = (
  id: string,
  name: string,
  type: string,
  hourlyRate: number,
): Room => ({
  id,
  name,
  type,
  hourlyRate,
  status: 'available',
  session: null,
})

const item = (
  id: string,
  name: string,
  nameMy: string,
  category: MenuItem['category'],
  price: number,
): MenuItem => ({ id, name, nameMy, category, price, available: true })

export const seedRooms: Room[] = [
  room('r1', 'Room 1', 'Small', 8000),
  room('r2', 'Room 2', 'Small', 8000),
  room('r3', 'Room 3', 'Medium', 12000),
  room('r4', 'Room 4', 'Medium', 12000),
  room('r5', 'Room 5', 'VIP', 20000),
  room('r6', 'Room 6', 'VIP', 20000),
]

export const seedMenu: MenuItem[] = [
  item('m1', 'Myanmar Beer', 'မြန်မာဘီယာ', 'beer', 3000),
  item('m2', 'Tiger Beer', 'တိုက်ဂါဘီယာ', 'beer', 3500),
  item('m3', 'Heineken', 'ဟိုက်နီကင်း', 'beer', 4000),
  item('m4', 'Coca-Cola', 'ကိုကာကိုလာ', 'drink', 1500),
  item('m5', 'Sprite', 'စပရိုက်', 'drink', 1500),
  item('m6', 'Drinking Water', 'သောက်ရေသန့်', 'drink', 700),
  item('m7', 'Red Bull', 'ရက်ဘုလ်', 'drink', 1800),
  item('m8', 'Fried Rice', 'ထမင်းကြော်', 'food', 4000),
  item('m9', 'Fried Noodles', 'ခေါက်ဆွဲကြော်', 'food', 4000),
  item('m10', 'Chicken Wings', 'ကြက်တောင်ပံ', 'food', 6000),
  item('m11', 'French Fries', 'အာလူးကြော်', 'snack', 3000),
  item('m12', 'Peanuts', 'မြေပဲ', 'snack', 1500),
  item('m13', 'Potato Chips', 'အာလူးချောင်းကြော်', 'snack', 2000),
  item('m14', 'Fruit Platter', 'သစ်သီးစုံ', 'snack', 5000),
]

export const initialState: AppState = {
  rooms: seedRooms,
  menu: seedMenu,
  sales: [],
  settings: {
    shopName: 'Star KTV',
    serviceChargePct: 5,
    billWholeHour: false,
    language: 'my',
  },
}
