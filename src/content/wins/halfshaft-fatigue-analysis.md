---
title: "A halfshaft fatigue analysis tool, built in a chat"
who: Richard
team: Powertrain
mode: chat
timeSaved: "1 week"
date: "2026-07-02"
---

Richard and Cisco used Claude to narrow the halfshaft design specifications around frequency sensitivity and fatigue life. Claude built a self-contained HTML tool that ran rainflow counting on three torque profiles per an ASTM standard, extrapolated the results across Aptera's specified vehicle life, and generated design options across a range of stiffnesses, wall thicknesses, and material combinations. It calculated the cumulative fatigue damage and a damage-equivalent load for each design, compared them against the material's fatigue S-N curve, plotted the stress/strain response, and drew the cross-section to scale for clarity. Building on MATLAB/Simulink inputs from Albert Mathews, the analysis compressed roughly a week of engineering work into a single collaborative session.
