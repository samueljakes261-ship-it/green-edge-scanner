import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Activity,
  Calculator,
  Copy,
  ExternalLink,
  Filter,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Trophy,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

type Lang = "en" | "tr";

type Leg = {
  bookmaker: string;
  bookmakerColor: string;
  bookmakerUrl: string;
  selection: { en: string; tr: string };
  odd: number;
};

type Arb = {
  id: string;
  roi: number;
  sport: { en: string; tr: string };
  sportIcon: string;
  match: string;
  league: { en: string; tr: string };
  foundSeconds: number;
  market: { en: string; tr: string };
  legs: Leg[];
};

const ARBS: Arb[] = [
  {
    id: "arb-1",
    roi: 5.42,
    sport: { en: "Football", tr: "Futbol" },
    sportIcon: "⚽",
    match: "Manchester City vs Real Madrid",
    league: { en: "UEFA Champions League", tr: "UEFA Şampiyonlar Ligi" },
    foundSeconds: 12,
    market: { en: "Match Winner 1X2", tr: "Maç Sonucu 1X2" },
    legs: [
      { bookmaker: "Bet365", bookmakerColor: "#14805e", bookmakerUrl: "https://www.bet365.com", selection: { en: "Real Madrid Win", tr: "Real Madrid Kazanır" }, odd: 2.10 },
      { bookmaker: "William Hill", bookmakerColor: "#0b3d91", bookmakerUrl: "https://sports.williamhill.com", selection: { en: "Draw or Man City", tr: "Beraberlik veya Man City" }, odd: 2.05 },
    ],
  },
  {
    id: "arb-2",
    roi: 3.15,
    sport: { en: "Tennis", tr: "Tenis" },
    sportIcon: "🎾",
    match: "Alcaraz vs Sinner",
    league: { en: "ATP Finals — Turin", tr: "ATP Finalleri — Torino" },
    foundSeconds: 38,
    market: { en: "Match Winner", tr: "Maç Kazananı" },
    legs: [
      { bookmaker: "Pinnacle", bookmakerColor: "#c8102e", bookmakerUrl: "https://www.pinnacle.com", selection: { en: "Alcaraz", tr: "Alcaraz" }, odd: 2.02 },
      { bookmaker: "Betfair", bookmakerColor: "#ffb80c", bookmakerUrl: "https://www.betfair.com", selection: { en: "Sinner", tr: "Sinner" }, odd: 2.08 },
    ],
  },
  {
    id: "arb-3",
    roi: 7.80,
    sport: { en: "Basketball", tr: "Basketbol" },
    sportIcon: "🏀",
    match: "Lakers vs Celtics",
    league: { en: "NBA Regular Season", tr: "NBA Normal Sezon" },
    foundSeconds: 60,
    market: { en: "Over/Under 219.5 Points", tr: "Üst/Alt 219.5 Sayı" },
    legs: [
      { bookmaker: "DraftKings", bookmakerColor: "#53d337", bookmakerUrl: "https://sportsbook.draftkings.com", selection: { en: "Over 219.5", tr: "Üst 219.5" }, odd: 2.15 },
      { bookmaker: "FanDuel", bookmakerColor: "#1493ff", bookmakerUrl: "https://sportsbook.fanduel.com", selection: { en: "Under 219.5", tr: "Alt 219.5" }, odd: 2.12 },
    ],
  },
  {
    id: "arb-4",
    roi: 2.68,
    sport: { en: "Football", tr: "Futbol" },
    sportIcon: "⚽",
    match: "Arsenal vs Liverpool",
    league: { en: "Premier League", tr: "Premier Lig" },
    foundSeconds: 75,
    market: { en: "Both Teams to Score", tr: "Karşılıklı Gol" },
    legs: [
      { bookmaker: "Unibet", bookmakerColor: "#147b45", bookmakerUrl: "https://www.unibet.com", selection: { en: "BTTS — Yes", tr: "KG — Var" }, odd: 2.00 },
      { bookmaker: "Betway", bookmakerColor: "#00a826", bookmakerUrl: "https://betway.com", selection: { en: "BTTS — No", tr: "KG — Yok" }, odd: 2.10 },
    ],
  },
  {
    id: "arb-5",
    roi: 4.11,
    sport: { en: "MMA", tr: "MMA" },
    sportIcon: "🥊",
    match: "Makhachev vs Volkanovski",
    league: { en: "UFC 312 — Main Event", tr: "UFC 312 — Ana Karşılaşma" },
    foundSeconds: 120,
    market: { en: "Fight Winner", tr: "Maç Kazananı" },
    legs: [
      { bookmaker: "Stake", bookmakerColor: "#4b6cf6", bookmakerUrl: "https://stake.com", selection: { en: "Makhachev", tr: "Makhachev" }, odd: 1.95 },
      { bookmaker: "1xBet", bookmakerColor: "#1f7ac0", bookmakerUrl: "https://1xbet.com", selection: { en: "Volkanovski", tr: "Volkanovski" }, odd: 2.20 },
    ],
  },
];

