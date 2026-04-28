export interface User {
  name: string;
  email: string;
  password: string;
}

export interface Product {
  name: string;
  price?: string;
}

export interface TestCase {
  title: string;
  steps: string[];
  expectedResult: string;
}

export interface ApiResponse {
  responseCode: number;
  message: string;
}
