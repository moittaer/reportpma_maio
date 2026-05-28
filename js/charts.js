// ===== CHARTS — PREFEITURA DE AMERICANA | ABR–MAI 2026 =====

Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.pointStyle = 'circle';
Chart.defaults.plugins.legend.labels.padding = 22;
Chart.defaults.animation.duration = 1400;
Chart.defaults.animation.easing = 'easeOutQuart';

// ── Paleta ────────────────────────────────────────────────
const C = {
  navy:   '#0D1B6E',
  blue:   '#1A3CFF',
  teal:   '#17A697',
  slate:  '#4A6AFF',
  purple: '#5B2C6F',
  amber:  '#E65100',
};

const TIP = {
  backgroundColor: '#FFFFFF',
  titleColor: '#111111',
  bodyColor: '#555555',
  borderColor: 'rgba(0,0,0,0.09)',
  borderWidth: 1,
  cornerRadius: 10,
  padding: 14,
  titleFont: { weight: '700', size: 13 },
  bodyFont: { size: 12 },
  displayColors: false,
};

// ── Plugin: texto central nos doughnuts ──────────────────
const centerTextPlugin = {
  id: 'centerText',
  afterDraw(chart) {
    const cfg = chart.config.options.plugins?.centerText;
    if (!cfg?.lines) return;
    const { ctx, chartArea: { left, right, top, bottom } } = chart;
    const cx = (left + right) / 2;
    const cy = (top + bottom) / 2;
    ctx.save();
    cfg.lines.forEach(line => {
      ctx.font = `${line.weight || '700'} ${line.size || 15}px Inter, sans-serif`;
      ctx.fillStyle = line.color || '#111111';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(line.text, cx, cy + (line.dy || 0));
    });
    ctx.restore();
  }
};

// ── Plugin: data labels nas barras ───────────────────────
const dataLabelsPlugin = {
  id: 'dataLabels',
  afterDatasetsDraw(chart) {
    if (!chart.config.options.plugins?.dataLabels?.enabled) return;
    const { ctx } = chart;
    const isH = chart.config.options.indexAxis === 'y';
    chart.data.datasets.forEach((ds, di) => {
      const meta = chart.getDatasetMeta(di);
      if (meta.hidden) return;
      meta.data.forEach((el, idx) => {
        const val = ds.data[idx];
        if (!val) return;
        const label = val >= 1000
          ? (val >= 1000000
              ? (val / 1000000).toFixed(2).replace('.', ',') + 'M'
              : Math.round(val / 1000) + 'K')
          : val.toLocaleString('pt-BR');
        ctx.save();
        ctx.font = '600 11px Inter, sans-serif';
        ctx.fillStyle = '#444444';
        if (isH) {
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(label, el.x + 7, el.y);
        } else {
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(label, el.x, el.y - 5);
        }
        ctx.restore();
      });
    });
  }
};

Chart.register(centerTextPlugin, dataLabelsPlugin);

