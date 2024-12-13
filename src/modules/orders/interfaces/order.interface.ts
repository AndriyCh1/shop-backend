export interface ShippingAddressData {
  addressLine1: string;
  addressLine2?: string;
  phoneNumber?: string;
  country: string;
  postalCode: string;
  city: string;
}

export interface CreateOrderData {
  userId: number;
  items: {
    productVariantId: number;
    quantity: number;
  }[];
  shippingAddressId?: number;
  shippingAddress?: ShippingAddressData;
}
