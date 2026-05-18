import { useState } from 'react';
import { Copy, Check, Users, Clock, Gamepad2 } from 'lucide-react';
import { Lobby, getRankColor, formatTimeAgo } from '../lib/supabase';

interface LobbyCardProps {
  lobby: Lobby;
}

const MODE_ICONS: Record<string, string> = {
  'Competitive': '⚔',
  'Unrated': '🎮',
  'Spike Rush': '💣',
  'Deathmatch': '🔫',
  'Escalation': '📈',
  'Team Deathmatch': '🏆',
  'Swiftplay': '⚡',
  'Premier': '👑',
};

export default function LobbyCard({ lobby }: LobbyCardProps) {
  const [copied, setCopied] = useState(false);
  const rankColor = getRankColor(lobby.rank);
  const remainingMinutes = Math.max(
  0,
  Math.floor(
    (new Date(lobby.expires_at).getTime() - new Date().getTime()) / 60000
  )
);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(lobby.lobby_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = lobby.lobby_code;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const modeIcon = MODE_ICONS[lobby.game_mode] || '🎮';

  return (
    <div className="lobby-card group relative overflow-hidden rounded-xl border border-purple-900/40 bg-black/60 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/60 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]">
      <div
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${rankColor}, transparent)` }}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="flex-shrink-0 w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: rankColor, boxShadow: `0 0 8px ${rankColor}` }}
            />
            <span
              className="font-bold text-sm tracking-wide uppercase truncate"
              style={{ color: rankColor }}
            >
              {lobby.rank}
            </span>
          </div>
          <span className="flex-shrink-0 flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 rounded-full px-2.5 py-1">
            <Clock className="w-3 h-3" />
            {remainingMinutes} dk kaldı
          </span>
        </div>

        {/* Mode */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base leading-none">{modeIcon}</span>
          <span className="text-sm font-semibold text-purple-300 tracking-wide">
            {lobby.game_mode}
          </span>
        </div>

       {/* Description */}
<div className="min-h-[48px] mb-4">
  {lobby.description ? (
    <p className="text-sm text-gray-300 leading-relaxed line-clamp-2">
      {lobby.description}
    </p>
  ) : (
    <p className="text-sm text-gray-600 italic">
      Açıklama yok
    </p>
  )}
</div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>
              <span className="text-purple-300 font-semibold">{lobby.players_needed}</span>
              <span className="text-gray-500"> oyuncu aranıyor</span>
            </span>
          </div>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
              copied
                ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                : 'bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/40 hover:border-purple-400/60 hover:text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                Kopyalandı!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Kodu Kopyala
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
