import { useQuery } from '@tanstack/react-query';
import { leaderboardService } from '@/services/leaderboard.service';

export const useLeaderboard = () => {
  const { data: topEarnersData, isLoading: isTopEarnersLoading } = useQuery({
    queryKey: ['top-earners'],
    queryFn: () => leaderboardService.getTopEarners(10),
  });

  const { data: topWitnessesData, isLoading: isTopWitnessesLoading } = useQuery({
    queryKey: ['top-witnesses'],
    queryFn: () => leaderboardService.getTopWitnesses(10),
  });

  const { data: topWinRateData, isLoading: isTopWinRateLoading } = useQuery({
    queryKey: ['top-win-rate'],
    queryFn: () => leaderboardService.getTopWinRate(10, 10),
  });

  const { data: risingStarsData, isLoading: isRisingStarsLoading } = useQuery({
    queryKey: ['rising-stars'],
    queryFn: () => leaderboardService.getRisingStars(10),
  });

  const { data: platformStatsData, isLoading: isPlatformStatsLoading } = useQuery({
    queryKey: ['platform-stats'],
    queryFn: leaderboardService.getPlatformStats,
  });

  return {
    topEarners: topEarnersData?.data?.leaderboard || [],
    isTopEarnersLoading,
    topWitnesses: topWitnessesData?.data?.leaderboard || [],
    isTopWitnessesLoading,
    topWinRate: topWinRateData?.data?.leaderboard || [],
    isTopWinRateLoading,
    risingStars: risingStarsData?.data?.leaderboard || [],
    isRisingStarsLoading,
    platformStats: platformStatsData?.data,
    isPlatformStatsLoading,
  };
};

export const useHomeScreenData = () => {
  return useQuery({
    queryKey: ['home-screen-data'],
    queryFn: leaderboardService.getHomeScreenData,
    staleTime: 5 * 60 * 1000,
  });
};

export const useLiveChallenges = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['live-challenges', page, limit],
    queryFn: () => leaderboardService.getLiveChallenges(page, limit),
  });
};

export const useFeaturedChallenges = (limit: number = 10) => {
  return useQuery({
    queryKey: ['featured-challenges', limit],
    queryFn: () => leaderboardService.getFeaturedChallenges(limit),
  });
};
