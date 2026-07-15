import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Activity,
  Calculator,
  Copy,
  ExternalLink,
  History,
  Filter,
  Radio,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Trophy,
  User,
  Zap,
  BookOpen,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

type Leg = {
  bookmaker: string;
  bookmakerColor: string;
  selection: string;
  odd: number;
};

type Arb = {
  id: string;
  roi: number;
  sport: string;
  sportIcon: string;
  match: string;
  league: string;
  foundAgo: string;
  market: string;
  legs: Leg[];
};

const ARBS: Arb[] = [
  {
    id: "arb-1",
    roi: 5.42,
    sport: "Football",
    sportIcon: "⚽",
    match: "Manchester City vs Real Madrid",
    league: "UEFA Champions League",
    foundAgo: "12s ago",
    market: "Match Winner 1X2",
    legs: [
      { bookmaker: "Bet365", bookmakerColor: "#14805e", selection: "Real Madrid Win", odd: 2.10 },
      { bookmaker: "William Hill", bookmakerColor: "#0b3d91", selection: "Draw or Man City", odd: 2.05 },
    ],
  },
  {
    id: "arb-2",
    roi: 3.15,
    sport: "Tennis",
    sportIcon: "🎾",
    match: "Alcaraz vs Sinner",
    league: "ATP Finals — Turin",
    foundAgo: "38s ago",
    market: "Match Winner",
    legs: [
      { bookmaker: "Pinnacle", bookmakerColor: "#c8102e", selection: "Alcaraz", odd: 2.02 },
      { bookmaker: "Betfair", bookmakerColor: "#ffb80c", selection: "Sinner", odd: 2.08 },
    ],
  },
  {
    id: "arb-3",
    roi: 7.80,
    sport: "Basketball",
    sportIcon: "🏀",
    match: "Lakers vs Celtics",
    league: "NBA Regular Season",
    foundAgo: "1m ago",
    market: "Over/Under 219.5 Points",
    legs: [
      { bookmaker: "DraftKings", bookmakerColor: "#53d337", selection: "Over 219.5", odd: 2.15 },
      { bookmaker: "FanDuel", bookmakerColor: "#1493ff", selection: "Under 219.5", odd: 2.12 },
    ],
  },
  {
    id: "arb-4",
    roi: 2.68,
    sport: "Football",
    sportIcon: "⚽",
    match: "Arsenal vs Liverpool",
    league: "Premier League",
    foundAgo: "1m ago",
    market: "Both Teams to Score",
    legs: [
      { bookmaker: "Unibet", bookmakerColor: "#147b45", selection: "BTTS — Yes", odd: 2.00 },
      { bookmaker: "Betway", bookmakerColor: "#00a826", selection: "BTTS — No", odd: 2.10 },
    ],
  },
  {
    id: "arb-5",
    roi: 4.11,
    sport: "MMA",
    sportIcon: "🥊",
    match: "Makhachev vs Volkanovski",
    league: "UFC 312 — Main Event",
    foundAgo: "2m ago",
    market: "Fight Winner",
    legs: [
      { bookmaker: "Stake", bookmakerColor: "#4b6cf6", selection: "Makhachev", odd: 1.95 },
      { bookmaker: "1xBet", bookmakerColor: "#1f7ac0", selection: "Volkanovski", odd: 2.20 },
    ],
  },
];

