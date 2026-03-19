'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, User, Wallet, Gamepad2, Settings, HelpCircle, CheckCircle, Lightbulb } from 'lucide-react';
import { useSupport } from '@/hooks/useSupport';

export default function CreateSupportTicketPage() {
  const router = useRouter();
  const { createTicket, isCreating } = useSupport();
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('technical');
  const [message, setMessage] = useState('');

  const categories = [
    { id: 'account', name: 'Account', description: 'Login, profile, settings', icon: User, color: '#7C8CFF' },
    { id: 'payment', name: 'Payment', description: 'Deposits, withdrawals, wallet', icon: Wallet, color: '#FBCB4A' },
    { id: 'challenge', name: 'Challenge', description: 'Game issues, disputes', icon: Gamepad2, color: '#00FFB2' },
    { id: 'technical', name: 'Technical', description: 'Bugs, performance', icon: Settings, color: '#FF6B6B' },
    { id: 'other', name: 'Other', description: 'General inquiries', icon: HelpCircle, color: '#FF61D6' },
  ];

  const handleCreateTicket = () => {
    if (!subject.trim() || !message.trim()) {
      return;
    }

    if (subject.trim().length < 5) {
      return;
    }

    if (message.trim().length < 20) {
      return;
    }

    createTicket(
      {
        subject: subject.trim(),
        category,
        message: message.trim(),
      },
      {
        onSuccess: () => {
          router.back();
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#03060b] text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-xl border-b border-white/5" style={{ background: 'rgba(3,6,11,0.8)' }}>
        <div className="flex items-center gap-3 h-14 px-4">
          <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <ArrowLeft className="h-5 w-5 text-white/70" />
          </button>
          <h1 className="text-base font-bold">Create Support Ticket</h1>
        </div>
      </div>

      <div className="p-4 pb-8 space-y-6">
        {/* Subject */}
        <div>
          <h2 className="text-sm font-bold mb-1 text-white">Subject</h2>
          <p className="text-xs mb-3 text-white/50">
            Briefly describe your issue (minimum 5 characters)
          </p>
          <div className="rounded-xl flex items-center px-4 py-3 bg-white/5 border border-white/10 focus-within:ring-2 focus-within:ring-[#00FFB2]/50 focus-within:border-[#00FFB2]/50 transition-all">
            <FileText className="h-4 w-4 mr-2.5 flex-shrink-0 text-white/40" />
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Cannot login to my account"
              maxLength={100}
              className="flex-1 text-sm bg-transparent text-white placeholder:text-white/30 focus:outline-none"
            />
            <span className="text-[10px] ml-2 flex-shrink-0 text-white/30">{subject.length}/100</span>
          </div>
        </div>

        {/* Category */}
        <div>
          <h2 className="text-sm font-bold mb-1 text-white">Category</h2>
          <p className="text-xs mb-3 text-white/50">
            Select the category that best describes your issue
          </p>
          <div className="space-y-2.5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className="w-full rounded-xl p-3.5 flex items-center transition-all group"
                  style={{
                    border: isSelected ? `2px solid ${cat.color}` : '2px solid rgba(255,255,255,0.05)',
                    background: isSelected ? `${cat.color}15` : 'rgba(255,255,255,0.02)',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${cat.color}20` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: cat.color }} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold" style={{ color: isSelected ? cat.color : 'white' }}>
                      {cat.name}
                    </p>
                    <p className="text-xs text-white/40">{cat.description}</p>
                  </div>
                  {isSelected && (
                    <CheckCircle className="h-5 w-5 ml-2 flex-shrink-0" style={{ color: cat.color }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Message */}
        <div>
          <h2 className="text-sm font-bold mb-1 text-white">Message</h2>
          <p className="text-xs mb-3 text-white/50">
            Provide detailed information (minimum 20 characters)
          </p>
          <div className="rounded-xl p-4 bg-white/5 border border-white/10 focus-within:ring-2 focus-within:ring-[#00FFB2]/50 focus-within:border-[#00FFB2]/50 transition-all">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please describe your issue in detail..."
              maxLength={1000}
              rows={6}
              className="w-full text-sm bg-transparent text-white placeholder:text-white/30 focus:outline-none resize-none"
            />
            <p className="text-[10px] text-right mt-2 text-white/30">{message.length}/1000</p>
          </div>
        </div>

        {/* Tips */}
        <div className="rounded-xl p-4 border-l-4" style={{ background: 'rgba(251,203,74,0.08)', borderLeftColor: '#FBCB4A' }}>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-[#FBCB4A]" />
            <p className="text-xs font-bold text-[#FBCB4A]">Tips for Faster Resolution</p>
          </div>
          <div className="space-y-1">
            {['Be specific and include details', 'Mention any error messages', 'Include screenshots if possible', 'Provide steps to reproduce the issue'].map((tip) => (
              <p key={tip} className="text-xs text-white/60">• {tip}</p>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleCreateTicket}
          disabled={isCreating || !subject.trim() || !message.trim() || subject.length < 5 || message.length < 20}
          className="w-full py-3.5 rounded-2xl font-bold text-sm disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: '#00FFB2', color: '#05070b' }}
        >
          {isCreating ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#05070b]/20 border-t-[#05070b]"></div>
              <span>Creating Ticket...</span>
            </div>
          ) : (
            'Create Ticket'
          )}
        </button>
      </div>
    </div>
  );
}
