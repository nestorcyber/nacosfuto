import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  Trophy, 
  Timer, 
  ArrowRight, 
  CheckCircle, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Cpu, 
  Wallet, 
  Globe, 
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import HackathonNavbar from '../components/HackathonNavbar';
import CountdownTimer from '../components/CountdownTimer';
import Footer from '../components/Footer';
import { HACKATHONS } from '../data/hackathons';

const HackathonDetail = () => {
  const hackathon = HACKATHONS[0]; // BuildX NACOS
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.8 }
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const getTrackIcon = (icon) => {
    switch (icon) {
      case 'Wallet': return <Wallet className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#041801] text-gray-900 dark:text-white font-sans selection:bg-[#138601] selection:text-white">
      
      {/* Top Navbar */}
      <HackathonNavbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 border-b border-gray-200 dark:border-[#138601]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-[#138601] dark:text-[#4bd043]">
                  {hackathon.badge}
                </span>
                <span className="text-gray-400 dark:text-gray-500">•</span>
                <span className="text-gray-600 dark:text-gray-300">
                  {hackathon.mode}
                </span>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white font-display">
                  Build<span className="text-[#138601] dark:text-[#4bd043]">X</span> NACOS 2026
                </h1>
                <p className="text-lg sm:text-xl text-gray-700 dark:text-green-100 font-semibold leading-snug">
                  {hackathon.subtitle}
                </p>
              </div>

              <p className="text-sm sm:text-base text-gray-600 dark:text-green-100/80 max-w-xl leading-relaxed font-normal">
                {hackathon.tagline} Collaborate across chapters, build innovative solutions, and compete for national recognition.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/hackathons/BuildXNACOS/apply"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded-xl shadow-sm transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Apply with Team</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-gray-700 dark:text-green-100 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-[#083002] hover:bg-gray-50 dark:hover:bg-[#083002]/80 rounded-xl border border-gray-200 dark:border-[#138601]/30 transition-colors shadow-sm cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-[#138601] dark:text-[#4bd043]" />
                      <span className="text-[#138601] dark:text-[#4bd043] font-medium">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Share Hackathon</span>
                    </>
                  )}
                </button>
              </div>

              {/* Organizer Meta */}
              <div className="pt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-green-200/80 border-t border-gray-200 dark:border-[#138601]/20 font-normal">
                <span>Organized by:</span>
                <span className="font-semibold text-[#138601] dark:text-[#4bd043]">{hackathon.organizer}</span>
                <span>•</span>
                <span>FUTO Chapter Host</span>
              </div>
            </div>

            {/* Right: Countdown & Status Card */}
            <div className="lg:col-span-5 space-y-4">
              <CountdownTimer targetDate={hackathon.startDate} label="Registration Closes In" />

              {/* Participation Metrics */}
              <div className="bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 rounded-2xl p-5 shadow-sm">
                <div className="text-xs font-semibold text-gray-700 dark:text-[#4bd043] mb-3 flex items-center justify-between">
                  <span>Participation Metrics</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-gray-50 dark:bg-[#041801] rounded-xl border border-gray-200 dark:border-[#138601]/20">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{hackathon.stats.registeredStudents}+</div>
                    <div className="text-xs text-gray-500 dark:text-green-200/80 font-normal">Students</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-[#041801] rounded-xl border border-gray-200 dark:border-[#138601]/20">
                    <div className="text-xl font-bold text-[#138601] dark:text-[#4bd043]">{hackathon.stats.activeTeams}</div>
                    <div className="text-xs text-gray-500 dark:text-green-200/80 font-normal">Teams</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-[#041801] rounded-xl border border-gray-200 dark:border-[#138601]/20">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{hackathon.stats.submissionsCount}</div>
                    <div className="text-xs text-gray-500 dark:text-green-200/80 font-normal">Submissions</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Key Stats Grid */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 flex items-center space-x-3 sm:space-x-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#138601]/20 border border-gray-200 dark:border-[#138601]/40 flex items-center justify-center shrink-0 text-[#138601] dark:text-[#4bd043]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-green-200/70 font-normal">Event Date</div>
              <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">{hackathon.stats.eventDate}</div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 flex items-center space-x-3 sm:space-x-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#138601]/20 border border-gray-200 dark:border-[#138601]/40 flex items-center justify-center shrink-0 text-[#138601] dark:text-[#4bd043]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-green-200/70 font-normal">Location</div>
              <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">{hackathon.stats.location}</div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 flex items-center space-x-3 sm:space-x-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#138601]/20 border border-gray-200 dark:border-[#138601]/40 flex items-center justify-center shrink-0 text-[#138601] dark:text-[#4bd043]">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-green-200/70 font-normal">Total Prize Pool</div>
              <div className="text-sm sm:text-base font-bold text-[#138601] dark:text-[#4bd043]">{hackathon.stats.prizePool}</div>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 flex items-center space-x-3 sm:space-x-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#138601]/20 border border-gray-200 dark:border-[#138601]/40 flex items-center justify-center shrink-0 text-[#138601] dark:text-[#4bd043]">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-green-200/70 font-normal">Apply Before</div>
              <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">{hackathon.stats.applyBefore}</div>
            </div>
          </div>

        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Build beyond the classroom. Solve real challenges.
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-green-100/90 leading-relaxed font-normal">
              BuildX NACOS is the national hackathon organized by the Nigeria Association of Computing Students (NACOS). It mobilizes student software engineers, designers, and developers across Nigerian universities.
            </p>
            <p className="text-sm text-gray-500 dark:text-green-200/80 leading-relaxed font-normal">
              Finalists connect directly with mentors, hiring partners, and awards. Build functional products that solve concrete African challenges.
            </p>

            <div className="pt-2 space-y-2.5">
              <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-green-100 font-normal">
                <CheckCircle className="w-4 h-4 text-[#138601] dark:text-[#4bd043] shrink-0" />
                <span>Mentorship from senior software architects & industry engineers</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-green-100 font-normal">
                <CheckCircle className="w-4 h-4 text-[#138601] dark:text-[#4bd043] shrink-0" />
                <span>Cloud computing credits & developer tool access</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-green-100 font-normal">
                <CheckCircle className="w-4 h-4 text-[#138601] dark:text-[#4bd043] shrink-0" />
                <span>Certificate of technical achievement on your student profile</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/40 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-[#138601] dark:text-[#4bd043]" />
                Why You Should Participate
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/20">
                  <div className="font-semibold text-gray-900 dark:text-[#4bd043] mb-0.5">Industry Exposure</div>
                  <p className="text-gray-600 dark:text-green-100/80 font-normal">Showcase your technical skills to potential hiring teams and collaborators.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/20">
                  <div className="font-semibold text-gray-900 dark:text-[#4bd043] mb-0.5">Team Collaboration</div>
                  <p className="text-gray-600 dark:text-green-100/80 font-normal">Team up with peers across universities to build full-stack solutions.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/20">
                  <div className="font-semibold text-gray-900 dark:text-[#4bd043] mb-0.5">Cash Grants & Recognition</div>
                  <p className="text-gray-600 dark:text-green-100/80 font-normal">₦1,000,000 equity-free prize pool to support further project development.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Prizes Section */}
      <section id="prizes" className="py-16 bg-gray-100/60 dark:bg-[#083002]/40 border-y border-gray-200 dark:border-[#138601]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-semibold text-[#138601] dark:text-[#4bd043]">Rewards & Recognition</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              ₦1,000,000 Total Prize Pool
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-green-200/80 font-normal">
              Rewarding excellence in software architecture, usability, and practical impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hackathon.prizes.map((prize, idx) => (
              <div 
                key={idx}
                className="relative rounded-2xl p-6 bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/40 flex flex-col justify-between transition-all shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-600 dark:text-[#4bd043]">
                      {prize.rank}
                    </span>
                    <Trophy className="w-5 h-5 text-[#138601] dark:text-[#4bd043]" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">{prize.title}</h3>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {prize.amount}
                  </div>

                  <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-[#138601]/20 text-xs text-gray-600 dark:text-green-100 font-normal">
                    <div className="font-semibold text-gray-900 dark:text-green-300 text-xs">Included Perks:</div>
                    {prize.perks.map((perk, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-[#138601] dark:text-[#4bd043] shrink-0" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3">
                  <Link
                    to="/hackathons/BuildXNACOS/apply"
                    className="w-full inline-flex items-center justify-center py-2 px-4 rounded-xl text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] transition-colors shadow-sm"
                  >
                    Compete for this Prize
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Challenge Tracks */}
      <section id="tracks" className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-semibold text-[#138601] dark:text-[#4bd043]">Problem Statements</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Challenge Tracks
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-green-200/80 font-normal">
            Choose a challenge track that matches your team's technical focus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hackathon.tracks.map((track) => (
            <div
              key={track.id}
              className="rounded-2xl p-6 bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#138601]/20 border border-gray-200 dark:border-[#138601]/40 flex items-center justify-center text-[#138601] dark:text-[#4bd043] mb-4">
                  {getTrackIcon(track.icon)}
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{track.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-green-100/80 leading-relaxed mb-4 font-normal">
                  {track.description}
                </p>

                <div className="space-y-1.5 pt-3 border-t border-gray-100 dark:border-[#138601]/20">
                  <span className="text-xs font-semibold text-gray-900 dark:text-[#4bd043]">Example Concepts:</span>
                  {track.ideas.map((idea, iIdx) => (
                    <div key={iIdx} className="text-xs text-gray-600 dark:text-green-100 flex items-start gap-2 font-normal">
                      <span className="text-[#138601] dark:text-[#4bd043]">•</span>
                      <span>{idea}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3">
                <Link
                  to={`/hackathons/BuildXNACOS/apply?track=${track.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#138601] dark:text-[#4bd043] hover:underline"
                >
                  <span>Select this track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-16 bg-gray-100/60 dark:bg-[#083002]/40 border-y border-gray-200 dark:border-[#138601]/25">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-semibold text-[#138601] dark:text-[#4bd043]">Schedule</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Event Timeline
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-green-200/80 font-normal">
              Important dates for registration, development sprints, and final evaluations.
            </p>
          </div>

          <div className="space-y-4">
            {hackathon.timeline.map((step, idx) => (
              <div 
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 shadow-sm flex items-start gap-4"
              >
                <div className="w-7 h-7 rounded-lg bg-[#138601] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#138601] dark:text-[#4bd043] mb-0.5">
                    {step.date}
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-1">{step.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-green-100/80 leading-relaxed font-normal">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-semibold text-[#138601] dark:text-[#4bd043]">Questions & Answers</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {hackathon.faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="rounded-xl bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 overflow-hidden shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left text-sm font-semibold text-gray-900 dark:text-white hover:text-[#138601] dark:hover:text-[#4bd043] transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-[#138601] dark:text-[#4bd043] shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-4 text-xs sm:text-sm text-gray-600 dark:text-green-100/90 leading-relaxed border-t border-gray-100 dark:border-[#138601]/20 pt-2.5 font-normal">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default HackathonDetail;