const T = {
  scannerStatus: { en: "Scanner Status:", tr: "Tarayıcı Durumu:" },
  active: { en: "Active", tr: "Aktif" },
  delay: { en: "delay", tr: "gecikme" },
  minRoi: { en: "Min ROI", tr: "Min ROI" },
  sports: { en: "Sports", tr: "Sporlar" },
  all: { en: "All", tr: "Tümü" },
  bookies: { en: "12 Bookies", tr: "12 Bahisçi" },
  selected: { en: "Selected", tr: "Seçili" },
  proTier: { en: "PRO TIER", tr: "PRO ÜYELİK" },
  liveFeed: { en: "Live Arbitrage Feed", tr: "Canlı Arbitraj Akışı" },
  opportunities: { en: "opportunities · refreshed just now", tr: "fırsat · az önce yenilendi" },
  live: { en: "LIVE", tr: "CANLI" },
  roi: { en: "ROI", tr: "ROI" },
  odd: { en: "Odd", tr: "Oran" },
  bet: { en: "Bet", tr: "Bahis" },
  stakeCalc: { en: "Stake Calculator", tr: "Bahis Hesaplayıcı" },
  autoSynced: { en: "Auto-synced", tr: "Otomatik senkron" },
  totalStake: { en: "Total Stake", tr: "Toplam Bahis" },
  totalInvestment: { en: "Total Investment", tr: "Toplam Yatırım" },
  guaranteedReturn: { en: "Guaranteed Return", tr: "Garantili Getiri" },
  netProfit: { en: "Net Profit", tr: "Net Kâr" },
  placeBets: { en: "Place Bets Sequentially →", tr: "Bahisleri Sırayla Yerleştir →" },
  lockedNote: {
    en: "Stakes locked to guarantee equal profit across outcomes",
    tr: "Bahisler tüm sonuçlarda eşit kâr için kilitlenmiştir",
  },
  copyStake: { en: "Copy stake", tr: "Bahsi kopyala" },
  secAgo: { en: "s ago", tr: "sn önce" },
  minAgo: { en: "m ago", tr: "dk önce" },
};

function formatAgo(seconds: number, lang: Lang) {
  if (seconds < 60) return `${seconds}${T.secAgo[lang]}`;
  return `${Math.floor(seconds / 60)}${T.minAgo[lang]}`;
}

