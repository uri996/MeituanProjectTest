export interface Canteen {
  id: string
  name: string
  subtitle: string
  description: string
  location: string
  hours: string
  color: string
}
export interface Window {
  id: string
  canteenId: string
  name: string
  category: string
  number: string
}
export interface Dish {
  id: string
  windowId: string
  name: string
  price: number
  category: string
  flavors: string[]
  tags: string[]
  emoji: string
  color: string
  isNew: boolean
  description: string
}
export interface Review {
  id: string
  dishId: string
  author: string
  rating: number
  tags: string[]
  text: string
  date: string
  source: 'demo' | 'local'
}
export interface Filters {
  query: string
  canteenId: string
  maxPrice: number
  flavor: string
  category: string
  sort: string
}
