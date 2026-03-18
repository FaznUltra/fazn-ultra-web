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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-14 px-4">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Create Support Ticket</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="p-5 pb-8">
        {/* Subject */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Subject</h2>
          <p className="text-sm text-gray-500 mb-4">
            Briefly describe your issue (minimum 5 characters)
          </p>
          <div className="bg-white rounded-2xl border border-gray-200 flex items-center px-4 py-4">
            <FileText className="h-5 w-5 text-gray-400 mr-3" />
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Cannot login to my account"
              maxLength={100}
              className="flex-1 text-base text-gray-900 placeholder-gray-400 focus:outline-none"
            />
            <span className="text-xs text-gray-400 ml-3">{subject.length}/100</span>
          </div>
        </div>

        {/* Category */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Category</h2>
          <p className="text-sm text-gray-500 mb-4">
            Select the category that best describes your issue
          </p>
          <div className="space-y-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`w-full bg-white rounded-2xl border-2 p-4 flex items-center transition-all ${
                    category === cat.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{
                    borderColor: category === cat.id ? cat.color : undefined,
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mr-4"
                    style={{ backgroundColor: `${cat.color}20` }}
                  >
                    <Icon className="h-7 w-7" style={{ color: cat.color }} />
                  </div>
                  <div className="flex-1 text-left">
                    <p
                      className={`text-base font-semibold mb-0.5 ${
                        category === cat.id ? 'text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      {cat.name}
                    </p>
                    <p className="text-[13px] text-gray-500">{cat.description}</p>
                  </div>
                  {category === cat.id && (
                    <CheckCircle className="h-5 w-5 text-blue-600 ml-3" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Message */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Message</h2>
          <p className="text-sm text-gray-500 mb-4">
            Provide detailed information about your issue (minimum 20 characters)
          </p>
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please describe your issue in detail. Include any relevant information such as:

• What happened
• When it happened
• What you expected to happen
• Any error messages you saw"
              maxLength={1000}
              rows={8}
              className="w-full text-base text-gray-900 placeholder-gray-400 focus:outline-none resize-none"
            />
            <p className="text-xs text-gray-400 text-right mt-2">{message.length}/1000</p>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-yellow-50 rounded-2xl p-4 border-l-4 border-orange-500 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-5 w-5 text-orange-500" />
            <p className="text-base font-semibold text-gray-900">Tips for Faster Resolution</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">• Be specific and include details</p>
            <p className="text-sm text-gray-600">• Mention any error messages</p>
            <p className="text-sm text-gray-600">• Include screenshots if possible</p>
            <p className="text-sm text-gray-600">• Provide steps to reproduce the issue</p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleCreateTicket}
          disabled={isCreating || !subject.trim() || !message.trim() || subject.length < 5 || message.length < 20}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-semibold text-base hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/30 disabled:shadow-none"
        >
          {isCreating ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
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
