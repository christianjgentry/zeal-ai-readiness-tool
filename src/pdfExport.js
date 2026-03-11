import jsPDF from "jspdf";
import { phases } from "./phaseData";

const NAVY = [11, 37, 69];
const ACCENT = [27, 107, 147];
const TEXT_PRIMARY = [26, 26, 46];
const TEXT_SECONDARY = [74, 85, 104];
const BORDER = [209, 217, 230];
const BG_ELEVATED = [240, 242, 245];
const RED = [192, 57, 43];
const WHITE = [255, 255, 255];

const phaseNames = [
  "Unstructured Exploration",
  "Assisted Workflows",
  "Integrated Automation",
  "Contextual Intelligence",
  "Supervised Agentic Tasks",
  "Autonomous at Scale",
];

const spectrumColors = [
  [176, 189, 208], [143, 160, 186], [110, 131, 163],
  [77, 102, 140], [44, 73, 117], [11, 37, 69]
];

function drawFooter(doc, margin, contentWidth) {
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  doc.line(margin, 280, margin + contentWidth, 280);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...TEXT_SECONDARY);
  doc.text("Zeal IT Consultants — AI Readiness Assessment", margin, 286);
  doc.text("zealconsultants.com", margin + contentWidth, 286, { align: "right" });
}

function drawHeaderBand(doc, pageWidth, margin, title, subtitle) {
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageWidth, 38, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...WHITE);
  doc.text("ZEAL IT CONSULTANTS", margin, 14);
  doc.setFontSize(16);
  doc.text(title, margin, 26);
  if (subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(200, 210, 225);
    doc.text(subtitle, margin, 33);
  }
}

