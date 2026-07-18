import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Bell,
  Calculator,
  Check,
  ChevronDown,
  Copy,
  Cpu,
  ExternalLink,
  Filter,
  Gauge,
  LineChart,
  Moon,
  Radar,
  Radio,
  RefreshCw,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Wallet,
  X,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

type Lang = "en" | "tr";

type Bookmaker = {
  id: string;
  name: string;
  color: string;
  url: string;
  short: string;
};

const BOOKMAKERS: Record<string, Bookmaker> = {
  orbit: { id: "orbit", name: "Orbit Exchange", color: "#f59e0b", short: "OX", url: "https://orbitxch.com" },
  betfair: { id: "betfair", name: "Betfair Exchange", color: "#ffb80c", short: "BF", url: "https://www.betfair.com/exchange" },
  kolay90: { id: "kolay90", name: "Kolay90", color: "#22c55e", short: "K9", url: "https://kolay90.com" },
  novel34: { id: "novel34", name: "Novel34", color: "#a855f7", short: "N3", url: "https://novel34.com" },
  betkanyon: { id: "betkanyon", name: "BetKanyon", color: "#ef4444", short: "BK", url: "https://betkanyon.com" },
  onwin: { id: "onwin", name: "OnWin", color: "#3b82f6", short: "OW", url: "https://onwin.com" },
};

type Leg = {
  outcome: "HOME" | "DRAW" | "AWAY" | "OVER" | "UNDER" | "YES" | "NO";
  bookmakerId: keyof typeof BOOKMAKERS;
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
  kickoff: string;
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
    kickoff: "Today · 21:00 CET",
    foundSeconds: 12,
    market: { en: "Match Winner 1X2", tr: "Maç Sonucu 1X2" },
    legs: [
      { outcome: "HOME", bookmakerId: "orbit", selection: { en: "Man City", tr: "Man City" }, odd: 3.25 },
      { outcome: "DRAW", bookmakerId: "betfair", selection: { en: "Draw", tr: "Beraberlik" }, odd: 3.80 },
      { outcome: "AWAY", bookmakerId: "kolay90", selection: { en: "Real Madrid", tr: "Real Madrid" }, odd: 3.15 },
    ],
  },
  {
    id: "arb-2",
    roi: 3.15,
    sport: { en: "Tennis", tr: "Tenis" },
    sportIcon: "🎾",
    match: "Alcaraz vs Sinner",
    league: { en: "ATP Finals — Turin", tr: "ATP Finalleri — Torino" },
    kickoff: "Today · 20:30 CET",
    foundSeconds: 38,
    market: { en: "Match Winner", tr: "Maç Kazananı" },
    legs: [
      { outcome: "HOME", bookmakerId: "novel34", selection: { en: "Alcaraz", tr: "Alcaraz" }, odd: 2.02 },
      { outcome: "AWAY", bookmakerId: "onwin", selection: { en: "Sinner", tr: "Sinner" }, odd: 2.08 },
    ],
  },
  {
    id: "arb-3",
    roi: 7.80,
    sport: { en: "Basketball", tr: "Basketbol" },
    sportIcon: "🏀",
    match: "Lakers vs Celtics",
    league: { en: "NBA Regular Season", tr: "NBA Normal Sezon" },
    kickoff: "Tomorrow · 02:30 CET",
    foundSeconds: 60,
    market: { en: "Total Points — Over/Under 219.5", tr: "Toplam Sayı — Üst/Alt 219.5" },
    legs: [
      { outcome: "OVER", bookmakerId: "betkanyon", selection: { en: "Over 219.5", tr: "Üst 219.5" }, odd: 2.15 },
      { outcome: "UNDER", bookmakerId: "orbit", selection: { en: "Under 219.5", tr: "Alt 219.5" }, odd: 2.12 },
    ],
  },
  {
    id: "arb-4",
    roi: 2.68,
    sport: { en: "Football", tr: "Futbol" },
    sportIcon: "⚽",
    match: "Arsenal vs Liverpool",
    league: { en: "Premier League", tr: "Premier Lig" },
    kickoff: "Sat · 18:30 CET",
    foundSeconds: 75,
    market: { en: "Both Teams to Score", tr: "Karşılıklı Gol" },
    legs: [
      { outcome: "YES", bookmakerId: "betfair", selection: { en: "BTTS — Yes", tr: "KG — Var" }, odd: 2.00 },
      { outcome: "NO", bookmakerId: "kolay90", selection: { en: "BTTS — No", tr: "KG — Yok" }, odd: 2.10 },
    ],
  },
  {
    id: "arb-5",
    roi: 4.11,
    sport: { en: "MMA", tr: "MMA" },
    sportIcon: "🥊",
    match: "Makhachev vs Volkanovski",
    league: { en: "UFC 312 — Main Event", tr: "UFC 312 — Ana Karşılaşma" },
    kickoff: "Sun · 05:00 CET",
    foundSeconds: 120,
    market: { en: "Fight Winner", tr: "Maç Kazananı" },
    legs: [
      { outcome: "HOME", bookmakerId: "novel34", selection: { en: "Makhachev", tr: "Makhachev" }, odd: 1.95 },
      { outcome: "AWAY", bookmakerId: "onwin", selection: { en: "Volkanovski", tr: "Volkanovski" }, odd: 2.20 },
    ],
  },
];

