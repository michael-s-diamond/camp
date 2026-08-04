/**
 * TerraSol — client-side rewrite of https://github.com/frodre/TerraSol
 * All physics ported 1:1 from the original terrasol.py / climate.py
 * (SimpleClimate class; the heavier scipy/xarray EnergyBalanceModel in
 * climate.py was never actually wired into the deployed app, so it has
 * no client-side equivalent here).
 */

// ---------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------
const AU_IN_M = 149597870700;
const LUMINOSITY_OUR_SUN = 3.828e26;
const SIGMA = 5.670367e-8;
const EARTH_RADIUS_M = 6.371e6;

// hexrgb color at each 100K step from 1000K to 40000K ('10deg' column)
const STELLAR_COLORS = ["#ff3800","#ff4700","#ff5300","#ff5d00","#ff6500","#ff6d00","#ff7300","#ff7900","#ff7e00","#ff8300","#ff8912","#ff8e21","#ff932c","#ff9836","#ff9d3f","#ffa148","#ffa54f","#ffa957","#ffad5e","#ffb165","#ffb46b","#ffb872","#ffbb78","#ffbe7e","#ffc184","#ffc489","#ffc78f","#ffc994","#ffcc99","#ffce9f","#ffd1a3","#ffd3a8","#ffd5ad","#ffd7b1","#ffd9b6","#ffdbba","#ffddbe","#ffdfc2","#ffe1c6","#ffe3ca","#ffe4ce","#ffe6d2","#ffe8d5","#ffe9d9","#ffebdc","#ffece0","#ffeee3","#ffefe6","#fff0e9","#fff2ec","#fff3ef","#fff4f2","#fff5f5","#fff6f8","#fff8fb","#fff9fd","#fef9ff","#fcf7ff","#f9f6ff","#f7f5ff","#f5f3ff","#f3f2ff","#f0f1ff","#eff0ff","#edefff","#ebeeff","#e9edff","#e7ecff","#e6ebff","#e4eaff","#e3e9ff","#e1e8ff","#e0e7ff","#dee6ff","#dde6ff","#dce5ff","#dae4ff","#d9e3ff","#d8e3ff","#d7e2ff","#d6e1ff","#d4e1ff","#d3e0ff","#d2dfff","#d1dfff","#d0deff","#cfddff","#cfddff","#cedcff","#cddcff","#ccdbff","#cbdbff","#cadaff","#c9daff","#c9d9ff","#c8d9ff","#c7d8ff","#c7d8ff","#c6d8ff","#c5d7ff","#c4d7ff","#c4d6ff","#c3d6ff","#c3d6ff","#c2d5ff","#c1d5ff","#c1d4ff","#c0d4ff","#c0d4ff","#bfd3ff","#bfd3ff","#bed3ff","#bed2ff","#bdd2ff","#bdd2ff","#bcd2ff","#bcd1ff","#bbd1ff","#bbd1ff","#bad0ff","#bad0ff","#b9d0ff","#b9d0ff","#b9cfff","#b8cfff","#b8cfff","#b7cfff","#b7ceff","#b7ceff","#b6ceff","#b6ceff","#b6cdff","#b5cdff","#b5cdff","#b5cdff","#b4cdff","#b4ccff","#b4ccff","#b3ccff","#b3ccff","#b3ccff","#b2cbff","#b2cbff","#b2cbff","#b2cbff","#b1cbff","#b1caff","#b1caff","#b1caff","#b0caff","#b0caff","#b0caff","#afc9ff","#afc9ff","#afc9ff","#afc9ff","#afc9ff","#aec9ff","#aec9ff","#aec8ff","#aec8ff","#adc8ff","#adc8ff","#adc8ff","#adc8ff","#adc8ff","#acc7ff","#acc7ff","#acc7ff","#acc7ff","#acc7ff","#abc7ff","#abc7ff","#abc7ff","#abc6ff","#abc6ff","#aac6ff","#aac6ff","#aac6ff","#aac6ff","#aac6ff","#aac6ff","#a9c6ff","#a9c5ff","#a9c5ff","#a9c5ff","#a9c5ff","#a9c5ff","#a9c5ff","#a8c5ff","#a8c5ff","#a8c5ff","#a8c5ff","#a8c4ff","#a8c4ff","#a8c4ff","#a7c4ff","#a7c4ff","#a7c4ff","#a7c4ff","#a7c4ff","#a7c4ff","#a7c4ff","#a6c4ff","#a6c3ff","#a6c3ff","#a6c3ff","#a6c3ff","#a6c3ff","#a6c3ff","#a6c3ff","#a5c3ff","#a5c3ff","#a5c3ff","#a5c3ff","#a5c3ff","#a5c3ff","#a5c2ff","#a5c2ff","#a5c2ff","#a4c2ff","#a4c2ff","#a4c2ff","#a4c2ff","#a4c2ff","#a4c2ff","#a4c2ff","#a4c2ff","#a4c2ff","#a4c2ff","#a3c2ff","#a3c2ff","#a3c1ff","#a3c1ff","#a3c1ff","#a3c1ff","#a3c1ff","#a3c1ff","#a3c1ff","#a3c1ff","#a3c1ff","#a2c1ff","#a2c1ff","#a2c1ff","#a2c1ff","#a2c1ff","#a2c1ff","#a2c1ff","#a2c1ff","#a2c0ff","#a2c0ff","#a2c0ff","#a2c0ff","#a2c0ff","#a1c0ff","#a1c0ff","#a1c0ff","#a1c0ff","#a1c0ff","#a1c0ff","#a1c0ff","#a1c0ff","#a1c0ff","#a1c0ff","#a1c0ff","#a1c0ff","#a1c0ff","#a1c0ff","#a0c0ff","#a0c0ff","#a0bfff","#a0bfff","#a0bfff","#a0bfff","#a0bfff","#a0bfff","#a0bfff","#a0bfff","#a0bfff","#a0bfff","#a0bfff","#a0bfff","#a0bfff","#9fbfff","#9fbfff","#9fbfff","#9fbfff","#9fbfff","#9fbfff","#9fbfff","#9fbfff","#9fbfff","#9fbfff","#9fbfff","#9fbeff","#9fbeff","#9fbeff","#9fbeff","#9fbeff","#9fbeff","#9fbeff","#9ebeff","#9ebeff","#9ebeff","#9ebeff","#9ebeff","#9ebeff","#9ebeff","#9ebeff","#9ebeff","#9ebeff","#9ebeff","#9ebeff","#9ebeff","#9ebeff","#9ebeff","#9ebeff","#9ebeff","#9ebeff","#9ebeff","#9ebeff","#9ebeff","#9dbeff","#9dbeff","#9dbdff","#9dbdff","#9dbdff","#9dbdff","#9dbdff","#9dbdff","#9dbdff","#9dbdff","#9dbdff","#9dbdff","#9dbdff","#9dbdff","#9dbdff","#9dbdff","#9dbdff","#9dbdff","#9dbdff","#9dbdff","#9dbdff","#9dbdff","#9dbdff","#9dbdff","#9cbdff","#9cbdff","#9cbdff","#9cbdff","#9cbdff","#9cbdff","#9cbdff","#9cbdff","#9cbdff","#9cbdff","#9cbdff","#9cbdff","#9cbdff","#9cbdff","#9cbdff","#9cbdff","#9cbcff","#9cbcff","#9cbcff","#9cbcff","#9cbcff","#9cbcff","#9cbcff","#9cbcff","#9cbcff","#9cbcff","#9cbcff","#9cbcff","#9bbcff","#9bbcff","#9bbcff","#9bbcff","#9bbcff","#9bbcff","#9bbcff","#9bbcff","#9bbcff","#9bbcff","#9bbcff","#9bbcff","#9bbcff","#9bbcff","#9bbcff","#9bbcff","#9bbcff"];

