export interface User { 
    email : string;
    password:string;
    firstName?: string;
    lastName?: string;
    role: 'customer' | 'admin';
    shouldLoginSucceed: boolean;
    expectedError?: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    brand: string;
    inStock: boolean;
}

export interface CartItem {
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface CheckoutData {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postcode: string;
    paymentType: 'bank-transfer' | 'cash-on-delivery' | 'credit-card' | 'buy-now-pay-later' | 'gift-card'; 
}

export interface ApiResponse<T>{
    data: T;
    status: number;
    message?: string;
}