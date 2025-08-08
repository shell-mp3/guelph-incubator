import React, { useState } from 'react';
import { Users, Lightbulb, BookOpen, ChevronRight, Plus, Calendar, Mail, Github, Linkedin, Star, Award, Send, FileText, Target, Clock, CheckCircle, X } from 'lucide-react';


// Animated background component
const FloatingOrbs = () => (
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
    <div className="absolute w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
    <div className="absolute w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 top-0 right-0"></div>
    <div className="absolute w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000 bottom-20 left-20"></div>
  </div>
);


// A reusable styled button
const GradientButton = ({ onClick, children, className = '' }) => (
  <button
    onClick={onClick}
    className={`bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300 ease-in-out shadow-lg hover:shadow-cyan-500/50 ${className}`}
  >
    {children}
  </button>
);


// A reusable glassmorphism card component
const GlassCard = ({ children, className = '' }) => (
  <div className={`bg-slate-800/40 backdrop-blur-lg border border-slate-200/20 rounded-xl shadow-2xl p-8 ${className}`}>
    {children}
  </div>
);


// A reusable main layout container
const MainContainer = ({ children }) => (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-slate-200 overflow-hidden">
      <FloatingOrbs />
      <div className="relative z-10">
        {children}
      </div>
    </div>
);




const GuelphIncubator = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [profiles, setProfiles] = useState([
    {
      id: 1,
      type: 'faculty',
      name: 'Dr. Sarah Chen',
      email: 'schen@uoguelph.ca',
      department: 'School of Computer Science',
      researchAreas: ['Machine Learning', 'Computer Vision', 'AI Ethics'],
      supervisionAvailable: true
    },
    {
      id: 2,
      type: 'student',
      name: 'Alex Rivera',
      email: 'arivera@uoguelph.ca',
      year: '3rd Year',
      program: 'Computer Science',
      skills: ['React', 'Python', 'Data Analysis'],
      resume: 'resume.pdf',
      clubs: ['Tech Club', 'Startup Society'],
      projects: ['Weather App', 'ML Predictor'],
      links: { github: 'github.com/alexr', linkedin: 'linkedin.com/in/alexr' }
    }
  ]);
  const [researchPosts, setResearchPosts] = useState([
    {
      id: 1,
      facultyId: 1,
      facultyName: 'Dr. Sarah Chen',
      title: 'Computer Vision for Agricultural Applications',
      description: 'Looking for 2 undergraduate students to work on drone imagery analysis for crop health monitoring.',
      type: 'USRA',
      duration: 'Fall 2025',
      skills: ['Python', 'OpenCV', 'Machine Learning'],
      posted: '2025-08-08',
      applications: 3
    }
  ]);
  const [startupPosts, setStartupPosts] = useState([
    {
      id: 1,
      studentId: 2,
      studentName: 'Alex Rivera',
      title: 'CampusConnect',
      pitch: 'A mobile app to help students find study groups and campus events in real-time. Think Tinder meets academic success!',
      skillsNeeded: ['Mobile Dev', 'UI/UX', 'Marketing'],
      contact: '@alexrivera_ug',
      posted: '2025-08-08',
      interested: 5,
      stage: 'idea',
      commitment: '10-15 hours/week'
    }
  ]);
  const [applications, setApplications] = useState([]);
  const [interests, setInterests] = useState([]);
  const [showResearchForm, setShowResearchForm] = useState(false);
  const [showStartupForm, setShowStartupForm] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(null);
  const [showIncubatorForm, setShowIncubatorForm] = useState(null);


  const handleLogin = (email, userType) => {
    const newUser = {
      id: Date.now(),
      email: email,
      type: userType,
      name: email.split('@')[0]
    };
    setCurrentUser(newUser);
    setCurrentView('dashboard');
  };


  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };


  const handleCreateProfile = (profileData) => {
    const newProfile = {
      ...profileData,
      id: Date.now(),
      email: currentUser.email,
      type: currentUser.type
    };
    setProfiles([...profiles, newProfile]);
    alert('Profile created successfully!');
    setCurrentView('dashboard');
  };


  const handlePostResearch = (researchData) => {
    const faculty = profiles.find(p => p.email === currentUser.email);
    const newPost = {
      ...researchData,
      id: Date.now(),
      facultyId: faculty?.id || currentUser.id,
      facultyName: faculty?.name || currentUser.name,
      posted: new Date().toISOString().split('T')[0],
      applications: 0
    };
    setResearchPosts([...researchPosts, newPost]);
    alert('Research opportunity posted!');
    setShowResearchForm(false);
  };


  const handlePostStartup = (startupData) => {
    const student = profiles.find(p => p.email === currentUser.email);
    const newPost = {
      ...startupData,
      id: Date.now(),
      studentId: student?.id || currentUser.id,
      studentName: student?.name || currentUser.name,
      posted: new Date().toISOString().split('T')[0],
      interested: 0
    };
    setStartupPosts([...startupPosts, newPost]);
    alert('Startup idea posted!');
    setShowStartupForm(false);
  };


  const handleApplyResearch = (postId, applicationData) => {
    const newApplication = {
      id: Date.now(),
      postId,
      applicantId: currentUser.id,
      applicantName: currentUser.name,
      type: 'research',
      ...applicationData,
      status: 'pending',
      submitted: new Date().toISOString()
    };
    setApplications([...applications, newApplication]);
    
    // Update application count
    setResearchPosts(researchPosts.map(p =>
      p.id === postId ? {...p, applications: p.applications + 1} : p
    ));
    
    alert('Application submitted successfully!');
    setShowApplicationForm(null);
  };


  const handleApplyIncubator = (startupId, applicationData) => {
    const newApplication = {
      id: Date.now(),
      startupId,
      applicantId: currentUser.id,
      applicantName: currentUser.name,
      type: 'incubator',
      ...applicationData,
      status: 'pending',
      cohort: 'Fall 2025',
      submitted: new Date().toISOString()
    };
    setApplications([...applications, newApplication]);
    alert('Incubator application submitted! We\'ll review it soon.');
    setShowIncubatorForm(null);
  };


  const handleInterest = (postId, message) => {
    const newInterest = {
      id: Date.now(),
      postId,
      userId: currentUser.id,
      userName: currentUser.name,
      message: message || '',
      timestamp: new Date().toISOString()
    };
    setInterests([...interests, newInterest]);
    
    setStartupPosts(startupPosts.map(p =>
      p.id === postId ? {...p, interested: p.interested + 1} : p
    ));
  };
 
  // Landing Page
  if (currentView === 'landing') {
    return (
      <MainContainer>
        <nav className="bg-transparent">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
              <img src="/socis-logo.png" alt="SOCIS" className="h-14 w-auto mr-2" />
              <span className="font-bold text-2xl text-white">Guelph Incubator</span>
              </div>
              <GradientButton onClick={() => setCurrentView('login')}>
                Login / Sign Up
              </GradientButton>
            </div>
          </div>
        </nav>


        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
                    Guelph Student Incubator
                </span>
            </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
          A unified platform for U of G Computer Science and Software Engineering students to collaborate on innovative projects, join research labs, and connect with talented peers. Proudly supported by SOCIS.
          </p>
    
          <div className="mt-12">
             <GradientButton onClick={() => setCurrentView('login')} className="px-10 py-4 text-lg">
                Get Started Now
             </GradientButton>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid md:grid-cols-2 gap-8">
                <GlassCard>
                  <div className="flex items-center mb-4">
                    <BookOpen className="h-10 w-10 text-cyan-400 mr-4" />
                    <h2 className="text-2xl font-bold text-white">Research Matchmaking</h2>
                  </div>
                  <p className="text-slate-300 mb-6">
                    Discover and connect with faculty for volunteer USRA positions, thesis projects, and research assistant opportunities.
                  </p>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-center"><ChevronRight className="h-5 w-5 mr-2 text-cyan-400" />Browse available research positions</li>
                    <li className="flex items-center"><ChevronRight className="h-5 w-5 mr-2 text-cyan-400" />Create detailed academic profiles</li>
                    <li className="flex items-center"><ChevronRight className="h-5 w-5 mr-2 text-cyan-400" />Simplified, direct faculty connections</li>
                  </ul>
                </GlassCard>


                <GlassCard>
                   <div className="flex items-center mb-4">
                    <Users className="h-10 w-10 text-pink-500 mr-4" />
                    <h2 className="text-2xl font-bold text-white">Startup Incubator</h2>
                  </div>
                  <p className="text-slate-300 mb-6">
                    Launch your venture. Find co-founders, join our semester-long incubator, and compete for cash prizes.
                  </p>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-center"><ChevronRight className="h-5 w-5 mr-2 text-pink-500" />Post and discover startup ideas on our public board</li>
                    <li className="flex items-center"><ChevronRight className="h-5 w-5 mr-2 text-pink-500" />Join competitive, milestone-driven cohorts</li>
                    <li className="flex items-center"><ChevronRight className="h-5 w-5 mr-2 text-pink-500" />Access microgrants to cover project costs</li>
                    <li className="flex items-center"><ChevronRight className="h-5 w-5 mr-2 text-pink-500" />Compete for an end-of-term prize pool</li>
                  </ul>
                </GlassCard>
            </div>
        </div>
      </MainContainer>
    );
  }

  

  // Login Page
  if (currentView === 'login') {
    return <LoginView onLogin={handleLogin} onBack={() => setCurrentView('landing')} />;
  }
 
  const DashboardNav = () => (
    <nav className="bg-slate-900/50 backdrop-blur-md border-b border-slate-200/20">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
          <img src="/socis-logo.png" alt="SOCIS" className="h-10 w-auto mr-2" />
          <span className="font-bold text-xl text-white">Guelph Incubator</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-300">Hello, {currentUser?.name}!</span>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );




  // Dashboard
  if (currentView === 'dashboard') {
    const userProfile = profiles.find(p => p.email === currentUser?.email);
    const userApplications = applications.filter(a => a.applicantId === currentUser?.id);
    
    return (
        <MainContainer>
          <DashboardNav />
          <div className="max-w-7xl mx-auto px-4 py-8">
            {!userProfile && (
              <div className="bg-yellow-500/20 border border-yellow-400 rounded-lg p-4 mb-6 text-yellow-300">
                <p>👋 Welcome! Create your profile to get started.</p>
              </div>
            )}
 
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <button
                onClick={() => setCurrentView('profile')}
                className="bg-slate-800/40 backdrop-blur-lg border border-slate-200/20 rounded-xl shadow-2xl p-6 text-left hover:border-cyan-400/50 transition-all group"
              >
                <Users className="h-8 w-8 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg text-white">My Profile</h3>
                <p className="text-slate-400 text-sm">
                  {userProfile ? 'View and edit' : 'Create'} your profile
                </p>
              </button>
 
              <button
                onClick={() => setCurrentView('research')}
                className="bg-slate-800/40 backdrop-blur-lg border border-slate-200/20 rounded-xl shadow-2xl p-6 text-left hover:border-cyan-400/50 transition-all group"
              >
                <BookOpen className="h-8 w-8 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg text-white">Research Opportunities</h3>
                <p className="text-slate-400 text-sm">
                  {currentUser?.type === 'faculty' ? 'Post positions' : 'Find positions'}
                </p>
              </button>
 
              <button
                onClick={() => setCurrentView('startups')}
                className="bg-slate-800/40 backdrop-blur-lg border border-slate-200/20 rounded-xl shadow-2xl p-6 text-left hover:border-pink-500/50 transition-all group"
              >
                <Lightbulb className="h-8 w-8 text-pink-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg text-white">Startup Ideas</h3>
                <p className="text-slate-400 text-sm">
                  Browse ideas or post your own
                </p>
              </button>
            </div>
 
            <div className="grid md:grid-cols-2 gap-6">
                <GlassCard>
                    <h3 className="font-semibold text-lg mb-4 text-white">🚀 Incubator Cohort (Fall 2025)</h3>
                    <div className="bg-gradient-to-r from-purple-600/30 to-pink-500/30 rounded-lg p-4">
                      <p className="text-slate-200 mb-3">
                          <strong>Applications Open for Fall 2025!</strong> Join our milestone-driven cohort. Accepted teams can access:
                      </p>
                      <div className="space-y-2">
                          <div className="flex items-center text-slate-300"><CheckCircle className="h-5 w-5 mr-2 text-green-400" /><span>Up to <strong>$250</strong> in microgrants for development costs.</span></div>
                          <p className="pt-2 font-semibold">End-of-Term Cash Prizes:</p>
                          <div className="flex space-x-6 text-sm">
                              <div className="flex items-center text-yellow-300"><Award className="h-5 w-5 mr-1" /><span>1st: $1000</span></div>
                              <div className="flex items-center text-slate-300"><Award className="h-5 w-5 mr-1" /><span>2nd: $500</span></div>
                              <div className="flex items-center text-orange-400"><Award className="h-5 w-5 mr-1" /><span>3rd: $250</span></div>
                          </div>
                      </div>
                    </div>
                </GlassCard>
 
              {userApplications.length > 0 && (
                <GlassCard>
                  <h3 className="font-semibold text-lg mb-4 text-white">📋 My Applications</h3>
                  <div className="space-y-3">
                    {userApplications.slice(0, 3).map(app => (
                      <div key={app.id} className="flex items-center justify-between text-sm bg-slate-700/50 p-3 rounded-lg">
                        <span className="text-slate-200">{app.type === 'research' ? '🔬' : '🚀'} {app.type}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          app.status === 'pending' ? 'bg-yellow-400/20 text-yellow-300' :
                          app.status === 'accepted' ? 'bg-green-400/20 text-green-300' :
                          'bg-gray-400/20 text-gray-300'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </div>
          </div>
        </MainContainer>
      );
  }


  // Profile View
  if (currentView === 'profile') {
    const userProfile = profiles.find(p => p.email === currentUser?.email);
    return (
      <ProfileView
        currentUser={currentUser}
        userProfile={userProfile}
        onBack={() => setCurrentView('dashboard')}
        onCreateProfile={handleCreateProfile}
      />
    );
  }


  // Research View
  if (currentView === 'research') {
    return (
      <ResearchView
        currentUser={currentUser}
        researchPosts={researchPosts}
        showForm={showResearchForm}
        onToggleForm={setShowResearchForm}
        onPostResearch={handlePostResearch}
        showApplicationForm={showApplicationForm}
        onToggleApplicationForm={setShowApplicationForm}
        onApplyResearch={handleApplyResearch}
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }


  // Startups View
  if (currentView === 'startups') {
    return (
      <StartupsView
        currentUser={currentUser}
        startupPosts={startupPosts}
        showForm={showStartupForm}
        onToggleForm={setShowStartupForm}
        onPostStartup={handlePostStartup}
        showIncubatorForm={showIncubatorForm}
        onToggleIncubatorForm={setShowIncubatorForm}
        onApplyIncubator={handleApplyIncubator}
        onInterest={handleInterest}
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }


  return null;
};


// Generic Form Input
const FormInput = ({ label, ...props }) => (
    <div>
      <label className="block text-slate-300 mb-2 font-semibold">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-200"
      />
    </div>
  );
  
  const FormTextArea = ({ label, ...props }) => (
    <div>
      <label className="block text-slate-300 mb-2 font-semibold">{label}</label>
      <textarea
        {...props}
        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-200"
      />
    </div>
  );
  
  const FormSelect = ({ label, children, ...props }) => (
    <div>
      <label className="block text-slate-300 mb-2 font-semibold">{label}</label>
      <select
        {...props}
        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-200"
      >
        {children}
      </select>
    </div>
  );


// Login Component
const LoginView = ({ onLogin, onBack }) => {
    const [email, setEmail] = useState('');
    const [userType, setUserType] = useState('student');
 
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-slate-200 flex items-center justify-center p-4">
        <FloatingOrbs />
        <div className="relative z-10 w-full max-w-md">
            <GlassCard>
                <div className="flex flex-col items-center justify-center mb-6">
                <img src="/socis-logo.png" alt="SOCIS" className="h-16 w-auto mr-2" />
                <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                <p className="text-slate-400">Login to the Incubator</p>
                </div>
                
                <div className="space-y-6">
                    <FormInput
                        label="University Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.name@uoguelph.ca"
                    />
                
                    <FormSelect
                        label="I am a..."
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                    >
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                    </FormSelect>
                </div>


                <GradientButton
                    onClick={() => email && onLogin(email, userType)}
                    className="w-full mt-8 py-3"
                >
                    Login
                </GradientButton>
                
                <button
                    onClick={onBack}
                    className="mt-6 text-slate-400 hover:text-white text-sm w-full transition-colors"
                >
                    ← Back to Home
                </button>
            </GlassCard>
        </div>
      </div>
    );
  };
  
  type Profile = {
      name: string;
      department?: string;
      researchAreas?: string[];
      supervisionAvailable?: boolean;
      year?: string;
      program?: string;
      skills?: string[];
      resume?: string;
      clubs?: string[];
      projects?: string[];
      links?: {
        github?: string;
        linkedin?: string;
      };
    };
    
// Profile Component
const ProfileView = ({ currentUser, userProfile, onBack, onCreateProfile }) => {
    const [formData, setFormData] = useState({
      name: '',
      department: '',
      researchAreas: '',
      supervisionAvailable: 'true',
      year: '',
      program: '',
      skills: '',
      resume: '',
      clubs: '',
      projects: '',
      github: '',
      linkedin: ''
    });
 
    const handleSubmit = () => {

        interface ProfileData {
    name: string;
    department?: string;
    researchAreas?: string[];
    supervisionAvailable?: boolean;
    year?: string;
    program?: string;
    skills?: string[];
    resume?: string;
    clubs?: string[];
    projects?: string[];
    links?: {
      github?: string;
      linkedin?: string;
    };
  }
        const profileData: ProfileData = { name: formData.name };

        if (currentUser.type === 'faculty') {
          profileData.department = formData.department;
          profileData.researchAreas = formData.researchAreas.split(',').map(s => s.trim());
          profileData.supervisionAvailable = formData.supervisionAvailable === 'true';
        } else {
          profileData.year = formData.year;
          profileData.program = formData.program;
          profileData.skills = formData.skills.split(',').map(s => s.trim());
          profileData.resume = formData.resume;
          profileData.clubs = formData.clubs.split(',').map(s => s.trim()).filter(Boolean);
          profileData.projects = formData.projects.split(',').map(s => s.trim()).filter(Boolean);
          profileData.links = { github: formData.github, linkedin: formData.linkedin };
        }
     
      onCreateProfile(profileData);
    };
 
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-slate-200">
        <FloatingOrbs />
        <nav className="bg-transparent pt-8 mb-8">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button
              onClick={onBack}
              className="flex items-center text-slate-300 hover:text-white transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </nav>
 
        <div className="max-w-4xl mx-auto px-4 pb-12">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
            {userProfile ? 'My Profile' : 'Create Your Profile'}
          </h2>
 
          {userProfile ? (
            <GlassCard>
              <h3 className="text-2xl font-semibold mb-2 text-white">{userProfile.name}</h3>
              <p className="text-cyan-400 mb-6">{userProfile.email}</p>
              
              {userProfile.type === 'faculty' ? (
                <>
                  <p className="mb-2"><strong>Department:</strong> {userProfile.department}</p>
                  <p className="mb-2 mt-4"><strong>Research Areas:</strong></p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {userProfile.researchAreas.map((area, idx) => (
                      <span key={idx} className="bg-cyan-400/20 text-cyan-300 px-3 py-1 rounded-full text-sm">
                        {area}
                      </span>
                    ))}
                  </div>
                  <p className="mb-2">
                    <strong>Supervision Available:</strong> {userProfile.supervisionAvailable ? '✅ Yes' : '❌ No'}
                  </p>
                </>
              ) : (
                <>
                  <p className="mb-2"><strong>Year:</strong> {userProfile.year}</p>
                  <p className="mb-2"><strong>Program:</strong> {userProfile.program}</p>
                  <p className="mb-2 mt-4"><strong>Skills:</strong></p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {userProfile.skills.map((skill, idx) => (
                      <span key={idx} className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </GlassCard>
          ) : (
            <GlassCard>
              <div className="space-y-4">
                <FormInput
                  label="Full Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
 
                {currentUser.type === 'faculty' ? (
                  <>
                    <FormInput
                      label="Department"
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                    />
                    <FormInput
                      label="Research Areas (comma-separated)"
                      type="text"
                      value={formData.researchAreas}
                      onChange={(e) => setFormData({...formData, researchAreas: e.target.value})}
                      placeholder="Machine Learning, Computer Vision, AI Ethics"
                    />
                    <FormSelect
                      label="Available for Supervision?"
                      value={formData.supervisionAvailable}
                      onChange={(e) => setFormData({...formData, supervisionAvailable: e.target.value})}
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </FormSelect>
                  </>
                ) : (
                  <>
                    <FormInput
                      label="Year"
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                      placeholder="3rd Year"
                    />
                    <FormInput
                      label="Program"
                      type="text"
                      value={formData.program}
                      onChange={(e) => setFormData({...formData, program: e.target.value})}
                      placeholder="Computer Science"
                    />
                     <FormInput
                      label="Skills (comma-separated)"
                      type="text"
                      value={formData.skills}
                      onChange={(e) => setFormData({...formData, skills: e.target.value})}
                      placeholder="React, Python, Data Analysis"
                    />
                  </>
                )}
 
                <GradientButton onClick={handleSubmit} className="w-full py-3 mt-4">
                  Create Profile
                </GradientButton>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    );
  };
 
// Generic Modal
const Modal = ({ children, onBackdropClick }) => (
    <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onBackdropClick}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()} // Prevent click from bubbling to backdrop
      >
        <GlassCard>
            {children}
        </GlassCard>
      </div>
    </div>
);




// Research Component
const ResearchView = ({ currentUser, researchPosts, showForm, onToggleForm, onPostResearch, showApplicationForm, onToggleApplicationForm, onApplyResearch, onBack }) => {
    const [formData, setFormData] = useState({
      title: '', description: '', type: 'USRA', duration: '', skills: '',
      requirements: '', compensation: '', deadline: ''
    });
    const [applicationData, setApplicationData] = useState({
      coverLetter: '', availability: '', relevantExperience: '', whyInterested: ''
    });
 
    const handleSubmit = () => {
      onPostResearch({ ...formData, skills: formData.skills.split(',').map(s => s.trim()) });
      setFormData({ title: '', description: '', type: 'USRA', duration: '', skills: '',
      requirements: '', compensation: '', deadline: '' });
    };
 
    const handleApply = (postId) => {
      onApplyResearch(postId, applicationData);
      setApplicationData({ coverLetter: '', availability: '', relevantExperience: '', whyInterested: '' });
    };
 
    return (
      <MainContainer>
        <nav className="bg-transparent pt-8 mb-8">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <button onClick={onBack} className="flex items-center text-slate-300 hover:text-white transition-colors">
                ← Back to Dashboard
              </button>
              {currentUser?.type === 'faculty' && (
                <GradientButton onClick={() => onToggleForm(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Post Opportunity
                </GradientButton>
              )}
            </div>
          </div>
        </nav>
 
        <div className="max-w-5xl mx-auto px-4 pb-12">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Research Opportunities</h2>
 
          {showForm && currentUser?.type === 'faculty' && (
            <Modal onBackdropClick={() => onToggleForm(false)}>
                <h3 className="text-2xl font-bold mb-4 text-white">Post New Research Opportunity</h3>
                <div className="space-y-4">
                  <FormInput label="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                  <FormTextArea label="Description" rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormSelect label="Type" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                      <option>USRA</option><option>AROO</option><option>CIS*4900 Project</option><option>Research Assistant</option><option>Volunteer</option>
                    </FormSelect>
                    <FormInput label="Duration" placeholder="Fall 2025" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} />
                  </div>
                  <FormInput label="Required Skills (comma-separated)" placeholder="Python, ML" value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} />
                  <FormTextArea label="Requirements" placeholder="GPA requirements, etc." rows={2} value={formData.requirements} onChange={(e) => setFormData({...formData, requirements: e.target.value})} />
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormInput label="Compensation" placeholder="$6000 stipend" value={formData.compensation} onChange={(e) => setFormData({...formData, compensation: e.target.value})} />
                    <FormInput label="Application Deadline" type="date" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} />
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <GradientButton onClick={handleSubmit}>Post Opportunity</GradientButton>
                    <button onClick={() => onToggleForm(false)} className="text-slate-400 hover:text-white transition-colors">Cancel</button>
                  </div>
                </div>
            </Modal>
          )}


          {showApplicationForm && (
            <Modal onBackdropClick={() => onToggleApplicationForm(null)}>
                <h3 className="text-2xl font-bold mb-4 text-white">Apply to Research Position</h3>
                <div className="space-y-4">
                    <FormTextArea label="Cover Letter" rows={4} placeholder="Introduce yourself..." value={applicationData.coverLetter} onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})} />
                    <FormInput label="Availability" placeholder="e.g., May-August, 40 hours/week" value={applicationData.availability} onChange={(e) => setApplicationData({...applicationData, availability: e.target.value})} />
                    <FormTextArea label="Relevant Experience" rows={3} placeholder="Coursework, projects, skills..." value={applicationData.relevantExperience} onChange={(e) => setApplicationData({...applicationData, relevantExperience: e.target.value})} />
                    <FormTextArea label="Why are you interested?" rows={3} placeholder="What excites you?" value={applicationData.whyInterested} onChange={(e) => setApplicationData({...applicationData, whyInterested: e.target.value})} />
                    <div className="flex space-x-4 pt-4">
                        <GradientButton onClick={() => handleApply(showApplicationForm)}>
                            <Send className="h-4 w-4 mr-2" /> Submit Application
                        </GradientButton>
                        <button onClick={() => onToggleApplicationForm(null)} className="text-slate-400 hover:text-white transition-colors">Cancel</button>
                    </div>
                </div>
            </Modal>
          )}
 
          <div className="space-y-6">
            {researchPosts.map(post => (
              <GlassCard key={post.id}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-white">{post.title}</h3>
                  <span className="bg-cyan-400/20 text-cyan-300 px-3 py-1 rounded-full text-sm font-semibold">{post.type}</span>
                </div>
                <p className="text-slate-300 mb-4">{post.description}</p>
                <div className="flex flex-wrap items-center text-sm text-slate-400 mb-4 gap-x-4 gap-y-2">
                  <span className="flex items-center"><Calendar className="h-4 w-4 mr-1.5" />{post.duration}</span>
                  <span className="flex items-center"><Users className="h-4 w-4 mr-1.5" />{post.facultyName}</span>
                  <span className="flex items-center"><FileText className="h-4 w-4 mr-1.5" />{post.applications} applications</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.skills.map((skill, idx) => (
                    <span key={idx} className="bg-slate-700/80 text-slate-300 px-3 py-1 rounded-full text-xs">{skill}</span>
                  ))}
                </div>
                {currentUser?.type === 'student' && (
                  <GradientButton onClick={() => onToggleApplicationForm(post.id)}>Apply Now</GradientButton>
                )}
              </GlassCard>
            ))}
          </div>
        </div>
      </MainContainer>
    );
  };
 
  // Startups Component
  const StartupsView = ({ currentUser, startupPosts, showForm, onToggleForm, onPostStartup, showIncubatorForm, onToggleIncubatorForm, onApplyIncubator, onInterest, onBack }) => {
    const [formData, setFormData] = useState({ title: '', pitch: '', skillsNeeded: '', contact: '', stage: 'idea', commitment: '', lookingFor: '' });
    const [incubatorData, setIncubatorData] = useState({ teamMembers: '', progress: '', milestones: '', pitchDeck: '', commitment: '' });
    const [interestMessage, setInterestMessage] = useState('');
    const [showInterestForm, setShowInterestForm] = useState(null);
 
    const handleSubmit = () => {
      onPostStartup({ ...formData, skillsNeeded: formData.skillsNeeded.split(',').map(s => s.trim()) });
      setFormData({ title: '', pitch: '', skillsNeeded: '', contact: '', stage: 'idea', commitment: '', lookingFor: '' });
    };
 
    const handleIncubatorSubmit = (startupId) => {
      onApplyIncubator(startupId, incubatorData);
      setIncubatorData({ teamMembers: '', progress: '', milestones: '', pitchDeck: '', commitment: '' });
    };
 
    const handleInterestSubmit = (postId) => {
      onInterest(postId, interestMessage);
      setInterestMessage('');
      setShowInterestForm(null);
      alert('Interest registered! The founder will see your contact info.');
    };
 
    return (
        <MainContainer>
            <nav className="bg-transparent pt-8 mb-8">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                <button onClick={onBack} className="flex items-center text-slate-300 hover:text-white transition-colors">
                    ← Back to Dashboard
                </button>
                {currentUser?.type === 'student' && (
                    <GradientButton onClick={() => onToggleForm(true)} className="from-pink-500 to-purple-600 hover:shadow-pink-500/50">
                        <Plus className="h-4 w-4 mr-2" /> Post Idea
                    </GradientButton>
                )}
                </div>
            </div>
            </nav>
    
            <div className="max-w-5xl mx-auto px-4 pb-12">
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">Startup Ideas</h2>
    
            {showForm && currentUser?.type === 'student' && (
                <Modal onBackdropClick={() => onToggleForm(false)}>
                    <h3 className="text-2xl font-bold mb-4 text-white">Post Your Startup Idea</h3>
                    <div className="space-y-4">
                        <FormInput label="Startup Name" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                        <FormTextArea label="Elevator Pitch" rows={3} placeholder="What problem are you solving?" value={formData.pitch} onChange={(e) => setFormData({...formData, pitch: e.target.value})} />
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormSelect label="Stage" value={formData.stage} onChange={(e) => setFormData({...formData, stage: e.target.value})}>
                                <option value="idea">Just an idea</option><option value="prototype">Building prototype</option><option value="mvp">Have MVP</option><option value="launched">Launched</option>
                            </FormSelect>
                            <FormInput label="Time Commitment Expected" placeholder="e.g., 10-15 hours/week" value={formData.commitment} onChange={(e) => setFormData({...formData, commitment: e.target.value})} />
                        </div>
                        <FormInput label="Skills Needed (comma-separated)" placeholder="Mobile Dev, UI/UX" value={formData.skillsNeeded} onChange={(e) => setFormData({...formData, skillsNeeded: e.target.value})} />
                        <FormTextArea label="What are you looking for?" rows={2} placeholder="Co-founders, advisors..." value={formData.lookingFor} onChange={(e) => setFormData({...formData, lookingFor: e.target.value})} />
                        <FormInput label="Contact (Discord/IG/etc)" placeholder="@yourusername" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} />
                        <div className="flex space-x-4 pt-4">
                            <GradientButton onClick={handleSubmit} className="from-pink-500 to-purple-600 hover:shadow-pink-500/50">Post Idea</GradientButton>
                            <button onClick={() => onToggleForm(false)} className="text-slate-400 hover:text-white transition-colors">Cancel</button>
                        </div>
                    </div>
                </Modal>
            )}


            {showIncubatorForm && (
                 <Modal onBackdropClick={() => onToggleIncubatorForm(null)}>
                    <h3 className="text-2xl font-bold mb-4 text-white">Apply to Incubator Cohort</h3>
                    <div className="space-y-4">
                        <FormTextArea label="Team Members (include roles)" rows={3} placeholder="John Doe - CEO..." value={incubatorData.teamMembers} onChange={(e) => setIncubatorData({...incubatorData, teamMembers: e.target.value})} />
                        <FormTextArea label="Current Progress" rows={3} placeholder="What have you built so far?" value={incubatorData.progress} onChange={(e) => setIncubatorData({...incubatorData, progress: e.target.value})} />
                        <FormTextArea label="Milestones for This Semester" rows={3} placeholder="1. Complete MVP by Oct...\n2. Onboard 50 users by Nov..." value={incubatorData.milestones} onChange={(e) => setIncubatorData({...incubatorData, milestones: e.target.value})} />
                        <FormInput label="Pitch Deck Link (optional)" placeholder="drive.google.com/..." value={incubatorData.pitchDeck} onChange={(e) => setIncubatorData({...incubatorData, pitchDeck: e.target.value})} />
                        <FormInput label="Weekly Time Commitment" placeholder="e.g., 20 hours/week" value={incubatorData.commitment} onChange={(e) => setIncubatorData({...incubatorData, commitment: e.target.value})} />
                        <div className="bg-purple-500/20 rounded-lg p-4 my-4">
                            <p className="text-sm text-purple-300"><strong>Commitment:</strong> Teams must attend weekly check-ins and present at the final showcase. Reaching pre-determined milestones makes you eligible for microgrants and the final prize pool.</p>
                        </div>
                        <div className="flex space-x-4 pt-4">
                            <GradientButton onClick={() => handleIncubatorSubmit(showIncubatorForm)} className="from-pink-500 to-purple-600 hover:shadow-pink-500/50"><Target className="h-4 w-4 mr-2"/>Submit Application</GradientButton>
                            <button onClick={() => onToggleIncubatorForm(null)} className="text-slate-400 hover:text-white transition-colors">Cancel</button>
                        </div>
                    </div>
                </Modal>
            )}


            {showInterestForm && (
                <Modal onBackdropClick={() => {setShowInterestForm(null); setInterestMessage('');}}>
                    <h3 className="text-lg font-semibold mb-4 text-white">Express Interest</h3>
                    <FormTextArea label="Message (optional)" rows={3} placeholder="Tell them why you're interested..." value={interestMessage} onChange={(e) => setInterestMessage(e.target.value)} />
                    <div className="flex space-x-4 pt-4">
                        <GradientButton onClick={() => handleInterestSubmit(showInterestForm)} className="from-pink-500 to-purple-600 hover:shadow-pink-500/50">Send Interest</GradientButton>
                        <button onClick={() => {setShowInterestForm(null); setInterestMessage('');}} className="text-slate-400 hover:text-white transition-colors">Cancel</button>
                    </div>
                </Modal>
            )}
    
            <div className="space-y-6">
                {startupPosts.map(post => (
                <GlassCard key={post.id}>
                    <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-white">{post.title}</h3>
                    <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            post.stage === 'idea' ? 'bg-yellow-400/20 text-yellow-300' :
                            post.stage === 'prototype' ? 'bg-blue-400/20 text-blue-300' :
                            post.stage === 'mvp' ? 'bg-green-400/20 text-green-300' :
                            'bg-purple-400/20 text-purple-300'
                        }`}>{post.stage}</span>
                        <div className="flex items-center text-sm text-yellow-400"><Star className="h-4 w-4 mr-1" /><span>{post.interested} interested</span></div>
                    </div>
                    </div>
                    <p className="text-slate-300 mb-4">{post.pitch}</p>
                    <div className="flex flex-wrap items-center text-sm text-slate-400 mb-4 gap-x-4 gap-y-2">
                        <span className="flex items-center"><Users className="h-4 w-4 mr-1.5" />{post.studentName}</span>
                        <span className="flex items-center"><Mail className="h-4 w-4 mr-1.5" />{post.contact}</span>
                        {post.commitment && <span className="flex items-center"><Clock className="h-4 w-4 mr-1.5" />{post.commitment}</span>}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-sm text-slate-200 font-medium self-center">Looking for:</span>
                    {post.skillsNeeded.map((skill, idx) => (
                        <span key={idx} className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full text-xs">{skill}</span>
                    ))}
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <GradientButton onClick={() => setShowInterestForm(post.id)} className="from-pink-500 to-orange-500 hover:shadow-pink-500/50">I'm Interested</GradientButton>
                        <GradientButton onClick={() => onToggleIncubatorForm(post.id)} className="from-purple-500 to-indigo-600 hover:shadow-purple-500/50">Apply to Incubator</GradientButton>
                    </div>
                </GlassCard>
                ))}
            </div>
            </div>
        </MainContainer>
    );
  };
 


export default GuelphIncubator;