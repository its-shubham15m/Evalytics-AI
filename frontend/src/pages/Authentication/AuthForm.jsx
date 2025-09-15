import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../utils/UserContext';
import api from '../../utils/api';

export default function AuthForm({ type }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();

  // Signup-specific fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const validateSignup = () => {
    if (!firstName || !lastName || !email || !phoneNumber || !username || !password || !confirmPassword) {
      return 'Please fill in all required fields.';
    }
    if (firstName.length < 2 || lastName.length < 2) {
      return 'First Name and Last Name must be at least 2 characters long.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }
    const fullPhoneNumber = countryCode + phoneNumber;
    const phoneRegex = /^\+\d{1,3}\d{10}$/;
    if (!phoneRegex.test(fullPhoneNumber)) {
      return 'Please enter a valid 10-digit phone number with country code.';
    }
    const usernameRegex = /^[a-zA-Z0-9]{5,15}$/;
    if (!usernameRegex.test(username)) {
      return 'Username must be 5-15 characters long and contain only letters and numbers.';
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return 'Password must be at least 8 characters long and include letters, numbers, and one special character.';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }
    if (!agreedToTerms) {
      return 'You must agree to the terms and conditions.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (type === 'signup') {
        const validationError = validateSignup();
        if (validationError) return setError(validationError);

        const payload = {
          firstName,
          lastName,
          email,
          phoneNumber: countryCode + phoneNumber,
          username,
          password,
        };

        const res = await api.post('/signup', payload);
        setMessage(res.data.message);

        setFirstName('');
        setLastName('');
        setEmail('');
        setCountryCode('+91');
        setPhoneNumber('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setAgreedToTerms(false);
        setShowPassword(false);

        navigate('/login');
      } else {
        const res = await api.post('/login', { username, password });
        setUser(res.data.user);
        setMessage(res.data.message);

        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.response?.data?.message || 'Something went wrong';
      setError(msg);
    }
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return '';
    if (password.length < 8) return 'Weak';
    if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) return 'Strong';
    return 'Moderate';
  };

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        {type === 'login' ? 'Login' : 'Sign Up'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-md border border-red-200 dark:border-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 rounded-md border border-green-200 dark:border-green-700">
          {message}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {type === 'signup' && (
          <>
            <div className="flex space-x-4">
              <input
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                type="text"
                placeholder="First Name"
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                autoComplete="given-name"
              />
              <input
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                type="text"
                placeholder="Last Name"
                required
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                autoComplete="family-name"
              />
            </div>

            <input
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />

            <div className="flex space-x-4">
              <select
                className="w-1/4 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                value={countryCode}
                onChange={e => setCountryCode(e.target.value)}
              >
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
              </select>
              <input
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                type="tel"
                placeholder="Phone Number (10 digits)"
                required
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                autoComplete="tel-national"
                maxLength="10"
              />
            </div>
          </>
        )}

        <input
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoComplete="username"
        />

        <input
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete={type === 'login' ? 'current-password' : 'new-password'}
        />

        <label className="flex items-center text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            className="mr-2 h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          Show Password
        </label>

        {type === 'signup' && password.length > 0 && (
          <p className={`text-sm font-medium ${
            getPasswordStrength() === 'Weak' ? 'text-red-500' :
            getPasswordStrength() === 'Moderate' ? 'text-yellow-500' :
            'text-green-500'
          }`}>
            Strength: {getPasswordStrength()}
          </p>
        )}

        {type === 'signup' && (
          <>
            <input
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              type={showPassword ? 'text' : 'password'}
              placeholder="Rewrite Password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
            <label className="flex items-center text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                checked={agreedToTerms}
                onChange={() => setAgreedToTerms(!agreedToTerms)}
                required
              />
              I agree to the{' '}
              <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-1">
                Terms & Conditions
              </a>
            </label>
          </>
        )}

        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition duration-200 transform hover:-translate-y-0.5 shadow-md"
        >
          {type === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}