const T = {
  appName: { en: "ArbScanner", tr: "ArbScanner" },
  tagline: { en: "Professional Arbitrage Terminal", tr: "Profesyonel Arbitraj Terminali" },
  scannerLive: { en: "Scanner Live", tr: "Tarayıcı Canlı" },
  lastUpdate: { en: "Last update", tr: "Son güncelleme" },
  nextRefresh: { en: "Next refresh", tr: "Sıradaki tarama" },
  connectedBooks: { en: "Books connected", tr: "Bağlı bahisçi" },
  bankroll: { en: "Bankroll", tr: "Bakiye" },
  activeArbs: { en: "Active Arbitrages", tr: "Aktif Arbitrajlar" },
  guaranteedProfit: { en: "Guaranteed Profit", tr: "Garantili Kâr" },
  highestRoi: { en: "Highest ROI", tr: "En Yüksek ROI" },
  avgRoi: { en: "Average ROI", tr: "Ortalama ROI" },
  marketsScanned: { en: "Markets Scanned", tr: "Taranan Piyasa" },
  scannerHealth: { en: "Scanner Health", tr: "Tarayıcı Sağlığı" },
  parser: { en: "Parser", tr: "Ayrıştırıcı" },
  api: { en: "API Gateway", tr: "API Ağ Geçidi" },
  engine: { en: "Matching Engine", tr: "Eşleştirme Motoru" },
  stakeCalc: { en: "Stake Calculator", tr: "Bahis Hesaplayıcı" },
  operational: { en: "Operational", tr: "Operasyonel" },
  filters: { en: "Filters", tr: "Filtreler" },
  minRoi: { en: "Min ROI", tr: "Min ROI" },
  sport: { en: "Sport", tr: "Spor" },
  book: { en: "Bookmaker", tr: "Bahisçi" },
  country: { en: "Country", tr: "Ülke" },
  competition: { en: "Competition", tr: "Turnuva" },
  searchTeam: { en: "Search team…", tr: "Takım ara…" },
  refreshEvery: { en: "Refresh every", tr: "Yenileme sıklığı" },
  all: { en: "All", tr: "Tümü" },
  liveFeed: { en: "Live Opportunities", tr: "Canlı Fırsatlar" },
  opportunities: { en: "opportunities · refreshed just now", tr: "fırsat · az önce yenilendi" },
  live: { en: "LIVE", tr: "CANLI" },
  roi: { en: "ROI", tr: "ROI" },
  odd: { en: "Odd", tr: "Oran" },
  home: { en: "HOME", tr: "EV" },
  draw: { en: "DRAW", tr: "BERABERE" },
  away: { en: "AWAY", tr: "DEPLASMAN" },
  over: { en: "OVER", tr: "ÜST" },
  under: { en: "UNDER", tr: "ALT" },
  yes: { en: "YES", tr: "VAR" },
  no: { en: "NO", tr: "YOK" },
  viewOpp: { en: "View Opportunity", tr: "Fırsatı Aç" },
  copySlip: { en: "Copy Bet Slip", tr: "Kuponu Kopyala" },
  totalStake: { en: "Total Stake", tr: "Toplam Bahis" },
  totalInvestment: { en: "Total Investment", tr: "Toplam Yatırım" },
  guaranteedReturn: { en: "Guaranteed Return", tr: "Garantili Getiri" },
  netProfit: { en: "Net Profit", tr: "Net Kâr" },
  placeBets: { en: "Execute Sequentially →", tr: "Sırayla Çalıştır →" },
  lockedNote: {
    en: "Stakes are balanced to lock equal profit across all outcomes.",
    tr: "Bahisler tüm sonuçlarda eşit kâr için kilitlenmiştir.",
  },
  copyStake: { en: "Copy stake", tr: "Bahsi kopyala" },
  secAgo: { en: "s ago", tr: "sn önce" },
  minAgo: { en: "m ago", tr: "dk önce" },
  oddsComparison: { en: "Odds Comparison", tr: "Oran Karşılaştırması" },
  executionOrder: { en: "Execution Order", tr: "Uygulama Sırası" },
  riskLevel: { en: "Risk Level", tr: "Risk Seviyesi" },
  low: { en: "Low", tr: "Düşük" },
  priceMovement: { en: "Price Movement", tr: "Oran Hareketi" },
  soon: { en: "Coming soon", tr: "Yakında" },
  bookmakers: { en: "Connected Bookmakers", tr: "Bağlı Bahisçiler" },
  online: { en: "Online", tr: "Çevrimiçi" },
  visit: { en: "Visit", tr: "Aç" },
  todayOpps: { en: "Today's Opportunities", tr: "Bugünün Fırsatları" },
  roiDist: { en: "ROI Distribution", tr: "ROI Dağılımı" },
  proTier: { en: "PRO", tr: "PRO" },
};

