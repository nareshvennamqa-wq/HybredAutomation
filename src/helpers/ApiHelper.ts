import { APIRequestContext, expect } from '@playwright/test';
import { ApiResponse } from '../types';

export class ApiHelper {
  constructor(private request: APIRequestContext) {}

  private get baseUrl() {
    return process.env.BASE_URL ?? 'https://automationexercise.com';
  }

  // ─── Auth ────────────────────────────────────────────────────────────────

  async verifyLogin(email: string, password: string) {
    const response = await this.request.post(`${this.baseUrl}/api/verifyLogin`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    });
    const body: ApiResponse = await response.json();
    return { status: response.status(), body };
  }

  async verifyLoginInvalidMethod() {
    const response = await this.request.delete(`${this.baseUrl}/api/verifyLogin`);
    const body: ApiResponse = await response.json();
    return { status: response.status(), body };
  }

  // ─── Users ───────────────────────────────────────────────────────────────

  async createAccount(params: {
    name: string;
    email: string;
    password: string;
    title?: string;
    birth_date?: string;
    birth_month?: string;
    birth_year?: string;
    firstname?: string;
    lastname?: string;
    company?: string;
    address1?: string;
    address2?: string;
    country?: string;
    zipcode?: string;
    state?: string;
    city?: string;
    mobile_number?: string;
  }) {
    const formData = Object.entries(params)
      .map(([k, v]) => `${k}=${encodeURIComponent(v ?? '')}`)
      .join('&');

    const response = await this.request.post(`${this.baseUrl}/api/createAccount`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: formData,
    });
    const body: ApiResponse = await response.json();
    return { status: response.status(), body };
  }

  async deleteAccount(email: string, password: string) {
    const response = await this.request.delete(`${this.baseUrl}/api/deleteAccount`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    });
    const body: ApiResponse = await response.json();
    return { status: response.status(), body };
  }

  async getUserByEmail(email: string) {
    const response = await this.request.get(
      `${this.baseUrl}/api/getUserDetailByEmail?email=${encodeURIComponent(email)}`
    );
    const body = await response.json();
    return { status: response.status(), body };
  }

  async updateAccount(params: { email: string; password: string; name: string }) {
    const formData = Object.entries(params)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&');

    const response = await this.request.put(`${this.baseUrl}/api/updateAccount`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: formData,
    });
    const body: ApiResponse = await response.json();
    return { status: response.status(), body };
  }

  // ─── Products ────────────────────────────────────────────────────────────

  async getAllProducts() {
    const response = await this.request.get(`${this.baseUrl}/api/productsList`);
    const body = await response.json();
    return { status: response.status(), body };
  }

  async searchProduct(productName: string) {
    const response = await this.request.post(`${this.baseUrl}/api/searchProduct`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: `search_product=${encodeURIComponent(productName)}`,
    });
    const body = await response.json();
    return { status: response.status(), body };
  }

  async searchProductInvalidMethod() {
    const response = await this.request.get(`${this.baseUrl}/api/searchProduct`);
    const body = await response.json();
    return { status: response.status(), body };
  }

  // ─── Brands ──────────────────────────────────────────────────────────────

  async getAllBrands() {
    const response = await this.request.get(`${this.baseUrl}/api/brandsList`);
    const body = await response.json();
    return { status: response.status(), body };
  }
}
