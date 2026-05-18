import { useState, useEffect, useCallback } from 'react';
import { Plus, Crosshair, RefreshCw, Users, Zap } from 'lucide-react';
import { supabase, Lobby, GAME_MODES } from './lib/supabase';
import LobbyCard from './components/LobbyCard';
import CreateLobbyModal from './components/CreateLobbyModal';

const RANK_TIERS = ['Hepsi', 'Demir', 'Bronz', 'Gümüş', 'Altın', 'Platin', 'Elmas', 'Yücelik', 'Ölümsüzlük', 'Radyant'];

export default function App() {
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [filterMode, setFilterMode] = useState('All');
  const [filterRank, setFilterRank] = useState('All');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchLobbies = useCallback(async () => {
    const { data } = await supabase
      .from('lobbies')
      .select('*')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (data) {
      setLobbies(data);
      setLastUpdated(new Date());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLobbies();

    const channel = supabase
      .channel('lobbies-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lobbies' }, () => {
        fetchLobbies();
      })
      .subscribe();

    const interval = setInterval(fetchLobbies, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [fetchLobbies]);

  const filteredLobbies = lobbies.filter(l => {
    const modeMatch = filterMode === 'All' || l.game_mode === filterMode;
    const rankMatch = filterRank === 'All' || l.rank.startsWith(filterRank);
    return modeMatch && rankMatch;
  });

  const formatLastUpdated = () => {
    const secs = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
    if (secs < 5) return 'Az Önce';
    if (secs < 60) return `${secs}Sn Önce`;
    return `${Math.floor(secs / 60)}Dk Önce`;
  };

  return (
    <div className="min-h-screen bg-[#060608] text-white">
      <video
  autoPlay
  loop
  muted
  playsInline
  className="absolute inset-0 w-full h-full object-cover opacity-25"
>
  <source src="/valorant.mp4" type="video/mp4" />
</video>

<div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]" />
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.04] blur-[120px] bg-purple-500" />
        <div className="absolute -bottom-1/3 -right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.04] blur-[120px] bg-purple-600" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, rgba(139,92,246,0.5) 0px, transparent 1px, transparent 40px),
              repeating-linear-gradient(90deg, rgba(139,92,246,0.5) 0px, transparent 1px, transparent 40px)`,
          }}
        />
      </div>

      {/* Nav */}
      <header className="relative z-10 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Crosshair className="w-7 h-7 text-purple-400" style={{ filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.8))' }} />
              <div>
                <span className="text-xl font-black tracking-wider text-white">
                  LOBBY<span className="text-purple-400">RUSH</span>
                </span>
                <span className="ml-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest hidden sm:inline">
                  Takımını Bul
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 bg-white/5 rounded-full px-3 py-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span>{lobbies.length} Aktif</span>
              </div>
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 text-sm font-bold tracking-wide transition-all duration-200 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
              >
                <Plus className="w-4 h-4" />
                <span>Lobi Oluştur</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative z-10 border-b border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3">
              <span className="text-white">Mükemmel </span>
              <span
                className="text-purple-400"
                style={{ textShadow: '0 0 30px rgba(139,92,246,0.6)' }}
              >
                Takımını Kur
              </span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto">
              Canlı Valorant lobilerine katıl, kodu kopyala ve oyuna gir.
            </p>
          </div>

          <div className="flex justify-center gap-6 sm:gap-10 text-center">
            {[
              { icon: Users, label: 'Aktif Lobiler', value: lobbies.length },
              { icon: Zap, label: 'Canlı Güncelleme', value: 'Gerçek Zamanlı' },
              { icon: RefreshCw, label: 'Son Güncelleme', value: formatLastUpdated() },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon className="w-4 h-4 text-purple-400" />
                <span className="text-lg font-black text-white">{value}</span>
                <span className="text-[11px] text-gray-400 uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="relative z-10 sticky top-0 bg-[#060608]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="flex-shrink-0 text-xs text-gray-400 uppercase tracking-wider font-semibold">Mod:</span>
              <div className="flex gap-1.5">
                {['Hepsi', ...GAME_MODES].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setFilterMode(mode)}
                    className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 ${
                      filterMode === mode
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 sm:ml-auto">
              <span className="flex-shrink-0 text-xs text-gray-400 uppercase tracking-wider font-semibold">Rank:</span>
              <div className="flex gap-1.5">
                {RANK_TIERS.map(tier => (
                  <button
                    key={tier}
                    onClick={() => setFilterRank(tier)}
                    className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 ${
                      filterRank === tier
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-44 rounded-xl border border-white/5 bg-white/[0.02] animate-pulse"
              />
            ))}
          </div>
        ) : filteredLobbies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="p-6 rounded-2xl bg-purple-600/10 border border-purple-500/20 mb-6">
              <Crosshair className="w-12 h-12 text-purple-400 opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-gray-300 mb-2">Aktif lobi bulunamadı</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              {lobbies.length === 0
                ? 'İlk lobiyi oluşturan sen ol ve takımını bul.'
                : 'Mevcut filtrelerinizle eşleşen lobi bulunamadı. Filtreleri yeniden ayarlamayı deneyin.'}
            </p>
            {lobbies.length === 0 && (
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 text-sm font-bold transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                İlk Lobiyi Oluştur
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                <span className="text-white font-semibold">{filteredLobbies.length}</span>{' '}
                {filteredLobbies.length !== 1 ? 'lobi' : 'lobby'} bulundu
              </p>
              <button
                onClick={fetchLobbies}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-purple-400 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Yenile
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredLobbies.map(lobby => (
                <LobbyCard key={lobby.id} lobby={lobby} />
              ))}
            </div>
          </>
        )}
      </main>

  <footer className="relative z-10 border-t border-white/5 mt-12 py-6 text-center">
  <p className="text-xs text-gray-700">
    LobbyRush &mdash; Riot Games veya Valorant ile hiçbir bağlantısı yoktur.
  </p>

  <p className="text-xs text-gray-700 mt-2">
    Copyright © 2026 - Tüm Hakları Saklıdır.
  </p>
</footer>

      {showCreate && (
        <CreateLobbyModal
          onClose={() => setShowCreate(false)}
          onCreated={fetchLobbies}
        />
      )}
    </div>
  );
}
