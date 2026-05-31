// import { useNavigate } from 'react-router';
import { BookOpen } from 'lucide-react';

export function HomePage() {
//   const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-md shadow-xl text-center">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BookOpen size={32} className="text-primary-foreground" />
        </div>
        <h1>Welcome to MangaK</h1>
        <p className="text-muted-foreground mt-2 mb-6">
          A complete manga/comic publishing management system
        </p>

        <button
        //   onClick={() => navigate('/')}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          Go to Login
        </button>

        <div className="mt-6 p-4 bg-muted rounded-lg text-left">
          <p className="text-sm font-medium mb-2">Quick Access:</p>
          <div className="space-y-2 text-sm">
            <button 
            // onClick={() => navigate('/mangaka')} 
            className="block text-primary hover:underline">
              → Mangaka Dashboard
            </button>
            <button 
            // onClick={() => navigate('/assistant')} 
            className="block text-primary hover:underline">
              → Assistant Dashboard
            </button>
            <button 
            // onClick={() => navigate('/tantou')}
            className="block text-primary hover:underline">
              → Tantou Editor Dashboard
            </button>
            <button 
            // onClick={() => navigate('/editorial')}
            className="block text-primary hover:underline">
              → Editorial Board Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
