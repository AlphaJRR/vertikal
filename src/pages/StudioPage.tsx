import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { triggerHaptic } from '../utils/helpers';

interface Tool {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

export const StudioPage = () => {
  const [tool, setTool] = useState('reshaper');
  const [script, setScript] = useState('');
  const [result, setResult] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  const tools: Tool[] = [
    { id: 'reshaper', label: 'Reshaper', icon: '✨', desc: 'Horizontal to Vertical' },
    { id: 'viral', label: 'Viral Engine', icon: '🔥', desc: 'Captions & Tags' },
    { id: 'bible', label: 'Series Bible', icon: '📖', desc: 'Concept to Show' },
    { id: 'pitch', label: 'Pitch Deck ✨', icon: '💼', desc: 'Investor Slides' },
    { id: 'dialogue', label: 'Dialogue Fix ✨', icon: '💬', desc: 'Punch Up Scripts' },
    { id: 'scene', label: 'Scene Gen ✨', icon: '🎬', desc: 'Full Script Writer' },
    { id: 'marketing', label: 'Launch Plan ✨', icon: '🚀', desc: 'Go-To-Market' },
  ];

  const generate = async () => {
    if (!script) return;
    setLoading(true);
    setResult(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    let prompt = '';
    if (tool === 'reshaper')
      prompt = `Repurpose horizontal script for vertical video. JSON {hook, shot_list}. Input: "${script}"`;
    else if (tool === 'viral')
      prompt = `3 viral captions. JSON {option1, option2, option3}. Input: "${script}"`;
    else if (tool === 'bible')
      prompt = `Vertical drama bible. JSON {title, logline, characters: [{name, role}], episodes: [{ep: 1, plot}]}. Input: "${script}"`;
    else if (tool === 'pitch')
      prompt = `5-slide investor pitch. JSON { slides: [{title, bullet_points: []}] }. Input: "${script}"`;
    else if (tool === 'dialogue')
      prompt = `Rewrite dialogue for vertical video (fast). JSON { original_analysis, rewritten_script, virality_score }. Input: "${script}"`;
    else if (tool === 'scene')
      prompt = `Write a 1-minute vertical drama scene script. JSON { title, characters: [], script_body: [{speaker, line, action}] }. Input: "${script}"`;
    else if (tool === 'marketing')
      prompt = `Create a marketing launch plan. JSON { tagline, social_hooks: [], pr_angle, timeline: [{day, action}] }. Input: "${script}"`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });
      const data = await res.json();
      setResult(JSON.parse(data.candidates[0].content.parts[0].text));
    } catch (e) {
      // Fallbacks
      if (tool === 'scene')
        setResult({
          title: 'The Confrontation',
          characters: ['Jax', 'Vera'],
          script_body: [
            { speaker: 'Jax', line: "I told you not to come here.", action: 'Looks over shoulder' },
            { speaker: 'Vera', line: "You didn't leave me a choice.", action: 'Steps closer' },
          ],
        });
      if (tool === 'marketing')
        setResult({
          tagline: 'Silence is a weapon.',
          social_hooks: ['#Thriller', '#VertikalOriginal'],
          timeline: [
            { day: 'Day 1', action: 'Teaser Drop' },
            { day: 'Day 3', action: 'Cast Reveal' },
          ],
        });
    }
    setLoading(false);
  };

  const currentTool = tools.find(t => t.id === tool) || tools[0];

  return (
    <div className="h-full bg-gray-950 p-6 flex flex-col pt-16 overflow-y-auto pb-24">
      <h2 className="text-3xl font-black mb-6">Creator Studio</h2>
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
        {tools.map(t => (
          <button
            key={t.id}
            onClick={() => {
              setTool(t.id);
              setResult(null);
              triggerHaptic('light');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              tool === t.id
                ? 'bg-white text-black border-white'
                : 'bg-gray-900 text-gray-500 border-gray-800'
            }`}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 flex flex-col">
        <div className="flex items-center gap-2 mb-2 text-purple-400">
          <span>{currentTool.icon}</span>
          <span className="font-bold uppercase text-xs tracking-widest">{currentTool.desc}</span>
        </div>
        <textarea
          className="w-full bg-black/50 rounded-lg p-4 text-sm text-white resize-none border border-gray-700 focus:border-purple-500 outline-none h-32 mb-4"
          placeholder="Enter script or concept..."
          value={script}
          onChange={e => setScript(e.target.value)}
        />
        <button
          onClick={generate}
          disabled={loading}
          className="w-full brand-gradient py-4 rounded-lg font-bold text-white shadow-lg shadow-purple-900/40 relative overflow-hidden active:scale-95 transition-transform"
        >
          {loading ? 'Generating...' : 'Generate with Gemini ✨'}
        </button>
      </div>

      {result && (
        <div className="mt-6 glass-panel p-6 rounded-xl animate-spring-up border-l-4 border-purple-500">
          {tool === 'reshaper' && (
            <>
              <div className="mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase">Hook</span>
                <p className="text-lg font-bold">{(result as { hook?: string }).hook}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase">Shot List</span>
                <p className="text-sm text-gray-300 whitespace-pre-wrap">
                  {(result as { shot_list?: string }).shot_list}
                </p>
              </div>
            </>
          )}
          {tool === 'scene' && (
            <div className="space-y-4">
              <h3 className="font-bold text-xl">{(result as { title?: string }).title}</h3>
              <div className="space-y-2">
                {((result as { script_body?: Array<{ speaker: string; line: string; action: string }> })
                  .script_body || []).map((line, i) => (
                  <div key={i} className="text-sm">
                    <span className="text-blue-400 font-bold">{line.speaker}:</span>{' '}
                    <span className="text-white">{line.line}</span>{' '}
                    <span className="text-gray-500 italic">({line.action})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tool === 'marketing' && (
            <div className="space-y-4">
              <h3 className="font-bold text-xl">
                Strategy: {(result as { tagline?: string }).tagline}
              </h3>
              <div className="flex gap-2">
                {((result as { social_hooks?: string[] }).social_hooks || []).map((h, i) => (
                  <span key={i} className="bg-blue-900/50 px-2 py-1 rounded text-xs">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


