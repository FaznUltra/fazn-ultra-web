'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useHomeScreenData } from '@/hooks/useLeaderboard';
import { useChallenges } from '@/hooks/useChallenges';
import { Trophy, TrendingUp, Zap, Eye, Swords, Users, ArrowRight, Flame, Star, Crown, Gamepad2, Target, TrendingDown, Clock, Award, User } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { data: homeData, isLoading, error } = useHomeScreenData();
  const { stats } = useChallenges();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-200" style={{ borderTopColor: 'var(--ultra-primary)' }} />
      </div>
    );
  }

  const statCards = [
    { label: 'Challenges Played', value: stats?.totalChallenges || 0, icon: Swords, color: '#7C8CFF', bg: 'rgba(124,140,255,0.1)' },
    { label: 'Wins', value: stats?.wins || 0, icon: Trophy, color: '#00FFB2', bg: 'rgba(0,255,178,0.1)' },
    { label: 'Active Matches', value: stats?.activeChallenges || 0, icon: Zap, color: '#FBCB4A', bg: 'rgba(251,203,74,0.08)' },
    { label: 'Total Earnings', value: `₦${(stats?.totalWinnings || 0).toLocaleString()}`, icon: TrendingUp, color: '#FF61D6', bg: 'rgba(255,97,214,0.08)' },
  ];

  const platformStats = homeData?.platformStats?.data;

  const heroMetrics = [
    { label: 'Active Players', value: platformStats?.users?.activeThisWeek?.toLocaleString() || '0', icon: Users },
    { label: 'Matches Live', value: platformStats?.challenges?.live || 0, icon: Eye },
    { label: 'Paid Out Today', value: `₦${((platformStats?.economy?.totalPaidOut || 0) / 1_000_000).toFixed(1)}M`, icon: TrendingUp },
  ];

  const communityFeed = [
    ...(homeData?.userRecentActivity?.data?.activity?.slice(0, 4).map((activity: any) => ({
      id: `${activity.challengeId}-activity`,
      title: activity.description,
      subtitle: `${activity.gameName?.replace(/_/g, ' ')} • ₦${activity.stakeAmount?.toLocaleString()}`,
      tag: activity.activityType,
    })) || []),
    ...(homeData?.recentHighlights?.data?.highlights?.slice(0, 2).map((highlight: any) => ({
      id: `${highlight.challengeId}-highlight`,
      title: `${highlight.winner?.displayName} won ₦${highlight.winnerPayout?.toLocaleString()}`,
      subtitle: `${highlight.gameName?.replace(/_/g, ' ')} • Final ${highlight.finalScore?.creator}-${highlight.finalScore?.acceptor}`,
      tag: 'highlight',
    })) || []),
    ...(homeData?.openChallenges?.data?.challenges?.slice(0, 2).map((challenge: any) => ({
      id: `${challenge._id}-open`,
      title: `${challenge.creator?.displayName} opened ${challenge.gameName?.replace(/_/g, ' ')}`,
      subtitle: `₦${challenge.stakeAmount?.toLocaleString()} • ${challenge.challengeType}`,
      tag: 'challenge',
    })) || []),
  ].slice(0, 6);

  const getTagStyles = (tag: string) => {
    const palette: Record<string, { bg: string; color: string; label: string }> = {
      won: { bg: 'rgba(0,255,178,0.12)', color: '#00FFB2', label: 'Victory' },
      lost: { bg: 'rgba(255,97,214,0.12)', color: '#FF61D6', label: 'Setback' },
      live: { bg: 'rgba(251,203,74,0.15)', color: '#FBCB4A', label: 'Live' },
      highlight: { bg: 'rgba(255,255,255,0.12)', color: '#FFFFFF', label: 'Highlight' },
      challenge: { bg: 'rgba(124,140,255,0.15)', color: '#7C8CFF', label: 'Challenge' },
    };
    return palette[tag] || { bg: 'rgba(255,255,255,0.08)', color: '#FFFFFF', label: tag };
  };

  return (
    <div className="min-h-screen bg-[#03060b] text-white">
      <div className="max-w-6xl mx-auto px-4 py-6 pb-28 space-y-6">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#131A31] via-[#0B0F1B] to-[#05070C] p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs uppercase tracking-[0.4em] text-[#00FFB2]">FAZN Social Arena</span>
              <h1 className="text-3xl md:text-4xl font-bold leading-snug">
                Bring the crew, drop a challenge, <span className="text-[#00FFB2]">own the spotlight.</span>
              </h1>
              <p className="text-sm text-white/70 max-w-xl">
                Track friends, witness insane wins, and jump into live matches from one hyper-social dashboard.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/create-challenge" className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold" style={{ background: '#00FFB2', color: '#05070b' }}>
                  Drop a Challenge
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/spectate" className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold border border-white/10 text-white/90">
                  Watch Live Matches
                  <Eye className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:w-1/2">
              {heroMetrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl bg-white/5 border border-white/5 p-4 backdrop-blur">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-white/60">
                    <metric.icon className="h-3.5 w-3.5" />
                    {metric.label}
                  </div>
                  <p className="mt-2 text-2xl font-bold">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 w-1/2 pointer-events-none" style={{ background: 'radial-gradient(circle at top, rgba(0,255,178,0.25), transparent 60%)' }} />
        </section>

        {/* Personal Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {statCards.map((card) => (
            <div key={card.label} className="rounded-2xl p-4 border border-white/5" style={{ background: '#0A0F1A' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-2xl flex items-center justify-center" style={{ background: card.bg }}>
                  <card.icon className="h-4 w-4" style={{ color: card.color }} />
                </div>
                <span className="text-[11px] uppercase tracking-wide text-white/60">{card.label}</span>
              </div>
              <p className="text-2xl font-semibold">{card.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-[2fr,1.2fr]">
          {/* Community Feed */}
          <div className="rounded-3xl border border-white/5 bg-[#080C14] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Live Community Buzz</p>
                <h2 className="text-lg font-semibold">Friends, rivals & witnesses in motion</h2>
              </div>
              <Link href="/friends" className="text-xs font-semibold text-[#00FFB2]">Find Friends</Link>
            </div>
            <div className="space-y-3">
              {communityFeed.length > 0 ? (
                communityFeed.map((item) => {
                  const styles = getTagStyles(item.tag);
                  return (
                    <div key={item.id} className="rounded-2xl border border-white/5 bg-white/2 p-4 flex flex-col gap-1" style={{ background: '#0F1523' }}>
                      <div className="flex items-center justify-between text-sm">
                        <p className="font-semibold text-white/90">{item.title}</p>
                        <span className="text-[10px] px-2 py-1 rounded-full font-semibold" style={{ background: styles.bg, color: styles.color }}>
                          {styles.label}
                        </span>
                      </div>
                      <p className="text-xs text-white/60">{item.subtitle}</p>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-white/60">No recent community updates yet. Jump into a match!</p>
              )}
            </div>
          </div>

          {/* Spotlight Card */}
          <div className="rounded-3xl border border-white/5 bg-[#080C14] p-5 space-y-4">
            {homeData?.playerOfWeek?.data?.player ? (
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#00FFB2]">Player of the Week</p>
                <div className="mt-3 flex items-center gap-3">
                  {homeData.playerOfWeek.data.player.profileImage ? (
                    <img src={homeData.playerOfWeek.data.player.profileImage} alt={homeData.playerOfWeek.data.player.displayName} className="w-12 h-12 rounded-full border border-white/10" />
                  ) : (
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <User className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <p className="text-base font-semibold">{homeData.playerOfWeek.data.player.displayName}</p>
                    <p className="text-xs text-white/60">{homeData.playerOfWeek.data.player.weeklyWins} wins this week</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs border border-white/5 rounded-2xl">
                  <div className="p-3">
                    <p className="text-lg font-semibold">{homeData.playerOfWeek.data.player.winRate}%</p>
                    <p className="text-white/50">Win rate</p>
                  </div>
                  <div className="p-3 border-l border-r border-white/5">
                    <p className="text-lg font-semibold">{homeData.playerOfWeek.data.player.totalWins}</p>
                    <p className="text-white/50">Total wins</p>
                  </div>
                  <div className="p-3">
                    <p className="text-lg font-semibold">₦{(homeData.playerOfWeek.data.player.totalEarnings || 0).toLocaleString()}</p>
                    <p className="text-white/50">Earnings</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-white/60">No featured player just yet. Win more matches to claim the spotlight.</div>
            )}

            {homeData?.matchOfWeek?.data?.match && (
              <div className="rounded-2xl border border-white/5 p-4" style={{ background: '#0F1523' }}>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Match of the Week</p>
                <p className="mt-2 text-sm font-semibold">{homeData.matchOfWeek.data.match.gameName?.replace(/_/g, ' ')}</p>
                <p className="text-xs text-white/60">₦{homeData.matchOfWeek.data.match.stakeAmount?.toLocaleString()} stake • Witness: {homeData.matchOfWeek.data.match.witness?.displayName || 'TBD'}</p>
              </div>
            )}
          </div>
        </section>

        {/* Live Challenges */}
        {homeData?.liveChallenges?.data?.challenges && homeData.liveChallenges.data.challenges.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <h2 className="text-base font-semibold">Live Matches</h2>
              </div>
              <Link href="/spectate" className="text-xs font-semibold text-[#00FFB2]">View All</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
              {homeData.liveChallenges.data.challenges.slice(0, 6).map((challenge: any) => (
                <button
                  key={challenge._id}
                  onClick={() => router.push(`/challenges/${challenge._id}`)}
                  className="min-w-[220px] rounded-3xl border border-white/5 bg-[#080C14] p-4 text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-9 w-9 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <Gamepad2 className="h-4 w-4 text-white/80" />
                    </div>
                    <p className="text-sm font-semibold truncate">{challenge.gameName?.replace(/_/g, ' ')}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>Stake</span>
                    <span className="text-white">₦{challenge.stakeAmount?.toLocaleString()}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Open Challenges & Trending */}
        <section className="grid gap-4 md:grid-cols-2">
          {homeData?.openChallenges?.data?.challenges && homeData.openChallenges.data.challenges.length > 0 && (
            <div className="rounded-3xl border border-white/5 bg-[#080C14] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold">Open Challenges</h2>
                <Link href="/challenges" className="text-xs font-semibold text-[#00FFB2]">See all</Link>
              </div>
              <div className="space-y-3">
                {homeData.openChallenges.data.challenges.slice(0, 4).map((challenge: any) => (
                  <button key={challenge._id} onClick={() => router.push(`/challenges/${challenge._id}`)} className="w-full rounded-2xl border border-white/5 p-4 text-left" style={{ background: '#0F1523' }}>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-semibold">{challenge.gameName?.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-white/60">by {challenge.creator?.displayName}</p>
                      </div>
                      <p className="text-[#00FFB2]">₦{challenge.stakeAmount?.toLocaleString()}</p>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-white/60">
                      <span>{challenge.challengeType}</span>
                      {challenge.timeRemaining && <span>{Math.floor(challenge.timeRemaining / (1000 * 60 * 60))}h left</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {homeData?.trendingGames?.data?.games && homeData.trendingGames.data.games.length > 0 && (
            <div className="rounded-3xl border border-white/5 bg-[#080C14] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="h-4 w-4 text-[#FF6B6B]" />
                <h2 className="text-base font-semibold">Trending Games</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {homeData.trendingGames.data.games.slice(0, 4).map((game: any) => (
                  <div key={game.gameName} className="rounded-2xl border border-white/5 p-4" style={{ background: '#0F1523' }}>
                    <p className="text-xs text-white/60">Rank #{game.rank}</p>
                    <p className="mt-1 font-semibold">{game.gameName.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-white/60">{game.challengeCount} matches</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Top Earners & Biggest Wins */}
        <section className="grid gap-4 md:grid-cols-2">
          {homeData?.topEarners?.data?.leaderboard && homeData.topEarners.data.leaderboard.length > 0 && (
            <div className="rounded-3xl border border-white/5 bg-[#080C14] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="h-4 w-4 text-[#FBCB4A]" />
                <h2 className="text-base font-semibold">Top Earners</h2>
              </div>
              <div className="space-y-3">
                {homeData.topEarners.data.leaderboard.slice(0, 5).map((player: any, idx: number) => (
                  <div key={player.userId} className="flex items-center justify-between rounded-2xl border border-white/5 px-4 py-3" style={{ background: '#0F1523' }}>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: idx === 0 ? 'rgba(251,203,74,0.2)' : 'rgba(255,255,255,0.08)', color: idx === 0 ? '#FBCB4A' : '#FFFFFF' }}>
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{player.displayName}</p>
                        <p className="text-xs text-white/60">{player.totalChallenges} matches</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-[#00FFB2]">₦{player.totalEarnings?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {homeData?.biggestWinsToday?.data?.wins && homeData.biggestWinsToday.data.wins.length > 0 && (
            <div className="rounded-3xl border border-white/5 bg-[#080C14] p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-[#00FFB2]" />
                <h2 className="text-base font-semibold">Biggest Wins Today</h2>
              </div>
              <div className="space-y-3">
                {homeData.biggestWinsToday.data.wins.slice(0, 5).map((win: any) => (
                  <div key={win.challengeId} className="rounded-2xl border border-white/5 px-4 py-3" style={{ background: '#0F1523' }}>
                    <div className="flex items-center justify-between text-sm">
                      <p className="font-semibold">{win.winner?.displayName}</p>
                      <span className="text-[#00FFB2]">₦{win.winnerPayout?.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-white/60">{win.gameName?.replace(/_/g, ' ')} • {win.hoursAgo}h ago</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Highlights */}
        {homeData?.recentHighlights?.data?.highlights && homeData.recentHighlights.data.highlights.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-[#FF61D6]" />
              <h2 className="text-base font-semibold">Recent Highlights</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {homeData.recentHighlights.data.highlights.slice(0, 3).map((highlight: any) => (
                <div key={highlight.challengeId} className="rounded-3xl border border-white/5 bg-[#080C14] p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <p className="font-semibold">{highlight.gameName?.replace(/_/g, ' ')}</p>
                    <span className="text-[#FBCB4A]">₦{highlight.stakeAmount?.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-white/60">Final {highlight.finalScore?.creator} - {highlight.finalScore?.acceptor}</p>
                  <p className="text-sm text-white/80">{highlight.winner?.displayName} took home ₦{highlight.winnerPayout?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className="grid gap-3 md:grid-cols-3">
          <Link href="/create-challenge" className="rounded-3xl border border-white/5 bg-gradient-to-r from-[#00FFB2]/20 to-transparent p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Create Challenge</p>
              <p className="text-xs text-white/60">Set stakes, invite rivals</p>
            </div>
            <div className="h-11 w-11 rounded-2xl flex items-center justify-center bg-[#00FFB2]/20">
              <Swords className="h-5 w-5 text-[#00FFB2]" />
            </div>
          </Link>
          <Link href="/spectate" className="rounded-3xl border border-white/5 bg-[#080C14] p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Spectate Live</p>
              <p className="text-xs text-white/60">Catch intense moments</p>
            </div>
            <div className="h-11 w-11 rounded-2xl flex items-center justify-center bg-white/5">
              <Eye className="h-5 w-5 text-white" />
            </div>
          </Link>
          <Link href="/friends" className="rounded-3xl border border-white/5 bg-[#080C14] p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Grow Your Circle</p>
              <p className="text-xs text-white/60">Add friends & rivals</p>
            </div>
            <div className="h-11 w-11 rounded-2xl flex items-center justify-center bg-white/5">
              <Users className="h-5 w-5 text-white" />
            </div>
          </Link>
        </section>

        <footer className="rounded-3xl border border-white/5 bg-gradient-to-r from-[#131A31] to-[#05070C] p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold">Need to review your history?</p>
            <p className="text-xs text-white/60">See how far you've come and share receipts with the squad.</p>
          </div>
          <Link href="/challenge-history" className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-[#05070C]" style={{ background: '#00FFB2' }}>
            Challenge History
            <ArrowRight className="h-4 w-4" />
          </Link>
        </footer>
      </div>
    </div>
  );
}