function Dashboard() {
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
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-5 p-5">
            <section className="min-w-0 space-y-4">
              <FeedHeader />
              <div className="space-y-3">
                {ARBS.map((arb) => (
                  <ArbCard
                    key={arb.id}
                    arb={arb}
                    active={arb.id === activeId}
                    onSelect={() => setActiveId(arb.id)}
                  />
                ))}
              </div>
            </section>
            <aside className="xl:sticky xl:top-5 xl:self-start">
              <StakeCalculator
                arb={active}
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

function Sidebar() {
  const nav = [
    { icon: Radio, label: "Live Scanner", active: true },
    { icon: History, label: "History" },
    { icon: Calculator, label: "Calculator" },
    { icon: BookOpen, label: "Betting Rules" },
    { icon: Sparkles, label: "Premium" },
    { icon: User, label: "Account" },
  ];
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-panel/60 backdrop-blur">
      <div className="p-5 border-b border-border flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center shadow-lg shadow-primary/30">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="leading-tight">
          <div className="font-semibold tracking-tight">SureScan AI</div>
          <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Arbitrage Terminal</div>
        </div>
      </div>
      <nav className="p-3 flex-1 space-y-1">
        {nav.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all " +
              (active
                ? "bg-primary/15 text-foreground border border-primary/30 shadow-inner shadow-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-panel-elevated border border-transparent")
            }
          >
            <Icon className="h-4 w-4" />
            <span className="font-medium">{label}</span>
            {active && (
              <span className="ml-auto flex items-center gap-1.5 text-[10px] font-semibold text-profit">
                <span className="h-1.5 w-1.5 rounded-full bg-profit animate-pulse-dot" />
                LIVE
              </span>
            )}
          </button>
        ))}
      </nav>
      <div className="m-3 rounded-lg border border-primary/30 bg-gradient-to-br from-primary/15 to-accent/10 p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-profit" />
          <span>Pro Tier · 12 books</span>
        </div>
        <div className="mt-1.5 text-sm font-semibold">Upgrade to Institutional</div>
        <button className="mt-3 w-full text-xs font-semibold py-2 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground transition">
          View plans →
        </button>
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <header className="border-b border-border bg-panel/40 backdrop-blur sticky top-0 z-10">
      <div className="flex items-center gap-4 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-profit opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-profit" />
          </span>
          <div className="text-sm">
            <span className="text-muted-foreground">Scanner Status:</span>{" "}
            <span className="font-semibold text-profit">Active</span>
            <span className="text-muted-foreground"> · </span>
            <span className="font-mono text-foreground">0.4s delay</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 ml-2">
          <FilterChip icon={<TrendingUp className="h-3.5 w-3.5" />} label="Min ROI" value="2.5%" />
          <FilterChip icon={<Trophy className="h-3.5 w-3.5" />} label="Sports" value="All" />
          <FilterChip icon={<Filter className="h-3.5 w-3.5" />} label="12 Bookies" value="Selected" />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/10 border border-primary/30">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-semibold">PRO TIER</span>
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

function FeedHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <Activity className="h-5 w-5 text-profit" />
          Live Arbitrage Feed
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5 font-mono">
          {ARBS.length} opportunities · refreshed just now
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-profit animate-pulse-dot" />
        <span className="font-semibold text-profit">LIVE</span>
      </div>
    </div>
  );
}

function ArbCard({ arb, active, onSelect }: { arb: Arb; active: boolean; onSelect: () => void }) {
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
            <div className="text-[10px] font-semibold uppercase tracking-wider text-profit/80">ROI</div>
            <div className="text-2xl font-bold text-profit tabular-nums leading-none mt-0.5">
              {arb.roi.toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="text-base leading-none">{arb.sportIcon}</span>
            <span className="font-medium">{arb.league}</span>
            <span>·</span>
            <span className="font-mono">{arb.foundAgo}</span>
          </div>
          <div className="mt-1 font-semibold tracking-tight truncate">{arb.match}</div>
          <div className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground bg-panel-elevated px-2 py-0.5 rounded border border-border">
            {arb.market}
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
                  <div className="text-sm truncate">{leg.selection}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Odd</div>
                  <div className="font-mono font-bold tabular-nums">{leg.odd.toFixed(2)}</div>
                </div>
                <a
                  href="#"
                  onClick={(e) => e.stopPropagation()}
                  className="ml-1 inline-flex items-center gap-1 rounded-md bg-accent/15 border border-accent/40 hover:bg-accent hover:text-accent-foreground px-2.5 py-1.5 text-[11px] font-semibold text-accent transition-colors"
                  aria-label={`Bet at ${leg.bookmaker}`}
                >
                  Bet <ExternalLink className="h-3 w-3" />
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
  stake,
  setStake,
  stakes,
  guaranteedReturn,
  profit,
}: {
  arb: Arb;
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
          <h2 className="font-semibold text-sm tracking-tight">Stake Calculator</h2>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          Auto-synced
        </span>
      </div>

      <div className="p-4 space-y-4">
        <div className="text-xs text-muted-foreground truncate">
          <span className="text-base mr-1">{arb.sportIcon}</span>
          {arb.match}
        </div>

        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Total Stake
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
                  className="px-2.5 rounded-md border border-border bg-panel hover:bg-panel-elevated text-muted-foreground hover:text-foreground transition"
                  aria-label="Copy stake"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-profit/40 bg-gradient-to-br from-profit/10 to-transparent p-3 space-y-1.5">
          <SummaryRow label="Total Investment" value={`€${stake.toFixed(2)}`} />
          <SummaryRow label="Guaranteed Return" value={`€${guaranteedReturn.toFixed(2)}`} />
          <div className="h-px bg-border my-1.5" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Net Profit
            </span>
            <span className="text-xl font-bold tabular-nums text-profit">
              +€{profit.toFixed(2)}
            </span>
          </div>
        </div>

        <button className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-accent hover:opacity-95 font-semibold text-sm shadow-lg shadow-primary/30 transition">
          Place Bets Sequentially →
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
          <ShieldCheck className="h-3 w-3 text-profit" />
          <span>Stakes locked to guarantee equal profit across outcomes</span>
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
