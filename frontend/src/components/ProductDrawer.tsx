import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_DEMAND, TRANSFER_STOCK } from '../graphql/queries';
import { Product, Warehouse } from '../types';

interface ProductDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  warehouses: Warehouse[];
  onUpdate: () => void;
}

const ProductDrawer: React.FC<ProductDrawerProps> = ({ 
  product, 
  isOpen, 
  onClose, 
  warehouses, 
  onUpdate 
}) => {
  const [demandValue, setDemandValue] = useState('');
  const [transferQty, setTransferQty] = useState('');
  const [targetWarehouse, setTargetWarehouse] = useState('');

  const [updateDemand, { loading: updateLoading }] = useMutation(UPDATE_DEMAND);
  const [transferStock, { loading: transferLoading }] = useMutation(TRANSFER_STOCK);

  React.useEffect(() => {
    if (product) {
      setDemandValue(product.demand.toString());
      setTransferQty('');
      setTargetWarehouse('');
    }
  }, [product]);

  const handleUpdateDemand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      await updateDemand({
        variables: {
          id: product.id,
          demand: parseInt(demandValue),
        },
      });
      onUpdate();
      alert('Demand updated successfully!');
    } catch (error) {
      alert('Error updating demand: ' + (error as Error).message);
    }
  };

  const handleTransferStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      await transferStock({
        variables: {
          id: product.id,
          fromWarehouse: product.warehouse,
          toWarehouse: targetWarehouse,
          qty: parseInt(transferQty),
        },
      });
      onUpdate();
      alert('Stock transferred successfully!');
      setTransferQty('');
      setTargetWarehouse('');
    } catch (error) {
      alert('Error transferring stock: ' + (error as Error).message);
    }
  };

  if (!isOpen || !product) return null;

  const status = product.stock > product.demand ? 'healthy' : 
                   product.stock === product.demand ? 'low' : 'critical';

  const statusColors = {
    healthy: 'text-green-600 bg-green-100',
    low: 'text-yellow-600 bg-yellow-100',
    critical: 'text-red-600 bg-red-100',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Product Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{product.name}</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">ID:</span>
                  <span className="text-sm font-medium">{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">SKU:</span>
                  <span className="text-sm font-medium">{product.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Warehouse:</span>
                  <span className="text-sm font-medium">{product.warehouse}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Stock:</span>
                  <span className="text-sm font-medium">{product.stock.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Demand:</span>
                  <span className="text-sm font-medium">{product.demand.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${statusColors[status]}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-8 p-4 border border-gray-200 rounded-lg">
              <h4 className="text-md font-medium text-gray-900 mb-4">Update Demand</h4>
              <form onSubmit={handleUpdateDemand}>
                <div className="mb-4">
                  <label htmlFor="demand" className="block text-sm font-medium text-gray-700 mb-2">
                    New Demand
                  </label>
                  <input
                    type="number"
                    id="demand"
                    value={demandValue}
                    onChange={(e) => setDemandValue(e.target.value)}
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  {updateLoading ? 'Updating...' : 'Update Demand'}
                </button>
              </form>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="text-md font-medium text-gray-900 mb-4">Transfer Stock</h4>
              <form onSubmit={handleTransferStock}>
                <div className="mb-4">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity to Transfer
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    value={transferQty}
                    onChange={(e) => setTransferQty(e.target.value)}
                    min="1"
                    max={product.stock}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="warehouse" className="block text-sm font-medium text-gray-700 mb-2">
                    Target Warehouse
                  </label>
                  <select
                    id="warehouse"
                    value={targetWarehouse}
                    onChange={(e) => setTargetWarehouse(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select warehouse...</option>
                    {warehouses
                      .filter(w => w.code !== product.warehouse)
                      .map((warehouse) => (
                        <option key={warehouse.code} value={warehouse.code}>
                          {warehouse.name}
                        </option>
                      ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={transferLoading}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:opacity-50"
                >
                  {transferLoading ? 'Transferring...' : 'Transfer Stock'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDrawer;