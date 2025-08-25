export interface Product {
  id: string;
  name: string;
  sku: string;
  warehouse: string;
  stock: number;
  demand: number;
}

export interface Warehouse {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface KPI {
  date: string;
  stock: number;
  demand: number;
}

export type ProductStatus = 'healthy' | 'low' | 'critical';

export interface Filters {
  search: string;
  warehouse: string;
  status: string;
  dateRange: '7d' | '14d' | '30d';
}