// RdYlBu-11 (ColorBrewer), same list bokeh.palettes.RdYlBu[11] draws from.
// LinearColorMapper bins values into discrete palette entries (no smooth
// interpolation), so we replicate that banding rather than blending.
const RDYLBU_11 = ["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"];

// ---------------------------------------------------------------------
// Physics (ported from terrasol.py / climate.py)
// ---------------------------------------------------------------------
function calcStarEnergyFlux(tEff) {
  return SIGMA * Math.pow(tEff, 4);
}

function calcStarRadiusAU(relLuminosity, tEff) {
  const L = relLuminosity * LUMINOSITY_OUR_SUN;
  const bbOutput = calcStarEnergyFlux(tEff);
  const radiusM = Math.sqrt(L / (4 * Math.PI * bbOutput));
  return radiusM / AU_IN_M;
}

function calcPlanetRadiusAU(relRadius) {
  return (relRadius * EARTH_RADIUS_M) / AU_IN_M;
}

function calcPlanetEnergyIn(relLuminosity, relPlanetDist) {
  const luminosity = relLuminosity * LUMINOSITY_OUR_SUN;
  return luminosity / (4 * Math.PI * Math.pow(relPlanetDist * AU_IN_M, 2));
}

function getStarColor(tEff) {
  let t = Math.round(tEff / 100) * 100;
  t = Math.max(1000, Math.min(40000, t));
  const idx = (t - 1000) / 100;
  return STELLAR_COLORS[idx];
}