// ────────────────────────────────────────────────────────
// CHART 0: Line — Seguidores por Dia (Instagram)
// ────────────────────────────────────────────────────────
const ctxSeg = document.getElementById('chartSeguidores');
if (ctxSeg) {
  const labels = [
    '28 abr','29 abr','30 abr','1 mai','2 mai','3 mai','4 mai',
    '5 mai','6 mai','7 mai','8 mai','9 mai','10 mai','11 mai',
    '12 mai','13 mai','14 mai','15 mai','16 mai','17 mai','18 mai',
    '19 mai','20 mai','21 mai','22 mai','23 mai','24 mai','25 mai','26 mai','27 mai'
  ];
  const data = [
    58, 52, 61, 65, 59, 54, 60,
    64, 70, 128, 112, 84, 72, 68,
    63, 66, 71, 74, 69, 65, 62,
    67, 73, 88, 97, 332, 148, 104, 82, 71
  ];

  // Gradiente de preenchimento
  const segCtx = ctxSeg.getContext('2d');
  const grad = segCtx.createLinearGradient(0, 0, 0, 260);
  grad.addColorStop(0, 'rgba(225,48,108,0.22)');
  grad.addColorStop(1, 'rgba(225,48,108,0)');

  // Cores dos pontos — destaque em May 23 (pico Celebra) e May 7 (spike secundário)
  const pointColors = data.map((_, i) => i === 25 ? '#E1306C' : i === 9 ? 'rgba(225,48,108,0.75)' : 'rgba(225,48,108,0.4)');
  const pointRadii  = data.map((_, i) => i === 25 ? 8 : i === 9 ? 5 : 3);
  const pointHoverR = data.map((_, i) => i === 25 ? 10 : i === 9 ? 7 : 5);

  new Chart(ctxSeg, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: '#E1306C',
        backgroundColor: grad,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: pointColors,
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: pointRadii,
        pointHoverRadius: pointHoverR,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          ...TIP,
          callbacks: {
            title: ctx => ctx[0].label,
            label: ctx => {
              const suffix = ctx.dataIndex === 25 ? '  ★ Pico — Celebra Americana II'
                           : ctx.dataIndex === 9  ? '  ↑ Spike secundário'
                           : '';
              return '  ' + ctx.parsed.y + ' novos seguidores' + suffix;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            font: { size: 10, weight: '500' },
            color: '#AAAAAA',
            maxRotation: 45,
            autoSkip: true,
            maxTicksLimit: 10,
          }
        },
        y: {
          grid: { color: 'rgba(0,0,0,0.04)', drawTicks: false },
          border: { display: false },
          min: 0,
          ticks: {
            font: { size: 11 }, color: '#AAAAAA', padding: 6,
            callback: v => v
          }
        }
      }
    }
  });
}

// ────────────────────────────────────────────────────────
// CHART 1: Doughnut — Impressões por Conjunto (4 conjuntos)
// ────────────────────────────────────────────────────────
const ctxConj = document.getElementById('chartConjuntos');
if (ctxConj) {
  new Chart(ctxConj, {
    type: 'doughnut',
    data: {
      labels: ['Público Amplo', 'Remarketing', 'Cluster Religioso', 'Zanaga Geo'],
      datasets: [{
        data: [491607, 334723, 175362, 90303],
        backgroundColor: [C.navy, C.teal, C.purple, C.slate],
        borderColor: '#FFFFFF',
        borderWidth: 4,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 12, weight: '500' }, color: '#444' }
        },
        tooltip: {
          ...TIP,
          callbacks: {
            title: ctx => ctx[0].label,
            label: ctx => {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const pct = ((ctx.parsed / total) * 100).toFixed(1);
              return '  ' + ctx.parsed.toLocaleString('pt-BR') + ' impressões (' + pct + '%)';
            }
          }
        },
        centerText: {
          lines: [
            { text: '1,09M', size: 22, weight: '800', color: '#111111', dy: -12 },
            { text: 'impressões', size: 11, weight: '500', color: '#888888', dy: 12 },
          ]
        }
      }
    }
  });
}

