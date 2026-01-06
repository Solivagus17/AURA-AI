import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, User, FileText, Check, Loader2, LogOut, Mail, Lock, Eye, EyeOff, Github, Instagram, PenTool, ArrowLeft } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const DICTIONARY = {
  en: {
    welcome: "Welcome to Aura",
    tagline: "Your Personal AI Wellness Companion",
    login_required_plan: "You need to connect with our app using Google Login options (Gmail) to use this feature",
    signin_sub: "Sign in to start your wellness journey",
    config_needed: "⚠️ Configuration Needed:",
    check_env: "Check .env file.",
    name_label: "Name",
    email_label: "Email",
    password_label: "Password",
    create_account: "Create Account",
    sign_in: "Sign In",
    or: "OR",
    continue_google: "Continue with Google",
    already_account: "Already have an account?",
    dont_have_account: "Don't have an account?",
    create_one: "Create one",
    hello: "Hello,",
    ready_journey: "Ready for your self-care journey?",
    generate_plan: "Generate New Plan",
    ask_anything: "Ask anything...",
    streak: "Day Streak",
    plans: "Plans",
    status: "Status",
    recent_plans: "Recent Plans",
    health_tracker: "Health Tracker",
    hydration: "Hydration",
    glasses: "4/8 Glasses",
    sleep: "Sleep",
    back_chat: "Back to Chat",
    save_docs: "Save this plan to Google Docs",
    saving: "Saving to Drive...",
    footer_mission: "Empowering women with personalized hygiene, wellness, and self-care guidance provided by world-class AI.",
    ai_disclaimer: "Note: AI can make mistakes. Please verify important medical advice.",
    contact_us: "Contact Us",
    about: "About",
    mission_link: "Our Mission",
    privacy_link: "Privacy Policy",
    terms_link: "Terms of Service",
    // ...
    rights: "Aura Wellness. All rights reserved.",
    cycle_tracker: "Menstrual Cycle Tracker",
    current_phase: "Current Phase",
    next_period: "Next Period",
    log_period: "Log Period",
    menstrual: "Menstrual",
    follicular: "Follicular",
    ovulation: "Ovulation",
    luteal: "Luteal",
    days_left: "Days left",
    days_left: "Days left",
    day: "Day",
    dev_section_title: "About the Developer",
    dev_name: "Sarthakk Anjariya",
    dev_role: "AI Enthusiast & Full Stack Developer",
    dev_bio: "Sophomore at LDCE pursuing B.E. in Robotics and Automation with minors in AIML.",
    lang_note: "Note: While the App UI currently supports English & Hindi, our AI can understand and answer your questions in ANY language in the world!",
    connect: "Connect with me",
    back_home: "Back to Home"
  },
  hi: {
    welcome: "ऑरा में आपका स्वागत है",
    tagline: "आपका व्यक्तिगत एआई कल्याण साथी",
    login_required_plan: "इस सुविधा का उपयोग करने के लिए आपको हमारे ऐप से गूगल लॉगिन (Gmail) का उपयोग करके जुड़ना होगा",
    signin_sub: "अपनी कल्याण यात्रा शुरू करने के लिए साइन इन करें",
    config_needed: "⚠️ कॉन्फ़िगरेशन की आवश्यकता:",
    check_env: ".env फ़ाइल की जाँच करें।",
    name_label: "नाम",
    email_label: "ईमेल",
    password_label: "पासवर्ड",
    create_account: "खाता बनाएँ",
    sign_in: "साइन इन करें",
    or: "या",
    continue_google: "Google के साथ जारी रखें",
    already_account: "पहले से ही एक अकाउंट है?",
    dont_have_account: "अकाउंट नहीं है?",
    create_one: "नया बनाएं",
    hello: "नमस्ते,",
    ready_journey: "अपनी आत्म-देखभाल यात्रा के लिए तैयार हैं?",
    generate_plan: "नई योजना बनाएँ",
    ask_anything: "कुछ भी पूछें...",
    streak: "दिन की लकीर",
    plans: "योजनाएँ",
    status: "स्थिति",
    recent_plans: "हाल की योजनाएँ",
    health_tracker: "स्वास्थ्य ट्रैकर",
    hydration: "जलयोजन",
    glasses: "4/8 गिलास",
    sleep: "नींद",
    back_chat: "चैट पर वापस",
    save_docs: "इस योजना को Google डॉक्स में सहेजें",
    saving: "ड्राइव में सहेजा जा रहा है...",
    footer_mission: "विश्व स्तरीय एआई द्वारा प्रदान किए गए व्यक्तिगत स्वच्छता, कल्याण और आत्म-देखभाल मार्गदर्शन के साथ महिलाओं को सशक्त बनाना।",
    ai_disclaimer: "नोट: एआई गलतियाँ कर सकता है। कृपया महत्वपूर्ण चिकित्सा सलाह की पुष्टि करें।",
    contact_us: "हमसे संपर्क करें",
    about: "के बारे में",
    mission_link: "हमारा मिशन",
    privacy_link: "गोपनीयता नीति",
    terms_link: "सेवा की शर्तें",
    // ...
    rights: "ऑरा वेलनेस। सर्वाधिकार सुरक्षित।",
    cycle_tracker: "मासिक धर्म चक्र ट्रैकर",
    current_phase: "वर्तमान चरण",
    next_period: "अगला पीरियड",
    log_period: "लॉग पीरियड",
    menstrual: "पीरियड",
    follicular: "कूपिक चरण",
    ovulation: "ओव्यूलेशन",
    luteal: "ल्यूटियल चरण",
    days_left: "दिन शेष",
    days_left: "दिन शेष",
    day: "दिन",
    dev_section_title: "डेवलपर के बारे में",
    dev_name: "सार्थक अंजारिया",
    dev_role: "एआई उत्साही और फुल स्टैक डेवलपर",
    dev_bio: "एल.डी.सी.ई. में रोबोटिक्स और ऑटोमेशन में बी.ई. (AIML में माइनर्स के साथ) कर रहे द्वितीय वर्ष के छात्र।",
    lang_note: "नोट: हालांकि ऐप यूआई वर्तमान में अंग्रेजी और हिंदी का समर्थन करता है, हमारा एआई दुनिया की किसी भी भाषा में आपके सवालों को समझ और जवाब दे सकता है!",
    connect: "मुझसे जुड़ें",
    back_home: "वापस जाएँ"
  }
};

