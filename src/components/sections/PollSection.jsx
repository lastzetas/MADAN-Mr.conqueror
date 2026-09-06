import React, { useState, useEffect } from 'react';
import { Vote, CheckCircle2, BarChart3, Users, Sparkles, TrendingUp } from 'lucide-react';
import { soundFx } from '../../utils/audio';
import { getStoredPolls, votePoll } from '../../utils/portalData';
import confetti from 'canvas-confetti';

export const PollSection = () => {
  const [polls, setPolls] = useState([]);
  const [userVotes, setUserVotes] = useState({});

  useEffect(() => {
    const loadPolls = () => {
      const allPolls = getStoredPolls();
      setPolls(allPolls.filter(p => p.status === 'ACTIVE'));

      // Check user previous votes
      const votesMap = {};
      allPolls.forEach(p => {
        const storedVote = localStorage.getItem(`voted_${p.id}`);
        if (storedVote !== null) {
          votesMap[p.id] = parseInt(storedVote, 10);
        }
      });
      setUserVotes(votesMap);
    };

    loadPolls();

    const handleUpdate = () => loadPolls();
    window.addEventListener('portal_polls_updated', handleUpdate);
    return () => window.removeEventListener('portal_polls_updated', handleUpdate);
  }, []);

  const handleVote = (pollId, optionIndex) => {
    if (userVotes[pollId] !== undefined) return; // Already voted

    soundFx.playVictory();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#E5C05B', '#2DD4BF', '#FFD700']
    });

    const updated = votePoll(pollId, optionIndex);
    setUserVotes(prev => ({ ...prev, [pollId]: optionIndex }));
  };

  if (polls.length === 0) return null;

  return (
    <section id="community-poll" className="w-full mb-8">
      <div className="rounded-2xl p-6 sm:p-8 bg-[#0C0F15] border border-[#1E2433] relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-[#1E2536] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-[10px] font-montserrat font-bold uppercase tracking-wider mb-2">
              <Vote className="w-3.5 h-3.5" />
              <span>COMMUNITY VOICE</span>
            </div>
            <h3 className="font-montserrat font-extrabold text-base sm:text-xl text-white uppercase tracking-wider">
              LIVE ARENA POLL
            </h3>
            <p className="font-rajdhani text-xs text-[#788294] font-medium mt-0.5">
              Vote to decide upcoming match formats, customs maps, and prize distributions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              VOTING OPEN
            </span>
          </div>
        </div>

        {/* Polls Container */}
        <div className="space-y-6">
          {polls.map((poll) => {
            const totalVotes = (poll.options || []).reduce((acc, opt) => acc + (opt.votes || 0), 0);
            const hasVoted = userVotes[poll.id] !== undefined;

            return (
              <div
                key={poll.id}
                className="p-5 sm:p-6 rounded-xl bg-[#11151E] border border-[#1E2536] space-y-4"
              >
                <div>
                  <h4 className="font-montserrat font-bold text-sm sm:text-base text-white">
                    {poll.question}
                  </h4>
                  {poll.description && (
                    <p className="font-rajdhani text-xs text-[#788294] mt-1">
                      {poll.description}
                    </p>
                  )}
                </div>

                {/* Options List */}
                <div className="space-y-2.5">
                  {poll.options.map((opt, idx) => {
                    const percentage = totalVotes > 0 ? Math.round(((opt.votes || 0) / totalVotes) * 100) : 0;
                    const isSelected = userVotes[poll.id] === idx;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleVote(poll.id, idx)}
                        disabled={hasVoted}
                        onMouseEnter={() => !hasVoted && soundFx.playHover()}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all relative overflow-hidden group cursor-pointer ${
                          isSelected
                            ? 'bg-[#16202C] border-teal-500/80 shadow-[0_0_15px_rgba(45,212,191,0.2)]'
                            : hasVoted
                            ? 'bg-[#0E121A] border-[#1E2536] opacity-90 cursor-default'
                            : 'bg-[#0E121A] hover:bg-[#161B26] border-[#1E2536] hover:border-[#E5C05B]/60'
                        }`}
                      >
                        {/* Progress Bar Fill */}
                        {hasVoted && (
                          <div
                            className={`absolute left-0 top-0 bottom-0 transition-all duration-700 ${
                              isSelected ? 'bg-teal-500/20' : 'bg-slate-700/20'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        )}

                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                              isSelected
                                ? 'border-teal-400 bg-teal-400 text-[#0A0D12]'
                                : 'border-gray-600 text-gray-400 group-hover:border-[#E5C05B]'
                            }`}>
                              {isSelected ? '✓' : idx + 1}
                            </div>
                            <span className={`text-xs font-montserrat font-semibold ${
                              isSelected ? 'text-teal-300' : 'text-gray-200 group-hover:text-white'
                            }`}>
                              {opt.text}
                            </span>
                          </div>

                          {hasVoted && (
                            <div className="flex items-center gap-2 font-mono">
                              <span className="text-[11px] text-gray-400">
                                {opt.votes || 0} votes
                              </span>
                              <span className={`text-xs font-black ${
                                isSelected ? 'text-teal-400' : 'text-[#E5C05B]'
                              }`}>
                                {percentage}%
                              </span>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Poll Footer Summary */}
                <div className="flex items-center justify-between text-[11px] font-mono text-[#788294] pt-2 border-t border-[#1E2536]">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-teal-400" />
                    <span>{totalVotes.toLocaleString()} Total Votes Cast</span>
                  </span>
                  <span>{hasVoted ? '✓ Your Vote Recorded' : 'Click any option to vote'}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default PollSection;
