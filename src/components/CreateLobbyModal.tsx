import { useState } from 'react';
import { X, Crosshair, ChevronDown } from 'lucide-react';
import { supabase, RANKS, GAME_MODES } from '../lib/supabase';

interface CreateLobbyModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateLobbyModal({ onClose, onCreated }: CreateLobbyModalProps) {
  const [rank, setRank] = useState('');
  const [gameMode, setGameMode] = useState('');
  const [lobbyCode, setLobbyCode] = useState('');
  const [description, setDescription] = useState('');
  const [playersNeeded, setPlayersNeeded] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rank || !gameMode || !lobbyCode.trim()) {
      setError('Lütfen gerekli alanları doldurun.');
      return;
    }

    setLoading(true);
    setError('');

    const { error: dbError } = await supabase.from('lobbies').insert({
      rank,
      game_mode: gameMode,
      lobby_code: lobbyCode.trim(),
      description: description.trim(),
      players_needed: playersNeeded,
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });

    setLoading(false);

    if (dbError) {
      setError('Lobi oluşturulamadı. Lütfen tekrar deneyin.');
      return;
    }

    onCreated();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-purple-700/40 bg-[#0d0d14] shadow-[0_0_60px_rgba(139,92,246,0.2)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-600/20 border border-purple-500/30">
              <Crosshair className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Lobi Oluştur</h2>
              <p className="text-xs text-gray-500">15 dakika sonra otomatik silinir</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Rank & Mode Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Rank <span className="text-purple-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={rank}
                  onChange={e => setRank(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-purple-500/60 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-colors cursor-pointer"
                >
                  <option value="" className="bg-[#0d0d14]">Rank seç</option>
                  {RANKS.map(r => (
                    <option key={r} value={r} className="bg-[#0d0d14]">{r}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Mod <span className="text-purple-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={gameMode}
                  onChange={e => setGameMode(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-purple-500/60 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-colors cursor-pointer"
                >
                  <option value="" className="bg-[#0d0d14]">Mod seç</option>
                  {GAME_MODES.map(m => (
                    <option key={m} value={m} className="bg-[#0d0d14]">{m}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Lobby Code */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Lobi Kodu <span className="text-purple-400">*</span>
            </label>
            <input
              type="text"
              value={lobbyCode}
              onChange={e => setLobbyCode(e.target.value)}
              placeholder="Örn. ABC123"
              maxLength={20}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-purple-500/60 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-colors font-mono tracking-widest"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Açıklama
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Örn. Mikrofon tercih edilir."
              maxLength={120}
              rows={2}
              className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-purple-500/60 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-colors"
            />
            <p className="text-right text-xs text-gray-600 mt-1">{description.length}/120</p>
          </div>

          {/* Players Needed */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Gerekli Oyuncu
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPlayersNeeded(n)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 border ${
                    playersNeeded === n
                      ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:border-purple-500/40 hover:text-purple-300'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm tracking-wider uppercase bg-purple-600 hover:bg-purple-500 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
          >
            {loading ? 'Oluşturuluyor...' : 'Lobi Oluştur'}
          </button>
        </form>
      </div>
    </div>
  );
}