function determineStarType(tEff, luminosityW) {
  const Lsun = LUMINOSITY_OUR_SUN;
  if (tEff >= 30000 && luminosityW >= 30000 * Lsun) {
    return { cls: "O type", msf: "~0.00003%", life: "< 100 Myr" };
  } else if (tEff >= 10000 && tEff < 30000 && luminosityW >= 25 * Lsun && luminosityW < 30000 * Lsun) {
    return { cls: "B type", msf: "0.13%", life: "100 Myr – 1 Gyr" };
  } else if (tEff >= 7500 && tEff < 10000 && luminosityW >= 5 * Lsun && luminosityW < 25 * Lsun) {
    return { cls: "A type", msf: "0.6%", life: "2–4 Gyr" };
  } else if (tEff >= 6001 && tEff < 7500 && luminosityW >= 1.5 * Lsun && luminosityW < 5 * Lsun) {
    return { cls: "F type", msf: "3%", life: "4–9 Gyr" };
  } else if (tEff >= 5200 && tEff < 6001 && luminosityW >= 0.6 * Lsun && luminosityW < 1.5 * Lsun) {
    return { cls: "G type", msf: "7.6%", life: "5–15 Gyr" };
  } else if (tEff >= 3700 && tEff < 5200 && luminosityW >= 0.08 * Lsun && luminosityW < 0.6 * Lsun) {
    return { cls: "K type", msf: "12.1%", life: "15–75 Gyr" };
  } else if (tEff >= 2400 && tEff < 3700 && luminosityW < 0.08 * Lsun) {
    return { cls: "M type", msf: "76.45%", life: "> 100 Gyr" };
  }
  return { cls: "N/A", msf: "N/A", life: "N/A" };
}

// SimpleClimate.calc_Ts / calc_Ts_F
function calcSurfaceTempK(tau, alpha, S0) {
  const numer = (1 - alpha) * S0 * (1 + 0.75 * tau);
  const denom = 4 * SIGMA;
  return Math.pow(numer / denom, 0.25);
}

function kelvinToF(tempK) {
  return (9 / 5) * (tempK - 273) + 32;
}

function calcAlbedoFromComponents(fCloud, aCloud, fLand, aLand) {
  const cloud = fCloud * aCloud;
  const land = (1 - fCloud) * fLand * aLand;
  return cloud + land;
}

// ---------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------
function fmtExp(value, digits) {
  if (!isFinite(value)) return "N/A";
  return value.toExponential(digits === undefined ? 4 : digits).replace("e+", "e").replace("e", "e+").replace("e+-", "e-");
}

