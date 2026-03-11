import jsPDF from "jspdf";

const NAVY = [11, 37, 69];
const ACCENT = [27, 107, 147];
const TEXT_PRIMARY = [26, 26, 46];
const TEXT_SECONDARY = [74, 85, 104];
const BORDER = [209, 217, 230];
const BG_ELEVATED = [240, 242, 245];
const RED = [192, 57, 43];

const phaseNames = [
  "Unstructured Exploration",
  "Assisted Workflows",
  "Integrated Automation",
  "Contextual Intelligence",
  "Supervised Agentic Tasks",
  "Autonomous at Scale",
];

export function generateResultsPdf({ name, email, company, results }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  // --- Header band ---
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageWidth, 44, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("ZEAL IT CONSULTANTS", margin, 16);

  doc.setFontSize(18);
  doc.text("AI Readiness Assessment Results", margin, 28);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(200, 210, 225);
  doc.text(`Prepared for ${name} at ${company}`, margin, 36);

  y = 56;

  // --- Phase result box ---
  doc.setFillColor(...BG_ELEVATED);
  doc.roundedRect(margin, y, contentWidth, 32, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...ACCENT);
  doc.text("YOUR ORGANIZATION IS AT", margin + 8, y + 10);

  doc.setFontSize(16);
  doc.setTextColor(...TEXT_PRIMARY);
  doc.text(`Phase ${results.phase}: ${phaseNames[results.phase - 1]}`, margin + 8, y + 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...TEXT_SECONDARY);
  doc.text(`Overall trajectory score: ${results.average} / 6`, margin + contentWidth - 8, y + 22, { align: "right" });

  y += 42;

  // --- Category breakdown ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...NAVY);
  doc.text("CATEGORY BREAKDOWN", margin, y);
  y += 8;

  const barMaxWidth = contentWidth - 60;
  const { categoryScores } = results;

  for (const cat of categoryScores) {
    // Label
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...TEXT_SECONDARY);
    doc.text(cat.categoryName, margin, y + 4);

    // Track background
    const barX = margin + 52;
    doc.setFillColor(...BG_ELEVATED);
    doc.roundedRect(barX, y, barMaxWidth, 5, 1.5, 1.5, "F");

    // Fill bar
    const pct = cat.score / 6;
    const fillWidth = Math.max(2, barMaxWidth * pct);
    const colorIdx = Math.min(Math.floor(cat.score) - 1, 5);
    const spectrumColors = [
      [176, 189, 208], [143, 160, 186], [110, 131, 163],
      [77, 102, 140], [44, 73, 117], [11, 37, 69]
    ];
    const barColor = spectrumColors[Math.max(0, colorIdx)];
    doc.setFillColor(...barColor);
    doc.roundedRect(barX, y, fillWidth, 5, 1.5, 1.5, "F");

    // Score number
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...TEXT_PRIMARY);
    doc.text(String(cat.score), barX + barMaxWidth + 4, y + 4);

    y += 10;
  }

  y += 4;

  // --- Weakest dimension ---
  if (results.weakest) {
    doc.setDrawColor(...RED);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin, y + 18);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...RED);
    doc.text("CONSTRAINING DIMENSION", margin + 4, y + 5);

    doc.setFontSize(11);
    doc.setTextColor(...TEXT_PRIMARY);
    doc.text(results.weakest.categoryName, margin + 4, y + 13);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...TEXT_SECONDARY);
    doc.text(
      `Currently scoring ${results.weakest.score}/6 — advancing this dimension unlocks your next phase.`,
      margin + 4, y + 18
    );

    y += 28;
  }

  // --- User info ---
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + contentWidth, y);
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...NAVY);
  doc.text("ASSESSMENT DETAILS", margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_SECONDARY);
  const details = [`Name: ${name}`, `Company: ${company}`];
  if (email) details.push(`Email: ${email}`);
  details.push(`Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`);
  for (const line of details) {
    doc.text(line, margin, y);
    y += 5;
  }

  y += 6;

  // --- Next steps ---
  doc.setFillColor(...BG_ELEVATED);
  doc.roundedRect(margin, y, contentWidth, 22, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...ACCENT);
  doc.text("RECOMMENDED NEXT STEP", margin + 6, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_PRIMARY);
  const nextStepText = `Explore Phase ${results.phase} to see the specific IT requirements, gaps, and Zeal services that will advance your organization.`;
  const lines = doc.splitTextToSize(nextStepText, contentWidth - 12);
  doc.text(lines, margin + 6, y + 14);

  y += 32;

  // --- Footer ---
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  doc.line(margin, 280, margin + contentWidth, 280);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...TEXT_SECONDARY);
  doc.text("Zeal IT Consultants — AI Readiness Assessment", margin, 286);
  doc.text("zealconsultants.com", margin + contentWidth, 286, { align: "right" });

  // --- Save ---
  const slug = company.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  doc.save(`zeal-readiness-${slug}.pdf`);
}
