import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ProgressBar } from '@/components/ProgressBar';
import { StatsWidget } from '@/components/StatsWidget';
import { HowItWorks } from '@/components/HowItWorks';
import { useApi } from '@/lib/api';
import { mockApi } from '@/lib/mock';

async function getData() {
  const api = process.env.NEXT_PUBLIC_USE_MOCKS === 'true' ? mockApi : useApi();
  
  try {
    const [petition, stats, config] = await Promise.all([
      api.getPetition(),
      api.getStats(),
      api.getConfig(),
    ]);
    return { petition, stats, config };
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return { petition: null, stats: null, config: null };
  }
}

export default async function Home() {
  const { petition, stats, config } = await getData();

  if (!petition || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Unable to load petition data
          </h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  const excerpt = petition.bodyMarkdown
    .replace(/^#.*$/gm, '')
    .replace(/\*\*/g, '')
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('##'))
    .slice(0, 2)
    .join(' ')
    .substring(0, 200) + '...';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {petition.title}
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {excerpt}
              </p>
              <div className="mb-8">
                <ProgressBar 
                  current={stats.count} 
                  goal={stats.goal}
                  className="max-w-md"
                />
              </div>
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link href="/petition">
                  Sign the Petition
                </Link>
              </Button>
            </div>
            
            <div className="order-1 lg:order-2">
              <HeroCarousel images={petition.heroImages} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Join {stats.count.toLocaleString()} Others
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              People from across the country are making their voices heard. Add yours today.
            </p>
          </div>
          
          <StatsWidget stats={stats} showRecent={config?.showRecent ?? true} />
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Who We Are */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Who We Are
          </h2>
          <div className="text-lg text-gray-600 space-y-4 leading-relaxed">
            <p>
              We are a grassroots organization dedicated to creating positive change in our communities. 
              Our mission is to amplify the voices of concerned citizens and drive meaningful policy reform.
            </p>
            <p>
              Every petition we support is carefully researched and designed to create real, lasting impact. 
              We believe that when people come together, they can achieve extraordinary things.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}