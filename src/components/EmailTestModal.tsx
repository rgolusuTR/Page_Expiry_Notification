import React, { useState } from 'react';
import { Mail, X, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { EmailService } from '../lib/emailService';

interface EmailTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailTestModal: React.FC<EmailTestModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSendTest = async () => {
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setIsSending(true);
    setStatus('sending');
    setMessage('Sending test email...');

    try {
      // Send test email using EmailService
      const result = await EmailService.sendTestEmail(email);

      setStatus('success');
      setMessage(result.message);
      
      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setMessage('');
        setEmail('');
      }, 3000);
    } catch (error) {
      console.error('Email test error:', error);
      setStatus('error');
      setMessage(error.message || 'Failed to send test email');
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    onClose();
    setStatus('idle');
    setMessage('');
    setEmail('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Mail className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Test Email Configuration</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address to test"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSending}
            />
            <p className="text-xs text-gray-500 mt-1">
              A test email will be sent to verify the email configuration
            </p>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
              status === 'success' ? 'bg-green-50 text-green-800' :
              status === 'error' ? 'bg-red-50 text-red-800' :
              'bg-blue-50 text-blue-800'
            }`}>
              {status === 'success' && <CheckCircle className="w-5 h-5" />}
              {status === 'error' && <AlertCircle className="w-5 h-5" />}
              {status === 'sending' && (
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              )}
              <span className="text-sm">{message}</span>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handleSendTest}
              disabled={isSending || !email}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Test Email</span>
                </>
              )}
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTestModal;