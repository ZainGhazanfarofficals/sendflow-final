import React, { useEffect, useState, useRef } from "react";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js/auto";
import axios from "axios";

const Analytics = ({ id, cid }) => {
  const [analyticsData, setAnalyticsData] = useState({
    emailsSent: 0,
    emailsOpened: 0,
    replies: 0,
  });

  const chartRef = useRef(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        if (!cid && !id) return;

        const response = await axios.get(`/api/analytics?id=${cid || id}`);

        if (response.status === 200) {
          setAnalyticsData(response.data);
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchAnalytics();
  }, [cid, id]);

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");

    Chart.register(ArcElement, Tooltip, Legend);

    const chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Emails Sent", "Opened", "Replies"],
        datasets: [
          {
            data: [
              analyticsData.emailsSent,
              analyticsData.emailsOpened,
              analyticsData.replies,
            ],
            backgroundColor: ["#38bdf8", "#facc15", "#fb7185"],
            borderWidth: 0,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        cutout: "65%",
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    return () => chart.destroy();
  }, [analyticsData]);

  const summary = [
    {
      label: "Emails sent",
      value: analyticsData.emailsSent,
      accent: "from-sky-400/80 to-blue-500/60",
    },
    {
      label: "Opened",
      value: analyticsData.emailsOpened,
      accent: "from-amber-300/80 to-orange-500/60",
    },
    {
      label: "Replies",
      value: analyticsData.replies,
      accent: "from-rose-300/80 to-pink-500/60",
    },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/60 via-slate-900/30 to-slate-900/10 p-4 text-slate-50 shadow-2xl backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">
            Performance
          </p>
          <h3 className="text-lg font-semibold">Engagement overview</h3>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
          Live sync every 60s
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 rounded-xl border border-white/10 bg-slate-900/40 p-4 shadow-inner">
          <div className="relative mx-auto h-64 max-w-xs">
            <canvas ref={chartRef} className="h-full w-full" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xs uppercase tracking-[0.25em] text-slate-300">
                  Total
                </div>
                <div className="text-3xl font-bold">
                  {analyticsData.emailsSent + analyticsData.emailsOpened + analyticsData.replies}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/20 px-2 py-1 text-sky-100">
              <span className="h-2 w-2 rounded-full bg-sky-400" />
              Sent
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2 py-1 text-amber-100">
              <span className="h-2 w-2 rounded-full bg-amber-300" />
              Opened
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-400/20 px-2 py-1 text-rose-100">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              Replies
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {summary.map(({ label, value, accent }) => (
            <div
              key={label}
              className={`rounded-xl border border-white/10 bg-white/5 p-3 shadow-lg`}
            >
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-300">
                {label}
              </div>
              <div className="mt-1 flex items-end justify-between">
                <div className="text-2xl font-bold">{value}</div>
                <div
                  className={`rounded-full bg-gradient-to-r ${accent} px-3 py-1 text-[11px] font-semibold text-slate-900`}
                >
                  {value === 0 ? "pending" : "growing"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
