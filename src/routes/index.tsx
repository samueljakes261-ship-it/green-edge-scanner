import { useEffect, useMemo, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RefreshCw, TrendingUp, DollarSign, Activity } from "lucide-react"

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "ArbScanner — Live Sports Arbitrage Opportunities" },
      {
        name: "description",
        content:
          "Live sure-bet scanner across six bookmakers with instant stake, ROI and guaranteed profit calculations.",
      },
      { property: "og:title", content: "ArbScanner — Live Sports Arbitrage Opportunities" },
      {
        property: "og:description",
        content:
          "Live sure-bet scanner across six bookmakers with instant stake, ROI and guaranteed profit calculations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
})

type Leg = { bookmaker: string; odds: number; stake: number }

type Opportunity = {
  sport?: string
  competition: string
  homeTeam: string
  awayTeam: string
  profitPercentage: number
  roi: number
  guaranteedProfit: number
  guaranteedReturn: number
  bets: {
    home: Leg
    draw: Leg
    away: Leg
  }
}

const API_URL = "http://127.0.0.1:8000/opportunities"

type Computed = {
  legs: { key: string; label: string; color: string; leg: Leg; stake: number }[]
  guaranteedReturn: number
  guaranteedProfit: number
  roi: number
}

function computeStakes(opportunity: Opportunity, bankroll: number): Computed {
  const entries = [
    { key: "home", label: "HOME", color: "text-emerald-400", leg: opportunity.bets.home },
    { key: "draw", label: "DRAW", color: "text-amber-400", leg: opportunity.bets.draw },
    { key: "away", label: "AWAY", color: "text-cyan-400", leg: opportunity.bets.away },
  ].filter((entry) => entry.leg && Number(entry.leg.odds) > 0)

  const inverseSum = entries.reduce((sum, entry) => sum + 1 / Number(entry.leg.odds), 0)

  if (!inverseSum || !Number.isFinite(inverseSum) || bankroll <= 0) {
    return {
      legs: entries.map((entry) => ({ ...entry, stake: entry.leg.stake ?? 0 })),
      guaranteedReturn: opportunity.guaranteedReturn,
      guaranteedProfit: opportunity.guaranteedProfit,
      roi: opportunity.roi,
    }
  }

  const guaranteedReturn = bankroll / inverseSum

  return {
    legs: entries.map((entry) => ({
      ...entry,
      stake: guaranteedReturn / Number(entry.leg.odds),
    })),
    guaranteedReturn,
    guaranteedProfit: guaranteedReturn - bankroll,
    roi: ((guaranteedReturn - bankroll) / bankroll) * 100,
  }
}

