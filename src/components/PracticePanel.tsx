import React, { useState } from "react";
import { MC_QUESTIONS, ESSAY_QUESTIONS, MCQuestion, EssayQuestion } from "../data.ts";
import { CheckCircle, XCircle, Brain, BookOpen, Send, Sparkles, RefreshCw, AlertCircle, AlertTriangle } from "lucide-react";

export default function PracticePanel() {
  const [subTab, setSubTab] = useState<"mc" | "essay">("mc");

  // State for MC Questions
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [submittedMC, setSubmittedMC] = useState<Record<number, boolean>>({});

  // State for Essay/Short Answer Grader
  const [selectedEssayId, setSelectedEssayId] = useState<string>(ESSAY_QUESTIONS[0].id);
  const [studentAnswer, setStudentAnswer] = useState<string>("");
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [gradingError, setGradingError] = useState<string | null>(null);
  const [gradingResult, setGradingResult] = useState<any | null>(null);

  const activeEssay = ESSAY_QUESTIONS.find((q) => q.id === selectedEssayId) || ESSAY_QUESTIONS[0];

  // MC Helpers
  const handleSelectMC = (qId: number, option: 'A' | 'B' | 'C' | 'D') => {
    if (submittedMC[qId]) return; // locked after submit
    setSelectedAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmitMC = (qId: number) => {
    if (!selectedAnswers[qId]) return;
    setSubmittedMC(prev => ({ ...prev, [qId]: true }));
  };

  const handleResetMC = (qId: number) => {
    setSelectedAnswers(prev => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
    setSubmittedMC(prev => ({ ...prev, [qId]: false }));
  };

  // Essay grading submitter
  const handleGradeEssay = async () => {
    if (!studentAnswer.trim()) return;

    setIsGrading(true);
    setGradingError(null);
    setGradingResult(null);

    try {
      const response = await fetch("/api/grade-essay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          questionId: selectedEssayId,
          studentAnswer: studentAnswer
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to contact grading server.");
      }

      setGradingResult(data);
    } catch (err: any) {
      console.error(err);
      setGradingError(err.message || "An unexpected error occurred during grading.");
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div id="practice-exercises-panel" className="bg-white border border-black rounded-none p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-neutral-900" />
          <h3 className="font-serif italic font-medium text-neutral-950 tracking-tight text-lg">Practice Exercises & Marking Systems</h3>
        </div>

        {/* Toggle between MC and Essay grading */}
        <div className="flex border border-black p-0.5 rounded-none bg-white w-fit">
          <button
            id="subtab-btn-mc"
            onClick={() => setSubTab("mc")}
            className={`px-3 py-1.5 rounded-none text-[10px] font-mono uppercase tracking-wider transition-all duration-150 cursor-pointer ${
              subTab === "mc"
                ? "bg-neutral-900 text-white font-bold"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Multiple Choice
          </button>
          <button
            id="subtab-btn-essay"
            onClick={() => setSubTab("essay")}
            className={`px-3 py-1.5 rounded-none text-[10px] font-mono uppercase tracking-wider transition-all duration-150 cursor-pointer border-l border-black ${
              subTab === "essay"
                ? "bg-neutral-900 text-white font-bold"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            AI Essay Grader
          </button>
        </div>
      </div>

      {/* MC Questions Section */}
      {subTab === "mc" && (
        <div className="space-y-8">
          <div className="bg-neutral-50 p-4 rounded-none border border-black text-neutral-800 text-xs flex gap-2.5 items-start font-serif">
            <BookOpen className="w-4 h-4 text-neutral-700 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold mb-0.5 font-sans uppercase tracking-widest text-[10px] text-neutral-500">HKDSE Exam Simulator</p>
              <p className="leading-relaxed">Practice these highly realistic multiple choice questions derived from past DSE Economics examinations. Review the full explanations to understand why incorrect distractors are wrong — key to boosting your grade!</p>
            </div>
          </div>

          {MC_QUESTIONS.map((q, idx) => {
            const chosen = selectedAnswers[q.id];
            const submitted = submittedMC[q.id];
            const isCorrect = chosen === q.correctAnswer;

            return (
              <div key={q.id} className="border border-black rounded-none p-5 md:p-6 space-y-4 bg-[#FDFCFB]/40">
                <div className="flex justify-between items-start gap-4">
                  <span className="text-[9px] font-bold font-mono bg-neutral-100 text-neutral-850 px-2.5 py-0.5 rounded-none border border-black uppercase tracking-wider">
                    Question {idx + 1} {q.year && `• ${q.year}`}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">Topic: {q.topic}</span>
                </div>

                <p className="text-neutral-950 font-serif font-medium text-sm leading-relaxed whitespace-pre-line">{q.question}</p>

                {/* Option Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                    const optionText = q.options[opt];
                    const isSelected = chosen === opt;
                    const isAnswerKey = opt === q.correctAnswer;

                    let btnStyle = "bg-white border-neutral-300 text-neutral-800 hover:bg-neutral-50";
                    if (submitted) {
                      if (isSelected && isCorrect) {
                        btnStyle = "bg-green-50 border-green-600 text-green-900 font-serif font-bold";
                      } else if (isSelected && !isCorrect) {
                        btnStyle = "bg-red-50 border-red-600 text-red-900 font-serif font-bold";
                      } else if (isAnswerKey) {
                        btnStyle = "bg-green-50/55 border-green-600 text-green-800";
                      } else {
                        btnStyle = "bg-white border-neutral-200 text-neutral-400 opacity-60";
                      }
                    } else if (isSelected) {
                      btnStyle = "bg-neutral-100 border-black text-black font-semibold";
                    }

                    return (
                      <button
                        key={opt}
                        id={`option-${q.id}-${opt}`}
                        onClick={() => handleSelectMC(q.id, opt)}
                        disabled={submitted}
                        className={`text-left text-xs p-3.5 rounded-none border transition-all duration-150 flex gap-2.5 items-start cursor-pointer font-serif ${btnStyle}`}
                      >
                        <span className={`w-5 h-5 rounded-none shrink-0 flex items-center justify-center text-[10px] font-mono border ${
                          isSelected 
                            ? "bg-neutral-900 text-white border-neutral-900" 
                            : "bg-neutral-100 text-neutral-700 border-neutral-200"
                        }`}>
                          {opt}
                        </span>
                        <span>{optionText}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Actions & Explanations */}
                <div className="flex items-center gap-2 pt-2">
                  {!submitted ? (
                    <button
                      id={`submit-mc-btn-${q.id}`}
                      onClick={() => handleSubmitMC(q.id)}
                      disabled={!chosen}
                      className={`px-4 py-2 rounded-none text-xs font-mono uppercase tracking-wider cursor-pointer border ${
                        chosen 
                          ? "bg-neutral-900 border-neutral-900 text-white hover:bg-black" 
                          : "bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed"
                      }`}
                    >
                      Check Answer
                    </button>
                  ) : (
                    <button
                      id={`reset-mc-btn-${q.id}`}
                      onClick={() => handleResetMC(q.id)}
                      className="px-4 py-2 bg-white text-neutral-700 border border-black hover:bg-neutral-50 rounded-none text-xs font-mono uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Try Again
                    </button>
                  )}
                </div>

                {/* Detailed MC Explanations */}
                {submitted && (
                  <div className={`p-4 rounded-none border border-black mt-4 text-xs space-y-3 font-serif ${
                    isCorrect ? "bg-green-50/10" : "bg-neutral-50"
                  }`}>
                    <div className="flex items-center gap-2 mb-2 font-bold text-neutral-950">
                      {isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-green-700" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-700" />
                      )}
                      <span>{isCorrect ? "Correct Choice." : "Incorrect Choice."} The correct answer is {q.correctAnswer}.</span>
                    </div>

                    <div className="space-y-2 text-neutral-700">
                      <p className="font-bold text-neutral-900 font-sans uppercase tracking-widest text-[9px]">Distractor Analysis & Explanations:</p>
                      {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                        <div key={opt} className={`pl-2 border-l-2 py-0.5 ${
                          opt === q.correctAnswer ? "border-green-600 text-green-900 bg-green-50/20 font-medium" : "border-neutral-200"
                        }`}>
                          <strong className="font-mono">{opt}: </strong>
                          {q.explanations[opt]}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* AI Essay Grader Section */}
      {subTab === "essay" && (
        <div className="space-y-6">
          <div className="bg-neutral-950 p-5 rounded-none text-white flex gap-3.5 items-start shadow-none">
            <Sparkles className="w-4 h-4 text-neutral-300 mt-1 shrink-0 animate-pulse" />
            <div className="space-y-1">
              <p className="font-serif italic font-bold">Gemini AI Essay Grader (AI 智能論文批改)</p>
              <p className="text-xs text-neutral-300 leading-relaxed font-serif">
                Grade your written economics explanations instantly using the Gemini API. Submit your essay answer to actual past DSE questions, and the examiner engine will evaluate your argument against the official marking rubrics and criteria.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Form Column */}
            <div className="lg:col-span-6 space-y-5">
              {/* Question Selection */}
              <div>
                <label className="block text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest mb-2">Select Essay Question</label>
                <select
                  id="essay-question-selector"
                  value={selectedEssayId}
                  onChange={(e) => {
                    setSelectedEssayId(e.target.value);
                    setStudentAnswer("");
                    setGradingResult(null);
                    setGradingError(null);
                  }}
                  className="w-full bg-white border border-black rounded-none px-4 py-3 text-xs font-serif text-neutral-900 focus:outline-none cursor-pointer"
                >
                  {ESSAY_QUESTIONS.map((eq) => (
                    <option key={eq.id} value={eq.id}>{eq.title}</option>
                  ))}
                </select>
              </div>

              {/* Display Question Details */}
              <div className="bg-neutral-50/60 border border-black p-4 rounded-none space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-serif italic font-bold text-neutral-900">DSE Question Prompt</span>
                  <span className="font-mono bg-neutral-900 text-white px-2 py-0.5 text-[9px] font-bold">{activeEssay.maxMarks} Marks</span>
                </div>
                <p className="text-neutral-800 font-serif text-xs leading-relaxed whitespace-pre-line bg-white p-3 rounded-none border border-neutral-300">
                  {activeEssay.prompt}
                </p>

                <div className="text-[11px] text-neutral-600 font-serif">
                  <p className="font-sans uppercase tracking-widest text-[9px] text-neutral-400 font-bold mb-1">Recommended Keywords (提示關鍵詞):</p>
                  <div className="flex flex-wrap gap-1">
                    {activeEssay.suggestedKeywords.map(k => (
                      <span key={k} className="bg-neutral-200 text-neutral-800 px-1.5 py-0.5 rounded-none font-mono text-[9px] border border-neutral-300">{k}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Student Written Area */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">Type Your Explanation (請輸入你的答案)</label>
                <textarea
                  id="essay-textarea"
                  value={studentAnswer}
                  onChange={(e) => setStudentAnswer(e.target.value)}
                  placeholder="E.g., An effective price ceiling restricts quantity transacted to quantity supplied. Since price ceiling is lowered, quantity supplied contraction occurs..."
                  rows={8}
                  className="w-full bg-white border border-black rounded-none p-4 text-xs leading-relaxed focus:outline-none placeholder-gray-400 font-serif"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                  <span>Define MB = MC for full marks!</span>
                  <span>{studentAnswer.length} chars</span>
                </div>
              </div>

              {/* Grade Action button */}
              <button
                id="grade-essay-btn"
                onClick={handleGradeEssay}
                disabled={isGrading || !studentAnswer.trim()}
                className={`w-full py-3.5 rounded-none text-xs font-mono uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer border ${
                  studentAnswer.trim() && !isGrading
                    ? "bg-neutral-900 border-neutral-900 text-white hover:bg-black"
                    : "bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed"
                }`}
              >
                {isGrading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-neutral-500" />
                    Examiner is grading your answer...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Grade Answer with DSE Criteria
                  </>
                )}
              </button>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-6">
              {/* Fallback state when no results yet */}
              {!gradingResult && !isGrading && !gradingError && (
                <div className="border border-dashed border-neutral-400 rounded-none h-full min-h-[300px] flex flex-col items-center justify-center p-6 text-center text-neutral-400 font-serif">
                  <Brain className="w-10 h-10 stroke-[1.2] text-neutral-300 mb-3" />
                  <p className="font-bold text-neutral-700 italic text-sm mb-1">Awaiting Student Submission</p>
                  <p className="text-xs max-w-[280px] leading-relaxed">
                    Type your answer on the left and click grade. The AI examiner will return your marking breakdown here.
                  </p>
                </div>
              )}

              {/* Loading State */}
              {isGrading && (
                <div className="border border-black bg-neutral-50/50 rounded-none p-6 h-full min-h-[300px] flex flex-col items-center justify-center gap-4 text-center font-serif">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-none border border-neutral-300 border-t-neutral-900 animate-spin"></div>
                    <Sparkles className="w-4 h-4 text-neutral-700 absolute -top-1.5 -right-1.5 animate-bounce" />
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900 text-sm mb-1">Analyzing Economics Terminology</p>
                    <p className="text-xs text-neutral-500 max-w-[320px] leading-relaxed">
                      Gemini is comparing your explanation with official HKEAA marking rubrics, analyzing structural concepts, and generating full-mark models.
                    </p>
                  </div>
                </div>
              )}

              {/* Error display */}
              {gradingError && (
                <div className="border border-black bg-neutral-50 rounded-none p-6 h-full min-h-[300px] flex flex-col items-center justify-center gap-3 text-center text-red-900 font-serif">
                  <AlertCircle className="w-8 h-8 text-neutral-900 stroke-[1.5]" />
                  <p className="font-bold text-sm">Grading System Note</p>
                  <p className="text-xs leading-relaxed max-w-[340px]">
                    {gradingError.includes("GEMINI_API_KEY") 
                      ? "The server's Gemini API key is missing. Please make sure to configure GEMINI_API_KEY in the Secrets panel in AI Studio settings before calling the grader."
                      : gradingError}
                  </p>
                  <button
                    onClick={handleGradeEssay}
                    className="mt-2 px-4 py-2 bg-white border border-black text-neutral-800 hover:bg-neutral-50 rounded-none text-xs font-mono uppercase tracking-wider cursor-pointer"
                  >
                    Retry Grading
                  </button>
                </div>
              )}

              {/* Highly detailed grading scorecard */}
              {gradingResult && (
                <div id="essay-grading-result" className="border border-black bg-white rounded-none p-6 space-y-6 shadow-none">
                  {/* Score circle badge */}
                  <div className="flex items-center justify-between pb-4 border-b border-black">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block">Marking Result</span>
                      <h4 className="text-base font-serif italic font-bold text-neutral-950">Examiner's Grading Report</h4>
                    </div>
                    <div className="bg-neutral-50 border border-black px-4 py-2 text-center shrink-0 rounded-none">
                      <p className="text-[9px] text-neutral-500 font-mono uppercase font-bold">Score</p>
                      <p className="font-mono text-lg font-bold text-neutral-900">
                        {gradingResult.score} / {gradingResult.maxScore}
                      </p>
                    </div>
                  </div>

                  {/* Rubric Points Checklist */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block">HKDSE Criteria Rubric Checklist</p>
                    <div className="space-y-2">
                      {gradingResult.gradingBreakdown.map((item: any, i: number) => (
                        <div key={i} className={`p-3 rounded-none border flex gap-3 text-xs font-serif ${
                          item.awarded 
                            ? "bg-green-50/10 border-green-600 text-neutral-950" 
                            : "bg-neutral-50 border-neutral-300 text-neutral-500"
                        }`}>
                          <div className="mt-0.5 shrink-0">
                            {item.awarded ? (
                              <CheckCircle className="w-4 h-4 text-green-700" />
                            ) : (
                              <XCircle className="w-4 h-4 text-neutral-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold mb-1 text-neutral-950">
                              Point {i + 1}: {item.point}
                            </p>
                            <p className="text-neutral-600 text-[11px] leading-relaxed">{item.explanation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Used and Missed Terms tags */}
                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div className="bg-neutral-50 border border-neutral-300 p-3 rounded-none space-y-1.5">
                      <span className="font-mono font-bold text-neutral-500 text-[9px] uppercase tracking-wider block">Terms You Used ✓</span>
                      <div className="flex flex-wrap gap-1">
                        {gradingResult.keyTermsUsed && gradingResult.keyTermsUsed.length > 0 ? (
                          gradingResult.keyTermsUsed.map((t: string) => (
                            <span key={t} className="bg-neutral-200 text-neutral-800 px-1.5 py-0.5 rounded-none font-mono text-[9px] border border-neutral-300">{t}</span>
                          ))
                        ) : (
                          <span className="text-neutral-400 italic text-[11px] font-serif">No formal terms detected</span>
                        )}
                      </div>
                    </div>

                    <div className="bg-neutral-50 border border-neutral-300 p-3 rounded-none space-y-1.5">
                      <span className="font-mono font-bold text-neutral-500 text-[9px] uppercase tracking-wider block">Missing Terms ✗</span>
                      <div className="flex flex-wrap gap-1">
                        {gradingResult.keyTermsMissed && gradingResult.keyTermsMissed.length > 0 ? (
                          gradingResult.keyTermsMissed.map((t: string) => (
                            <span key={t} className="bg-neutral-100 text-neutral-800 px-1.5 py-0.5 rounded-none font-mono text-[9px] border border-neutral-300">{t}</span>
                          ))
                        ) : (
                          <span className="text-green-700 italic text-[11px] font-serif">None! Perfect phrasing.</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Exemplary Model Answer */}
                  <div className="bg-neutral-50 border border-black rounded-none p-4">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block mb-1.5">HKDSE Standard Model Answer</span>
                    <p className="text-neutral-850 text-xs leading-relaxed font-serif italic whitespace-pre-line">
                      "{gradingResult.modelAnswer}"
                    </p>
                  </div>

                  {/* General feedback */}
                  <div className="bg-neutral-100 border border-neutral-300 rounded-none p-4 flex gap-3 text-xs text-neutral-900 leading-relaxed font-serif font-medium">
                    <AlertTriangle className="w-4 h-4 text-neutral-800 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-sans uppercase tracking-widest text-[9px] text-neutral-500 font-bold mb-1">Examiner's General Comments:</p>
                      <p className="text-neutral-800 font-serif font-medium text-[11px]">{gradingResult.generalFeedback}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
