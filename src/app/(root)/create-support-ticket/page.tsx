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
    { id: 'account', name: 'Account', description: 'Login, profile, settings', icon: User, color: '#007AFF' },
    { id: 'payment', name: 'Payment', description: 'Deposits, withdrawals, wallet', icon: Wallet, color: '#34C759' },
    { id: 'challenge', name: 'Challenge', description: 'Game issues, disputes', icon: Gamepad2, color: '#FF9500' },
    { id: 'technical', name: 'Technical', description: 'Bugs, performance', icon: Settings, color: '#5856D6' },
    { id: 'other', name: 'Other', description: 'General inquiries', icon: HelpCircle, color: '#8E8E93' },
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
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white" style={{ borderBottom: '1px solid var(--ultra-border)' }}>
        <div className="flex items-center gap-3 h-12 px-4">
          <button onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" style={{ color: 'var(--ultra-text)' }} />
          </button>
          <h1 className="text-base font-bold" style={{ color: 'var(--ultra-text)' }}>Create Support Ticket</h1>
        </div>
      </div>

      <div className="p-4 pb-8 space-y-5">
        {/* Subject */}
        <div>
          <h2 className="text-sm font-bold mb-1" style={{ color: 'var(--ultra-text)' }}>Subject</h2>
          <p className="text-[11px] mb-2" style={{ color: 'var(--ultra-text-muted)' }}>
            Briefly describe your issue (minimum 5 characters)
          </p>
          <div className="bg-white rounded-xl flex items-center px-3 py-2.5" style={{ border: '1px solid var(--ultra-border)' }}>
            <FileText className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: 'var(--ultra-text-muted)' }} />
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Cannot login to my account"
              maxLength={100}
              className="flex-1 text-sm placeholder-gray-400 focus:outline-none"
              style={{ color: 'var(--ultra-text)' }}
            />
            <span className="text-[10px] ml-2 flex-shrink-0" style={{ color: 'var(--ultra-text-muted)' }}>{subject.length}/100</span>
          </div>
        </div>

        {/* Category */}
        <div>
          <h2 className="text-sm font-bold mb-1" style={{ color: 'var(--ultra-text)' }}>Category</h2>
          <p className="text-[11px] mb-2" style={{ color: 'var(--ultra-text-muted)' }}>
            Select the category that best describes your issue
          </p>
          <div className="space-y-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className="w-full bg-white rounded-xl p-3 flex items-center transition-all"
                  style={{
                    border: isSelected ? `2px solid var(--ultra-primary)` : '2px solid var(--ultra-border)',
                    background: isSelected ? 'var(--ultra-primary-light)' : 'white',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mr-3 flex-shrink-0"
                    style={{ backgroundColor: `${cat.color}15` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: cat.color }} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold" style={{ color: isSelected ? 'var(--ultra-primary)' : 'var(--ultra-text)' }}>
                      {cat.name}
                    </p>
                    <p className="text-[11px]" style={{ color: 'var(--ultra-text-muted)' }}>{cat.description}</p>
                  </div>
                  {isSelected && (
                    <CheckCircle className="h-4 w-4 ml-2 flex-shrink-0" style={{ color: 'var(--ultra-primary)' }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Message */}
        <div>
          <h2 className="text-sm font-bold mb-1" style={{ color: 'var(--ultra-text)' }}>Message</h2>
          <p className="text-[11px] mb-2" style={{ color: 'var(--ultra-text-muted)' }}>
            Provide detailed information (minimum 20 characters)
          </p>
          <div className="bg-white rounded-xl p-3" style={{ border: '1px solid var(--ultra-border)' }}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please describe your issue in detail..."
              maxLength={1000}
              rows={6}
              className="w-full text-sm placeholder-gray-400 focus:outline-none resize-none"
              style={{ color: 'var(--ultra-text)' }}
            />
            <p className="text-[10px] text-right mt-1" style={{ color: 'var(--ultra-text-muted)' }}>{message.length}/1000</p>
          </div>
        </div>

        {/* Tips */}
        <div className="rounded-xl p-3" style={{ background: '#FEF3C7', borderLeft: '3px solid #D97706' }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Lightbulb className="h-3.5 w-3.5" style={{ color: '#D97706' }} />
            <p className="text-xs font-bold" style={{ color: '#92400E' }}>Tips for Faster Resolution</p>
          </div>
          <div className="space-y-0.5">
            {['Be specific and include details', 'Mention any error messages', 'Include screenshots if possible', 'Provide steps to reproduce the issue'].map((tip) => (
              <p key={tip} className="text-[11px]" style={{ color: '#78350F' }}>• {tip}</p>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleCreateTicket}
          disabled={isCreating || !subject.trim() || !message.trim() || subject.length < 5 || message.length < 20}
          className="w-full py-3 text-white rounded-xl font-semibold text-sm disabled:opacity-50 transition-colors"
          style={{ background: 'var(--ultra-primary)' }}
        >
          {isCreating ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span>Creating...</span>
            </div>
          ) : (
            'Create Ticket'
          )}
        </button>
      </div>
    </div>
  );
}