// ────────────────────────────────────────────────────────
// CHART 2: Horizontal Bar — Impressões por Criativo (7 criativos)
// ────────────────────────────────────────────────────────
const ctxAds = document.getElementById('chartAnuncios');
if (ctxAds) {
  new Chart(ctxAds, {
    type: 'bar',
    data: {
      labels: [
        ['ASFALTO VAI', 'VIRAR TAPETE'],
        ['NOVA ESTAÇÃO DE', 'TRATAMENTO DE ÁGUA'],
        'ORÇAMENTO 2027',
        ['32 NOVOS AGENTES', '| GMA'],
        ['CELEBRA', 'AMERICANA II'],
        'PA DO ZANAGA',
        ['CELEBRA', 'AMERICANA'],
      ],
      datasets: [{
        data: [271881, 248953, 156182, 149314, 103539, 90303, 71823],
        backgroundColor: [C.navy, C.blue, C.teal, C.slate, C.purple, C.amber, '#00994D'],
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { right: 60 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...TIP,
          callbacks: {
            title: ctx => ctx[0].label.replace(/,/g, ' '),
            label: ctx => {
              const cliques = [262, 244, 123, 123, 94, 153, 85];
              const ctr     = ['0,096%', '0,098%', '0,079%', '0,082%', '0,091%', '0,169%', '0,118%'];
              const i = ctx.dataIndex;
              return [
                '  ' + ctx.parsed.x.toLocaleString('pt-BR') + ' impressões',
                '  Cliques: ' + cliques[i] + '  ·  CTR: ' + ctr[i],
              ];
            }
          }
        },
        dataLabels: { enabled: true }
      },
      scales: {
        x: {
          grid: { color: 'rgba(0,0,0,0.04)', drawTicks: false },
          border: { display: false },
          ticks: {
            font: { size: 11 }, color: '#AAAAAA', padding: 6,
            callback: v => v >= 1000 ? Math.round(v / 1000) + 'K' : v
          }
        },
        y: {
          grid: { display: false },
          border: { display: false },
          ticks: { font: { size: 11, weight: '600' }, color: '#333333', padding: 6 }
        }
      }
    }
  });
}

// ────────────────────────────────────────────────────────
// CHART 3: Bar — Impressões por Faixa Etária
// ────────────────────────────────────────────────────────
const ctxAge = document.getElementById('chartIdade');
if (ctxAge) {
  new Chart(ctxAge, {
    type: 'bar',
    data: {
      labels: ['18–24', '25–34', '35–44', '45–54', '55–64', '65+'],
      datasets: [{
        data: [146612, 507938, 224722, 115913, 61869, 34921],
        backgroundColor: [C.navy, C.navy, C.blue, C.blue, C.teal, C.teal],
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 24 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...TIP,
          callbacks: {
            title: ctx => ctx[0].label + ' anos',
            label: ctx => {
              const pcts = ['13,4%', '46,5%', '20,6%', '10,6%', '5,7%', '3,2%'];
              return '  ' + ctx.parsed.y.toLocaleString('pt-BR') + ' impr. (' + pcts[ctx.dataIndex] + ')';
            }
          }
        },
        dataLabels: { enabled: true }
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { font: { size: 12, weight: '600' }, color: '#444444', padding: 6 }
        },
        y: {
          grid: { color: 'rgba(0,0,0,0.04)', drawTicks: false },
          border: { display: false },
          ticks: {
            font: { size: 11 }, color: '#AAAAAA', padding: 6,
            callback: v => v >= 1000 ? Math.round(v / 1000) + 'K' : v
          }
        }
      }
    }
  });
}

// ────────────────────────────────────────────────────────
// CHART 4: Doughnut — Gênero
// ────────────────────────────────────────────────────────
const ctxGen = document.getElementById('chartGenero');
if (ctxGen) {
  new Chart(ctxGen, {
    type: 'doughnut',
    data: {
      labels: ['Feminino', 'Masculino'],
      datasets: [{
        data: [604664, 484877],
        backgroundColor: [C.navy, C.teal],
        borderColor: '#FFFFFF',
        borderWidth: 4,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 12, weight: '500' }, color: '#444' }
        },
        tooltip: {
          ...TIP,
          callbacks: {
            title: ctx => ctx[0].label,
            label: ctx => {
              const total = 1091995;
              const pct = ((ctx.parsed / total) * 100).toFixed(1);
              return '  ' + ctx.parsed.toLocaleString('pt-BR') + ' impr. (' + pct + '%)';
            }
          }
        },
        centerText: {
          lines: [
            { text: '55,4%', size: 22, weight: '800', color: '#111111', dy: -12 },
            { text: 'feminino', size: 11, weight: '500', color: '#888888', dy: 12 },
          ]
        }
      }
    }
  });
}
