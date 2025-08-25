import React from 'react';

interface KPICardsProps {
  totalStock: number;
  totalDemand: number;
  fillRate: number;
}

const KPICards: React.FC<KPICardsProps> = ({ totalStock, totalDemand, fillRate }) => {
  const cards = [
    {
      title: 'Total Stock',
      value: totalStock.toLocaleString(),
      icon: '📦',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Demand',
      value: totalDemand.toLocaleString(),
      icon: '📋',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      title: 'Fill Rate',
      value: `${fillRate}%`,
      icon: '📊',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className={`${card.bgColor} rounded-lg p-6`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">{card.icon}</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
