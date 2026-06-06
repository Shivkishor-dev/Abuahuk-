import React, { useState, useEffect } from "react";
import { Check, Vote, Award, BarChart3 } from "lucide-react";
import { PollDefinition, LanguageType } from "../types";

interface PollWidgetProps {
  currentLang: LanguageType;
  poll: PollDefinition | null;
  onVoteSubmit: (pollId: string, optionId: string) => Promise<void>;
}

export default function PollWidget({ currentLang, poll, onVoteSubmit }: PollWidgetProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Check if voted locally for this specific poll
  useEffect(() => {
    if (poll) {
      const votedState = localStorage.getItem(`voted-poll-${poll.id}`);
      if (votedState) {
        setHasVoted(true);
      } else {
        setHasVoted(false);
      }
    }
  }, [poll]);

  const t = {
    en: {
      title: "OPINION POLL",
      total: "Total respondents",
      submit: "Submit Vote",
      voted: "Thank You for voting!",
      selectPrompt: "Choose one opinion",
      results: "Current breakdown"
    },
    hi: {
      title: "जनमत सर्वेक्षण",
      total: "कुल मतदाता",
      submit: "वोट डेलें",
      voted: "प्रतिक्रिया के लिए धन्यवाद!",
      selectPrompt: "एक विकल्प चुनें",
      results: "वर्तमान आंकड़े"
    },
    sat: {
      title: "ᱦᱚᱲ ᱢᱚᱱᱳᱵᱷᱟᱵᱽ",
      total: "ᱜᱩᱴ ᱢᱚᱛᱫᱟᱛᱟ",
      submit: "ᱵᱷᱳᱴ ᱮᱢ ᱢᱮ",
      voted: "ᱵᱷᱳᱴ ᱮᱢ ᱥᱟᱨᱦᱟᱣ!",
      selectPrompt: "ᱢᱤᱫᱴᱟᱹᱝ ᱵᱟᱪᱷᱟᱣ ᱢᱮ",
      results: "ᱵᱷᱳᱴ ᱨᱮᱭᱟᱜ ᱦᱟᱹᱴᱤᱧ"
    }
  }[currentLang];

  if (!poll) return null;

  const handleVote = async () => {
    if (!selectedOption) return;
    setIsSubmitting(true);
    try {
      await onVoteSubmit(poll.id, selectedOption);
      localStorage.setItem(`voted-poll-${poll.id}`, "true");
      setHasVoted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-zinc-850 text-white rounded-xl p-5 shadow-sm hover:border-zinc-700 transition" id={`poll-box-${poll.id}`}>
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-5 h-5 text-red-500 shrink-0" />
        <span className="text-xs font-mono font-extrabold tracking-wider text-red-500 uppercase">
          {t.title}
        </span>
      </div>

      <h3 className="text-sm sm:text-base font-bold text-zinc-100 leading-snug mb-4">
        {poll.question[currentLang] || poll.question.en}
      </h3>

      {!hasVoted ? (
        <div className="space-y-2.5">
          {poll.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedOption(opt.id)}
                className={`w-full text-left p-3 rounded-lg text-xs font-semibold flex items-center justify-between border cursor-pointer transition ${
                  isSelected 
                    ? "bg-red-900/40 border-red-600 text-red-100" 
                    : "bg-zinc-800 border-zinc-700 hover:border-zinc-650 text-zinc-300"
                }`}
              >
                <span>{opt.text[currentLang] || opt.text.en}</span>
                <span className={`w-4 h-4 rounded-full border border-zinc-500 flex items-center justify-center shrink-0 ${
                  isSelected ? "bg-red-600 border-red-500" : ""
                }`}>
                  {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                </span>
              </button>
            );
          })}

          <button
            onClick={handleVote}
            disabled={!selectedOption || isSubmitting}
            className={`w-full py-2.5 rounded-lg text-xs font-bold font-mono tracking-widest text-white uppercase flex items-center justify-center gap-2 transition cursor-pointer ${
              selectedOption && !isSubmitting
                ? "bg-red-600 hover:bg-red-700 shadow-lg"
                : "bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed"
            }`}
          >
            <Vote className="w-4 h-4 text-white" />
            <span>{isSubmitting ? "Saving..." : t.submit}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-red-400 font-bold font-mono flex items-center gap-1">
            <Award className="w-4 h-4 text-yellow-500" />
            <span>{t.voted} {t.results}:</span>
          </div>

          <div className="space-y-3">
            {poll.options.map((opt) => {
              const share = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
              return (
                <div key={opt.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-zinc-300">
                    <span className="truncate max-w-[80%]">{opt.text[currentLang] || opt.text.en}</span>
                    <span className="font-mono text-xs text-red-500">{share}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2 relative overflow-hidden">
                    <div 
                      className="bg-red-600 h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${share}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono text-right">
                    {opt.votes} votes
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-zinc-400 font-mono flex items-center justify-between border-t border-zinc-800 pt-3">
            <span>{t.total}:</span>
            <span className="font-bold text-zinc-100">{poll.totalVotes}</span>
          </div>
        </div>
      )}
    </div>
  );
}
