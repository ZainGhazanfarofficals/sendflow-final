"use client"
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js/auto';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const MainAnalytics = () => {
  const { data: uservar } = useSession();
  const mail = uservar?.user.email;

  const [analyticsData, setAnalyticsData] = useState({
    totalEmailsSent: 0,
    totalEmailsOpened: 0,
    totalReplies: 0,
  });

  const chartRef = useRef(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        if (!mail) {
          console.log('No Login Email here');
          return;
        }

        const response = await axios.get(`/api/mainanalytics?mail=${mail}`);

        if (response.status === 200) {
          const data = response.data;
          console.log(data);
          setAnalyticsData(data);
        } else {
          console.error('Error fetching analytics data.');
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchAnalytics();
  }, [mail]);

  const chartData = useMemo(() => {
    return {
      labels: ['Emails Sent', 'Emails Opened', 'Replies'],
      datasets: [
        {
          data: [
            analyticsData.totalEmailsSent,
            analyticsData.totalEmailsOpened,
            analyticsData.totalReplies,
          ],
          backgroundColor: ['#38bdf8', '#facc15', '#fb7185'],
          borderWidth: 0,
        },
      ],
    };
  }, [analyticsData]);

  useEffect(() => {
    // Create and configure the chart when the component mounts or when analyticsData changes
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // Register the ArcElement
      Chart.register(ArcElement, Tooltip, Legend);

      const chart = new Chart(ctx, {
        type: 'doughnut',
        data: chartData, // Use the memoized chartData here
        options: {
          cutout: "65%",
          plugins: { legend: { display: false } }
        }
      });

      return () => {
        // Cleanup chart instance when the component unmounts
        chart.destroy();
      };
    }
  }, [chartData]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-50 shadow-2xl backdrop-blur">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">Workspace</p>
          <h3 className="text-lg font-semibold">Overall performance</h3>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
          Synced
        </span>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 rounded-xl border border-white/10 bg-slate-900/40 p-4 shadow-inner">
          <div className="relative mx-auto h-60 max-w-xs">
            <canvas ref={chartRef} className="h-full w-full" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xs uppercase tracking-[0.25em] text-slate-300">
                  Total
                </div>
                <div className="text-3xl font-bold">
                  {analyticsData.totalEmailsSent + analyticsData.totalEmailsOpened + analyticsData.totalReplies}
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
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 shadow-lg">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-300">Emails sent</div>
            <div className="text-2xl font-bold">{analyticsData.totalEmailsSent}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 shadow-lg">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-300">Opened</div>
            <div className="text-2xl font-bold">{analyticsData.totalEmailsOpened}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 shadow-lg">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-300">Replies</div>
            <div className="text-2xl font-bold">{analyticsData.totalReplies}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainAnalytics;
