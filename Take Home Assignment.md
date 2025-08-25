# **🏗️ Take-Home Frontend Challenge —** 

# **SupplySight Dashboard**

Hi\! 👋 Thanks for interviewing with us.

Here’s a small but tricky challenge that should take **around 4 hours**. It’s designed to mimic the kind of work you’d do here: turning specs into a polished frontend, wiring APIs, and applying business logic.

---

## **🎯 The Task**

Build a **Daily Inventory Dashboard** for a supply chain platform called **SupplySight**.

Your mission:

* Set up your own **React \+ Tailwind** project.

* Create a small **mock GraphQL server** (Apollo, urql, or anything you like).

* Implement the dashboard UI as per the spec below.

## **📊 GraphQL Schema (use this to seed a mock API)**

![][image1]

Sample Data 👍  
\[  
  { "id": "P-1001", "name": "12mm Hex Bolt", "sku": "HEX-12-100", "warehouse": "BLR-A", "stock": 180, "demand": 120 },  
  { "id": "P-1002", "name": "Steel Washer", "sku": "WSR-08-500", "warehouse": "BLR-A", "stock": 50, "demand": 80 },  
  { "id": "P-1003", "name": "M8 Nut", "sku": "NUT-08-200", "warehouse": "PNQ-C", "stock": 80, "demand": 80 },  
  { "id": "P-1004", "name": "Bearing 608ZZ", "sku": "BRG-608-50", "warehouse": "DEL-B", "stock": 24, "demand": 120 }  
\]

## **🖥️ What to Build**

1. **Dashboard Layout**

   * Top bar with logo text **SupplySight** \+ date range chips (**7d / 14d / 30d**).

   * KPI cards:

     * Total Stock (sum of stock)

     * Total Demand (sum of demand)

     * Fill Rate \= (sum(min(stock, demand)) / sum(demand)) \* 100%

   * Line chart: Stock vs Demand trend (from kpis(range)).

   * Filters row:

     * Search box (by name, SKU, ID)

     * Warehouse dropdown (from warehouses)

     * Status dropdown (**All / Healthy / Low / Critical**)

2. **Products Table**

   * Columns: Product, SKU, Warehouse, Stock, Demand, Status.

   * Status pill rules:

     * 🟢 Healthy \= stock \> demand

     * 🟡 Low \= stock \= demand

     * 🔴 Critical \= stock \< demand (entire row lightly red-tinted)

   * Pagination: 10 rows/page.

3. **Interactions**

   * Filters update results live.

   * Clicking a row opens a **right-side drawer** with:

     * Product details

     * **Update Demand** form (mutation)

     * **Transfer Stock** form (mutation)

## **📦 Deliverable**

* A GitHub repo (or zip) with your code.

* A short NOTES.md describing decisions, trade-offs, and what you’d improve with more time.

## **✅ What We Look For**

* Clean React \+ Tailwind code structure

* Correct data wiring (queries, filters, mutations)

* Handling of loading/error states

* Business logic correctness (**Healthy/Low/Critical**)

* Attention to detail in UX

That’s it\! 🚀

Think of it as your chance to **show us how you’d build a real feature** — not just code, but also how you balance speed, clarity, and usability.

