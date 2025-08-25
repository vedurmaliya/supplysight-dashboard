from typing import List, Optional
from datetime import datetime, timedelta
import strawberry
from strawberry.fastapi import GraphQLRouter
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Data models
@strawberry.type
class Warehouse:
    code: str
    name: str
    city: str
    country: str

@strawberry.type
class Product:
    id: str
    name: str
    sku: str
    warehouse: str
    stock: int
    demand: int

@strawberry.type
class KPI:
    date: str
    stock: int
    demand: int

@strawberry.type
class KPISummary:
    totalStock: int
    totalDemand: int
    fillRate: float

# Sample data
warehouses_data = [
    {"code": "BLR-A", "name": "Bangalore Warehouse A", "city": "Bangalore", "country": "India"},
    {"code": "PNQ-C", "name": "Pune Warehouse C", "city": "Pune", "country": "India"},
    {"code": "DEL-B", "name": "Delhi Warehouse B", "city": "Delhi", "country": "India"},
]

products_data = [
    {"id": "P-1001", "name": "12mm Hex Bolt", "sku": "HEX-12-100", "warehouse": "BLR-A", "stock": 180, "demand": 120},
    {"id": "P-1002", "name": "Steel Washer", "sku": "WSR-08-500", "warehouse": "BLR-A", "stock": 50, "demand": 80},
    {"id": "P-1003", "name": "M8 Nut", "sku": "NUT-08-200", "warehouse": "PNQ-C", "stock": 80, "demand": 80},
    {"id": "P-1004", "name": "Bearing 608ZZ", "sku": "BRG-608-50", "warehouse": "DEL-B", "stock": 24, "demand": 120},
    {"id": "P-1005", "name": "Socket Head Cap Screw", "sku": "SHCS-06-75", "warehouse": "BLR-A", "stock": 200, "demand": 150},
    {"id": "P-1006", "name": "Flat Washer", "sku": "FWR-10-300", "warehouse": "PNQ-C", "stock": 90, "demand": 95},
    {"id": "P-1007", "name": "Ball Bearing 6202", "sku": "BB-6202-25", "warehouse": "DEL-B", "stock": 45, "demand": 60},
    {"id": "P-1008", "name": "Allen Key Set", "sku": "AK-SET-01", "warehouse": "BLR-A", "stock": 30, "demand": 25},
    {"id": "P-1009", "name": "Spring Washer", "sku": "SPW-08-400", "warehouse": "PNQ-C", "stock": 120, "demand": 140},
    {"id": "P-1010", "name": "Thrust Bearing", "sku": "TB-51100", "warehouse": "DEL-B", "stock": 15, "demand": 35},
    {"id": "P-1011", "name": "Hex Nut M10", "sku": "HN-M10-250", "warehouse": "BLR-A", "stock": 300, "demand": 280},
    {"id": "P-1012", "name": "Machine Screw", "sku": "MS-04-150", "warehouse": "PNQ-C", "stock": 75, "demand": 75},
]

def generate_kpi_data(range_days: int) -> List[KPI]:
    """Generate KPI data for the specified range"""
    kpis = []
    base_date = datetime.now()
    
    for i in range(range_days):
        date = base_date - timedelta(days=range_days - 1 - i)
        total_stock = sum(p["stock"] for p in products_data) + (i * 10) - (range_days * 5)
        total_demand = sum(p["demand"] for p in products_data) + (i * 8) - (range_days * 4)
        
        kpis.append(KPI(
            date=date.strftime("%Y-%m-%d"),
            stock=max(0, total_stock),
            demand=max(0, total_demand)
        ))
    
    return kpis

# GraphQL Resolvers
@strawberry.type
class Query:
    @strawberry.field
    def products(
        self, 
        search: Optional[str] = None, 
        status: Optional[str] = None, 
        warehouse: Optional[str] = None
    ) -> List[Product]:
        filtered_products = products_data.copy()
        
        if search:
            search_lower = search.lower()
            filtered_products = [
                p for p in filtered_products 
                if search_lower in p["name"].lower() 
                or search_lower in p["sku"].lower() 
                or search_lower in p["id"].lower()
            ]
        
        if warehouse and warehouse != "all":
            filtered_products = [p for p in filtered_products if p["warehouse"] == warehouse]
        
        if status and status != "all":
            if status == "healthy":
                filtered_products = [p for p in filtered_products if p["stock"] > p["demand"]]
            elif status == "low":
                filtered_products = [p for p in filtered_products if p["stock"] == p["demand"]]
            elif status == "critical":
                filtered_products = [p for p in filtered_products if p["stock"] < p["demand"]]
        
        return [Product(**p) for p in filtered_products]
    
    @strawberry.field
    def warehouses(self) -> List[Warehouse]:
        return [Warehouse(**w) for w in warehouses_data]
    
    @strawberry.field
    def kpis(self, range: str = "7d") -> List[KPI]:
        range_map = {"7d": 7, "14d": 14, "30d": 30}
        days = range_map.get(range, 7)
        return generate_kpi_data(days)
    
    @strawberry.field
    def kpiSummary(self) -> KPISummary:
        total_stock = sum(p["stock"] for p in products_data)
        total_demand = sum(p["demand"] for p in products_data)
        
        if total_demand == 0:
            fill_rate = 100.0
        else:
            # Fill Rate = (sum(min(stock, demand)) / sum(demand)) * 100%
            fulfillable_demand = sum(min(p["stock"], p["demand"]) for p in products_data)
            fill_rate = (fulfillable_demand / total_demand) * 100
        
        return KPISummary(
            totalStock=total_stock,
            totalDemand=total_demand,
            fillRate=round(fill_rate, 2)
        )

@strawberry.type
class Mutation:
    @strawberry.mutation
    def update_demand(self, id: str, demand: int) -> Product:
        for product in products_data:
            if product["id"] == id:
                product["demand"] = demand
                return Product(**product)
        raise Exception(f"Product with id {id} not found")
    
    @strawberry.mutation
    def transfer_stock(self, id: str, from_warehouse: str, to_warehouse: str, qty: int) -> Product:
        source_product = None
        for p in products_data:
            if p["id"] == id:
                source_product = p
                break
        
        if not source_product:
            raise Exception(f"Product with id {id} not found")
        
        if source_product["warehouse"] != from_warehouse:
            raise Exception(f"Product is not in warehouse {from_warehouse}")
        
        if source_product["stock"] < qty:
            raise Exception("Insufficient stock for transfer")
        
        destination_product = None
        for p in products_data:
            if (p["name"] == source_product["name"] and 
                p["sku"] == source_product["sku"] and 
                p["warehouse"] == to_warehouse):
                destination_product = p
                break
        
        source_product["stock"] -= qty
        
        if destination_product:
            destination_product["stock"] += qty
            return Product(**destination_product)
        else:
            new_product_id = f"{source_product['id']}-{to_warehouse}"
            new_product = {
                "id": new_product_id,
                "name": source_product["name"],
                "sku": source_product["sku"],
                "warehouse": to_warehouse,
                "stock": qty,
                "demand": 0
            }
            products_data.append(new_product)
            return Product(**new_product)

schema = strawberry.Schema(query=Query, mutation=Mutation)

app = FastAPI(title="SupplySight API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")

@app.get("/")
def read_root():
    return {"message": "SupplySight API is running! Visit /graphql for GraphQL playground"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)