import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/Home';
import GameDetail from '@/pages/GameDetail';
import CategoryPage from '@/pages/CategoryPage';
import StatsPage from '@/pages/StatsPage';
import Apps from '@/pages/Apps';
import AppDetail from '@/pages/AppDetail';
import { SplashScreen } from '@/components/SplashScreen';
import { BottomNav } from '@/components/BottomNav';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { useEffect } from 'react';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/game/:id" component={GameDetail} />
      <Route path="/category/:name" component={CategoryPage} />
      <Route path="/stats" component={StatsPage} />
      <Route path="/apps" component={Apps} />
      <Route path="/app/:id" component={AppDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <SplashScreen>
            <Router />
            <BottomNav />
          </SplashScreen>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;