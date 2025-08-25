# SupplySight Dashboard

A daily inventory dashboard for supply chain management built with React + Tailwind CSS frontend and Python FastAPI + GraphQL backend.

## Features

- **Dashboard Overview**: KPI cards showing total stock, demand, and fill rate
- **Interactive Charts**: Stock vs demand trend visualization using Recharts
- **Advanced Filtering**: Search by product name/SKU/ID, filter by warehouse and status
- **Product Management**: Click any row to open a detailed product drawer
- **Real-time Updates**: Update demand and transfer stock with GraphQL mutations
- **Responsive Design**: Works on desktop and mobile devices
- **Status Indicators**: Color-coded status (Healthy/Low/Critical) based on stock levels

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **Strawberry GraphQL**: Type-safe GraphQL library for Python
- **Uvicorn**: ASGI server for running the application

### Frontend
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Apollo Client**: GraphQL client with caching
- **Recharts**: Charting library for React

## Project Structure

```
├── backend/
│   ├── main.py              # FastAPI application with GraphQL schema
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── graphql/         # GraphQL queries and mutations
│   │   ├── types.ts         # TypeScript type definitions
│   │   ├── App.tsx          # Main App component
│   │   └── index.tsx        # Application entry point
│   ├── package.json         # Node.js dependencies
│   └── tailwind.config.js   # Tailwind CSS configuration
└── README.md                # This file
```

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the FastAPI server:
   ```bash
   python main.py
   ```
   
   The API will be available at `http://localhost:8000`
   GraphQL playground at `http://localhost:8000/graphql`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   
   The application will open at `http://localhost:3000`

## GraphQL Schema

The backend provides the following GraphQL operations:

### Queries
- `products(search, status, warehouse)`: Get filtered products
- `warehouses`: Get all warehouse locations
- `kpis(range)`: Get KPI data for specified time range

### Mutations
- `updateDemand(id, demand)`: Update product demand
- `transferStock(id, fromWarehouse, toWarehouse, qty)`: Transfer stock between warehouses

## Business Logic

### Status Calculation
- **🟢 Healthy**: Stock > Demand
- **🟡 Low**: Stock = Demand  
- **🔴 Critical**: Stock < Demand

### Fill Rate Calculation
Fill Rate = (Sum of min(stock, demand) for all products / Total demand) × 100

## Sample Data

The application includes sample data with 12 products across 3 warehouses:
- BLR-A (Bangalore Warehouse A)
- PNQ-C (Pune Warehouse C)  
- DEL-B (Delhi Warehouse B)

Products include various industrial components like bolts, washers, nuts, and bearings with realistic stock and demand values.
