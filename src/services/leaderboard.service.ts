import { apiClient } from '@/lib/axios';

class LeaderboardService {
  async getTopEarners(limit: number = 10) {
    const response = await apiClient.get(`/leaderboard/top-earners?limit=${limit}`);
    return response.data;
  }

  async getTopWitnesses(limit: number = 10) {
    const response = await apiClient.get(`/leaderboard/top-witnesses?limit=${limit}`);
    return response.data;
  }

  async getTopWinRate(limit: number = 10, minChallenges: number = 10) {
    const response = await apiClient.get(`/leaderboard/top-win-rate?limit=${limit}&minChallenges=${minChallenges}`);
    return response.data;
  }

  async getRisingStars(limit: number = 10) {
    const response = await apiClient.get(`/leaderboard/rising-stars?limit=${limit}`);
    return response.data;
  }

  async getLiveChallenges(page: number = 1, limit: number = 20) {
    const response = await apiClient.get(`/leaderboard/live-challenges?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getFeaturedChallenges(limit: number = 10) {
    const response = await apiClient.get(`/leaderboard/featured-challenges?limit=${limit}`);
    return response.data;
  }

  async getRecentHighlights(limit: number = 10) {
    const response = await apiClient.get(`/leaderboard/recent-highlights?limit=${limit}`);
    return response.data;
  }

  async getPlayerOfTheWeek() {
    const response = await apiClient.get('/leaderboard/player-of-the-week');
    return response.data;
  }

  async getMatchOfTheWeek() {
    const response = await apiClient.get('/leaderboard/match-of-the-week');
    return response.data;
  }

  async getPlatformStats() {
    const response = await apiClient.get('/leaderboard/platform-stats');
    return response.data;
  }

  async getTrendingGames(limit: number = 10) {
    const response = await apiClient.get(`/leaderboard/trending-games?limit=${limit}`);
    return response.data;
  }

  async getPopularPlatforms(limit: number = 10) {
    const response = await apiClient.get(`/leaderboard/popular-platforms?limit=${limit}`);
    return response.data;
  }

  async getHomeScreenData() {
    const [
      playerOfWeek,
      matchOfWeek,
      liveChallenges,
      featuredChallenges,
      topEarners,
      topWitnesses,
      recentHighlights,
      platformStats,
      trendingGames,
    ] = await Promise.all([
      this.getPlayerOfTheWeek(),
      this.getMatchOfTheWeek(),
      this.getLiveChallenges(1, 10),
      this.getFeaturedChallenges(5),
      this.getTopEarners(10),
      this.getTopWitnesses(10),
      this.getRecentHighlights(5),
      this.getPlatformStats(),
      this.getTrendingGames(5),
    ]);

    return {
      playerOfWeek,
      matchOfWeek,
      liveChallenges,
      featuredChallenges,
      topEarners,
      topWitnesses,
      recentHighlights,
      platformStats,
      trendingGames,
    };
  }
}

export const leaderboardService = new LeaderboardService();
