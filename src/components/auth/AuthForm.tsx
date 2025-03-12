import React, { useState, useRef } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Logo } from '../Logo';
import { Upload } from 'lucide-react';

type Step = 'login' | 'signup' | 'profile-1' | 'profile-2' | 'profile-3' | 'profile-4' | 'confirmation';

export function AuthForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    gender: '',
    dateOfBirth: '',
    languages: '',
    description: '',
    avatar: null as File | null,
    expertise: [] as string[],
    genderPreferences: '',
    ageGroupSpecialization: '',
    medicalSpecializations: '',
    yearsOfExperience: '',
    certifications: '',
    socialMediaLinks: '',
    idProof: null as File | null,
  });
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp } = useAuthStore();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      setFormData({ ...formData, avatar: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (step: Step): boolean => {
    setError(null);
    
    const emailRegex = /^[^\s]+$/; // Allow any non-whitespace character
    const today = new Date();
    const minAge = 18;
    
    switch (step) {
      case 'login':
        if (!formData.email || !emailRegex.test(formData.email)) {
          setError('Username cannot contain spaces');
          return false;
        }
        if (!formData.password || formData.password.length < 8) {
          setError('Password must be at least 8 characters long');
          return false;
        }
        break;

      case 'signup':
        if (!formData.email || !formData.email.includes('@')) {
          setError('Please enter a valid email address');
          return false;
        }
        if (!formData.password || formData.password.length < 8) {
          setError('Password must be at least 8 characters long');
          return false;
        }
        break;

      case 'profile-1':
        if (!formData.fullName || formData.fullName.length < 2) {
          setError('Full name must be at least 2 characters long');
          return false;
        }
        if (!formData.gender) {
          setError('Please select your gender');
          return false;
        }
        if (!formData.dateOfBirth) {
          setError('Date of birth is required');
          return false;
        } else {
          const birthDate = new Date(formData.dateOfBirth);
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age < minAge) {
            setError(`You must be at least ${minAge} years old`);
            return false;
          }
        }
        if (!formData.languages) {
          setError('Please specify at least one language');
          return false;
        }
        if (!formData.description || formData.description.length < 50) {
          setError('Description must be at least 50 characters long');
          return false;
        }
        if (!formData.avatar) {
          setError('Please upload a profile photo');
          return false;
        }
        break;

      case 'profile-2':
        if (formData.expertise.length === 0) {
          setError('Please select at least one expertise');
          return false;
        }
        if (formData.expertise.length > 5) {
          setError('You can select up to 5 areas of expertise');
          return false;
        }
        break;

      case 'profile-3':
        if (!formData.genderPreferences) {
          setError('Gender preferences are required');
          return false;
        }
        if (!formData.ageGroupSpecialization) {
          setError('Age group specialization is required');
          return false;
        }
        break;

      case 'profile-4':
        if (!formData.idProof) {
          setError('ID proof is required');
          return false;
        }
        if (!formData.yearsOfExperience || isNaN(Number(formData.yearsOfExperience))) {
          setError('Please enter valid years of experience');
          return false;
        }
        if (Number(formData.yearsOfExperience) > 50) {
          setError('Please enter a valid number of years');
          return false;
        }
        if (!formData.certifications) {
          setError('At least one certification is required');
          return false;
        }
        break;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep === 'login') {
      try {
        await signIn(formData.email, formData.password);
      } catch (err) {
        setError((err as Error).message);
      }
      return;
    }

    if (currentStep === 'signup') {
      if (!validateStep('signup')) {
        return;
      }
      setCurrentStep('profile-1');
      return;
    }

    // Handle profile steps
    switch (currentStep) {
      case 'profile-1':
        if (validateStep('profile-1')) {
          setCurrentStep('profile-2');
        }
        break;
      case 'profile-2':
        if (validateStep('profile-2')) {
          setCurrentStep('profile-3');
        }
        break;
      case 'profile-3':
        if (validateStep('profile-3')) {
          setCurrentStep('profile-4');
        }
        break;
      case 'profile-4':
        if (validateStep('profile-4')) {
          try {
            await signUp(formData.email, formData.password, formData);
            setCurrentStep('confirmation');
          } catch (err) {
            setError((err as Error).message);
          }
        }
        break;
    }
  };

  const renderSignUpForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full bg-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Email"
        />
      </div>

      <div>
        <input
          type="password"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full bg-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Password (min 8 characters)"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 transition-colors"
      >
        Next
      </button>
    </form>
  );

  const renderLoginForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full bg-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Username"
        />
      </div>

      <div>
        <input
          type="password"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full bg-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Password"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 transition-colors"
      >
        Login
      </button>
    </form>
  );

  const renderProfileStep1 = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-center mb-6">Create your profile</h2>
      
      <div className="flex justify-center mb-6">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative w-24 h-24 bg-[#2A2A2A] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#333333] transition-colors overflow-hidden"
        >
          {avatarPreview ? (
            <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <Upload className="w-8 h-8 text-gray-400" />
          )}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full bg-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Full Name"
          />
        </div>
        <div>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="w-full bg-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="date"
            value={formData.dateOfBirth}
            max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            className="w-full bg-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <input
            type="text"
            value={formData.languages}
            onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
            className="w-full bg-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Languages (comma separated)"
          />
        </div>
      </div>

      <div>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full bg-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
          placeholder="Tell us about yourself (min 50 characters)"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 transition-colors"
      >
        Next
      </button>

      <div className="flex justify-center gap-2 mt-4">
        <div className="w-2 h-2 rounded-full bg-purple-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
      </div>
    </form>
  );

  const renderProfileStep2 = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-center mb-6">What is your niche?</h2>
      <p className="text-center text-gray-400 mb-6">Select all the Exercise methods you prefer teaching (max 5)</p>

      <div className="grid grid-cols-2 gap-4">
        {[
          'Home Workouts',
          'Strength Training',
          'Yoga',
          'HIIT',
          'Pilates',
          'Aerobics',
          'Weight-lifting',
          'Specialized training',
          'Calisthenics',
          'Swimming/Exercises'
        ].map((method) => (
          <label key={method} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.expertise.includes(method)}
              onChange={(e) => {
                const newExpertise = e.target.checked
                  ? [...formData.expertise, method]
                  : formData.expertise.filter(item => item !== method);
                if (e.target.checked && formData.expertise.length >= 5) {
                  setError('You can select up to 5 areas of expertise');
                  return;
                }
                setFormData({ ...formData, expertise: newExpertise });
              }}
              className="form-checkbox text-purple-600 rounded-full"
            />
            <span className="text-white">{method}</span>
          </label>
        ))}
      </div>

      <button
        type="submit"
        className="w-full bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 transition-colors"
      >
        Next
      </button>

      <div className="flex justify-center gap-2 mt-4">
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-purple-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
      </div>
    </form>
  );

  const renderProfileStep3 = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-center mb-6">Client Preferences</h2>

      <div>
        <select
          value={formData.genderPreferences}
          onChange={(e) => setFormData({ ...formData, genderPreferences: e.target.value })}
          className="w-full bg-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select Gender Preference</option>
          <option value="male">Male Only</option>
          <option value="female">Female Only</option>
          <option value="both">Both</option>
        </select>
      </div>

      <div>
        <select
          value={formData.ageGroupSpecialization}
          onChange={(e) => setFormData({ ...formData, ageGroupSpecialization: e.target.value })}
          className="w-full bg-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select Age Group Specialization</option>
          <option value="teens">Teenagers (13-19)</option>
          <option value="young-adults">Young Adults (20-35)</option>
          <option value="adults">Adults (36-50)</option>
          <option value="seniors">Seniors (51+)</option>
          <option value="all">All Age Groups</option>
        </select>
      </div>

      <div>
        <textarea
          value={formData.medicalSpecializations}
          onChange={(e) => setFormData({ ...formData, medicalSpecializations: e.target.value })}
          className="w-full bg-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
          placeholder="Any other specializations based on medical conditions (optional)"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 transition-colors"
      >
        Next
      </button>

      <div className="flex justify-center gap-2 mt-4">
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-purple-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
      </div>
    </form>
  );

  const renderProfileStep4 = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-center mb-6">Help us verify your identity and establish your credibility as a Fitness Guide!</h2>

      <div>
        <label className="block text-gray-400 mb-2">Upload your ID proof* (passport, driver's license, etc.)</label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              if (file.size > 5 * 1024 * 1024) {
                setError('File size should be less than 5MB');
                return;
              }
              setFormData({ ...formData, idProof: file });
            }
          }}
          className="w-full bg-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <select
          value={formData.yearsOfExperience}
          onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
          className="w-full bg-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select Years of Experience</option>
          {Array.from({ length: 31 }, (_, i) => (
            <option key={i} value={i}>{i} {i === 1 ? 'year' : 'years'}</option>
          ))}
        </select>
      </div>

      <div>
        <textarea
          value={formData.certifications}
          onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
          className="w-full bg-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="List your certifications (comma separated)"
        />
      </div>

      <div>
        <input
          type="text"
          value={formData.socialMediaLinks}
          onChange={(e) => setFormData({ ...formData, socialMediaLinks: e.target.value })}
          className="w-full bg-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Links to your social media (optional)"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 transition-colors"
      >
        Complete Profile
      </button>

      <div className="flex justify-center gap-2 mt-4">
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-purple-600"></div>
      </div>
    </form>
  );

  const renderConfirmation = () => (
    <div className="text-center">
      <h2 className="text-xl font-semibold mb-4">Check your email</h2>
      <p className="text-gray-400 mb-6">
        We've sent you a confirmation email. Please click the link in the email to verify your account.
      </p>
      <button
        onClick={() => setCurrentStep('login')}
        className="text-purple-500 hover:text-purple-400"
      >
        Back to login
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="bg-[#1E1E1E] p-8 rounded-2xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo className="h-8" />
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="flex justify-between mb-6">
          {currentStep === 'login' && (
            <div className="flex gap-2">
              <button
                className="px-4 py-1 rounded-full bg-purple-600 text-white"
                onClick={() => setCurrentStep('login')}
              >
                Login
              </button>
              <button
                className="px-4 py-1 rounded-full text-gray-400"
                onClick={() => setCurrentStep('signup')}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {currentStep === 'login' && renderLoginForm()}
        {currentStep === 'signup' && renderSignUpForm()}
        {currentStep === 'profile-1' && renderProfileStep1()}
        {currentStep === 'profile-2' && renderProfileStep2()}
        {currentStep === 'profile-3' && renderProfileStep3()}
        {currentStep === 'profile-4' && renderProfileStep4()}
        {currentStep === 'confirmation' && renderConfirmation()}

        {currentStep === 'login' && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentStep('signup')}
              className="text-purple-500 hover:text-purple-400"
            >
              Don't have an account? Sign up
            </button>
          </div>
        )}

        {currentStep === 'signup' && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentStep('login')}
              className="text-purple-500 hover:text-purple-400"
            >
              Already have an account? Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}