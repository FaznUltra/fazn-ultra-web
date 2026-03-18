'use client';

import { useHomeScreenData } from '@/hooks/useLeaderboard';
import { useChallenges } from '@/hooks/useChallenges';

export default function HomePage() {
  const { data: homeData, isLoading } = useHomeScreenData();
  const { stats } = useChallenges();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Hero Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">Total Challenges</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats?.totalChallenges || 0}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">Wins</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {stats?.wins || 0}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">Active</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {stats?.activeChallenges || 0}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">Earnings</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              ₦{stats?.totalWinnings?.toLocaleString() || 0}
            </p>
          </div>
        </div>

        {/* Platform Stats */}
        {homeData?.platformStats?.data && (
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <h2 className="text-lg font-bold mb-4">Platform Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm opacity-90">Total Players</p>
                <p className="text-2xl font-bold">
                  {homeData.platformStats.data.totalPlayers?.toLocaleString() || 0}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-90">Active Challenges</p>
                <p className="text-2xl font-bold">
                  {homeData.platformStats.data.activeChallenges || 0}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-90">Total Staked</p>
                <p className="text-2xl font-bold">
                  ₦{homeData.platformStats.data.totalStaked?.toLocaleString() || 0}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-90">Total Paid Out</p>
                <p className="text-2xl font-bold">
                  ₦{homeData.platformStats.data.totalPaidOut?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
              <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center mb-2">
                <span className="text-2xl">🎮</span>
              </div>
              <span className="text-sm font-semibold">New Challenge</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors">
              <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center mb-2">
                <span className="text-2xl">👥</span>
              </div>
              <span className="text-sm font-semibold">Find Friends</span>
            </button>
          </div>
        </div>

        {/* Coming Soon Sections */}
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">More features coming soon...</p>
        </div>
      </div>
    </div>
  );
}
