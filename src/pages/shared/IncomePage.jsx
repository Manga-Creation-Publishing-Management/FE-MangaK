import { useState } from 'react';
import { DollarSign, History } from 'lucide-react';
import { useLocation } from 'react-router';

export function IncomePage() {
  const location = useLocation();
  const role = location.pathname.includes('mangaka') ? 'mangaka' :
               location.pathname.includes('assistant') ? 'assistant' : 'tantou';

  const [showHistory, setShowHistory] = useState(false);

  const thisMonth = 1520;

  const recentPayments = [
    { task: 'Lineart — Pages 1–12', chapter: 'Chapter 24 · The Last Warrior', amount: 280, date: 'May 15, 2026', paid: true },
    { task: 'Base Color — Pages 13–24', chapter: 'Chapter 12 · Moonlight Chronicles', amount: 320, date: 'May 12, 2026', paid: true },
    { task: 'Shading — Pages 1–16', chapter: 'Chapter 8 · Dark Academia', amount: 350, date: 'May 8, 2026', paid: true },
    { task: 'Typography — Pages 20–28', chapter: 'Chapter 12 · Moonlight Chronicles', amount: 180, date: 'May 5, 2026', paid: false },
  ];

  const incomeHistory = [
    { month: 'April 2026', total: 1680 },
    { month: 'March 2026', total: 1450 },
    { month: 'February 2026', total: 1590 },
    { month: 'January 2026', total: 1320 },
    { month: 'December 2025', total: 1780 },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1>Income</h1>
        <p className="text-muted-foreground mt-1">Your payment summary and history</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-6">
        <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <DollarSign size={28} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">This Month</p>
          <p className="text-3xl mt-1">${thisMonth.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2>Recent Payments</h2>

        <div className="space-y-3">
          {recentPayments.map((payment, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium">{payment.task}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{payment.chapter}</p>
                <p className="text-sm text-muted-foreground">{payment.date}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-lg">${payment.amount}</p>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs ${
                  payment.paid
                    ? 'bg-success/10 text-success border border-success/30'
                    : 'bg-warning/10 text-warning border border-warning/30'
                }`}>
                  {payment.paid ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-5 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors text-sm"
          >
            <History size={16} />
            {showHistory ? 'Hide Income History' : 'View Income History'}
          </button>
        </div>

        {showHistory && (
          <div className="mt-2 space-y-3">
            <h3 className="text-base">Previous Months</h3>
            {incomeHistory.map((item) => (
              <div key={item.month} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <span>{item.month}</span>
                <span className="font-medium">${item.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
