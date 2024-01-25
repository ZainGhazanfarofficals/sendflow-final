import React, { useEffect, useState, useRef } from 'react';
import { Chart, ArcElement } from 'chart.js/auto';
import axios from 'axios';
import './analytics.css'

const Analytics = ({id , cid}) => {
  const [analyticsData, setAnalyticsData] = useState({
    emailsSent: 0,
    emailsOpened: 0,
    replies: 0,
  });

  const chartRef = useRef(null);


  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        if (!cid && !id) {
          console.log("No Campaign ID here in Analytics");
          return;
        }

        const response = await axios.get(`/api/analytics?id=${cid || id}`);

        if (response.status === 200) {
          const data = response.data;
          setAnalyticsData(data);
        } else {
          console.error('Error fetching analytics data.');
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchAnalytics();
  }, [cid, id]);

  useEffect(() => {
    // Create and configure the chart when the component mounts or when analyticsData changes
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // Register the ArcElement
      Chart.register(ArcElement);

      const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Emails Sent', 'Emails Opened', 'Replies'],
          datasets: [
            {
              data: [
                analyticsData.emailsSent,
                analyticsData.emailsOpened,
                analyticsData.replies,
              ],
              backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
            },
          ],
        },
      });

      return () => {
        // Cleanup chart instance when the component unmounts
        chart.destroy();
      };
    }
  }, [analyticsData]);

  return (
    <div className="analytics-container">
    <div className="chart-container">
      <canvas ref={chartRef}></canvas>
    </div>
  </div>
  );
};

export default Analytics;