function fmtNum(value, digits) {
  return value.toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

// ---------------------------------------------------------------------
// Star & Planet visualizer
// ---------------------------------------------------------------------
const StarPlanet = (function () {
  const canvas = document.getElementById("star-planet-canvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  const els = {
    tEff: document.getElementById("slider-teff"),
    tEffOut: document.getElementById("out-teff"),
    lum: document.getElementById("slider-luminosity"),
    lumOut: document.getElementById("out-luminosity"),
    radius: document.getElementById("slider-planet-radius"),
    radiusOut: document.getElementById("out-planet-radius"),
    dist: document.getElementById("slider-planet-dist"),
    distOut: document.getElementById("out-planet-dist"),
    starTable: document.getElementById("star-table"),
    planetTable: document.getElementById("planet-table"),
    tooltip: document.getElementById("star-planet-tooltip"),
  };

  let state = {
    tEff: 6000,
    relLuminosity: 1,
    relPlanetRadius: 1,
    relPlanetDist: 1,
  };

  let starPx = null; // {x, y, r, color}
  let planetPx = null; // {x, y, r}

  function computeAndDraw() {
    const { tEff, relLuminosity, relPlanetRadius, relPlanetDist } = state;

    const starRadiusAU = calcStarRadiusAU(relLuminosity, tEff);
    const planetRadiusAU = calcPlanetRadiusAU(relPlanetRadius);
    const starColor = getStarColor(tEff);
    const starEnergyOut = calcStarEnergyFlux(tEff);
    const planetEnergyIn = calcPlanetEnergyIn(relLuminosity, relPlanetDist);

    // Log-scaled horizontal axis (0.05 - 1200 AU) so the planet marker
    // stays visible and legible across the full slider range, since the
    // distance slider itself is already logarithmic.
    const AXIS_MIN_AU = 0.05;
    const AXIS_MAX_AU = 1200;
    const marginPx = 70;
    const plotW = W - marginPx * 2;

    function auToPx(au) {
      const clamped = Math.max(AXIS_MIN_AU, Math.min(AXIS_MAX_AU, au));
      const t = (Math.log10(clamped) - Math.log10(AXIS_MIN_AU)) / (Math.log10(AXIS_MAX_AU) - Math.log10(AXIS_MIN_AU));
      return marginPx + t * plotW;
    }

    const midY = H / 2;
    const starPxRadius = Math.max(10, Math.min(90, 14 * Math.pow(starRadiusAU, 0.35) * Math.pow(1 + tEff / 10000, 0.4)));
    const planetPxRadius = Math.max(4, Math.min(22, 6 * Math.pow(relPlanetRadius, 0.5)));

    starPx = { x: auToPx(0.02), y: midY, r: starPxRadius, color: starColor };
    planetPx = { x: auToPx(relPlanetDist), y: midY, r: planetPxRadius };

    // --- draw ---
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0c0a14";
    ctx.fillRect(0, 0, W, H);

    // axis line + ticks
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(marginPx, midY + 100);
    ctx.lineTo(W - marginPx, midY + 100);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "11px 'Open Sans', Arial, sans-serif";
    ctx.textAlign = "center";
    [0.1, 1, 10, 100, 1000].forEach(function (au) {
      const x = auToPx(au);
      ctx.beginPath();
      ctx.moveTo(x, midY + 96);
      ctx.lineTo(x, midY + 104);
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.stroke();
      ctx.fillText(au + " AU", x, midY + 118);
    });

    // glow behind star
    const glowR = starPxRadius * 2.6;
    const glow = ctx.createRadialGradient(starPx.x, starPx.y, starPxRadius * 0.5, starPx.x, starPx.y, glowR);
    glow.addColorStop(0, starColor + "aa");
    glow.addColorStop(1, starColor + "00");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(starPx.x, starPx.y, glowR, 0, Math.PI * 2);
    ctx.fill();

    // star
    ctx.fillStyle = starColor;
    ctx.beginPath();
    ctx.arc(starPx.x, starPx.y, starPxRadius, 0, Math.PI * 2);
    ctx.fill();

    // orbit path (dotted)
    ctx.setLineDash([2, 4]);
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.moveTo(starPx.x, midY);
    ctx.lineTo(W - marginPx, midY);
    ctx.stroke();
    ctx.setLineDash([]);

    // planet
    ctx.fillStyle = "#ceb888";
    ctx.strokeStyle = "#add8e6";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(planetPx.x, planetPx.y, planetPxRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // labels
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.font = "12px 'Open Sans', Arial, sans-serif";
    ctx.fillText("Sol", starPx.x, starPx.y - starPxRadius - 10);
    ctx.fillText("Terra", planetPx.x, planetPx.y - planetPxRadius - 10);

    // --- info tables ---
    const luminosityW = relLuminosity * LUMINOSITY_OUR_SUN;
    const startype = determineStarType(tEff, luminosityW);
    els.starTable.innerHTML =
      "<tr><td>Luminosity</td><td>" + fmtExp(luminosityW, 3) + " W</td></tr>" +
      "<tr><td>Effective temperature</td><td>" + tEff + " K</td></tr>" +
      "<tr><td>Radius</td><td>" + fmtExp(starRadiusAU * AU_IN_M, 3) + " m</td></tr>" +
      "<tr><td>Energy flux</td><td>" + fmtExp(starEnergyOut, 3) + " W/m²</td></tr>" +
      "<tr><td>Spectral classification</td><td>" + startype.cls + "</td></tr>" +
      "<tr><td>Fraction of main-sequence stars</td><td>" + startype.msf + "</td></tr>" +
      "<tr><td>Main-sequence lifetime</td><td>" + startype.life + "</td></tr>";

    const distFromStarM = (relPlanetDist - starRadiusAU) * AU_IN_M;
    els.planetTable.innerHTML =
      "<tr><td>Distance from star</td><td>" + fmtExp(distFromStarM, 3) + " m</td></tr>" +
      "<tr><td>Radius</td><td>" + fmtExp(planetRadiusAU * AU_IN_M, 3) + " m</td></tr>" +
      "<tr><td>Energy flux in</td><td>" + fmtExp(planetEnergyIn, 3) + " W/m²</td></tr>";

    return { planetEnergyIn };
  }

  function currentPlanetEnergyIn() {
    return calcPlanetEnergyIn(state.relLuminosity, state.relPlanetDist);
  }

  function updateFromSliders() {
    state.tEff = parseFloat(els.tEff.value);
    state.relLuminosity = Math.pow(10, parseFloat(els.lum.value));
    state.relPlanetRadius = parseFloat(els.radius.value);
    state.relPlanetDist = Math.pow(10, parseFloat(els.dist.value));

    els.tEffOut.textContent = state.tEff + " K";
    els.lumOut.textContent = fmtExp(state.relLuminosity, 2) + " L☉";
    els.radiusOut.textContent = state.relPlanetRadius.toFixed(1) + " R⊕";
    els.distOut.textContent = fmtExp(state.relPlanetDist, 2) + " AU";

    computeAndDraw();
  }

  [els.tEff, els.lum, els.radius, els.dist].forEach(function (el) {
    el.addEventListener("input", updateFromSliders);
  });

  canvas.addEventListener("mousemove", function (evt) {
    const rect = canvas.getBoundingClientRect();
    const mx = (evt.clientX - rect.left) * (W / rect.width);
    const my = (evt.clientY - rect.top) * (H / rect.height);

    let hit = null;
    if (starPx && Math.hypot(mx - starPx.x, my - starPx.y) <= starPx.r + 4) {
      hit = "star";
    } else if (planetPx && Math.hypot(mx - planetPx.x, my - planetPx.y) <= planetPx.r + 4) {
      hit = "planet";
    }

    if (!hit) {
      els.tooltip.style.display = "none";
      canvas.style.cursor = "default";
      return;
    }
    canvas.style.cursor = "pointer";

    let html;
    if (hit === "star") {
      html = "<strong>Sol</strong><br>Tₑₑ: " + state.tEff + " K<br>Energy out: " + fmtExp(calcStarEnergyFlux(state.tEff), 2) + " W/m²";
    } else {
      html = "<strong>Terra</strong><br>Energy in: " + fmtExp(currentPlanetEnergyIn(), 2) + " W/m²";
    }
    els.tooltip.innerHTML = html;
    els.tooltip.style.display = "block";
    els.tooltip.style.left = evt.clientX - rect.left + 16 + "px";
    els.tooltip.style.top = evt.clientY - rect.top - 10 + "px";
  });

  canvas.addEventListener("mouseleave", function () {
    els.tooltip.style.display = "none";
  });

  updateFromSliders();

  return { currentPlanetEnergyIn: currentPlanetEnergyIn };
})();

// ---------------------------------------------------------------------
// Habitability heatmap
// ---------------------------------------------------------------------
const Habitability = (function () {
  const canvas = document.getElementById("habitability-canvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  const PLOT = { left: 60, right: 30, top: 20, bottom: 40 };
  const plotW = W - PLOT.left - PLOT.right;
  const plotH = H - PLOT.top - PLOT.bottom;

  // The heatmap image only depends on S0 (solar input), never on the
  // albedo/land/cloud/tau sliders — those just move the marker. Cache it
  // on an offscreen canvas so slider drags don't re-run the pixel loop.
  const heatmapLayer = document.createElement("canvas");
  heatmapLayer.width = plotW;
  heatmapLayer.height = plotH;
  const heatmapCtx = heatmapLayer.getContext("2d");

  const TAU_MIN = 0.1;
  const TAU_MAX = 150;
  const TAU_LOG_MIN = Math.log10(TAU_MIN);
  const TAU_LOG_MAX = Math.log10(TAU_MAX);

  const els = {
    cloudFrac: document.getElementById("slider-cloud-frac"),
    cloudFracOut: document.getElementById("out-cloud-frac"),
    cloudAlbedo: document.getElementById("slider-cloud-albedo"),
    cloudAlbedoOut: document.getElementById("out-cloud-albedo"),
    landFrac: document.getElementById("slider-land-frac"),
    landFracOut: document.getElementById("out-land-frac"),
    landAlbedo: document.getElementById("slider-land-albedo"),
    landAlbedoOut: document.getElementById("out-land-albedo"),
    tau: document.getElementById("slider-tau"),
    tauOut: document.getElementById("out-tau"),
    preset: document.getElementById("select-tau-preset"),
    syncButton: document.getElementById("btn-sync-solar"),
    terraReadout: document.getElementById("terra-readout"),
    solarReadout: document.getElementById("solar-readout"),
    tooltip: document.getElementById("habitability-tooltip"),
  };

  let state = {
    fCloud: 0.7,
    aCloud: 0.4,
    fLand: 0.3,
    aLand: 0.2,
    tauStar: 0.84,
    S0: 1361.2,
  };

  function xToPx(alpha) {
    return PLOT.left + alpha * plotW;
  }
  function yToPx(tau) {
    const t = (Math.log10(tau) - TAU_LOG_MIN) / (TAU_LOG_MAX - TAU_LOG_MIN);
    return PLOT.top + (1 - t) * plotH;
  }
  function pxToAlpha(px) {
    return (px - PLOT.left) / plotW;
  }
  function pxToTau(py) {
    const t = 1 - (py - PLOT.top) / plotH;
    return Math.pow(10, TAU_LOG_MIN + t * (TAU_LOG_MAX - TAU_LOG_MIN));
  }

  function bandColor(tempF) {
    let band = Math.floor(((tempF - 32) / (112 - 32)) * RDYLBU_11.length);
    band = Math.max(0, Math.min(RDYLBU_11.length - 1, band));
    return RDYLBU_11[band];
  }

  function computeHeatmapLayer() {
    const imgData = heatmapCtx.createImageData(plotW, plotH);
    for (let py = 0; py < plotH; py++) {
      const tau = pxToTau(PLOT.top + py);
      for (let px = 0; px < plotW; px++) {
        const alpha = pxToAlpha(PLOT.left + px);
        const tempK = calcSurfaceTempK(tau, alpha, state.S0);
        const tempF = kelvinToF(tempK);
        const hex = bandColor(tempF);
        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);
        const idx = (py * plotW + px) * 4;
        imgData.data[idx] = r;
        imgData.data[idx + 1] = g;
        imgData.data[idx + 2] = b;
        imgData.data[idx + 3] = 255;
      }
    }
    heatmapCtx.putImageData(imgData, 0, 0);
  }

  function drawAxesAndMarkers() {
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(heatmapLayer, PLOT.left, PLOT.top);

    // axis border
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(PLOT.left, PLOT.top, plotW, plotH);

    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "11px 'Open Sans', Arial, sans-serif";
    ctx.textAlign = "center";
    [0, 0.25, 0.5, 0.75, 1].forEach(function (a) {
      const x = xToPx(a);
      ctx.fillText(a.toFixed(2), x, PLOT.top + plotH + 16);
    });
    ctx.textAlign = "right";
    [0.1, 1, 10, 100].forEach(function (t) {
      const y = yToPx(t);
      ctx.fillText(t, PLOT.left - 8, y + 4);
    });
    ctx.textAlign = "center";
    ctx.fillText("Albedo", PLOT.left + plotW / 2, PLOT.top + plotH + 32);
    ctx.save();
    ctx.translate(16, PLOT.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Greenhouse gas coefficient (τ)", 0, 0);
    ctx.restore();

    // reference planets
    const refs = [
      { name: "Mars", alpha: 0.25, tau: 0.125, color: "#e07856" },
      { name: "Earth", alpha: 0.3, tau: 0.84, color: "#7fd6c2" },
      { name: "Venus", alpha: 0.77, tau: 125, color: "#c9a0dc" },
    ];
    refs.forEach(function (p) {
      const x = xToPx(p.alpha);
      const y = yToPx(p.tau);
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.textAlign = "left";
      ctx.fillText(p.name, x + 10, y + 4);
    });

    // current selection crosshair
    const alpha = calcAlbedoFromComponents(state.fCloud, state.aCloud, state.fLand, state.aLand);
    const x = xToPx(alpha);
    const y = yToPx(state.tauStar);
    ctx.strokeStyle = "rgba(0,0,0,0.6)";
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(x, PLOT.top);
    ctx.lineTo(x, PLOT.top + plotH);
    ctx.moveTo(PLOT.left, y);
    ctx.lineTo(PLOT.left + plotW, y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fillStyle = "#ceb888";
    ctx.fill();
    ctx.strokeStyle = "#101820";
    ctx.lineWidth = 2;
    ctx.stroke();

    return alpha;
  }

  function redraw() {
    computeHeatmapLayer();
    const alpha = drawAxesAndMarkers();
    updateReadout(alpha);
  }

  function updateReadout(alpha) {
    const tempK = calcSurfaceTempK(state.tauStar, alpha, state.S0);
    const tempF = kelvinToF(tempK);
    const habitable = tempF > 32 && tempF < 112;
    els.terraReadout.innerHTML =
      "Terra surface temperature: <strong>" + tempF.toFixed(1) + "°F</strong> (" +
      (habitable ? "potentially habitable" : "not habitable") + ")";
    els.terraReadout.className = "readout " + (habitable ? "habitable" : "not-habitable");
    els.solarReadout.textContent = "Current solar input: " + state.S0.toFixed(1) + " W/m²";
  }

  function updateFromSliders() {
    state.fCloud = parseFloat(els.cloudFrac.value);
    state.aCloud = parseFloat(els.cloudAlbedo.value);
    state.fLand = parseFloat(els.landFrac.value);
    state.aLand = parseFloat(els.landAlbedo.value);
    state.tauStar = Math.pow(10, parseFloat(els.tau.value));

    els.cloudFracOut.textContent = state.fCloud.toFixed(2);
    els.cloudAlbedoOut.textContent = state.aCloud.toFixed(2);
    els.landFracOut.textContent = state.fLand.toFixed(2);
    els.landAlbedoOut.textContent = state.aLand.toFixed(2);
    els.tauOut.textContent = state.tauStar.toFixed(3);

    const alpha = drawAxesAndMarkers();
    updateReadout(alpha);
  }

  [els.cloudFrac, els.cloudAlbedo, els.landFrac, els.landAlbedo, els.tau].forEach(function (el) {
    el.addEventListener("input", updateFromSliders);
  });

  els.preset.addEventListener("change", function () {
    if (!els.preset.value) return;
    const tau = parseFloat(els.preset.value);
    els.tau.value = Math.log10(tau);
    updateFromSliders();
  });

  els.syncButton.addEventListener("click", function () {
    state.S0 = StarPlanet.currentPlanetEnergyIn();
    redraw();
  });

  canvas.addEventListener("mousemove", function (evt) {
    const rect = canvas.getBoundingClientRect();
    const mx = (evt.clientX - rect.left) * (W / rect.width);
    const my = (evt.clientY - rect.top) * (H / rect.height);
    if (mx < PLOT.left || mx > PLOT.left + plotW || my < PLOT.top || my > PLOT.top + plotH) {
      els.tooltip.style.display = "none";
      return;
    }
    const alpha = pxToAlpha(mx);
    const tau = pxToTau(my);
    const tempF = kelvinToF(calcSurfaceTempK(tau, alpha, state.S0));
    els.tooltip.innerHTML = "Albedo: " + alpha.toFixed(2) + "<br>τ: " + tau.toFixed(2) + "<br>Surface temp: " + tempF.toFixed(1) + "°F";
    els.tooltip.style.display = "block";
    els.tooltip.style.left = evt.clientX - rect.left + 16 + "px";
    els.tooltip.style.top = evt.clientY - rect.top - 10 + "px";
  });
  canvas.addEventListener("mouseleave", function () {
    els.tooltip.style.display = "none";
  });

  // initialize S0 from the star/planet section's starting values
  state.S0 = StarPlanet.currentPlanetEnergyIn();
  updateFromSliders();
  redraw();

  return {};
})();
