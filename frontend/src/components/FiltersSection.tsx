import React from 'react';
import { Filters, Warehouse } from '../types';

interface FiltersSectionProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  warehouses: Warehouse[];
}

const FiltersSection: React.FC<FiltersSectionProps> = ({ filters, setFilters, warehouses }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search by name, SKU, or ID..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Warehouse Filter */}
        <div>
          <label htmlFor="warehouse" className="block text-sm font-medium text-gray-700 mb-2">
            Warehouse
          </label>
          <select
            id="warehouse"
            value={filters.warehouse}
            onChange={(e) => setFilters(prev => ({ ...prev, warehouse: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Warehouses</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.code} value={warehouse.code}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="healthy">🟢 Healthy</option>
            <option value="low">🟡 Low</option>
            <option value="critical">🔴 Critical</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FiltersSection;
