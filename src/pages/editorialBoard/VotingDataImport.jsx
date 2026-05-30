import { useState } from 'react';
import { Upload, TrendingUp, AlertTriangle } from 'lucide-react';

export function VotingDataImport() {
  const [importedData, setImportedData] = useState([]);

  const seriesData = [
    { id: 1, name: 'The Last Warrior', currentVotes: 8542, expectedRate: 8000, status: 'exceeding' },
    { id: 2, name: 'Moonlight Chronicles', currentVotes: 6234, expectedRate: 7000, status: 'below' },
    { id: 3, name: 'Dark Academia', currentVotes: 4891, expectedRate: 4500, status: 'meeting' },
  ];

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Phase 3: Importing reader voting data from:', file.name);
      console.log('Auto-calculating leaderboard and ranking after import');
      console.log('Editorial Board will evaluate if changes are needed based on rankings');
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1>Rating Data Import</h1>
        <p className="text-muted-foreground mt-1">Import reader rating data and track series performance</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 space-y-6">
        <h2>Import Rating Data</h2>
        <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer">
          <Upload className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-muted-foreground mb-2">Click to upload voting data file</p>
          <p className="text-sm text-muted-foreground mb-4">CSV, XLSX up to 10MB</p>
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleImport}
            className="hidden"
            id="voting-import"
          />
          <label
            htmlFor="voting-import"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            Choose File
          </label>
        </div>
        <div className="bg-info/10 border border-info/30 rounded-lg p-4">
          <p className="text-sm text-info">
            After importing, the leaderboard will be automatically calculated and series performance will be evaluated
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 space-y-6">
        <h2>Series Performance vs Expectation</h2>
        <div className="space-y-4">
          {seriesData.map((series) => {
            const percentage = ((series.currentVotes / series.expectedRate) * 100).toFixed(1);
            const isLow = series.currentVotes < series.expectedRate;
            const isMeeting = Math.abs(series.currentVotes - series.expectedRate) / series.expectedRate < 0.1;

            return (
              <div key={series.id} className="border border-border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3>{series.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Expected: {series.expectedRate.toLocaleString()} votes
                    </p>
                  </div>
                  {isLow ? (
                    <span className="flex items-center gap-2 px-3 py-1 bg-warning/10 text-warning border border-warning/30 rounded-full text-sm">
                      <AlertTriangle size={16} />
                      Below Target
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 px-3 py-1 bg-success/10 text-success border border-success/30 rounded-full text-sm">
                      <TrendingUp size={16} />
                      {isMeeting ? 'Meeting Target' : 'Exceeding Target'}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Votes: {series.currentVotes.toLocaleString()}</span>
                    <span className={isLow ? 'text-warning' : 'text-success'}>{percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        isLow ? 'bg-warning' : 'bg-success'
                      }`}
                      style={{ width: `${Math.min(parseFloat(percentage), 100)}%` }}
                    />
                  </div>
                </div>

                {isLow && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-warning mb-3">Phase 3: Low performance detected - Action required</p>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity">
                        Cancel Series Publication
                      </button>
                      <button className="px-4 py-2 bg-warning text-warning-foreground rounded-lg hover:opacity-90 transition-opacity">
                        Send Feedback & Continue
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