function App() {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [language, setLanguage] = useState('en'); // 'en' | 'hi'

  const [cycleDay, setCycleDay] = useState(14);
  const [cyclePhase, setCyclePhase] = useState('ovulation');
  const t = (key) => DICTIONARY[language][key] || key;
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [messages, setMessages] = useState([
    { role: 'model', text: "Hello! I'm Aura. I'm here to support your hygiene and wellness journey. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX} px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY} px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);




  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'model') {
        return [{
          role: 'model', text: language === 'en'
            ? "Hello! I'm Aura. I'm here to support your hygiene and wellness journey. How can I help you today?"
            : "नमस्ते! मैं ऑरा हूँ। मैं यहाँ आपकी स्वच्छता और कल्याण यात्रा में सहायता करने के लिए हूँ। आज मैं आपकी कैसे मदद कर सकती हूँ?"
        }];
      }
      return prev;
    });
  }, [language]);


  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);



  const handleGoogleLogin = async () => {
    // ... (Keep same logic)
    if (!auth) {
      alert("Firebase Configuration Missing! Please check your .env file.");
      return;
    }
    setAuthError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      setAccessToken(token);
      setUser(result.user);
    } catch (error) {
      console.error("Login Error:", error);
      setAuthError(error.message);
    }
  };

  const handleEmailAuth = async (e) => {
    // ... (Keep same logic)
    e.preventDefault();
    if (!auth) return;
    setAuthError('');
    setAuthLoading(true);

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
          await updateProfile(userCredential.user, {
            displayName: displayName,
            photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=FF9EAA&color=fff`
          });
          setUser({ ...userCredential.user, displayName, photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=FF9EAA&color=fff` });
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.error("Auth Error", err);
      setAuthError(err.message.replace('Firebase:', '').trim());
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setAccessToken(null);
    setUser(null);
    // Reset message handled by effect
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]); // UI Update 1
    setIsTyping(true);

    try {
      const systemContext = `You are Aura, a world-class Women's Hygiene & Wellness Coach. You are warm, empathetic, but highly knowledgeable. You provide expert advice on hygiene, skincare, mental health, fitness, and general wellness. Keep answers concise but strictly accurate and helpful. For general health queries (like headaches, cramps, mild pain), provide helpful home remedies and wellness advice, but ALWAYS include a disclaimer effectively stating: "Note: I am an AI, not a doctor. Please consult a professional for serious medical concerns." If a question is strictly vulgar or inappropriate, say "I cannot answer that". ALWAYS detect the language of the user's message and reply in that EXACT same language (e.g., if Hindi, reply in Hindi; if English, reply in English).`;

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

      let apiHistory = [
        {
          role: 'user',
          parts: [{ text: `System Instructions: ${systemContext}` }]
        },
        {
          role: 'model',
          parts: [{ text: "Understood." }]
        }
      ];

      const previousMessages = messages.filter((_, index) => index > 0);

      previousMessages.forEach(msg => {
        const role = msg.role === 'model' ? 'model' : 'user';
        if (msg.text) {
          apiHistory.push({ role, parts: [{ text: msg.text }] });
        }
      });

      const chat = model.startChat({
        history: apiHistory
      });

      const result = await chat.sendMessage(userText);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'model', text }]);

    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: `Connection Error: ${error.message || error.toString()}. \n\nPlease check your key and try again.` }]);
    } finally {
      setIsTyping(false);
    }
  };

  // ... (Keep createGoogleDoc - no changes needed except maybe creating doc title in Hindi?)
  const createGoogleDoc = async (planContent) => {
    if (!accessToken && !user.accessToken) {
      alert("For Email/Password login, direct Google Docs integration might be limited due to permissions logic. Please Sign in with Google Button for full Docs support.");
      return;
    }

    if (!accessToken) {
      alert("To save to Google Docs, you must Sign In with Google (not Email/Password).");
      return;
    }

    setIsSaving(true);

    try {
      const createResponse = await fetch('https://docs.googleapis.com/v1/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: language === 'hi' ? 'मेरी ऑरा स्वच्छता योजना' : 'My Aura Hygiene Plan' })
      });

      if (!createResponse.ok) throw new Error("Failed to create doc");
      const doc = await createResponse.json();
      const docId = doc.documentId;
      await fetch(`https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requests: [{ insertText: { location: { index: 1 }, text: planContent } }]
        })
      });
      alert(`Plan saved to Google Docs! (ID: ${docId})`);
    } catch (err) {
      console.error("Docs API Error", err);
      alert("Failed to save to Docs: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const DeveloperCard = () => (
    <div className="glass-panel p-8 w-full relative overflow-hidden mt-8">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-pink-300 to-purple-300 shadow-lg">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
            <User size={64} className="text-pink-300" />
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-serif text-gray-800 mb-2">{t('dev_name')}</h2>
          <p className="text-pink-500 font-medium">{t('dev_role')}</p>
        </div>

        <p className="text-gray-600 max-w-lg leading-relaxed">
          {t('dev_bio')}
        </p>

        <div className="bg-pink-50 p-3 rounded-lg border border-pink-100 max-w-lg">
          <p className="text-xs text-pink-600 font-medium">✨ {t('lang_note')}</p>
        </div>

        <div className="w-full h-px bg-gray-100 my-4"></div>

        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t('connect')}</h3>

        <div className="flex gap-6 mt-4">
          <a href="https://medium.com/@sarthakk_ai" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 group-hover:bg-green-50 group-hover:border-green-300 transition-all duration-300 shadow-sm group-hover:shadow-md">
              <PenTool size={20} className="text-gray-700 group-hover:text-green-600 transition-colors" />
            </div>
            <span className="text-xs text-gray-500 group-hover:text-green-600 font-medium transition-colors">sarthakk_ai</span>
          </a>

          <a href="https://www.instagram.com/_sarthakk._.17/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 group-hover:bg-gradient-to-tr group-hover:from-yellow-400 group-hover:via-red-500 group-hover:to-purple-500 group-hover:border-transparent transition-all duration-300 shadow-sm group-hover:shadow-md">
              <Instagram size={20} className="text-gray-700 group-hover:text-white transition-colors" />
            </div>
            <span className="text-xs text-gray-500 group-hover:text-pink-600 font-medium transition-colors">Instagram</span>
          </a>

          <a href="https://github.com/Solivagus17" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 group-hover:bg-gray-900 group-hover:border-gray-900 transition-all duration-300 shadow-sm group-hover:shadow-md">
              <Github size={20} className="text-gray-700 group-hover:text-white transition-colors" />
            </div>
            <span className="text-xs text-gray-500 group-hover:text-gray-900 font-medium transition-colors">GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );

  const generateCuratedPlan = async () => {
    if (!user) { alert(t('login_required_plan')); return; }
    setIsTyping(true);

    let prompt = "";
    if (language === 'hi') {
      prompt = `एक विश्व-प्रसिद्ध कल्याण और स्वच्छता कोच के रूप में कार्य करें। एक महिला के लिए एक अत्यधिक विस्तृत, व्यक्तिगत 7-दिवसीय स्वच्छता और आत्म-देखभाल योजना बनाएं। 
        ध्यान दें:
        1. सुबह और रात की स्वच्छता दिनचर्या (त्वचा की देखभाल, मौखिक देखभाल)।
        2. मानसिक कल्याण (ध्यान, जर्नलिंग)।
        3. शारीरिक स्वास्थ्य (हल्की गतिविधियां/योग)।
        4. चमकती त्वचा के लिए आहार युक्तियाँ।
        
        प्रत्येक दिन के लिए स्पष्ट बोल्ड शीर्षकों के साथ मार्कडाउन का उपयोग करके प्रारूपित करें। इसे प्रीमियम और देखभाल करने वाला महसूस कराएं। HINDI में जवाब दें।`;
    } else {
      prompt = `Act as a world-renowned Wellness & Hygiene Coach. Create a highly detailed, personalized 7-Day Hygiene & Self-Care Plan for a woman. 
        Focus on:
        1. Morning & Nightly Hygiene Routines (Skincare, Oral care).
        2. Mental Wellness (Meditation, Journaling).
        3. Physical Health (Light movements/Yoga).
        4. Diet tips for glowing skin.
        
        Format using Markdown with clear bold headings for each Day. Make it feel premium and caring.`;
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      setMessages(prev => [...prev, { role: 'model', text: text, isPlan: true }]);
    } catch (e) {
      // ...
      console.error(e);
      alert("Error generating plan: " + e.message + "\n\n(Check if your Gemini API Key is set in .env)");
    } finally {
      setIsTyping(false);
    }
  };


  const [view, setView] = useState('chat');


  const LangToggle = () => (
    <button
      onClick={() => setLanguage(l => l === 'en' ? 'hi' : 'en')}
      className="bg-white/60 backdrop-blur px-3 py-1 rounded-full text-xs font-bold border border-white/40 shadow-sm hover:bg-white hover:scale-105 transition-all"
      title="Switch Language"
    >
      {language === 'en' ? '🇮🇳 HI' : '🇺🇸 EN'}
    </button>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          <button
            onClick={() => setView('about')}
            className="bg-white/60 backdrop-blur px-3 py-1 rounded-full text-xs font-bold border border-white/40 shadow-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 hover:scale-105 transition-all text-gray-700"
          >
            {t('dev_section_title')}
          </button>
          <LangToggle />
        </div>
        <div className="background-mesh"></div>
        <div className="spotlight"></div> {/* Added Spotlight */}
        <div className="glass-panel p-8 max-w-md w-full text-center space-y-6 animate-fade-in relative z-10">
          <div className="flex justify-center mb-8">
            <span className="text-5xl text-pink-400">✿</span>
          </div>

          <div>
            <h1 className="text-3xl font-serif text-gray-800">{t('welcome')}</h1>
            <p className="text-pink-500 font-medium text-sm mt-1 mb-1">{t('tagline')}</p>
            <p className="text-gray-500 text-sm mt-2">{t('signin_sub')}</p>
          </div>

          {!auth && (
            <div className="bg-red-50 text-red-600 p-2 rounded text-xs text-left">
              <strong>{t('config_needed')}</strong> {t('check_env')}
            </div>
          )}

          {authError && (
            <div className="bg-red-50 text-red-600 p-2 rounded text-xs text-left break-words">
              {authError}
            </div>
          )}

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
            {isSignUp && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-xs font-medium text-gray-700">{t('name_label')}</label>
                  <User size={14} className="text-pink-400" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  className="input-field"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label className="block text-xs font-medium text-gray-700">{t('email_label')}</label>
                <Mail size={14} className="text-pink-400" />
              </div>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="input-field"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label className="block text-xs font-medium text-gray-700">{t('password_label')}</label>
                <Lock size={14} className="text-pink-400" />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="input-field pr-10"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!auth || authLoading}
              className="w-full btn-primary justify-center text-sm py-2.5"
            >
              {authLoading ? <Loader2 size={16} className="animate-spin" /> : (isSignUp ? t('create_account') : t('sign_in'))}
            </button>
          </form>

          <div className="flex items-center gap-4">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-gray-400 text-xs">{t('or')}</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={!auth}
            className="w-full bg-white border border-gray-200 text-gray-700 rounded-full py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <img src="https://www.google.com/favicon.ico" alt="G" className="w-4 h-4" />
            {t('continue_google')}
          </button>

          <div className="text-xs text-center text-gray-500">
            {isSignUp ? t('already_account') : t('dont_have_account')}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-1 text-pink-500 font-medium hover:underline"
            >
              {isSignUp ? t('sign_in') : t('create_one')}
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-[10px] text-gray-400">Developed by <span className="font-semibold text-pink-400">Sarthakk Anjariya</span></p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative p-4 pb-20">
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setView('about')}
          className="bg-white/60 backdrop-blur px-3 py-1 rounded-full text-xs font-bold border border-white/40 shadow-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 hover:scale-105 transition-all text-gray-700"
        >
          {t('dev_section_title')}
        </button>
        <LangToggle />
      </div>
      <div className="background-mesh"></div>
      <div className="spotlight"></div>

      <header className="max-w-4xl mx-auto flex justify-between items-center py-6">
        <div className="flex items-center gap-4 text-2xl font-serif font-semibold text-gray-800 px-2 cursor-pointer" onClick={() => setView('chat')}>
          <span className="text-pink-400 text-3xl">✿</span> <span>Aura</span>
          {view === 'dashboard' && <span className="text-sm font-sans font-normal text-gray-400 ml-2">{t('back_chat')}</span>}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setView(view === 'dashboard' ? 'chat' : 'dashboard')}
            className="hidden md:flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-full border border-white/60 hover:bg-pink-100 hover:border-pink-300 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
          >
            {user.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-6 h-6 rounded-full" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-pink-200 flex items-center justify-center text-xs font-bold text-pink-700">
                {user.displayName?.[0] || 'U'}
              </div>
            )}
            <span className="text-sm text-gray-700 font-medium">{user.displayName || user.email.split('@')[0]}</span>
          </button>
          <button onClick={handleLogout} className="text-gray-500 hover:text-pink-500 transition-colors" title="Sign Out">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto space-y-6">


        {view === 'dashboard' ? (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-panel p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-pink-200 to-green-100 mb-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-pink-100 flex items-center justify-center text-4xl font-serif text-pink-400">
                    {user.displayName?.[0] || 'U'}
                  </div>
                )}
              </div>
              <h2 className="text-3xl font-serif text-gray-800">{user.displayName || 'Wellness User'}</h2>
              <p className="text-gray-500">{user.email}</p>

              <div className="grid grid-cols-3 gap-4 w-full max-w-md mt-6">
                <div className="bg-white/50 p-4 rounded-xl border border-white/60">
                  <div className="text-2xl font-serif text-pink-400">7</div>
                  <div className="text-xs text-gray-500">{t('streak')}</div>
                </div>
                <div className="bg-white/50 p-4 rounded-xl border border-white/60">
                  <div className="text-2xl font-serif text-green-400">12</div>
                  <div className="text-xs text-gray-500">{t('plans')}</div>
                </div>
                <div className="bg-white/50 p-4 rounded-xl border border-white/60">
                  <div className="text-2xl font-serif text-blue-400">Gold</div>
                  <div className="text-xs text-gray-500">{t('status')}</div>
                </div>
              </div>
            </div>

            {/* Cycle Tracker Widget */}
            <div className="glass-panel p-6 relative overflow-hidden">
              <div className="text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="font-serif text-xl text-gray-800 mb-1">{t('cycle_tracker')}</h3>
                  <p className="text-sm text-gray-500">{t('current_phase')}: <span className="font-semibold text-pink-500">{t(cyclePhase)}</span></p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-pink-100" />
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * cycleDay / 28)} className="text-pink-400 transition-all duration-1000 ease-out" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xs text-gray-400">{t('day')}</span>
                      <span className="text-2xl font-serif text-gray-800">{cycleDay}</span>
                    </div>
                  </div>

                  <div className="text-center md:text-right space-y-2">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">{t('next_period')}</p>
                    <p className="text-lg font-medium text-gray-700">in {28 - cycleDay} days</p>
                    <button className="text-xs bg-pink-50 text-pink-600 px-3 py-1 rounded-full border border-pink-100 hover:bg-pink-100">{t('log_period')}</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-panel p-6">
                <h3 className="font-serif text-xl mb-4 text-gray-700">{t('recent_plans')}</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-gray-600 p-3 rounded-xl transition-all border border-transparent hover:bg-pink-100 hover:text-pink-900 hover:font-semibold hover:border-pink-200 cursor-pointer shadow-sm hover:shadow-md">
                    <FileText size={18} className="text-pink-400 group-hover:text-pink-600" /> <span>Weekend Relax Plan</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600 p-3 rounded-xl transition-all border border-transparent hover:bg-pink-100 hover:text-pink-900 hover:font-semibold hover:border-pink-200 cursor-pointer shadow-sm hover:shadow-md">
                    <FileText size={18} className="text-pink-400 group-hover:text-pink-600" /> <span>Hygiene Routine B</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600 p-3 rounded-xl transition-all border border-transparent hover:bg-pink-100 hover:text-pink-900 hover:font-semibold hover:border-pink-200 cursor-pointer shadow-sm hover:shadow-md">
                    <FileText size={18} className="text-pink-400 group-hover:text-pink-600" /> <span>Stress Detox</span>
                  </li>
                </ul>
              </div>
              <div className="glass-panel p-6">
                <h3 className="font-serif text-xl mb-4 text-gray-700">{t('health_tracker')}</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>{t('hydration')}</span>
                    <span className="text-blue-400">{t('glasses')}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-300 w-1/2"></div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>{t('sleep')}</span>
                    <span className="text-purple-400">7h 30m</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-300 w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Developer Section in Dashboard */}
            <DeveloperCard />
          </div>
        ) : view === 'about' ? (
          <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh]">
            <div className="glass-panel p-8 max-w-2xl w-full relative overflow-hidden">
              <button
                onClick={() => setView('chat')}
                className="absolute top-6 left-6 text-gray-400 hover:text-pink-500 transition-colors flex items-center gap-2 text-sm font-medium z-10"
              >
                <ArrowLeft size={16} /> {t('back_home')}
              </button>

              <div className="flex flex-col items-center text-center space-y-6 mt-6">
                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-pink-300 to-purple-300 shadow-lg">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    {/* Placeholder for Sarthakk's image or just an initial/icon if no image provided yet */}
                    <User size={64} className="text-pink-300" />
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-serif text-gray-800 mb-2">{t('dev_name')}</h2>
                  <p className="text-pink-500 font-medium">{t('dev_role')}</p>
                </div>

                <p className="text-gray-600 max-w-lg leading-relaxed">
                  {t('dev_bio')}
                </p>

                <div className="bg-pink-50 p-3 rounded-lg border border-pink-100 max-w-lg">
                  <p className="text-xs text-pink-600 font-medium">✨ {t('lang_note')}</p>
                </div>

                <div className="w-full h-px bg-gray-100 my-4"></div>

                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t('connect')}</h3>

                <div className="flex gap-6 mt-4">
                  <a href="https://medium.com/@sarthakk_ai" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 group-hover:bg-black group-hover:border-black transition-all duration-300 shadow-sm group-hover:shadow-md">
                      <PenTool size={20} className="text-gray-700 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-xs text-gray-500 group-hover:text-black font-medium transition-colors">sarthakk_ai</span>
                  </a>

                  <a href="https://www.instagram.com/_sarthakk._.17/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 group-hover:bg-gradient-to-tr group-hover:from-yellow-400 group-hover:via-red-500 group-hover:to-purple-500 group-hover:border-transparent transition-all duration-300 shadow-sm group-hover:shadow-md">
                      <Instagram size={20} className="text-gray-700 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-xs text-gray-500 group-hover:text-pink-600 font-medium transition-colors">Instagram</span>
                  </a>

                  <a href="https://github.com/Solivagus17" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 group-hover:bg-gray-900 group-hover:border-gray-900 transition-all duration-300 shadow-sm group-hover:shadow-md">
                      <Github size={20} className="text-gray-700 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-xs text-gray-500 group-hover:text-gray-900 font-medium transition-colors">GitHub</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Welcome Card */}
            <section className="text-center py-6 space-y-4">
              <h1 className="text-4xl font-serif text-gray-800">
                {t('hello')} {user.displayName?.split(' ')[0] || ''} <span className="text-pink-300">👋</span>
              </h1>
              <p className="text-gray-600 max-w-lg mx-auto">
                {t('ready_journey')}
              </p>
              <button onClick={generateCuratedPlan} className="btn-primary">
                <FileText size={18} /> {t('generate_plan')}
              </button>
            </section>

            {/* Chat Interface */}
            <section className="glass-panel h-[500px] flex flex-col p-4 relative transition-all duration-500">
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar" ref={scrollRef}>
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'model' ? 'bg-gradient-to-br from-white to-pink-50' : 'bg-pink-400 text-white'}`}>
                      {msg.role === 'model' ? <Sparkles size={16} className="text-pink-400" /> : (
                        user.photoURL ? <img src={user.photoURL} className="w-8 h-8 rounded-full" /> : <User size={16} />
                      )}
                    </div>
                    <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-pink-400 text-white rounded-tr-sm' : 'bg-white rounded-tl-sm text-gray-700'}`}>
                      <div className="whitespace-pre-line">{msg.text}</div>
                      {msg.isPlan && (
                        <button
                          onClick={() => createGoogleDoc(msg.text)}
                          disabled={isSaving}
                          className="mt-3 flex items-center gap-2 text-xs bg-green-50 text-green-700 px-3 py-2 rounded-full border border-green-100 hover:bg-green-100 transition-colors"
                        >
                          {isSaving ? <Loader2 size={12} className="animate-spin" /> : <FileText size={12} />}
                          {isSaving ? t('saving') : t('save_docs')}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Input Area */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t('ask_anything')}
                  className="input-field"
                />
                <button onClick={handleSend} disabled={!input.trim()} className="btn-primary rounded-full w-12 h-12 flex items-center justify-center p-0">
                  <Send size={18} />
                </button>
              </div>
            </section>
          </>
        )}

      </main>

      {/* --- Footer --- */}
      <footer className="mt-20 border-t border-white/60 bg-white/30 backdrop-blur-md">
        <div className="max-w-4xl mx-auto py-8 px-4 grid md:grid-cols-3 gap-8 text-sm text-gray-600">
          <div>
            <h4 className="font-serif text-lg text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-pink-400">✿</span> Aura
            </h4>
            <p className="leading-relaxed">
              {t('footer_mission')}
            </p>
            <p className="text-xs text-gray-400 mt-2 italic">
              {t('ai_disclaimer')}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-700 mb-3 uppercase tracking-wider text-xs">{t('contact_us')}</h4>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-pink-400" />
                <a href="mailto:hello@aura-app.com" className="hover:text-pink-500 transition-colors">hello@aura-app.com</a>
              </p>
              <p className="flex items-center gap-2">
                <User size={14} className="text-pink-400" />
                <span>+1 (555) 123-4567</span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-700 mb-3 uppercase tracking-wider text-xs">{t('about')}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-pink-500 transition-colors">{t('mission_link')}</a></li>
              <li><a href="#" className="hover:text-pink-500 transition-colors">{t('privacy_link')}</a></li>
              <li><a href="#" className="hover:text-pink-500 transition-colors">{t('terms_link')}</a></li>
              <li><button onClick={() => setView('about')} className="hover:text-pink-500 transition-colors text-left">{t('dev_section_title')}</button></li>
            </ul>
          </div>
        </div>
        <div className="text-center py-4 border-t border-white/20 text-xs text-gray-400">
          © {new Date().getFullYear()} {t('rights')}
        </div>
      </footer>
    </div>
  );
}

export default App;
