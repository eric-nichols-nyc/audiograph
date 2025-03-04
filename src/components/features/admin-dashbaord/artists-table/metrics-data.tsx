import { ArrowUp, ArrowDown } from 'lucide-react';

interface Value {
    current: number;
    change: number;
    percentChange: number;
}
interface MetricProps {
    value:Value ;
};

export const MetricDisplay = ({ value }:MetricProps) => {
    const { current, change, percentChange } = value;
    const isPositive = change > 0;
    
    return (
      <div className="flex flex-col">
        <div className="text-base font-medium">{current.toLocaleString()}</div>
        {change !== 0 && (
          <div className={`flex items-center text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            <span className="font-medium">{Math.abs(percentChange).toFixed(1)}%</span>
            <span className="ml-1 text-gray-500">({isPositive ? '+' : ''}{change.toLocaleString()})</span>
          </div>
        )}
      </div>
    );
  };