
    // Check login status on page load
    document.addEventListener('DOMContentLoaded', function() {
      checkLoginStatus();
      // Set up periodic license check every 10 seconds
      setInterval(checkLicense, 10000);
    });

    // Scroll to element function
    function scrollToElement(elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    function checkLoginStatus() {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const licenseValid = checkLicense();

      if (isLoggedIn === 'true' && licenseValid) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
      } else {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('mainContent').style.display = 'none';
        
        if (!licenseValid) {
          document.getElementById('licenseModal').style.display = 'flex';
          document.getElementById('loginForm').style.display = 'none';
        }
      }
    }

    // Login function
    function login(event) {
      event.preventDefault();
      if (!checkLicense()) return;
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      if (username === 'admin' && password === 'trivietpower') {
        localStorage.setItem('isLoggedIn', 'true');
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
      } else {
        alert('Tên đăng nhập hoặc mật khẩu không đúng!');
      }
    }

    // Logout function
    function logout() {
      localStorage.removeItem('isLoggedIn');
      document.getElementById('mainContent').style.display = 'none';
      document.getElementById('loginForm').style.display = 'block';
    }

    // License check
    const LICENSE_EXPIRY = new Date('2025-06-21'); // Đặt ngày hết hạn ở đây

    function checkLicense() {
      const today = new Date();
      if (today > LICENSE_EXPIRY) {
        document.getElementById('licenseModal').style.display = 'flex';
        localStorage.removeItem('isLoggedIn'); // Clear login state when license expires
        document.getElementById('mainContent').style.display = 'none';
        document.getElementById('loginForm').style.display = 'none';
        return false;
      }
      return true;
    }

    function formatVND(num) {
      return num.toLocaleString('vi-VN');
    }

    function calcCostPerTon(gcvTrau, mTrau, cTrau, rTrau,
                            gcvThan, mThan, cThan, rThan,
                            gcvDam, mDam, cDam, rDam) {
      if (!checkLicense()) return null;

      const gcvMix = (gcvTrau*rTrau + gcvThan*rThan + gcvDam*rDam)/100;
      const moistureMix = (mTrau*rTrau + mThan*rThan + mDam*rDam)/100;
      const costMix = (cTrau*rTrau + cThan*rThan + cDam*rDam)/100;

      // Tổn thất do ẩm
      const lossMoisture = moistureMix * 12.2;
      
      // Tổn thất do khí thải (giảm từ 0.083 xuống 0.05)
      const lossFlueGas = gcvMix * 0.05;
      
      // Tổn thất do bức xạ (giảm từ 0.09 xuống 0.05)
      const lossRadiation = gcvMix * 0.05;
      
      // Tổn thất do cháy không hoàn toàn (thêm mới)
      const lossIncomplete = gcvMix * 0.02;
      
      // Tổn thất do xả đáy lò (thêm mới) 
      const lossBottom = gcvMix * 0.02;
      
      // Tổn thất do rò rỉ hơi (thêm mới)
      const lossSteamLeak = gcvMix * 0.03;

      // Tổng tổn thất (giữ nguyên như cũ)
      const totalLoss = lossMoisture + lossFlueGas + lossRadiation + lossIncomplete + lossBottom + lossSteamLeak;

      const netHeat = gcvMix - totalLoss;
      if (netHeat <= 0) return null;

      const steamHeat = 635; // kcal/kg hơi
      const fuelPerTon = (steamHeat * 1000) / netHeat;
      const costPerTon = fuelPerTon * costMix;

      return {
        costPerTon,
        fuelPerTon,
        efficiency: (netHeat/gcvMix)*100,
        gcvMix,
        moistureMix,
        costMix,
        lossMoisture,
        lossFlueGas,
        lossRadiation,
        lossIncomplete,
        lossBottom,
        lossSteamLeak,
        kcalPerKgStm: totalLoss,
      }
    }

    function generateMixRatios() {
      const results = [];
      const step = 10;
      
      const useTrau = document.getElementById('use_trau').checked;
      const useThan = document.getElementById('use_than').checked;
      const useDam = document.getElementById('use_dam').checked;

      const activeFuels = [useTrau, useThan, useDam].filter(Boolean).length;
      
      if (activeFuels < 2) {
        alert('Vui lòng chọn ít nhất 2 loại nhiên liệu để phối trộn!');
        return [];
      }

      for (let rTrau = 0; rTrau <= 100; rTrau += step) {
        for (let rThan = 0; rThan <= 100 - rTrau; rThan += step) {
          let rDam = 100 - rTrau - rThan;
          
          // Skip if not using this fuel type
          if (!useTrau && rTrau > 0) continue;
          if (!useThan && rThan > 0) continue;
          if (!useDam && rDam > 0) continue;
          
          // Only add valid combinations that sum to 100%
          if (rDam >= 0 && rTrau + rThan + rDam === 100) {
            results.push({ trau: rTrau, than: rThan, dam: rDam });
          }
        }
      }

      return results;
    }

    function updateResultBox(res) {
      if(!res) {
        document.getElementById('resultBox').style.display = 'none';
        return;
      }
      const html = `
        💧 Tổn thất ẩm: ${res.lossMoisture.toFixed(0)} kcal/kg<br>
        ☁️ Tổn thất khí thải: ${res.lossFlueGas.toFixed(0)} kcal/kg<br>
        ✨ Tổn thất bức xạ: ${res.lossRadiation.toFixed(0)} kcal/kg<br>
        🔥 Tổn thất cháy không hoàn toàn: ${res.lossIncomplete.toFixed(0)} kcal/kg<br>
        ♨️ Tổn thất xả đáy lò: ${res.lossBottom.toFixed(0)} kcal/kg<br>
        💨 Tổn thất rò rỉ hơi: ${res.lossSteamLeak.toFixed(0)} kcal/kg<br>
        🔥 Hiệu suất lý thuyết: ${res.efficiency.toFixed(2)} %<br>
        ⚡ Nhiệt trị phối trộn (GCV): ${res.gcvMix.toFixed(0)} kcal/kg<br>
        💰 Chi phí nhiên liệu trung bình: ${formatVND(res.costMix.toFixed(0))} VNĐ/kg<br>
        🚿 Lượng nhiên liệu dùng cho 1 tấn hơi: ${res.fuelPerTon.toFixed(2)} kg<br>
        💵 Chi phí nhiên liệu cho 1 tấn hơi: ${formatVND(res.costPerTon.toFixed(0))} VNĐ
      `;
      const box = document.getElementById('resultBox');
      document.getElementById('resultContent').innerHTML = html;
      box.style.display = 'block';
    }

    function autoCalculate() {
      if (!checkLicense()) return;

      // Lấy giá trị input
      const gcvTrau = parseFloat(document.getElementById('gcv_trau').value) || 0;
      const mTrau = parseFloat(document.getElementById('moisture_trau').value) || 0;
      const cTrau = parseFloat(document.getElementById('cost_trau').value) || 0;

      const gcvThan = parseFloat(document.getElementById('gcv_than').value) || 0;
      const mThan = parseFloat(document.getElementById('moisture_than').value) || 0;
      const cThan = parseFloat(document.getElementById('cost_than').value) || 0;

      const gcvDam = parseFloat(document.getElementById('gcv_dam').value) || 0;
      const mDam = parseFloat(document.getElementById('moisture_dam').value) || 0;
      const cDam = parseFloat(document.getElementById('cost_dam').value) || 0;

      const mixes = generateMixRatios();
      if (mixes.length === 0) return;

      let outputHTML = '';
      let bestMix = null;
      let bestCost = Infinity;

      mixes.forEach(({trau, than, dam}, i) => {
        const res = calcCostPerTon(gcvTrau, mTrau, cTrau, trau,
                                   gcvThan, mThan, cThan, than,
                                   gcvDam, mDam, cDam, dam);

        if(res === null) {
          outputHTML += `<div>Phối trộn #${i+1} (${trau}%-${than}%-${dam}%) không hợp lệ (Hiệu suất <= 0)</div>`;
          return;
        }

        if(res.costPerTon < bestCost){
          bestCost = res.costPerTon;
          bestMix = {...res, trau, than, dam};
        }

        outputHTML += `<div>
          <strong>Phối trộn #${i+1}</strong> - Trấu: ${trau}%, Than: ${than}%, Dăm: ${dam}%<br>
          Chi phí: <span style="color:var(--primary)">${formatVND(res.costPerTon.toFixed(0))} VNĐ</span> |
          Lượng nhiên liệu: ${res.fuelPerTon.toFixed(2)} kg/1 tấn hơi | 
          Hiệu suất: ${res.efficiency.toFixed(2)}%
        </div><hr>`;
      });

      document.getElementById('costChart').style.display = 'block';
      document.getElementById('sineChart').style.display = 'block';

      updateResultBox(bestMix);

      drawChart(mixes, bestMix, gcvTrau, mTrau, cTrau, gcvThan, mThan, cThan, gcvDam, mDam, cDam);
      drawSineChart(mixes, bestMix, gcvTrau, mTrau, cTrau, gcvThan, mThan, cThan, gcvDam, mDam, cDam);
    }

    function drawChart(mixes, bestMix, gcvTrau, mTrau, cTrau, gcvThan, mThan, cThan, gcvDam, mDam, cDam){
      if (!checkLicense()) return;

      const ctx = document.getElementById('costChart').getContext('2d');

      const labels = mixes.map(mix => '');

      const costs = mixes.map(mix => {
        const res = calcCostPerTon(gcvTrau, mTrau, cTrau, mix.trau,
                                   gcvThan, mThan, cThan, mix.than,
                                   gcvDam, mDam, cDam, mix.dam);
        return res ? res.costPerTon : null;
      });

      if(window.costChartInstance){
        window.costChartInstance.destroy();
      }

      window.costChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: '',
            data: costs,
            backgroundColor: costs.map(c => c === bestMix.costPerTon ? '#4CAF50' : '#90CAF9'),
            borderRadius: 8,
            maxBarThickness: 25,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => {
                  const mix = mixes[ctx.dataIndex];
                  return [
                    `Trấu: ${mix.trau}%, Than: ${mix.than}%, Dăm: ${mix.dam}%`,
                    `Chi phí: ${formatVND(ctx.parsed.y.toFixed(0))} VNĐ`
                  ];
                }
              }
            }
          },
          scales: {
            x: {
              ticks: { display: false },
              grid: { display: false }
            },
            y: {
              beginAtZero: true,
              grid: { display: false }
            }
          }
        }
      });
    }

    function drawSineChart(mixes, bestMix, gcvTrau, mTrau, cTrau, gcvThan, mThan, cThan, gcvDam, mDam, cDam) {
      if (!checkLicense()) return;

      const ctx = document.getElementById('sineChart').getContext('2d');

      const costs = mixes.map(mix => {
        const res = calcCostPerTon(gcvTrau, mTrau, cTrau, mix.trau,
                                   gcvThan, mThan, cThan, mix.than,
                                   gcvDam, mDam, cDam, mix.dam);
        return res ? res.costPerTon : null;
      });

      if(window.sineChartInstance) {
        window.sineChartInstance.destroy();
      }

      window.sineChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: mixes.map(mix => ''),
          datasets: [{
            label: 'Chi phí theo phối trộn',
            data: costs,
            borderColor: '#FF5722',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: costs.map(c => c === bestMix.costPerTon ? '#4CAF50' : '#FF5722'),
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => {
                  const mix = mixes[ctx.dataIndex];
                  const res = calcCostPerTon(gcvTrau, mTrau, cTrau, mix.trau,
                                           gcvThan, mThan, cThan, mix.than,
                                           gcvDam, mDam, cDam, mix.dam);
                  return [
                    `Trấu: ${mix.trau}%, Than: ${mix.than}%, Dăm: ${mix.dam}%`,
                    `Chi phí: ${formatVND(res.costPerTon.toFixed(0))} VNĐ`,
                    `Lượng nhiên liệu: ${res.fuelPerTon.toFixed(2)} kg/1 tấn hơi`,
                    `Hiệu suất: ${res.efficiency.toFixed(2)}%`
                  ];
                }
              }
            }
          },
          scales: {
            x: {
              ticks: { display: false },
              grid: { display: false }
            },
            y: {
              grid: { display: false }
            }
          }
        }
      });
    }
