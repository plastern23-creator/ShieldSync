import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, Calendar as CalendarIcon, DollarSign, Clock, Users, AlertTriangle, 
  CheckCircle2, Plus, ArrowRight, Lock, Mail, Key, User, Smartphone, Globe, 
  Sliders, FileText, ChevronRight, Check, X, RefreshCw, BarChart3, LogOut, Briefcase, Award
} from 'lucide-react';

export default function ShieldSyncApp() {
  // Navigation & Authentication States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState('Sgt. N. Plaster');
  const [password, setPassword] = useState('********');
  const [badgeNumber, setBadgeNumber] = useState('7420');
  const [agency, setAgency] = useState('Raleigh Police Department');
  const [showPassword, setShowPassword] = useState(false);
  const [ssoProvider, setSsoProvider] = useState(null);

  // Setup Wizard State
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [selectedRotation, setSelectedRotation] = useState('pitman_day');
  const [selectedSquad, setSelectedSquad] = useState('Squad A');
  const [selectedApps, setSelectedApps] = useState(['RollKall', 'PowerDetails']);
  const [selectedCalendar, setSelectedCalendar] = useState('apple');

  // Tax & Fatigue Engine Parameters
  const [federalRate, setFederalRate] = useState(22);
  const [stateRate, setSateRate] = useState(5.25);
  const [mileageRate, setMileageRate] = useState(0.67);
  const [maxDailyHours, setMaxDailyHours] = useState(16);
  const [maxWeeklyHours, setMaxWeeklyHours] = useState(64);

  // Active Tab View ('schedule', 'tax', 'parser', 'rotation')
  const [activeTab, setActiveTab] = useState('schedule');
  const [calendarView, setCalendarView] = useState('month'); // 'month' or 'week'

  // Schedule & Detail State
  const [details, setDetails] = useState([
    { id: 1, title: 'Downtown Street Festival Security', platform: 'RollKall', date: '2026-10-28', hours: 8, rate: 55, type: '1099', status: 'Confirmed', location: 'Fayetteville St' },
    { id: 2, title: 'Construction Traffic Control', platform: 'PowerDetails', date: '2026-10-30', hours: 6, rate: 50, type: '1099', status: 'Confirmed', location: 'Capital Blvd' },
    { id: 3, title: 'High School Football Detail', platform: 'OfficerTRAK', date: '2026-11-01', hours: 5, rate: 45, type: '1099', status: 'Pending', location: 'Enloe Stadium' }
  ]);

  // Schedule C Deductions State
  const [deductions, setDeductions] = useState([
    { id: 1, category: 'Duty Gear & Vest Carrier', amount: 480 },
    { id: 2, category: 'Uniform Dry Cleaning & Upkeep', amount: 320 },
    { id: 3, category: 'Secondary Liability Insurance', amount: 195 },
    { id: 4, category: 'Range Ammo & Training', amount: 350 },
    { id: 5, category: 'Off-Duty Detail Mileage (450 mi)', amount: 301.5 }
  ]);

  // Parser Simulator State
  const [rawParserText, setRawParserText] = useState(
    "CONFIRMATION: RollKall Detail #98241. You have been assigned to City Center Parade on 2026-11-05 from 17:00 to 23:00 (6 hours) at $60.00/hr. Location: Nash Square. Contact Coordinator Sgt. Miller."
  );
  const [parserResult, setParserResult] = useState(null);

  // New Detail Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState('RollKall');
  const [newDate, setNewDate] = useState('2026-11-02');
  const [newHours, setNewHours] = useState(6);
  const [newRate, setNewRate] = useState(55);
  const [newLocation, setNewLocation] = useState('');

  // Calculations for Tax & Hours
  const total1099Earnings = useMemo(() => {
    return details.reduce((acc, d) => acc + (d.hours * d.rate), 0);
  }, [details]);

  const totalDeductions = useMemo(() => {
    return deductions.reduce((acc, d) => acc + d.amount, 0);
  }, [deductions]);

  const net1099Profit = Math.max(0, total1099Earnings - totalDeductions);
  const seTax = net1099Profit * 0.9235 * 0.153; // ~14.13% effective SECA tax
  const incomeTaxEst = net1099Profit * ((federalRate + stateRate) / 100);
  const totalEstimatedTax = seTax + incomeTaxEst;
  const recommendedSetAside = total1099Earnings > 0 ? Math.round((totalEstimatedTax / total1099Earnings) * 100) : 28;

  // Handle Detail Addition
  const handleAddDetail = (e) => {
    e.preventDefault();
    if (!newTitle) return;
    const item = {
      id: Date.now(),
      title: newTitle,
      platform: newPlatform,
      date: newDate,
      hours: Number(newHours),
      rate: Number(newRate),
      type: '1099',
      status: 'Confirmed',
      location: newLocation || 'Primary District'
    };
    setDetails([...details, item]);
    setNewTitle('');
    setNewLocation('');
    setShowAddModal(false);
  };

  // Handle Email Parsing Simulation
  const handleParseText = () => {
    setParserResult({
      title: 'City Center Parade',
      platform: 'RollKall',
      date: '2026-11-05',
      hours: 6,
      rate: 60,
      location: 'Nash Square',
      earnings: 360,
      confidence: '99.4%'
    });
  };

  const handleAcceptParsed = () => {
    if (!parserResult) return;
    setDetails([...details, {
      id: Date.now(),
      title: parserResult.title,
      platform: parserResult.platform,
      date: parserResult.date,
      hours: parserResult.hours,
      rate: parserResult.rate,
      type: '1099',
      status: 'Confirmed',
      location: parserResult.location
    }]);
    setParserResult(null);
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white pb-12">
      {/* Ambient Glass Glow Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/15 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px]"></div>
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* TOP TACTICAL HUD HEADER */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-white/15 shadow-2xl mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 border border-white/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">ShieldSync</h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30">LE Ops & Tax v3.2</span>
              </div>
              <p className="text-xs text-slate-400">Master Schedule, Detail Ingestion & 1099 Tax Engine</p>
            </div>
          </div>

          {isAuthenticated && isSetupComplete && (
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <div className="px-3 py-1.5 rounded-2xl bg-slate-800/80 border border-white/10 text-xs flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-slate-300 font-medium">{username}</span>
                <span className="text-slate-500">|</span>
                <span className="text-cyan-400 font-mono">Badge #{badgeNumber}</span>
              </div>
              
              <button 
                onClick={() => setIsSetupComplete(false)}
                className="px-3 py-1.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-xs font-medium text-slate-300 transition flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                Quick Setup
              </button>

              <button 
                onClick={() => { setIsAuthenticated(false); setIsSetupComplete(false); }}
                className="px-3 py-1.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-medium text-rose-300 transition flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </header>

        {/* VIEW 1: AUTHENTICATION GATE */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto mt-12 p-8 rounded-3xl bg-slate-900/70 backdrop-blur-3xl border border-white/15 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-cyan-500/30 border border-white/20">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Officer Secure Access</h2>
              <p className="text-xs text-slate-400 mt-1">Law Enforcement Master Schedule & Secondary Detail Hub</p>
            </div>

            {/* Auth Mode Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-950/60 border border-white/10 mb-6">
              <button 
                onClick={() => setAuthMode('login')}
                className={`py-2 text-xs font-semibold rounded-xl transition ${authMode === 'login' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'text-slate-400 hover:text-white'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => setAuthMode('register')}
                className={`py-2 text-xs font-semibold rounded-xl transition ${authMode === 'register' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'text-slate-400 hover:text-white'}`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Officer Username / Callsign</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 transition"
                    placeholder="Sgt. N. Plaster"
                  />
                </div>
              </div>

              {authMode === 'register' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Badge Number</label>
                    <input 
                      type="text" 
                      value={badgeNumber}
                      onChange={(e) => setBadgeNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 transition"
                      placeholder="7420"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Agency</label>
                    <input 
                      type="text" 
                      value={agency}
                      onChange={(e) => setAgency(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 transition"
                      placeholder="Raleigh PD"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-950/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 transition"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-white"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 border border-white/20 transition flex items-center justify-center gap-2 mt-2"
              >
                {authMode === 'login' ? 'Authenticate & Access Hub' : 'Register Officer Profile'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-center text-xs text-slate-400 mb-4">Or sign in instantly with Single Sign-On (SSO)</p>
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => { setSsoProvider('Google'); setIsAuthenticated(true); }}
                  className="py-2.5 px-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-white/10 text-xs font-medium text-slate-200 flex items-center justify-center gap-2 transition"
                >
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  Google
                </button>
                <button 
                  onClick={() => { setSsoProvider('Microsoft'); setIsAuthenticated(true); }}
                  className="py-2.5 px-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-white/10 text-xs font-medium text-slate-200 flex items-center justify-center gap-2 transition"
                >
                  <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                  Outlook
                </button>
                <button 
                  onClick={() => { setSsoProvider('Apple'); setIsAuthenticated(true); }}
                  className="py-2.5 px-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-white/10 text-xs font-medium text-slate-200 flex items-center justify-center gap-2 transition"
                >
                  <Smartphone className="w-3.5 h-3.5 text-slate-300" />
                  Apple ID
                </button>
              </div>
            </div>
          </div>
        ) : !isSetupComplete ? (
          
          /* VIEW 2: 4-STEP MISSION ONBOARDING WIZARD */
          <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-slate-900/80 backdrop-blur-3xl border border-white/15 shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white">Mission Setup Wizard</h2>
                <p className="text-xs text-slate-400">Configure your shift rotation, off-duty platforms, and tax engine parameters.</p>
              </div>
              <div className="px-3 py-1 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                Step {setupStep} of 4
              </div>
            </div>

            {setupStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">1. Select Patrol Shift Rotation & Squad</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'pitman_day', title: 'Pitman 2-2-3 (Day)', desc: '06:00 - 18:00 (12h shifts)' },
                    { id: 'pitman_night', title: 'Pitman 2-2-3 (Night)', desc: '18:00 - 06:00 (12h shifts)' },
                    { id: 'four_on_four_off', title: '4-On / 4-Off Rotation', desc: '10.5h or 12h squad rotation' },
                    { id: 'panama', title: 'Panama 12-Hour', desc: '2 days on, 2 off, 3 on (alternating)' },
                    { id: 'admin_5x8', title: '5x8 Admin / CID', desc: 'Monday - Friday standard' }
                  ].map((rot) => (
                    <div 
                      key={rot.id}
                      onClick={() => setSelectedRotation(rot.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition ${selectedRotation === rot.id ? 'bg-cyan-500/20 border-cyan-500/60 shadow-lg shadow-cyan-500/20' : 'bg-slate-950/50 border-white/10 hover:border-white/25'}`}
                    >
                      <h4 className="text-sm font-bold text-white mb-1">{rot.title}</h4>
                      <p className="text-xs text-slate-400">{rot.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Assigned Squad</label>
                  <div className="flex gap-2">
                    {['Squad A', 'Squad B', 'Squad C', 'Squad D'].map((sq) => (
                      <button
                        key={sq}
                        type="button"
                        onClick={() => setSelectedSquad(sq)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${selectedSquad === sq ? 'bg-cyan-500 text-white border-cyan-400' : 'bg-slate-950/60 text-slate-400 border-white/10'}`}
                      >
                        {sq}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {setupStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">2. Select Off-Duty Detail Platforms</h3>
                <p className="text-xs text-slate-400">Choose which secondary employment networks your department uses to pull jobs and confirmations.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'RollKall', name: 'RollKall', desc: 'Automated email parser & direct scheduling sync' },
                    { id: 'PowerDetails', name: 'PowerDetails', desc: 'Real-time shift bidding & calendar export' },
                    { id: 'OfficerTRAK', name: 'OfficerTRAK (Off Duty Mgt)', desc: 'Enterprise law enforcement detail portal' },
                    { id: 'DetailKommander', name: 'Detail Kommander', desc: 'Secondary employment dispatch integration' },
                    { id: 'Private', name: 'Direct Commercial Contracts', desc: 'Direct corporate & private security gigs' }
                  ].map((app) => {
                    const isSelected = selectedApps.includes(app.id);
                    return (
                      <div 
                        key={app.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedApps(selectedApps.filter(a => a !== app.id));
                          } else {
                            setSelectedApps([...selectedApps, app.id]);
                          }
                        }}
                        className={`p-4 rounded-2xl border cursor-pointer transition flex items-start justify-between ${isSelected ? 'bg-cyan-500/20 border-cyan-500/60 shadow-lg shadow-cyan-500/20' : 'bg-slate-950/50 border-white/10 hover:border-white/25'}`}
                      >
                        <div>
                          <h4 className="text-sm font-bold text-white mb-1">{app.name}</h4>
                          <p className="text-xs text-slate-400">{app.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center border ${isSelected ? 'bg-cyan-500 border-cyan-400 text-white' : 'border-white/20'}`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {setupStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">3. Choose Master Calendar Destination</h3>
                <p className="text-xs text-slate-400">Where would you like your merged master schedule (Primary Shift + Off-Duty Gigs + Court) to sync?</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'apple', name: 'Apple Calendar', desc: 'iCal webfeed sync (.ics)' },
                    { id: 'google', name: 'Google Calendar', desc: 'Direct two-way OAuth sync' },
                    { id: 'outlook', name: 'Microsoft Outlook / 365', desc: 'Exchange calendar integration' }
                  ].map((cal) => (
                    <div 
                      key={cal.id}
                      onClick={() => setSelectedCalendar(cal.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition text-center ${selectedCalendar === cal.id ? 'bg-cyan-500/20 border-cyan-500/60 shadow-lg shadow-cyan-500/20' : 'bg-slate-950/50 border-white/10 hover:border-white/25'}`}
                    >
                      <h4 className="text-sm font-bold text-white mb-1">{cal.name}</h4>
                      <p className="text-xs text-slate-400">{cal.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {setupStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">4. Tax & Fatigue Guardrails</h3>
                <p className="text-xs text-slate-400">Configure your tax withholding brackets for 1099 earnings and agency fatigue limits.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Federal Marginal Rate (%)</label>
                    <input 
                      type="number" 
                      value={federalRate}
                      onChange={(e) => setFederalRate(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">State Tax Rate (%)</label>
                    <input 
                      type="number" 
                      value={stateRate}
                      onChange={(e) => setSateRate(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Max Daily Combined Hours</label>
                    <input 
                      type="number" 
                      value={maxDailyHours}
                      onChange={(e) => setMaxDailyHours(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Max Weekly Rolling Cap</label>
                    <input 
                      type="number" 
                      value={maxWeeklyHours}
                      onChange={(e) => setMaxWeeklyHours(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
              {setupStep > 1 ? (
                <button 
                  onClick={() => setSetupStep(setupStep - 1)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Back
                </button>
              ) : <div></div>}

              {setupStep < 4 ? (
                <button 
                  onClick={() => setSetupStep(setupStep + 1)}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow-lg shadow-cyan-500/25 flex items-center gap-2 hover:from-cyan-400 hover:to-blue-500 transition"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  onClick={() => setIsSetupComplete(true)}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold shadow-lg shadow-emerald-500/25 flex items-center gap-2 hover:from-emerald-400 hover:to-teal-500 transition"
                >
                  Complete Mission Setup
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (

          /* VIEW 3: MAIN APP DASHBOARD (APPLE LIQUID GLASS / ARGON TACTICAL HUD) */
          <div className="space-y-6">
            
            {/* Top Quick Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-white/15 shadow-xl relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl"></div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Projected 1099 Gross</span>
                  <DollarSign className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold text-white">${total1099Earnings.toLocaleString()}</div>
                <div className="text-[11px] text-cyan-300 mt-1 flex items-center gap-1">
                  <span>{details.length} active detail shifts logged</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-white/15 shadow-xl relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl"></div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Est. SECA & Income Tax</span>
                  <BarChart3 className="w-5 h-5 text-rose-400" />
                </div>
                <div className="text-2xl font-bold text-white">${Math.round(totalEstimatedTax).toLocaleString()}</div>
                <div className="text-[11px] text-rose-300 mt-1 flex items-center gap-1">
                  <span>Recommended {recommendedSetAside}% set-aside rate</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-white/15 shadow-xl relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fatigue Compliance</span>
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-emerald-400">100% Secure</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  <span>0 over-cap violations detected</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-white/15 shadow-xl relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rotation & Squad</span>
                  <Clock className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="text-xl font-bold text-white capitalize">{selectedRotation.replace('_', ' ')}</div>
                <div className="text-[11px] text-indigo-300 mt-1">
                  <span>Active: {selectedSquad}</span>
                </div>
              </div>
            </div>

            {/* Navigation Tab Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-white/15 shadow-xl">
              <div className="flex items-center gap-2 overflow-x-auto">
                <button 
                  onClick={() => setActiveTab('schedule')}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold transition flex items-center gap-2 ${activeTab === 'schedule' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'text-slate-400 hover:text-white'}`}
                >
                  <CalendarIcon className="w-4 h-4" />
                  Master Calendar
                </button>
                <button 
                  onClick={() => setActiveTab('tax')}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold transition flex items-center gap-2 ${activeTab === 'tax' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'text-slate-400 hover:text-white'}`}
                >
                  <DollarSign className="w-4 h-4" />
                  1099 Tax Engine & Deductions
                </button>
                <button 
                  onClick={() => setActiveTab('parser')}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold transition flex items-center gap-2 ${activeTab === 'parser' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'text-slate-400 hover:text-white'}`}
                >
                  <Mail className="w-4 h-4" />
                  Detail Parser
                </button>
              </div>

              <button 
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition"
              >
                <Plus className="w-4 h-4" />
                Add Detail / Shift
              </button>
            </div>

            {/* TAB CONTENT 1: MASTER CALENDAR & FATIGUE */}
            {activeTab === 'schedule' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left 2 Cols: Schedule List & Calendar View */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-white/15 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base font-bold text-white">Upcoming Shifts & Off-Duty Gigs</h3>
                        <p className="text-xs text-slate-400">Merged agency patrol rotation and secondary assignments</p>
