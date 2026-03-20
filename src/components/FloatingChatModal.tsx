import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { PrivateChatRoom } from './PrivateChatRoom';

interface FloatingChatModalProps {
  challengeId: string;
  isCreator: boolean;
  isAcceptor: boolean;
  isWitness: boolean;
}

export function FloatingChatModal({ 
  challengeId, 
  isCreator, 
  isAcceptor, 
  isWitness 
}: FloatingChatModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 sm:bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-[#00FFB2] to-[#00CC8E] shadow-lg shadow-[#00FFB2]/30 flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl hover:shadow-[#00FFB2]/40 group"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6 text-[#080C14] group-hover:scale-110 transition-transform" />
        
        {/* Pulse animation */}
        <span className="absolute inset-0 rounded-full bg-[#00FFB2] opacity-75 animate-ping" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="fixed top-4 left-4 right-4 bottom-20 sm:inset-auto sm:right-6 sm:bottom-6 sm:top-6 sm:w-[480px] z-50 animate-in slide-in-from-bottom-8 sm:slide-in-from-right-8 duration-300">
            <div 
              className="h-full rounded-3xl border border-white/10 bg-[#080C14] shadow-2xl flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-[#00FFB2]/10 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00FFB2]/20 to-[#00FFB2]/5 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-[#00FFB2]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Private Chat</h3>
                    <p className="text-xs text-white/50">Challenge participants only</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4 text-white/70" />
                </button>
              </div>

              {/* Chat Content */}
              <div className="flex-1 min-h-0">
                <PrivateChatRoom
                  challengeId={challengeId}
                  isCreator={isCreator}
                  isAcceptor={isAcceptor}
                  isWitness={isWitness}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
