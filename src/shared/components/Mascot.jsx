import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';

const roleTips = {
  mangaka: [
    "Use Series Management to publish new chapters and review your editor's notes!",
    "Under deadline pressure? Delegate sketch or coloring tasks to assistants in Task Management!",
    "Monitor the Leaderboard to see reader engagement on your active series!"
  ],
  assistant: [
    "Track the tasks assigned to you by the Mangaka in the 'My Tasks' dashboard!",
    "Once you finish sketch/lineart work, set status to complete to alert the Mangaka!",
    "View your compiled workflow earnings details in the 'Income' section! "
  ],
  tantou: [
    "Review chapter submissions in 'Series Review' and leave specific, actionable notes.",
    "Your comments help Mangakas improve story beats before publishing.",
    "Approve chapters for editorial review when they meet all quality standards!"
  ],
  editorial: [
    "Click 'Series Approval' to vote on new series proposals and drafts.",
    "Organize the weekly release slots under the 'Publishing Schedule' panel.",
    "Track top-performing series across categories using the Leaderboard!"
  ],
  admin: [
    "Create and manage system credentials securely in 'Account Management'.",
    "Assign supervisory Tantou editors to specific Mangaka creators.",
    "Check general database metrics and user counts on your Admin Dashboard!"
  ],
  reader: [
    "Discover new manga series and follow your favorite stories!",
    "Rate chapters and leave reviews to support your favorite Mangakas!",
    "Check out the Leaderboard to discover trending series and top authors!"
  ]
};

export function Mascot({ userRole, isOpen = true, isMobile = false, isMobileOpen = false }) {
  const location = useLocation();
  const [showTip, setShowTip] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    setShowTip(false);
  }, [location.pathname, isMobileOpen, isOpen]);

  const currentTips = roleTips[userRole] ?? roleTips.mangaka;

  const handleMascotClick = () => {
    if (!isMobile && !isOpen) return;
    if (isMobile && !isMobileOpen) return;

    if (!showTip) {
      setShowTip(true);
    } else {
      setTipIndex((prev) => (prev + 1) % currentTips.length);
    }
  };

  const getMode = () => {
    if (isMobile) return 'mobile';
    return isOpen ? 'desktop-open' : 'desktop-collapsed';
  };

  const renderSpeechBubble = () => {
    if (!showTip) return null;
    if (isMobile && !isMobileOpen) return null;

    const mode = getMode();
    const activeTip = currentTips[tipIndex % currentTips.length];

    const positionClasses = {
      'desktop-open': 'left-6 w-64 sm:w-72',
      'desktop-collapsed': 'left-2 w-64 sm:w-72',
      'mobile': 'left-1/2 -translate-x-1/2 w-[210px] sm:w-[220px]'
    }[mode];

    const tailClasses = {
      'desktop-open': 'left-24',
      'desktop-collapsed': 'left-7',
      'mobile': 'left-1/2 -translate-x-1/2'
    }[mode];

    return (
      <div className={`absolute bottom-[calc(100%-8px)] ${positionClasses} z-50 pointer-events-auto transition-all animate-in fade-in zoom-in-95 duration-200`}>
        <div className="relative bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-purple-400 rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.85)] dark:shadow-[4px_4px_0px_0px_rgba(168,85,247,0.4)] text-center select-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTip(false);
            }}
            className="absolute -top-2.5 -right-2.5 text-slate-700 dark:text-slate-200 hover:text-red-500 bg-white dark:bg-slate-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-slate-900 dark:border-purple-400 shadow-xs cursor-pointer transition-transform hover:scale-110 z-20"
            title="Close tip"
          >
            ✕
          </button>

          <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-relaxed font-sans px-1 pt-1">
            "{activeTip}"
          </p>
          <span className="block mt-2 text-[10px] font-extrabold uppercase tracking-wide text-purple-700 dark:text-purple-300 opacity-90">
            Tip {(tipIndex % currentTips.length) + 1}/{currentTips.length} • Click mascot for next
          </span>

          <svg viewBox="0 0 30 16" className={`absolute -bottom-3.5 ${tailClasses} w-7 h-4 overflow-visible`}>
            <path
              d="M 2 0 L 15 15 L 28 0 Z"
              className="fill-white dark:fill-slate-900 stroke-slate-900 dark:stroke-purple-400 stroke-[2]"
            />
            <path
              d="M 3 0 L 27 0"
              className="stroke-white dark:stroke-slate-900 stroke-[3]"
            />
          </svg>
        </div>
      </div>
    );
  };

  const isClickable = isMobile ? isMobileOpen : isOpen;

  return (
    <div className="pt-2 flex flex-col justify-center items-center shrink-0 transition-all duration-300 relative">
      {renderSpeechBubble()}
      <img
        src="/mascot.png"
        alt="Mascot"
        onClick={isClickable ? handleMascotClick : undefined}
        title={isClickable ? "Click for helpful tips!" : undefined}
        className={`${
          isMobile
            ? 'w-56 h-auto max-h-72 cursor-pointer hover:scale-105 active:scale-95'
            : isOpen
            ? 'w-56 max-h-64 cursor-pointer hover:scale-105 active:scale-95'
            : 'w-16 max-h-24 pointer-events-none cursor-default'
        } h-auto object-contain select-none transition-all duration-300 z-10`}
      />
      <div
        className={`${
          isMobile || isOpen ? 'w-44 h-4 -mt-10' : 'w-12 h-2 -mt-3.5'
        } bg-black/30 dark:bg-black/50 rounded-[50%] blur-[1px] select-none pointer-events-none transition-all duration-300`}
      />
    </div>
  );
}
