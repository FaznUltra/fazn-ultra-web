'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Phone, Shield } from 'lucide-react';

interface PhoneVerificationProps {
  onVerified: () => void;
}

export function PhoneVerification({ onVerified }: PhoneVerificationProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [loading, setLoading] = useState(false);

  const sendCode = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.post('/auth/send-verification-code', { phoneNumber });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Verification code sent to your phone');
      setStep('code');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.post('/auth/verify-phone', { phoneNumber, code: verificationCode });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Phone number verified successfully!');
      onVerified();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            {step === 'phone' ? (
              <Phone className="w-8 h-8 text-blue-600" />
            ) : (
              <Shield className="w-8 h-8 text-blue-600" />
            )}
          </div>
        </div>
        <h2 className="text-2xl font-bold">
          {step === 'phone' ? 'Verify Your Phone' : 'Enter Verification Code'}
        </h2>
        <p className="text-sm text-gray-600">
          {step === 'phone' 
            ? 'Phone verification is required to witness matches' 
            : `We sent a 6-digit code to ${phoneNumber}`}
        </p>
      </div>

      {step === 'phone' ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="phone"
                type="tel"
                placeholder="+234 800 000 0000"
                value={phoneNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-base font-medium text-black placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={sendCode}
            disabled={loading}
            className="h-14 w-full rounded-2xl bg-blue-600 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending Code...
              </span>
            ) : (
              'Send Verification Code'
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Shield className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="code"
                type="text"
                placeholder="000000"
                maxLength={6}
                value={verificationCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-center text-2xl tracking-widest font-mono text-black placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={verifyCode}
            disabled={loading}
            className="h-14 w-full rounded-2xl bg-blue-600 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </span>
            ) : (
              'Verify Phone Number'
            )}
          </button>

          <button
            onClick={() => setStep('phone')}
            className="h-14 w-full rounded-2xl bg-gray-100 font-semibold text-gray-700 transition-colors hover:bg-gray-200"
          >
            Change Phone Number
          </button>
        </div>
      )}
    </div>
  );
}
