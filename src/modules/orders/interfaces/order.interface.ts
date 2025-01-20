export interface ShippingAddressData {
  addressLine1: string;
  addressLine2?: string;
  country: string;
  postalCode: string;
  city: string;
  state?: string;
}

export interface ContactInfoData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
}

export interface CreateOrderData {
  userId: number;
  items: {
    productVariantId: number;
    quantity: number;
  }[];
  shippingAddress: ShippingAddressData;
  contactInfo: ContactInfoData;
}