function Dashboard() {
  const [lang, setLang] = useState<Lang>("en");
  const [activeId, setActiveId] = useState<string>(ARBS[0].id);
  const [stake, setStake] = useState<number>(100);

  const active = useMemo(() => ARBS.find((a) => a.id === activeId)!, [activeId]);

  const calc = useMemo(() => {
    const invOdds = active.legs.map((l) => 1 / l.odd);
    const sumInv = invOdds.reduce((a, b) => a + b, 0);
    const stakes = invOdds.map((inv) => (stake * inv) / sumInv);
    const guaranteedReturn = stakes[0] * active.legs[0].odd;
    const profit = guaranteedReturn - stake;
    return { stakes, guaranteedReturn, profit };
  }, [active, stake]);

  return (
    <div className="min-h-screen grid-bg">
      <div className="flex min-h-screen">
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar lang={lang} setLang={setLang} />
          <main className="flex-1 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-5 p-5">
            <section className="min-w-0 space-y-4">
              <FeedHeader lang={lang} />
              <div className="space-y-3">
                {ARBS.map((arb) => (
                  <ArbCard
                    key={arb.id}
                    arb={arb}
                    lang={lang}
                    active={arb.id === activeId}
                    onSelect={() => setActiveId(arb.id)}
                  />
                ))}
              </div>
            </section>
            <aside className="xl:sticky xl:top-5 xl:self-start">
              <StakeCalculator
                arb={active}
                lang={lang}
                stake={stake}
                setStake={setStake}
                stakes={calc.stakes}
                guaranteedReturn={calc.guaranteedReturn}
                profit={calc.profit}
              />
            </aside>
          </main>
        </div>
      </div>
    </div>
  );
}

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex items-center rounded-md border border-border bg-panel overflow-hidden text-xs font-semibold">
      {(["en", "tr"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={
            "px-2.5 py-1.5 transition " +
            (lang === l
              ? "bg-primary/20 text-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-panel-elevated")
          }
          aria-pressed={lang === l}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function TopBar({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <header className="border-b border-border bg-panel/40 backdrop-blur sticky top-0 z-10">
      <div className="flex items-center gap-4 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary to-accent grid place-items-center shadow-lg shadow-primary/30 mr-1">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold tracking-tight mr-3">SureScan AI</span>
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-profit opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-profit" />
          </span>
          <div className="text-sm">
            <span className="text-muted-foreground">{T.scannerStatus[lang]}</span>{" "}
            <span className="font-semibold text-profit">{T.active[lang]}</span>
            <span className="text-muted-foreground"> · </span>
            <span className="font-mono text-foreground">0.4s {T.delay[lang]}</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 ml-2">
          <FilterChip icon={<TrendingUp className="h-3.5 w-3.5" />} label={T.minRoi[lang]} value="2.5%" />
          <FilterChip icon={<Trophy className="h-3.5 w-3.5" />} label={T.sports[lang]} value={T.all[lang]} />
          <FilterChip icon={<Filter className="h-3.5 w-3.5" />} label={T.bookies[lang]} value={T.selected[lang]} />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <LangToggle lang={lang} setLang={setLang} />
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/10 border border-primary/30">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-semibold">{T.proTier[lang]}</span>
          </div>
          <button className="p-2 rounded-md hover:bg-panel-elevated text-muted-foreground hover:text-foreground transition">
            <Settings className="h-4 w-4" />
          </button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-primary grid place-items-center text-xs font-bold">
            AK
          </div>
        </div>
      </div>
      <div className="h-[2px] bg-border relative overflow-hidden">
        <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-profit to-transparent animate-scan" />
      </div>
    </header>
  );
}

function FilterChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs border border-border bg-panel hover:bg-panel-elevated transition">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-semibold">{value}</span>
    </button>
  );
}

function FeedHeader({ lang }: { lang: Lang }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <Activity className="h-5 w-5 text-profit" />
          {T.liveFeed[lang]}
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5 font-mono">
          {ARBS.length} {T.opportunities[lang]}
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-profit animate-pulse-dot" />
        <span className="font-semibold text-profit">{T.live[lang]}</span>
      </div>
    </div>
  );
}

