export interface ShopItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export interface CartItem extends ShopItem {
  quantity: number;
}
