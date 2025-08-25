import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS, GET_WAREHOUSES, GET_KPIS, GET_KPI_SUMMARY } from '../graphql/queries';
import { Product, Warehouse, KPI, Filters } from '../types';
import Header from './Header';
import KPICards from './KPICards';
import ChartSection from './ChartSection';
import FiltersSection from './FiltersSection';
import ProductsTable from './ProductsTable';
import ProductDrawer from './ProductDrawer';

const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    warehouse: 'all',
    status: 'all',
    dateRange: '7d',
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // GraphQL queries
  const { data: productsData, loading: productsLoading, refetch: refetchProducts } = useQuery(GET_PRODUCTS, {
    variables: {
      search: filters.search || undefined,
      status: filters.status === 'all' ? undefined : filters.status,
      warehouse: filters.warehouse === 'all' ? undefined : filters.warehouse,
    },
  });

  const { data: warehousesData } = useQuery(GET_WAREHOUSES);
  const { data: kpisData } = useQuery(GET_KPIS, {
    variables: { range: filters.dateRange },
  });
  const { data: kpiSummaryData } = useQuery(GET_KPI_SUMMARY);

  const products: Product[] = productsData?.products || [];
  const warehouses: Warehouse[] = warehousesData?.warehouses || [];
  const kpis: KPI[] = kpisData?.kpis || [];
  const kpiSummary = kpiSummaryData?.kpiSummary || { totalStock: 0, totalDemand: 0, fillRate: 0 };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProduct(null);
  };

  const handleProductUpdate = () => {
    refetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Range Selector */}
        <div className="mb-8">
          <div className="flex space-x-2">
            {['7d', '14d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setFilters(prev => ({ ...prev, dateRange: range as '7d' | '14d' | '30d' }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.dateRange === range
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <KPICards 
          totalStock={kpiSummary.totalStock}
          totalDemand={kpiSummary.totalDemand}
          fillRate={kpiSummary.fillRate}
        />

        {/* Chart Section */}
        <ChartSection kpis={kpis} />

        {/* Filters */}
        <FiltersSection 
          filters={filters}
          setFilters={setFilters}
          warehouses={warehouses}
        />

        {/* Products Table */}
        <ProductsTable 
          products={products}
          loading={productsLoading}
          onProductClick={handleProductClick}
        />
      </div>

      {/* Product Drawer */}
      <ProductDrawer
        product={selectedProduct}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        warehouses={warehouses}
        onUpdate={handleProductUpdate}
      />
    </div>
  );
};

export default Dashboard;
