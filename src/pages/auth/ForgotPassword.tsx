import { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <h3 className="text-center text-xl font-bold mb-6">Reset your password</h3>
      
      {submitted ? (
        <div className="text-center">
          <div className="rounded-full bg-primary-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-slate-700 mb-4">
            We've sent a password reset link to your email address.
          </p>
          <Link to="/auth/login" className="text-primary-600 hover:text-primary-500 font-medium">
            Back to login
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-600 mb-4">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 input-field"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-2"
            >
              Send reset link
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/auth/login" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              Back to login
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;