export function generateResultsPdf({ name, email, company, results }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // =============================================
  // PAGE 1 — Assessment Results
  // =============================================

  drawHeaderBand(doc, pageWidth, margin, "AI Readiness Assessment Results", `Prepared for ${name} at ${company}`);

  let y = 48;

  // --- Phase result box ---
  doc.setFillColor(...BG_ELEVATED);
  doc.roundedRect(margin, y, contentWidth, 28, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...ACCENT);
  doc.text("YOUR ORGANIZATION IS AT", margin + 8, y + 9);

  doc.setFontSize(15);
  doc.setTextColor(...TEXT_PRIMARY);
  doc.text(`Phase ${results.phase}: ${phaseNames[results.phase - 1]}`, margin + 8, y + 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_SECONDARY);
  doc.text(`Overall trajectory score: ${results.average} / 6`, margin + contentWidth - 8, y + 20, { align: "right" });

  y += 36;

  // --- Category breakdown ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...NAVY);
  doc.text("CATEGORY BREAKDOWN", margin, y);
  y += 8;

  const barFullWidth = contentWidth - 16; // score label needs ~16mm
  const { categoryScores } = results;

  for (const cat of categoryScores) {
    // Label row (above bar)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...TEXT_PRIMARY);
    doc.text(cat.categoryName, margin, y);
    y += 4;

    // Track background
    doc.setFillColor(...BG_ELEVATED);
    doc.roundedRect(margin, y, barFullWidth, 5, 1.5, 1.5, "F");

    // Fill bar
    const pct = cat.score / 6;
    const fillWidth = Math.max(2, barFullWidth * pct);
    const colorIdx = Math.min(Math.floor(cat.score) - 1, 5);
    const barColor = spectrumColors[Math.max(0, colorIdx)];
    doc.setFillColor(...barColor);
    doc.roundedRect(margin, y, fillWidth, 5, 1.5, 1.5, "F");

    // Score number (right-aligned after bar)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...TEXT_PRIMARY);
    doc.text(String(cat.score), margin + contentWidth, y + 4, { align: "right" });

    y += 10;
  }

  y += 2;

  // --- Weakest dimension ---
  if (results.weakest) {
    doc.setDrawColor(...RED);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin, y + 16);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...RED);
    doc.text("CONSTRAINING DIMENSION", margin + 4, y + 5);

    doc.setFontSize(10);
    doc.setTextColor(...TEXT_PRIMARY);
    doc.text(results.weakest.categoryName, margin + 4, y + 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...TEXT_SECONDARY);
    doc.text(
      `Currently scoring ${results.weakest.score}/6 — advancing this dimension unlocks your next phase.`,
      margin + 4, y + 16
    );

    y += 24;
  }

  // --- User info ---
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + contentWidth, y);
  y += 7;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...NAVY);
  doc.text("ASSESSMENT DETAILS", margin, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...TEXT_SECONDARY);
  const details = [`Name: ${name}`, `Company: ${company}`];
  if (email) details.push(`Email: ${email}`);
  details.push(`Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`);
  for (const line of details) {
    doc.text(line, margin, y);
    y += 4.5;
  }

  drawFooter(doc, margin, contentWidth);

  // =============================================
  // PAGE 2 — Phase Detail
  // =============================================

  const phase = phases[results.phase - 1];
  if (!phase) {
    const slug = company.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    doc.save(`zeal-readiness-${slug}.pdf`);
    return;
  }

  doc.addPage();
  drawHeaderBand(doc, pageWidth, margin, `Phase ${phase.id}: ${phase.name}`, phase.subtitle);

  y = 46;

  // --- Summary ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_SECONDARY);
  const summaryLines = doc.splitTextToSize(phase.summary, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 4.5 + 6;

  // --- IT Requirements ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...ACCENT);
  doc.text("IT REQUIREMENTS", margin, y);
  y += 6;

  for (const req of phase.requirements) {
    // Check if we need a new page (leave room for at least one requirement)
    if (y > 255) {
      drawFooter(doc, margin, contentWidth);
      doc.addPage();
      drawHeaderBand(doc, pageWidth, margin, `Phase ${phase.id}: ${phase.name}`, "Requirements (continued)");
      y = 46;
    }

    // Requirement card background
    const cardStartY = y;

    // Area name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...TEXT_PRIMARY);
    doc.text(req.area, margin + 4, y + 4);

    // Level badge on next line
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...ACCENT);
    doc.text(req.level, margin + 4, y + 8);

    y += 12;

    // Detail text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...TEXT_SECONDARY);
    const detailLines = doc.splitTextToSize(req.detail, contentWidth - 8);
    doc.text(detailLines, margin + 4, y);
    y += detailLines.length * 3.5 + 3;

    // Zeal service
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...NAVY);
    doc.text(`Zeal: ${req.zealService}`, margin + 4, y);
    y += 3;

    // Draw card border
    const cardHeight = y - cardStartY + 2;
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, cardStartY - 2, contentWidth, cardHeight, 2, 2, "S");

    y += 5;
  }

  // --- Blockers ---
  if (y > 245) {
    drawFooter(doc, margin, contentWidth);
    doc.addPage();
    drawHeaderBand(doc, pageWidth, margin, `Phase ${phase.id}: ${phase.name}`, "Gaps & Next Steps");
    y = 46;
  }

  y += 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...RED);
  doc.text("IT GAPS THAT BLOCK THIS PHASE", margin, y);
  y += 6;

  for (const blocker of phase.blockers) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...TEXT_PRIMARY);
    const blockerLines = doc.splitTextToSize(blocker, contentWidth - 8);
    doc.setTextColor(...RED);
    doc.text("-", margin + 1, y);
    doc.setTextColor(...TEXT_PRIMARY);
    doc.text(blockerLines, margin + 6, y);
    y += blockerLines.length * 3.5 + 3;
  }

  // --- Next Steps ---
  y += 4;

  if (y > 255) {
    drawFooter(doc, margin, contentWidth);
    doc.addPage();
    drawHeaderBand(doc, pageWidth, margin, `Phase ${phase.id}: ${phase.name}`, "Next Steps");
    y = 46;
  }

  doc.setFillColor(...BG_ELEVATED);
  const nextStepLines = doc.splitTextToSize(phase.nextStep, contentWidth - 12);
  const nextBoxHeight = nextStepLines.length * 4 + 14;
  doc.roundedRect(margin, y, contentWidth, nextBoxHeight, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...ACCENT);
  doc.text(phase.isStripe ? "SUSTAINING EXCELLENCE" : "IT PRIORITIES TO ADVANCE", margin + 6, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...TEXT_PRIMARY);
  doc.text(nextStepLines, margin + 6, y + 14);

  drawFooter(doc, margin, contentWidth);

  // --- Save ---
  const slug = company.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  doc.save(`zeal-readiness-${slug}.pdf`);
}