function ArbCard({ arb, lang, active, onSelect }: { arb: Arb; lang: Lang; active: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={
        "w-full text-left group rounded-xl border transition-all duration-200 " +
        (active
          ? "border-profit/50 bg-panel glow-profit"
          : "border-border bg-panel hover:border-primary/40 hover:bg-panel-elevated")
      }
    >
      <div className="p-4 flex items-start gap-4">
        <div className="shrink-0">
          <div className="rounded-lg bg-profit/15 border border-profit/40 px-3 py-2.5 text-center min-w-[92px]">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-profit/80">{T.roi[lang]}</div>
            <div className="text-2xl font-bold text-profit tabular-nums leading-none mt-0.5">
              {arb.roi.toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="text-base leading-none">{arb.sportIcon}</span>
            <span className="font-medium">{arb.league[lang]}</span>
            <span>·</span>
            <span className="font-mono">{formatAgo(arb.foundSeconds, lang)}</span>
          </div>
          <div className="mt-1 font-semibold tracking-tight truncate">{arb.match}</div>
          <div className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground bg-panel-elevated px-2 py-0.5 rounded border border-border">
            {arb.market[lang]}
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
            {arb.legs.map((leg, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 rounded-lg border border-border bg-panel-elevated/70 p-2.5"
              >
                <div
                  className="h-8 w-8 shrink-0 rounded-md grid place-items-center text-[10px] font-bold text-white"
                  style={{ backgroundColor: leg.bookmakerColor }}
                >
                  {leg.bookmaker.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {leg.bookmaker}
                  </div>
                  <div className="text-sm truncate">{leg.selection[lang]}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{T.odd[lang]}</div>
                  <div className="font-mono font-bold tabular-nums">{leg.odd.toFixed(2)}</div>
                </div>
                <a
                  href={leg.bookmakerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="ml-1 inline-flex items-center gap-1 rounded-md bg-accent/15 border border-accent/40 hover:bg-accent hover:text-accent-foreground px-2.5 py-1.5 text-[11px] font-semibold text-accent transition-colors"
                  aria-label={`${T.bet[lang]} — ${leg.bookmaker}`}
                >
                  {T.bet[lang]} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}

function StakeCalculator({
  arb,
  lang,
  stake,
  setStake,
  stakes,
  guaranteedReturn,
  profit,
}: {
  arb: Arb;
  lang: Lang;
  stake: number;
  setStake: (n: number) => void;
  stakes: number[];
  guaranteedReturn: number;
  profit: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-panel overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-panel-elevated/50">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-accent" />
          <h2 className="font-semibold text-sm tracking-tight">{T.stakeCalc[lang]}</h2>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          {T.autoSynced[lang]}
        </span>
      </div>

      <div className="p-4 space-y-4">
        <div className="text-xs text-muted-foreground truncate">
          <span className="text-base mr-1">{arb.sportIcon}</span>
          {arb.match}
        </div>

        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {T.totalStake[lang]}
          </label>
          <div className="mt-1.5 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">
              €
            </span>
            <input
              type="number"
              min={1}
              value={stake}
              onChange={(e) => setStake(Number(e.target.value) || 0)}
              className="w-full bg-input border border-border rounded-lg pl-8 pr-3 py-3 text-xl font-bold tabular-nums focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
            />
          </div>
        </div>

        <div className="space-y-2">
          {arb.legs.map((leg, i) => (
            <div key={i} className="rounded-lg border border-border bg-panel-elevated/60 p-3">
              <div className="flex items-center gap-2">
                <div
                  className="h-6 w-6 rounded grid place-items-center text-[9px] font-bold text-white"
                  style={{ backgroundColor: leg.bookmakerColor }}
                >
                  {leg.bookmaker.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-xs font-semibold truncate flex-1">{leg.bookmaker}</div>
                <div className="text-[10px] font-mono text-muted-foreground">@ {leg.odd.toFixed(2)}</div>
              </div>
              <div className="mt-2 flex items-stretch gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    €
                  </span>
                  <input
                    readOnly
                    value={stakes[i].toFixed(2)}
                    className="w-full bg-background/50 border border-border rounded-md pl-6 pr-2 py-2 text-sm font-mono font-semibold tabular-nums"
                  />
                </div>
                <button
                  onClick={() => navigator.clipboard?.writeText(stakes[i].toFixed(2))}
                  className="px-2.5 rounded-md border border-border bg-panel hover:bg-panel-elevated text-muted-foreground hover:text-foreground transition"
                  aria-label={T.copyStake[lang]}
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-profit/40 bg-gradient-to-br from-profit/10 to-transparent p-3 space-y-1.5">
          <SummaryRow label={T.totalInvestment[lang]} value={`€${stake.toFixed(2)}`} />
          <SummaryRow label={T.guaranteedReturn[lang]} value={`€${guaranteedReturn.toFixed(2)}`} />
          <div className="h-px bg-border my-1.5" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {T.netProfit[lang]}
            </span>
            <span className="text-xl font-bold tabular-nums text-profit">
              +€{profit.toFixed(2)}
            </span>
          </div>
        </div>

        <button className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-accent hover:opacity-95 font-semibold text-sm shadow-lg shadow-primary/30 transition">
          {T.placeBets[lang]}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
          <ShieldCheck className="h-3 w-3 text-profit" />
          <span>{T.lockedNote[lang]}</span>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-semibold tabular-nums">{value}</span>
    </div>
  );
}
