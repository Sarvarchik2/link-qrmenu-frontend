import { defineStore } from 'pinia'

interface Dish {
  id: number
  name: string
  price: number | string
  img: string
  qty?: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as Array<{id:number, name:string, price:number, img:string, qty:number}>
  }),
  getters: {
    total(state) {
      return state.items.reduce((sum, i) => sum + i.price * i.qty, 0)
    },
    count(state) {
      return state.items.reduce((sum, i) => sum + i.qty, 0)
    }
  },
  actions: {
    add(dish: Dish) {
      const found = this.items.find(i => i.id === dish.id)
      if (found) found.qty++
      else this.items.push({ ...dish, price: Number(dish.price), qty: 1 })
    },
    remove(id: number) {
      const idx = this.items.findIndex(i => i.id === id)
      if (idx !== -1) {
        if (this.items[idx].qty > 1) this.items[idx].qty--
        else this.items.splice(idx, 1)
      }
    },
    clear() {
      this.items = []
    }
  }
}) 