function formatAgo(seconds: number, lang: Lang) {
  if (seconds < 60) return `${seconds}${T.secAgo[lang]}`;
  return `${Math.floor(seconds / 60)}${T.minAgo[lang]}`;
}

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration]);
  return value;
}

function Dashboard() {
  const [lang, setLang] = useState<Lang>("en");
  const [stake, setStake] = useState<number>(100);
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const t = setInterval(() => setCountdown((c) => (c <= 1 ? 30 : c - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const activeArb = ARBS.find((a) => a.id === drawerId) ?? null;

  const stats = useMemo(() => {
    const rois = ARBS.map((a) => a.roi);
    const highest = Math.max(...rois);
    const avg = rois.reduce((a, b) => a + b, 0) / rois.length;
    const totalProfit = ARBS.reduce((sum, a) => sum + (stake * a.roi) / 100, 0);
    return { count: ARBS.length, highest, avg, totalProfit };
  }, [stake]);

  return (
    <div className="min-h-screen grid-bg text-foreground">
      <TopBar lang={lang} setLang={setLang} countdown={countdown} />

      <main className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <HeroStats stats={stats} lang={lang} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <ScannerHealth lang={lang} />
          <TodaysChart lang={lang} />
          <RoiDistribution lang={lang} />
        </div>

        <BookmakersStrip lang={lang} />

        <FiltersBar lang={lang} open={filtersOpen} setOpen={setFiltersOpen} />

        <section className="space-y-4">
          <FeedHeader lang={lang} />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {ARBS.map((arb, i) => (
              <div key={arb.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <ArbCard arb={arb} lang={lang} onOpen={() => setDrawerId(arb.id)} stake={stake} />
              </div>
            ))}
          </div>
        </section>

        <Footer lang={lang} />
      </main>

      {activeArb && (
        <OpportunityDrawer
          arb={activeArb}
          lang={lang}
          stake={stake}
          setStake={setStake}
          onClose={() => setDrawerId(null)}
        />
      )}
    </div>
  );
}

/* ---------- Top Bar ---------- */

function TopBar({ lang, setLang, countdown }: { lang: Lang; setLang: (l: Lang) => void; countdown: number }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border glass">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 h-16">
          <div className="flex items-center gap-2.5">
            <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-primary via-primary to-accent grid place-items-center shadow-lg shadow-primary/20">
              <Radar className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-profit ring-2 ring-background" />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-bold tracking-tight text-[15px]">{T.appName[lang]}</span>
              <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {T.tagline[lang]}
              </span>
            </div>
          </div>

          <div className="mx-3 h-6 w-px bg-border hidden md:block" />

          <div className="hidden md:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-profit animate-ping-slow" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-profit" />
              </span>
              <span className="font-semibold text-profit">{T.scannerLive[lang]}</span>
            </div>
            <div className="text-muted-foreground">
              <span>{T.lastUpdate[lang]}:</span>{" "}
              <span className="font-mono text-foreground">0.4s</span>
            </div>
            <div className="text-muted-foreground">
              <span>{T.nextRefresh[lang]}:</span>{" "}
              <span className="font-mono text-foreground tabular-nums">{countdown}s</span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <StatPill icon={<Users className="h-3.5 w-3.5" />} label={T.connectedBooks[lang]} value="6 / 6" />
            <StatPill icon={<Wallet className="h-3.5 w-3.5" />} label={T.bankroll[lang]} value="€12,450" tone="profit" />
            <LangToggle lang={lang} setLang={setLang} />
            <IconBtn><Bell className="h-4 w-4" /><span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-profit" /></IconBtn>
            <IconBtn><Moon className="h-4 w-4" /></IconBtn>
            <IconBtn><Settings className="h-4 w-4" /></IconBtn>
            <div className="ml-1 flex items-center gap-2 pl-2 border-l border-border">
              <div className="hidden md:flex items-center gap-1.5 rounded-md bg-primary/10 border border-primary/30 px-2 py-1">
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-bold tracking-wider">{T.proTier[lang]}</span>
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-primary grid place-items-center text-xs font-bold text-primary-foreground">
                AK
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[2px] bg-border relative overflow-hidden">
        <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-profit to-transparent animate-scan" />
      </div>
    </header>
  );
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="relative h-9 w-9 grid place-items-center rounded-lg border border-border bg-panel/60 text-muted-foreground hover:text-foreground hover:bg-panel-elevated transition">
      {children}
    </button>
  );
}

function StatPill({
  icon, label, value, tone,
}: { icon: React.ReactNode; label: string; value: string; tone?: "profit" }) {
  return (
    <div className="hidden lg:flex items-center gap-2 rounded-lg border border-border bg-panel/60 px-2.5 py-1.5">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className={"text-xs font-semibold tabular-nums " + (tone === "profit" ? "text-profit" : "text-foreground")}>
        {value}
      </span>
    </div>
  );
}

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex items-center rounded-lg border border-border bg-panel/60 overflow-hidden text-[11px] font-bold">
      {(["en", "tr"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={
            "px-2.5 py-1.5 transition " +
            (lang === l
              ? "bg-primary/20 text-primary"
              : "text-muted-foreground hover:text-foreground")
          }
          aria-pressed={lang === l}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

/* ---------- Hero Stats ---------- */

function HeroStats({
  stats, lang,
}: { stats: { count: number; highest: number; avg: number; totalProfit: number }; lang: Lang }) {
  return (
    <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      <MetricCard icon={<Activity />} label={T.activeArbs[lang]} value={stats.count.toString()} tone="profit" />
      <MetricCard icon={<TrendingUp />} label={T.guaranteedProfit[lang]} value={`€${stats.totalProfit.toFixed(2)}`} tone="profit" trend="+12.4%" />
      <MetricCard icon={<Target />} label={T.highestRoi[lang]} value={`${stats.highest.toFixed(2)}%`} tone="accent" />
      <MetricCard icon={<Gauge />} label={T.avgRoi[lang]} value={`${stats.avg.toFixed(2)}%`} />
      <MetricCard icon={<Radio />} label={T.marketsScanned[lang]} value="14238" trend="+842" />
      <MetricCard icon={<Users />} label={T.connectedBooks[lang]} value="6 / 6" tone="profit" />
    </section>
  );
}

function MetricCard({
  icon, label, value, tone, trend,
}: { icon: React.ReactNode; label: string; value: string; tone?: "profit" | "accent"; trend?: string }) {
  const numeric = parseFloat(value.replace(/[^\d.-]/g, ""));
  const animated = useCountUp(isFinite(numeric) ? numeric : 0);
  const hasDecimal = value.includes(".");
  const prefix = value.startsWith("€") ? "€" : "";
  const suffix = value.endsWith("%") ? "%" : value.includes("/") ? value.substring(value.indexOf(" /")) : "";
  const displayNum = isFinite(numeric)
    ? hasDecimal
      ? animated.toFixed(2)
      : Math.round(animated).toLocaleString()
    : value;

  const toneRing =
    tone === "profit" ? "from-profit/25 to-transparent" :
    tone === "accent" ? "from-accent/25 to-transparent" :
    "from-primary/15 to-transparent";
  const toneText =
    tone === "profit" ? "text-profit" :
    tone === "accent" ? "text-accent" :
    "text-foreground";

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-panel/70 p-4 card-hover hover:-translate-y-0.5 hover:border-primary/30 transition">
      <div className={`pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${toneRing} blur-2xl opacity-70`} />
      <div className="relative flex items-start justify-between">
        <div className={`h-9 w-9 rounded-lg bg-panel-elevated border border-border grid place-items-center ${toneText}`}>
          <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>
        </div>
        {trend && (
          <span className="text-[10px] font-semibold text-profit bg-profit/10 border border-profit/30 rounded px-1.5 py-0.5 flex items-center gap-0.5">
            <ArrowUpRight className="h-3 w-3" />{trend}
          </span>
        )}
      </div>
      <div className="relative mt-3">
        <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">{label}</div>
        <div className={`mt-1 text-2xl font-bold tracking-tight tabular-nums ${toneText}`}>
          {prefix}{displayNum}{suffix}
        </div>
      </div>
    </div>
  );
}

/* ---------- Scanner Health ---------- */

function ScannerHealth({ lang }: { lang: Lang }) {
  const rows: { label: string; status: "ok" | "warn" | "err" }[] = [
    { label: T.scannerLive[lang], status: "ok" },
    { label: T.connectedBooks[lang], status: "ok" },
    { label: T.parser[lang], status: "ok" },
    { label: T.api[lang], status: "ok" },
    { label: T.engine[lang], status: "warn" },
    { label: T.stakeCalc[lang], status: "ok" },
  ];
  return (
    <div className="rounded-xl border border-border bg-panel/70 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-accent" />
          <h3 className="font-semibold text-sm tracking-tight">{T.scannerHealth[lang]}</h3>
        </div>
        <span className="text-[10px] uppercase font-semibold text-profit">{T.operational[lang]}</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-2 rounded-lg border border-border bg-panel-elevated/60 px-2.5 py-2">
            <StatusDot status={r.status} />
            <span className="text-xs truncate">{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: "ok" | "warn" | "err" }) {
  const color = status === "ok" ? "bg-profit" : status === "warn" ? "bg-[color:var(--warn)]" : "bg-[color:var(--danger)]";
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      <span className={`absolute inline-flex h-full w-full rounded-full ${color} opacity-60 animate-ping-slow`} />
      <span className={`relative inline-flex rounded-full h-2 w-2 ${color}`} />
    </span>
  );
}

/* ---------- Charts ---------- */

function TodaysChart({ lang }: { lang: Lang }) {
  const bars = [3, 5, 4, 7, 6, 9, 8, 11, 9, 13, 12, 14, 11, 15];
  const max = Math.max(...bars);
  return (
    <div className="rounded-xl border border-border bg-panel/70 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LineChart className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm tracking-tight">{T.todayOpps[lang]}</h3>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">24h</span>
      </div>
      <div className="mt-4 flex items-end gap-1 h-24">
        {bars.map((b, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-gradient-to-t from-primary/70 to-accent/70 hover:from-primary hover:to-accent transition"
            style={{ height: `${(b / max) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-mono text-muted-foreground">
        <span>00:00</span><span>12:00</span><span>Now</span>
      </div>
    </div>
  );
}

function RoiDistribution({ lang }: { lang: Lang }) {
  const buckets = [
    { label: "0–2%", pct: 28, tone: "bg-muted" },
    { label: "2–4%", pct: 42, tone: "bg-accent/70" },
    { label: "4–6%", pct: 20, tone: "bg-primary/80" },
    { label: "6%+", pct: 10, tone: "bg-profit" },
  ];
  return (
    <div className="rounded-xl border border-border bg-panel/70 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-profit" />
          <h3 className="font-semibold text-sm tracking-tight">{T.roiDist[lang]}</h3>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">Live</span>
      </div>
      <div className="mt-4 space-y-2.5">
        {buckets.map((b) => (
          <div key={b.label}>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="font-mono text-muted-foreground">{b.label}</span>
              <span className="tabular-nums font-semibold">{b.pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-panel-elevated overflow-hidden">
              <div className={`h-full ${b.tone} rounded-full`} style={{ width: `${b.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Bookmakers ---------- */

function BookmakersStrip({ lang }: { lang: Lang }) {
  return (
    <div className="rounded-xl border border-border bg-panel/70 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-accent" />
          <h3 className="font-semibold text-sm tracking-tight">{T.bookmakers[lang]}</h3>
          <span className="text-[10px] font-mono text-muted-foreground">6 / 6</span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {Object.values(BOOKMAKERS).map((b) => (
          <BookmakerCard key={b.id} bm={b} lang={lang} />
        ))}
      </div>
    </div>
  );
}

function BookmakerCard({ bm, lang }: { bm: Bookmaker; lang: Lang }) {
  return (
    <a
      href={bm.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative overflow-hidden flex items-center gap-2.5 rounded-lg border border-border bg-panel-elevated/60 p-2.5 hover:border-primary/40 hover:bg-panel-elevated transition"
    >
      <div
        className="h-9 w-9 shrink-0 rounded-md grid place-items-center text-[11px] font-black text-white shadow-md"
        style={{ backgroundColor: bm.color }}
      >
        {bm.short}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold truncate">{bm.name}</div>
        <div className="flex items-center gap-1 mt-0.5">
          <StatusDot status="ok" />
          <span className="text-[10px] text-muted-foreground">{T.online[lang]}</span>
        </div>
      </div>
      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition" />
    </a>
  );
}

/* ---------- Filters ---------- */

function FiltersBar({
  lang, open, setOpen,
}: { lang: Lang; open: boolean; setOpen: (o: boolean) => void }) {
  return (
    <div className="rounded-xl border border-border bg-panel/70 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-panel-elevated/50 transition"
      >
        <Filter className="h-4 w-4 text-accent" />
        <span className="font-semibold text-sm">{T.filters[lang]}</span>
        <div className="hidden md:flex items-center gap-1.5 ml-2">
          <Chip label={T.minRoi[lang]} value="2.5%" />
          <Chip label={T.sport[lang]} value={T.all[lang]} />
          <Chip label={T.book[lang]} value="6" />
        </div>
        <ChevronDown className={"ml-auto h-4 w-4 text-muted-foreground transition " + (open ? "rotate-180" : "")} />
      </button>
      {open && (
        <div className="border-t border-border p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 animate-fade-up">
          <FilterField label={T.minRoi[lang]} value="2.5 %" icon={<TrendingUp className="h-3.5 w-3.5" />} />
          <FilterField label={T.sport[lang]} value={T.all[lang]} icon={<Trophy className="h-3.5 w-3.5" />} />
          <FilterField label={T.book[lang]} value="6 selected" icon={<Shield className="h-3.5 w-3.5" />} />
          <FilterField label={T.competition[lang]} value={T.all[lang]} icon={<Trophy className="h-3.5 w-3.5" />} />
          <FilterField label={T.country[lang]} value={T.all[lang]} icon={<Radio className="h-3.5 w-3.5" />} />
          <FilterField label={T.refreshEvery[lang]} value="5s" icon={<RefreshCw className="h-3.5 w-3.5" />} />
          <div className="col-span-2 md:col-span-4 lg:col-span-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder={T.searchTeam[lang]}
              className="w-full bg-input border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <span className="hidden lg:inline-flex items-center gap-1 rounded-md border border-border bg-panel-elevated/60 px-2 py-0.5 text-[11px]">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-semibold">{value}</span>
    </span>
  );
}

function FilterField({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <button className="flex items-center gap-2 rounded-lg border border-border bg-panel-elevated/60 px-3 py-2 hover:border-primary/40 hover:bg-panel-elevated transition text-left">
      <span className="text-muted-foreground">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-xs font-semibold truncate">{value}</div>
      </div>
      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
    </button>
  );
}

/* ---------- Feed ---------- */

function FeedHeader({ lang }: { lang: Lang }) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
          <Zap className="h-5 w-5 text-profit" />
          {T.liveFeed[lang]}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5 font-mono">
          {ARBS.length} {T.opportunities[lang]}
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="h-1.5 w-1.5 rounded-full bg-profit animate-pulse-dot" />
        <span className="font-bold text-profit tracking-wider">{T.live[lang]}</span>
      </div>
    </div>
  );
}

function outcomeLabel(l: Leg, lang: Lang): string {
  const map: Record<Leg["outcome"], { en: string; tr: string }> = {
    HOME: T.home, DRAW: T.draw, AWAY: T.away, OVER: T.over, UNDER: T.under, YES: T.yes, NO: T.no,
  };
  return map[l.outcome][lang];
}

function computeStakes(arb: Arb, stake: number) {
  const inv = arb.legs.map((l) => 1 / l.odd);
  const sum = inv.reduce((a, b) => a + b, 0);
  const stakes = inv.map((i) => (stake * i) / sum);
  const guaranteedReturn = stakes[0] * arb.legs[0].odd;
  const profit = guaranteedReturn - stake;
  return { stakes, guaranteedReturn, profit };
}

function ArbCard({
  arb, lang, onOpen, stake,
}: { arb: Arb; lang: Lang; onOpen: () => void; stake: number }) {
  const { stakes, guaranteedReturn, profit } = useMemo(() => computeStakes(arb, stake), [arb, stake]);
  return (
    <div className="group relative rounded-xl border border-border bg-panel/70 overflow-hidden transition hover:-translate-y-0.5 hover:border-profit/40 hover:shadow-[0_20px_50px_-25px_var(--profit-glow)]">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-panel-elevated/40">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base leading-none">{arb.sportIcon}</span>
          <span className="text-[11px] font-semibold text-muted-foreground truncate">{arb.league[lang]}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-[11px] font-mono text-muted-foreground">{arb.kickoff}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-profit animate-pulse-dot" />
          <span className="text-[10px] font-mono uppercase text-muted-foreground">{formatAgo(arb.foundSeconds, lang)}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-base font-bold tracking-tight truncate">{arb.match}</div>
            <div className="mt-1 inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-panel-elevated/70 px-2 py-0.5 rounded border border-border">
              {arb.market[lang]}
            </div>
          </div>
          <div className="shrink-0 rounded-xl bg-profit/15 border border-profit/40 px-3 py-1.5 text-center min-w-[86px]">
            <div className="text-[9px] font-bold uppercase tracking-wider text-profit/80">{T.roi[lang]}</div>
            <div className="text-2xl font-bold text-profit tabular-nums leading-none">
              {arb.roi.toFixed(2)}%
            </div>
          </div>
        </div>

        <div className={"mt-4 grid gap-2 " + (arb.legs.length === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2")}>
          {arb.legs.map((leg, i) => {
            const bm = BOOKMAKERS[leg.bookmakerId];
            return (
              <div key={i} className="rounded-lg border border-border bg-panel-elevated/60 p-2.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{outcomeLabel(leg, lang)}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">€{stakes[i].toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 shrink-0 rounded-md grid place-items-center text-[10px] font-black text-white" style={{ backgroundColor: bm.color }}>
                    {bm.short}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold truncate">{bm.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{leg.selection[lang]}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] uppercase text-muted-foreground">{T.odd[lang]}</div>
                    <div className="font-mono font-bold text-sm tabular-nums">{leg.odd.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg border border-border bg-panel-elevated/40 p-2.5">
          <SummaryMini label={T.totalStake[lang]} value={`€${stake.toFixed(0)}`} />
          <SummaryMini label={T.guaranteedReturn[lang]} value={`€${guaranteedReturn.toFixed(2)}`} />
          <SummaryMini label={T.netProfit[lang]} value={`+€${profit.toFixed(2)}`} tone="profit" />
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={onOpen}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 transition"
          >
            {T.viewOpp[lang]} <ArrowUpRight className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(`${arb.match} | ${arb.roi.toFixed(2)}%`); }}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-border bg-panel hover:bg-panel-elevated text-xs font-semibold transition"
          >
            <Copy className="h-3.5 w-3.5" /> {T.copySlip[lang]}
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryMini({ label, value, tone }: { label: string; value: string; tone?: "profit" }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
      <div className={"text-sm font-bold tabular-nums " + (tone === "profit" ? "text-profit" : "text-foreground")}>{value}</div>
    </div>
  );
}

/* ---------- Drawer ---------- */

function OpportunityDrawer({
  arb, lang, stake, setStake, onClose,
}: { arb: Arb; lang: Lang; stake: number; setStake: (n: number) => void; onClose: () => void }) {
  const { stakes, guaranteedReturn, profit } = useMemo(() => computeStakes(arb, stake), [arb, stake]);
  const [copied, setCopied] = useState<number | null>(null);

  const copy = (i: number) => {
    navigator.clipboard?.writeText(stakes[i].toFixed(2));
    setCopied(i);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-[520px] bg-panel border-l border-border overflow-y-auto animate-drawer-in">
        <div className="sticky top-0 bg-panel/95 backdrop-blur border-b border-border px-5 py-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 min-w-0">
            <Calculator className="h-4 w-4 text-accent" />
            <h2 className="font-bold text-sm truncate">{T.stakeCalc[lang]}</h2>
          </div>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg border border-border hover:bg-panel-elevated transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="text-base">{arb.sportIcon}</span>
              <span>{arb.league[lang]}</span>
              <span>·</span>
              <span className="font-mono">{arb.kickoff}</span>
            </div>
            <div className="mt-1 text-lg font-bold tracking-tight">{arb.match}</div>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-panel-elevated px-2 py-0.5 rounded border border-border">
                {arb.market[lang]}
              </span>
              <span className="text-[10px] font-mono uppercase text-profit bg-profit/10 border border-profit/30 px-2 py-0.5 rounded">
                {T.riskLevel[lang]}: {T.low[lang]}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-profit/40 bg-gradient-to-br from-profit/15 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-profit/80 font-semibold">{T.roi[lang]}</div>
                <div className="text-3xl font-bold text-profit tabular-nums">{arb.roi.toFixed(2)}%</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{T.netProfit[lang]}</div>
                <div className="text-2xl font-bold text-profit tabular-nums">+€{profit.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {T.totalStake[lang]}
            </label>
            <div className="mt-1.5 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">€</span>
              <input
                type="number"
                min={1}
                value={stake}
                onChange={(e) => setStake(Number(e.target.value) || 0)}
                className="w-full bg-input border border-border rounded-lg pl-8 pr-3 py-3 text-xl font-bold tabular-nums focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{T.executionOrder[lang]}</h3>
              <span className="text-[10px] font-mono text-muted-foreground">{T.oddsComparison[lang]}</span>
            </div>
            <div className="space-y-2">
              {arb.legs.map((leg, i) => {
                const bm = BOOKMAKERS[leg.bookmakerId];
                return (
                  <div key={i} className="rounded-lg border border-border bg-panel-elevated/60 p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 grid place-items-center rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                        {i + 1}
                      </div>
                      <div className="h-8 w-8 shrink-0 rounded-md grid place-items-center text-[10px] font-black text-white" style={{ backgroundColor: bm.color }}>
                        {bm.short}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold truncate">{bm.name}</div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {outcomeLabel(leg, lang)} · {leg.selection[lang]}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] uppercase text-muted-foreground">{T.odd[lang]}</div>
                        <div className="font-mono font-bold text-sm">{leg.odd.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-stretch gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                        <input
                          readOnly
                          value={stakes[i].toFixed(2)}
                          className="w-full bg-background/60 border border-border rounded-md pl-6 pr-2 py-2 text-sm font-mono font-semibold tabular-nums"
                        />
                      </div>
                      <button
                        onClick={() => copy(i)}
                        className="px-2.5 rounded-md border border-border bg-panel hover:bg-panel-elevated transition"
                        aria-label={T.copyStake[lang]}
                      >
                        {copied === i ? <Check className="h-3.5 w-3.5 text-profit" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                      <a
                        href={bm.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md bg-accent/15 border border-accent/40 hover:bg-accent hover:text-accent-foreground px-3 text-[11px] font-bold text-accent transition"
                      >
                        {T.visit[lang]} <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-panel-elevated/50 p-4 space-y-2">
            <SummaryRow label={T.totalInvestment[lang]} value={`€${stake.toFixed(2)}`} />
            <SummaryRow label={T.guaranteedReturn[lang]} value={`€${guaranteedReturn.toFixed(2)}`} />
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{T.netProfit[lang]}</span>
              <span className="text-2xl font-bold tabular-nums text-profit">+€{profit.toFixed(2)}</span>
            </div>
          </div>

          <button className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-sm shadow-lg shadow-primary/30 transition hover:opacity-95">
            {T.placeBets[lang]}
          </button>

          <div className="rounded-xl border border-dashed border-border bg-panel-elevated/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LineChart className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-semibold">{T.priceMovement[lang]}</span>
              </div>
              <span className="text-[9px] uppercase font-bold text-muted-foreground">{T.soon[lang]}</span>
            </div>
            <div className="mt-3 h-16 rounded-md bg-panel/60 relative overflow-hidden">
              <div className="absolute inset-0 shimmer opacity-40" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-profit" />
            <span>{T.lockedNote[lang]}</span>
          </div>
        </div>
      </aside>
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

function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="pt-6 pb-2 flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-muted-foreground">
      <div className="flex items-center gap-2">
        <Radar className="h-3.5 w-3.5" />
        <span>ArbScanner · {T.tagline[lang]}</span>
      </div>
      <div className="font-mono">
        {new Date().getFullYear()} · v1.0 · edge-latency 0.4s
      </div>
    </footer>
  );
}
