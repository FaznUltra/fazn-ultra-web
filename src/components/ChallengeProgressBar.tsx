'use client';

import { CheckCircle, Circle, Clock } from 'lucide-react';
import { ChallengeStatus } from '@/types/challenge';

interface ChallengeProgressBarProps {
  status: ChallengeStatus;
  hasWitness: boolean;
  hasRoomCode: boolean;
  bothPlayersJoined: boolean;
}

const stages = [
  { key: 'created', label: 'Created', icon: CheckCircle },
  { key: 'accepted', label: 'Accepted', icon: CheckCircle },
  { key: 'witness', label: 'Witness', icon: CheckCircle },
  { key: 'roomCode', label: 'Room Code', icon: CheckCircle },
  { key: 'playersReady', label: 'Players Ready', icon: CheckCircle },
  { key: 'live', label: 'Live Match', icon: Clock },
  { key: 'completed', label: 'Completed', icon: CheckCircle },
];

export function ChallengeProgressBar({ 
  status, 
  hasWitness, 
  hasRoomCode, 
  bothPlayersJoined 
}: ChallengeProgressBarProps) {
  
  const getCurrentStage = (): number => {
    if (status === 'COMPLETED' || status === 'SETTLED') return 6;
    if (status === 'LIVE') return 5;
    if (bothPlayersJoined) return 4;
    if (hasRoomCode) return 3;
    if (hasWitness) return 2;
    if (status === 'ACCEPTED') return 1;
    return 0;
  };

  const currentStage = getCurrentStage();

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-6">Challenge Progress</h3>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
            style={{ width: `${(currentStage / (stages.length - 1)) * 100}%` }}
          />
        </div>

        {/* Stages */}
        <div className="relative flex justify-between">
          {stages.map((stage, index) => {
            const isCompleted = index <= currentStage;
            const isCurrent = index === currentStage;
            const Icon = stage.icon;

            return (
              <div key={stage.key} className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300
                    ${isCompleted 
                      ? 'bg-gradient-to-r from-green-500 to-green-400 text-white shadow-lg shadow-green-500/50' 
                      : 'bg-card border-2 border-border text-muted-foreground'
                    }
                    ${isCurrent ? 'ring-4 ring-green-500/20 scale-110' : ''}
                  `}
                >
                  {isCompleted ? (
                    <Icon className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`
                    mt-2 text-xs font-medium text-center max-w-[80px]
                    ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}
                    ${isCurrent ? 'text-green-400 font-semibold' : ''}
                  `}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