function Dashboard() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [bankrollInput, setBankrollInput] = useState("1000")

  const bankroll = Number(bankrollInput) > 0 ? Number(bankrollInput) : 0

  const loadOpportunities = async () => {
    try {
      setLoading(true)

      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error("Failed to fetch opportunities")
      }

      const data = await response.json()

      setOpportunities(Array.isArray(data) ? data : [])
      setLastUpdated(new Date())
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOpportunities()

    const interval = setInterval(loadOpportunities, 5000)

    return () => clearInterval(interval)
  }, [])

  const computed = useMemo(
    () => opportunities.map((opportunity) => computeStakes(opportunity, bankroll)),
    [opportunities, bankroll]
  )

  const totalProfit = computed.reduce((sum, item) => sum + item.guaranteedProfit, 0)

  const bestRoi = computed.length ? Math.max(...computed.map((item) => item.roi)) : 0

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">ArbScanner</h1>
            <p className="text-slate-400">
              Live arbitrage opportunities from 6 bookmakers
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-500 text-black">
              <Activity className="w-3 h-3 mr-1" />
              LIVE
            </Badge>

            <Button
              variant="outline"
              onClick={loadOpportunities}
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Scan Again
            </Button>
          </div>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400">Stake Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-end gap-6">
              <div className="w-48">
                <label htmlFor="bankroll" className="text-sm text-slate-400">
                  Bankroll
                </label>
                <Input
                  id="bankroll"
                  type="number"
                  min={0}
                  step={10}
                  value={bankrollInput}
                  onChange={(event) => setBankrollInput(event.target.value)}
                  className="mt-1 bg-slate-800 border-slate-700 text-slate-100"
                />
              </div>
              <div className="text-sm text-slate-400">
                Stakes below recalculate instantly from this bankroll — no backend call.
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400">
                Active Arbitrages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{opportunities.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400">
                Total Guaranteed Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-400">
                ${totalProfit.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400">
                Best ROI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-400">
                {bestRoi.toFixed(2)}%
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-sm">
          <div>
            <span className="text-slate-400">Total Opportunities: </span>
            <span className="font-semibold">{opportunities.length}</span>
          </div>
          <div>
            <span className="text-slate-400">Current Bankroll: </span>
            <span className="font-semibold">${bankroll.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-slate-400">Last Updated: </span>
            <span className="font-semibold">
              {lastUpdated ? lastUpdated.toLocaleTimeString() : "Waiting for first scan..."}
            </span>
          </div>
        </div>

        {loading && opportunities.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="py-12 text-center">
              <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-cyan-400" />
              <div className="text-lg font-semibold">Scanning bookmakers...</div>
              <div className="text-slate-400 mt-2">
                Orbit • Betfair • Kolay90 • Novel34 • BetKanyon • OnWin
              </div>
            </CardContent>
          </Card>
        ) : opportunities.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="py-12 text-center">
              <TrendingUp className="w-10 h-10 mx-auto mb-4 text-slate-500" />
              <div className="text-xl font-semibold">
                No arbitrage opportunities currently available.
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {opportunities.map((opportunity, index) => {
              const calc = computed[index]

              return (
                <Card
                  key={index}
                  className="bg-slate-900 border-slate-800 hover:border-cyan-500/50 transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">
                          {opportunity.homeTeam} vs {opportunity.awayTeam}
                        </CardTitle>
                        <div className="text-slate-400 mt-1">
                          {opportunity.sport ? `${opportunity.sport} • ` : ""}
                          {opportunity.competition}
                        </div>
                      </div>

                      <Badge className="bg-emerald-500 text-black text-lg px-3 py-1">
                        +{calc.roi.toFixed(2)}%
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-800 rounded-lg p-3">
                        <div className="text-slate-400 text-sm">Profit %</div>
                        <div className="text-2xl font-bold text-emerald-400">
                          {opportunity.profitPercentage.toFixed(2)}%
                        </div>
                      </div>

                      <div className="bg-slate-800 rounded-lg p-3">
                        <div className="text-slate-400 text-sm">ROI</div>
                        <div className="text-2xl font-bold text-cyan-400">
                          {calc.roi.toFixed(2)}%
                        </div>
                      </div>

                      <div className="bg-slate-800 rounded-lg p-3">
                        <div className="text-slate-400 text-sm">Guaranteed Profit</div>
                        <div className="text-2xl font-bold text-emerald-400">
                          ${calc.guaranteedProfit.toFixed(2)}
                        </div>
                      </div>

                      <div className="bg-slate-800 rounded-lg p-3">
                        <div className="text-slate-400 text-sm">Guaranteed Return</div>
                        <div className="text-2xl font-bold">
                          ${calc.guaranteedReturn.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {calc.legs.map((entry) => (
                        <div key={entry.key} className="bg-slate-800 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className={`font-semibold ${entry.color}`}>{entry.label}</div>
                            <Badge variant="outline">{entry.leg.bookmaker}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <div className="text-slate-400">Odds</div>
                              <div className="font-bold text-lg">{entry.leg.odds}</div>
                            </div>
                            <div>
                              <div className="text-slate-400">Stake</div>
                              <div className="font-bold text-lg">${entry.stake.toFixed(2)}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
                      <DollarSign className="w-4 h-4 mr-2" />
                      View Opportunity
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
