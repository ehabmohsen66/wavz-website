import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, TrendingUp, Shield, CheckCircle, Clock, Users, BarChart3, ChevronRight, Megaphone, BookOpen } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { MediaHero } from './MediaHero.jsx';

/* ─── Case Study Data (sourced from official anonymized 2-pager documents) ─── */
const CASE_STUDIES = [
  {
    id: "healthcare-foundation",
    client: "A Leading Healthcare Foundation",
    clientAr: "\u0645\u0624\u0633\u0633\u0629 \u0631\u0639\u0627\u064a\u0629 \u0635\u062d\u064a\u0629 \u0631\u0627\u0626\u062f\u0629",
    subtitle: "SAP S/4HANA Transformation",
    subtitleAr: "\u062a\u062d\u0648\u0644 SAP S/4HANA",
    industry: "Non-Profit Healthcare",
    industryAr: "\u0627\u0644\u0631\u0639\u0627\u064a\u0629 \u0627\u0644\u0635\u062d\u064a\u0629 \u063a\u064a\u0631 \u0627\u0644\u0631\u0628\u062d\u064a\u0629",
    region: "Egypt",
    regionAr: "\u0645\u0635\u0631",
    scope: "SAP S/4HANA, FICO, MM, SD, BTP, CPI, SAC, SuccessFactors",
    scopeAr: "SAP S/4HANA, FICO, MM, SD, BTP, CPI, SAC, SuccessFactors",
    color: "#0284C7",
    bgGradient: "linear-gradient(135deg, #061E31 0%, #0369a1 100%)",
    tagColor: "rgba(2,132,199,0.12)",
    tagBorder: "rgba(2,132,199,0.3)",
    tagText: "#0284C7",
    headline: "One Connected Foundation: Unifying Finance, Care Operations & Data on a Single SAP Core",
    headlineAr: "\u0645\u0624\u0633\u0633\u0629 \u0645\u0648\u062d\u0651\u062f\u0629 \u0648\u0645\u062a\u0635\u0644\u0629: \u062f\u0645\u062c \u0627\u0644\u0634\u0624\u0648\u0646 \u0627\u0644\u0645\u0627\u0644\u064a\u0629 \u0648\u0639\u0645\u0644\u064a\u0627\u062a \u0627\u0644\u0631\u0639\u0627\u064a\u0629 \u0648\u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0639\u0644\u0649 \u0646\u0648\u0627\u0629 SAP \u0648\u0627\u062d\u062f\u0629",
    summary: "WAVZ designed and delivered an end-to-end SAP S/4HANA transformation for a leading non-profit healthcare organization in Egypt. Across 8 integrated SAP modules \u2014 spanning finance, procurement, billing, integration, analytics and HR \u2014 WAVZ replaced fragmented, paper-based systems with one connected, real-time digital core, turning a high-complexity transformation into a platform built for the Foundation's mission of patient care.",
    summaryAr: "\u0635\u0645\u0651\u0645\u062a WAVZ \u0648\u0646\u0641\u0651\u0630\u062a \u062a\u062d\u0648\u0644\u0627\u064b \u0634\u0627\u0645\u0644\u0627\u064b \u0642\u0627\u0626\u0645\u0627\u064b \u0639\u0644\u0649 SAP S/4HANA \u0644\u0645\u0624\u0633\u0633\u0629 \u0631\u0627\u0626\u062f\u0629 \u0641\u064a \u0645\u062c\u0627\u0644 \u0627\u0644\u0631\u0639\u0627\u064a\u0629 \u0627\u0644\u0635\u062d\u064a\u0629 \u063a\u064a\u0631 \u0627\u0644\u0631\u0628\u062d\u064a\u0629 \u0641\u064a \u0645\u0635\u0631. \u0639\u0628\u0631 8 \u0648\u062d\u062f\u0627\u062a SAP \u0645\u062a\u0643\u0627\u0645\u0644\u0629 \u062a\u063a\u0637\u064a \u0627\u0644\u0634\u0624\u0648\u0646 \u0627\u0644\u0645\u0627\u0644\u064a\u0629 \u0648\u0627\u0644\u0645\u0634\u062a\u0631\u064a\u0627\u062a \u0648\u0627\u0644\u0641\u0648\u062a\u0631\u0629 \u0648\u0627\u0644\u062a\u0643\u0627\u0645\u0644 \u0648\u0627\u0644\u062a\u062d\u0644\u064a\u0644\u0627\u062a \u0648\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0645\u0648\u0627\u0631\u062f \u0627\u0644\u0628\u0634\u0631\u064a\u0629\u060c \u0627\u0633\u062a\u0628\u062f\u0644\u062a WAVZ \u0627\u0644\u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u0645\u062c\u0632\u0623\u0629 \u0627\u0644\u0648\u0631\u0642\u064a\u0629 \u0628\u0640\u0646\u0648\u0627\u0629 \u0631\u0642\u0645\u064a\u0629 \u0648\u0627\u062d\u062f\u0629 \u0645\u062a\u0635\u0644\u0629 \u0648\u0622\u0646\u064a\u0629\u060c \u0645\u062d\u0648\u0651\u0644\u0629\u064b \u062a\u062d\u0648\u0644\u0627\u064b \u0628\u0627\u0644\u063a \u0627\u0644\u062a\u0639\u0642\u064a\u062f \u0625\u0644\u0649 \u0645\u0646\u0635\u0629 \u062a\u062e\u062f\u0645 \u0645\u0647\u0645\u0629 \u0627\u0644\u0645\u0624\u0633\u0633\u0629 \u0641\u064a \u0631\u0639\u0627\u064a\u0629 \u0627\u0644\u0645\u0631\u0636\u0649.",
    challengeIntro: "The Foundation's mission-critical operations ran on fragmented, manual systems:",
    challengeIntroAr: "\u0643\u0627\u0646\u062a \u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a \u0627\u0644\u062d\u064a\u0648\u064a\u0629 \u0644\u0644\u0645\u0624\u0633\u0633\u0629 \u062a\u0639\u062a\u0645\u062f \u0639\u0644\u0649 \u0623\u0646\u0638\u0645\u0629 \u064a\u062f\u0648\u064a\u0629 \u0648\u0645\u062a\u0634\u0639\u0628\u0629:",
    challengeBullets: ["No single source of truth across hospitals, departments & back office", "Manual, paper-based finance, billing & donation processes", "Manual procurement & inventory \u2014 stockouts, waste, weak cost control", "No real-time visibility into financial or operational performance", "No central platform connecting clinical & third-party systems"],
    challengeBulletsAr: ["\u063a\u064a\u0627\u0628 \u0645\u0635\u062f\u0631 \u0645\u0648\u062d\u0651\u062f \u0644\u0644\u062d\u0642\u064a\u0642\u0629 \u0639\u0628\u0631 \u0627\u0644\u0645\u0633\u062a\u0634\u0641\u064a\u0627\u062a \u0648\u0627\u0644\u0625\u062f\u0627\u0631\u0627\u062a \u0648\u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a \u0627\u0644\u062f\u0627\u062e\u0644\u064a\u0629", "\u0639\u0645\u0644\u064a\u0627\u062a \u0645\u0627\u0644\u064a\u0629 \u0648\u0641\u0648\u062a\u0631\u0629 \u0648\u0645\u0646\u062d \u0648\u0631\u0642\u064a\u0629 \u064a\u062f\u0648\u064a\u0629 \u062a\u064f\u0639\u064a\u0642 \u062f\u0648\u0631\u0629 \u0627\u0644\u0625\u0642\u0641\u0627\u0644 \u0627\u0644\u0645\u062d\u0627\u0633\u0628\u064a", "\u0645\u0634\u062a\u0631\u064a\u0627\u062a \u0648\u0645\u062e\u0632\u0648\u0646 \u064a\u062f\u0648\u064a\u0627\u0646 \u064a\u062a\u0633\u0628\u0628\u0627\u0646 \u0641\u064a \u0646\u0642\u0635 \u0627\u0644\u0645\u062e\u0632\u0648\u0646 \u0648\u0627\u0644\u0647\u062f\u0631 \u0648\u0636\u0639\u0641 \u0636\u0628\u0637 \u0627\u0644\u062a\u0643\u0627\u0644\u064a\u0641", "\u0627\u0646\u0639\u062f\u0627\u0645 \u0627\u0644\u0631\u0624\u064a\u0629 \u0627\u0644\u0641\u0648\u0631\u064a\u0629 \u0644\u0644\u0623\u062f\u0627\u0621 \u0627\u0644\u0645\u0627\u0644\u064a \u0648\u0627\u0644\u062a\u0634\u063a\u064a\u0644\u064a", "\u063a\u064a\u0627\u0628 \u0645\u0646\u0635\u0629 \u0645\u0631\u0643\u0632\u064a\u0629 \u062a\u0631\u0628\u0637 \u0627\u0644\u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u0633\u0631\u064a\u0631\u064a\u0629 \u0648\u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u0623\u0637\u0631\u0627\u0641 \u0627\u0644\u062b\u0627\u0644\u062b\u0629"],
    solutionIntro: "WAVZ engineered a fully integrated, on-premise SAP ecosystem:",
    solutionIntroAr: "\u0647\u0646\u062f\u0633\u062a WAVZ \u0645\u0646\u0638\u0648\u0645\u0629 SAP \u0645\u062a\u0643\u0627\u0645\u0644\u0629 \u0648\u0622\u0645\u0646\u0629 \u0645\u062d\u0644\u064a\u0627\u064b:",
    solutionBullets: ["S/4HANA core unifying finance, procurement & operations", "FICO automation through to audit-ready period-end close", "MM & SD digitizing procurement, inventory & patient billing", "BTP & CPI connecting S/4HANA to SAP CX Cloud & clinical systems", "SAC analytics and SuccessFactors HCM on one governed platform"],
    solutionBulletsAr: ["\u0646\u0648\u0627\u0629 S/4HANA \u062a\u062f\u0645\u062c \u0627\u0644\u0645\u0627\u0644\u064a\u0629 \u0648\u0627\u0644\u0645\u0634\u062a\u0631\u064a\u0627\u062a \u0648\u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a \u0628\u0627\u0644\u0643\u0627\u0645\u0644", "\u0623\u062a\u0645\u062a\u0629 FICO \u062d\u062a\u0649 \u0627\u0644\u0625\u0642\u0641\u0627\u0644 \u0627\u0644\u0645\u0627\u0644\u064a \u0627\u0644\u062c\u0627\u0647\u0632 \u0644\u0644\u062a\u062f\u0642\u064a\u0642", "\u0631\u0642\u0645\u0646\u0629 MM & SD \u0644\u0644\u0645\u0634\u062a\u0631\u064a\u0627\u062a \u0648\u0627\u0644\u0645\u062e\u0632\u0648\u0646 \u0648\u0641\u0648\u062a\u0631\u0629 \u0627\u0644\u0645\u0631\u0636\u0649", "\u0631\u0628\u0637 BTP & CPI \u0644\u0646\u0638\u0627\u0645 S/4HANA \u0628\u0640 SAP CX Cloud \u0648\u0627\u0644\u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u0633\u0631\u064a\u0631\u064a\u0629", "\u062a\u062d\u0644\u064a\u0644\u0627\u062a SAC \u0648\u0625\u062f\u0627\u0631\u0629 SuccessFactors HCM \u0639\u0644\u0649 \u0645\u0646\u0635\u0629 \u0648\u0627\u062d\u062f\u0629 \u0645\u062d\u0643\u0648\u0645\u0629"],
    metrics: [
      { icon: CheckCircle, value: "8", label: "SAP Modules Unified", labelAr: "\u0648\u062d\u062f\u0627\u062a SAP \u0645\u062a\u0643\u0627\u0645\u0644\u0629", color: "#0284C7" },
      { icon: Shield, value: "1", label: "Single Source of Truth", labelAr: "\u0645\u0635\u062f\u0631 \u0645\u0648\u062d\u0651\u062f \u0644\u0644\u062d\u0642\u064a\u0642\u0629", color: "#0284C7" },
      { icon: Clock, value: "100%", label: "On-Premise Data Control", labelAr: "\u0628\u064a\u0627\u0646\u0627\u062a \u0645\u062d\u0644\u064a\u0629 \u0628\u0627\u0644\u0643\u0627\u0645\u0644", color: "#059669" },
      { icon: TrendingUp, value: "4", label: "Core Functions Automated", labelAr: "\u0648\u0638\u0627\u0626\u0641 \u0623\u0633\u0627\u0633\u064a\u0629 \u0645\u0624\u062a\u0645\u062a\u0629", color: "#0284C7" },
    ],
    beforeAfterIntro: "Transformation across every operational dimension \u2014 fragmented activity replaced by one unified, accountable platform:",
    beforeAfterIntroAr: "\u062a\u062d\u0648\u0644 \u0634\u0627\u0645\u0644 \u0641\u064a \u0643\u0644 \u0628\u064f\u0639\u062f \u062a\u0634\u063a\u064a\u0644\u064a \u2014 \u0627\u0644\u0623\u0646\u0634\u0637\u0629 \u0627\u0644\u0645\u062c\u0632\u0623\u0629 \u0641\u064a \u0627\u0644\u0645\u0627\u0636\u064a\u060c \u0648\u0627\u0644\u064a\u0648\u0645 \u0645\u0646\u0635\u0629 \u0645\u0648\u062d\u0651\u062f\u0629 \u0648\u062e\u0627\u0636\u0639\u0629 \u0644\u0644\u0645\u0633\u0627\u0621\u0644\u0629:",
    beforeAfter: [
      {
            "metric": "Financial Close",
            "metricAr": "\u0627\u0644\u0625\u0642\u0641\u0627\u0644 \u0627\u0644\u0645\u0627\u0644\u064a",
            "before": "Manual, paper-based",
            "beforeAr": "\u064a\u062f\u0648\u064a \u0648\u0648\u0631\u0642\u064a",
            "after": "Automated FICO, audit-ready",
            "afterAr": "\u0623\u062a\u0645\u062a\u0629 FICO \u062c\u0627\u0647\u0632\u0629 \u0644\u0644\u062a\u062f\u0642\u064a\u0642",
            "impact": "Faster, reliable close",
            "impactAr": "\u0625\u0642\u0641\u0627\u0644 \u0623\u0633\u0631\u0639 \u0648\u0623\u0643\u062b\u0631 \u0645\u0648\u062b\u0648\u0642\u064a\u0629"
      },
      {
            "metric": "Procurement & Inventory",
            "metricAr": "\u0627\u0644\u0645\u0634\u062a\u0631\u064a\u0627\u062a \u0648\u0627\u0644\u0645\u062e\u0632\u0648\u0646",
            "before": "Manual, no real-time view",
            "beforeAr": "\u064a\u062f\u0648\u064a \u0628\u0644\u0627 \u0631\u0624\u064a\u0629 \u0641\u0648\u0631\u064a\u0629",
            "after": "Real-time MM with batch/expiry tracking",
            "afterAr": "MM \u0622\u0646\u064a\u0629 \u0645\u0639 \u062a\u062a\u0628\u0639 \u0627\u0644\u062f\u064f\u0651\u0641\u0639\u0627\u062a \u0648\u062a\u0648\u0627\u0631\u064a\u062e \u0627\u0644\u0627\u0646\u062a\u0647\u0627\u0621",
            "impact": "Less stockouts & waste",
            "impactAr": "\u0623\u0642\u0644 \u0646\u0642\u0635\u0627\u064b \u0648\u0647\u062f\u0631\u0627\u064b"
      },
      {
            "metric": "Billing & Revenue",
            "metricAr": "\u0627\u0644\u0641\u0648\u062a\u0631\u0629 \u0648\u0627\u0644\u0625\u064a\u0631\u0627\u062f\u0627\u062a",
            "before": "Manual reconciliation",
            "beforeAr": "\u062a\u0633\u0648\u064a\u0627\u062a \u064a\u062f\u0648\u064a\u0629",
            "after": "Automated SD billing tied to finance",
            "afterAr": "SD \u0645\u0624\u062a\u0645\u062a\u0629 \u0645\u0631\u062a\u0628\u0637\u0629 \u0628\u0627\u0644\u0645\u0627\u0644\u064a\u0629",
            "impact": "Real-time revenue visibility",
            "impactAr": "\u0631\u0624\u064a\u0629 \u0641\u0648\u0631\u064a\u0629 \u0644\u0644\u0625\u064a\u0631\u0627\u062f\u0627\u062a"
      },
      {
            "metric": "Reporting & Analytics",
            "metricAr": "\u0627\u0644\u062a\u0642\u0627\u0631\u064a\u0631 \u0648\u0627\u0644\u062a\u062d\u0644\u064a\u0644\u0627\u062a",
            "before": "Manual spreadsheets",
            "beforeAr": "\u062c\u062f\u0627\u0648\u0644 \u0628\u064a\u0627\u0646\u0627\u062a \u064a\u062f\u0648\u064a\u0629",
            "after": "SAC dashboards & planning",
            "afterAr": "\u0644\u0648\u062d\u0627\u062a SAC \u0648\u0623\u062f\u0648\u0627\u062a \u0627\u0644\u062a\u062e\u0637\u064a\u0637",
            "impact": "Data-driven decisions",
            "impactAr": "\u0642\u0631\u0627\u0631\u0627\u062a \u0645\u0628\u0646\u064a\u0629 \u0639\u0644\u0649 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a"
      },
      {
            "metric": "System Integration",
            "metricAr": "\u062a\u0643\u0627\u0645\u0644 \u0627\u0644\u0623\u0646\u0638\u0645\u0629",
            "before": "Disconnected silos",
            "beforeAr": "\u0623\u0646\u0638\u0645\u0629 \u0645\u0639\u0632\u0648\u0644\u0629",
            "after": "CPI-linked S/4HANA, CX Cloud & clinical systems",
            "afterAr": "S/4HANA \u0648 CX Cloud \u0648\u0627\u0644\u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u0633\u0631\u064a\u0631\u064a\u0629 \u0645\u0631\u062a\u0628\u0637\u0629 \u0628\u0640 CPI",
            "impact": "Eliminated data silos",
            "impactAr": "\u0625\u0632\u0627\u0644\u0629 \u0635\u0648\u0627\u0645\u0639 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a"
      },
      {
            "metric": "HR & Workforce",
            "metricAr": "\u0627\u0644\u0645\u0648\u0627\u0631\u062f \u0627\u0644\u0628\u0634\u0631\u064a\u0629",
            "before": "Fragmented HR processes",
            "beforeAr": "\u0639\u0645\u0644\u064a\u0627\u062a \u0645\u0648\u0627\u0631\u062f \u0628\u0634\u0631\u064a\u0629 \u0645\u062c\u0632\u0623\u0629",
            "after": "Unified SuccessFactors lifecycle",
            "afterAr": "\u062f\u0648\u0631\u0629 \u062d\u064a\u0627\u0629 \u0645\u0648\u062d\u0651\u062f\u0629 \u0639\u0628\u0631 SuccessFactors",
            "impact": "One view of the workforce",
            "impactAr": "\u0631\u0624\u064a\u0629 \u0645\u0648\u062d\u0651\u062f\u0629 \u0644\u0644\u0642\u0648\u0649 \u0627\u0644\u0639\u0627\u0645\u0644\u0629"
      }
],
    quote: "\u201cThis engagement is a testament to WAVZ's ability to lead complex, high-impact SAP transformations across non-profit healthcare organizations \u2014 delivering not just technology, but real operational change.\u201d\n\u2014  WAVZ SAP Practice",
    quoteAr: "\"\u062a\u064f\u062c\u0633\u0651\u062f \u0647\u0630\u0647 \u0627\u0644\u062a\u062c\u0631\u0628\u0629 \u0642\u062f\u0631\u0629 WAVZ \u0639\u0644\u0649 \u0642\u064a\u0627\u062f\u0629 \u062a\u062d\u0648\u0644\u0627\u062a SAP \u0628\u0627\u0644\u063a\u0629 \u0627\u0644\u062a\u0623\u062b\u064a\u0631 \u0641\u064a \u0645\u0646\u0638\u0645\u0627\u062a \u0627\u0644\u0631\u0639\u0627\u064a\u0629 \u0627\u0644\u0635\u062d\u064a\u0629 \u063a\u064a\u0631 \u0627\u0644\u0631\u0628\u062d\u064a\u0629 \u2014 \u0625\u0630 \u0644\u0627 \u062a\u0642\u062f\u0651\u0645 \u062a\u0642\u0646\u064a\u0629 \u0641\u062d\u0633\u0628\u060c \u0628\u0644 \u062a\u064f\u062d\u062f\u062b \u062a\u063a\u064a\u064a\u0631\u0627\u064b \u062a\u0634\u063a\u064a\u0644\u064a\u0627\u064b \u062d\u0642\u064a\u0642\u064a\u0627\u064b \u0648\u0645\u0644\u0645\u0648\u0633\u0627\u064b.\"\n\u2014 \u0645\u0645\u0627\u0631\u0633\u0629 SAP \u0641\u064a WAVZ",
    keyDiffs: [
      {
            "icon": "\u25c6",
            "title": "Healthcare-Grade",
            "titleAr": "\u0645\u0639\u064a\u0627\u0631 \u0627\u0644\u0631\u0639\u0627\u064a\u0629 \u0627\u0644\u0635\u062d\u064a\u0629",
            "desc": "Scoped to protect continuity of patient care throughout.",
            "descAr": "\u062a\u062d\u0648\u0644 \u0645\u064f\u0635\u0645\u064e\u0651\u0645 \u0644\u062d\u0645\u0627\u064a\u0629 \u0627\u0633\u062a\u0645\u0631\u0627\u0631\u064a\u0629 \u0631\u0639\u0627\u064a\u0629 \u0627\u0644\u0645\u0631\u0636\u0649 \u062f\u0648\u0646 \u0627\u0646\u0642\u0637\u0627\u0639."
      },
      {
            "icon": "\u25c9",
            "title": "Full-Stack SAP Depth",
            "titleAr": "\u0639\u0645\u0642 SAP \u0627\u0644\u0634\u0627\u0645\u0644",
            "desc": "Finance, procurement, billing, integration, analytics & HR as one platform.",
            "descAr": "\u0627\u0644\u0645\u0627\u0644\u064a\u0629\u060c \u0627\u0644\u0645\u0634\u062a\u0631\u064a\u0627\u062a\u060c \u0627\u0644\u0641\u0648\u062a\u0631\u0629\u060c \u0627\u0644\u062a\u0643\u0627\u0645\u0644\u060c \u0627\u0644\u062a\u062d\u0644\u064a\u0644\u0627\u062a \u0648\u0627\u0644\u0645\u0648\u0627\u0631\u062f \u0627\u0644\u0628\u0634\u0631\u064a\u0629 \u0639\u0644\u0649 \u0645\u0646\u0635\u0629 \u0648\u0627\u062d\u062f\u0629."
      },
      {
            "icon": "\u2191",
            "title": "Integration-First",
            "titleAr": "\u0623\u0648\u0644\u0648\u064a\u0629 \u0627\u0644\u062a\u0643\u0627\u0645\u0644",
            "desc": "SAP BTP & CPI form a governed backbone for clinical systems.",
            "descAr": "\u064a\u0634\u0643\u0651\u0644 SAP BTP & CPI \u0639\u0645\u0648\u062f\u0627\u064b \u0645\u062d\u0643\u0648\u0645\u0627\u064b \u0644\u0644\u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u0633\u0631\u064a\u0631\u064a\u0629 \u0648\u0627\u0644\u0637\u0631\u0641 \u0627\u0644\u062b\u0627\u0644\u062b."
      },
      {
            "icon": "\u2726",
            "title": "Donor-Grade Trust",
            "titleAr": "\u062b\u0642\u0629 \u0627\u0644\u062c\u0647\u0627\u062a \u0627\u0644\u0645\u0627\u0646\u062d\u0629",
            "desc": "Cost-center & reporting built for non-profit accountability.",
            "descAr": "\u0625\u0639\u062f\u0627\u062f \u062a\u0642\u0627\u0631\u064a\u0631 \u0642\u0627\u0626\u0645\u0629 \u0639\u0644\u0649 \u0645\u0631\u0627\u0643\u0632 \u0627\u0644\u062a\u0643\u0644\u0641\u0629 \u0644\u0636\u0645\u0627\u0646 \u0627\u0644\u0634\u0641\u0627\u0641\u064a\u0629 \u0627\u0644\u062a\u064a \u062a\u062a\u0637\u0644\u0628\u0647\u0627 \u0627\u0644\u0645\u0646\u0638\u0645\u0627\u062a \u063a\u064a\u0631 \u0627\u0644\u0631\u0628\u062d\u064a\u0629."
      }
],
    roadmapTitle: "WHAT'S NEXT \u2014 ROADMAP FOR CONTINUED GROWTH",
    roadmapTitleAr: "\u062e\u0627\u0631\u0637\u0629 \u0627\u0644\u0637\u0631\u064a\u0642 \u2014 \u0646\u062d\u0648 \u0646\u0645\u0648 \u0645\u0633\u062a\u062f\u0627\u0645",
    roadmap: [
      {
            "tag": "NEW FACILITIES",
            "tagAr": "\u0645\u0646\u0634\u0622\u062a \u062c\u062f\u064a\u062f\u0629",
            "desc": "Onboard additional hospitals onto the S/4HANA core.",
            "descAr": "\u0636\u0645 \u0645\u0633\u062a\u0634\u0641\u064a\u0627\u062a \u0625\u0636\u0627\u0641\u064a\u0629 \u0625\u0644\u0649 \u0646\u0648\u0627\u0629 S/4HANA \u0627\u0644\u0645\u0648\u062d\u0651\u062f\u0629."
      },
      {
            "tag": "DEEPER ANALYTICS",
            "tagAr": "\u062a\u0639\u0645\u064a\u0642 \u0627\u0644\u062a\u062d\u0644\u064a\u0644\u0627\u062a",
            "desc": "Expand SAC planning & forecasting foundation-wide.",
            "descAr": "\u062a\u0648\u0633\u064a\u0639 \u0645\u0646\u0635\u0629 SAC \u0644\u0644\u062a\u062e\u0637\u064a\u0637 \u0648\u0627\u0644\u062a\u0646\u0628\u0624 \u0639\u0644\u0649 \u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u0645\u0624\u0633\u0633\u0629."
      },
      {
            "tag": "CLINICAL EXPANSION",
            "tagAr": "\u0627\u0644\u062a\u0648\u0633\u0639 \u0627\u0644\u0633\u0631\u064a\u0631\u064a",
            "desc": "Connect more clinical & lab systems via CPI.",
            "descAr": "\u0631\u0628\u0637 \u0627\u0644\u0645\u0632\u064a\u062f \u0645\u0646 \u0627\u0644\u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u0633\u0631\u064a\u0631\u064a\u0629 \u0648\u0645\u062e\u062a\u0628\u0631\u0627\u062a \u0627\u0644\u062a\u0634\u062e\u064a\u0635 \u0639\u0628\u0631 CPI."
      },
      {
            "tag": "AUTOMATION",
            "tagAr": "\u0627\u0644\u0623\u062a\u0645\u062a\u0629",
            "desc": "Extend BTP apps for foundation-specific workflows.",
            "descAr": "\u062a\u0648\u0633\u064a\u0639 \u062a\u0637\u0628\u064a\u0642\u0627\u062a BTP \u0644\u062a\u062f\u0639\u0645 \u0633\u064a\u0631 \u0627\u0644\u0639\u0645\u0644 \u0627\u0644\u062e\u0627\u0635 \u0628\u0627\u0644\u0645\u0624\u0633\u0633\u0629."
      }
],
    closingText: "Engineered for non-profit excellence.  WAVZ is the Foundation's technology partner in turning operational complexity into mission-driven impact.",
    closingTextAr: "\u0645\u064f\u0635\u0645\u064e\u0651\u0645 \u0644\u062a\u062d\u0642\u064a\u0642 \u0627\u0644\u062a\u0645\u064a\u0651\u0632 \u063a\u064a\u0631 \u0627\u0644\u0631\u0628\u062d\u064a.  WAVZ \u0647\u064a \u0627\u0644\u0634\u0631\u064a\u0643 \u0627\u0644\u062a\u0642\u0646\u064a \u0644\u0644\u0645\u0624\u0633\u0633\u0629 \u0641\u064a \u062a\u062d\u0648\u064a\u0644 \u0627\u0644\u062a\u0639\u0642\u064a\u062f \u0627\u0644\u062a\u0634\u063a\u064a\u0644\u064a \u0625\u0644\u0649 \u0623\u062b\u0631 \u062d\u0642\u064a\u0642\u064a \u064a\u062e\u062f\u0645 \u0645\u0647\u0645\u062a\u0647\u0627 \u0627\u0644\u0625\u0646\u0633\u0627\u0646\u064a\u0629.",
  },
  {
    id: "leading-bank-sap",
    client: "A Leading Egyptian Bank",
    clientAr: "\u0628\u0646\u0643 \u0645\u0635\u0631\u064a \u0631\u0627\u0626\u062f",
    subtitle: "SAP Transformation Program",
    subtitleAr: "\u0627\u0644\u062a\u062d\u0648\u0644 \u0627\u0644\u0645\u0624\u0633\u0633\u064a \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0623\u0646\u0638\u0645\u0647 \u0625\u062f\u0627\u0631\u0629 \u0645\u0648\u0627\u0631\u062f \u0627\u0644\u0645\u0624\u0633\u0633\u0627\u062a",
    industry: "Banking & Financial Services",
    industryAr: "\u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0645\u0635\u0631\u0641\u064a\u0629 \u0648\u0627\u0644\u0645\u0627\u0644\u064a\u0629",
    region: "Egypt",
    regionAr: "\u0645\u0635\u0631",
    scope: "SAP FICO \u00b7 MM \u00b7 PS + T24 Integration",
    scopeAr: "SAP FICO \u00b7 MM \u00b7 PS \u0645\u062a\u0643\u0627\u0645\u0644 \u0645\u0639 \u0623\u0646\u0638\u0645\u0647 T24",
    color: "#059669",
    bgGradient: "linear-gradient(135deg, #022c22 0%, #064e3b 100%)",
    tagColor: "rgba(5,150,105,0.12)",
    tagBorder: "rgba(5,150,105,0.3)",
    tagText: "#059669",
    headline: "From Paper to Platform \u2014 A Bank-Wide SAP Transformation for Compliance, Speed & Scale",
    headlineAr: "\u0645\u0646 \u0627\u0644\u0648\u0631\u0642 \u0625\u0644\u0649 \u0627\u0644\u0645\u0646\u0635\u0651\u0629 \u0627\u0644\u0631\u0642\u0645\u064a\u0629 \u2014 \u062a\u062d\u0648\u0651\u0644 \u0634\u0627\u0645\u0644 \u0644\u0644\u0646\u0638\u0645 \u0627\u0644\u0645\u0627\u0644\u064a\u0647 \u0648\u0627\u0644\u0631\u0642\u0627\u0628\u064a\u0647 \u0648\u0646\u0638\u0645 \u0645\u0631\u0627\u0642\u0628\u0647 \u0627\u0644\u0645\u0634\u062a\u0631\u064a\u0627\u062a \u0648\u0627\u0644\u062a\u0643\u0627\u0644\u064a\u0641 \u0648\u062f\u0648\u0631\u0647 \u0627\u0644\u0645\u0634\u0627\u0631\u064a\u0639 \u0627\u0644\u062a\u0643\u0627\u0644\u064a\u0641 \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0646\u0638\u0645 SAP \u0644\u0636\u0628\u0637 \u0627\u0644\u062d\u0648\u0643\u0645\u0647 \u0648\u062a\u062d\u0642\u064a\u0642 \u0627\u0644\u062a\u0648\u0633\u0651\u0639 \u0627\u0644\u0633\u0631\u064a\u0639",
    summary: "WAVZ partnered with a leading Egyptian bank to deliver a bank-wide SAP transformation \u2014 replacing legacy paper-based operations with a fully automated, integrated enterprise platform. Spanning Finance (FICO), Procurement (MM), and Project Systems, and tightly integrated with the T24 core banking system, the program eliminated manual reconciliation, delivered real-time executive visibility, and aligned reporting with Central Bank of Egypt (CBE) compliance standards \u2014 modernizing the bank's operating model and lowering operational risk.",
    summaryAr: "\u062a\u0639\u0627\u0648\u0646\u062a WAVZ \u0645\u0639 \u0628\u0646\u0643 \u0645\u0635\u0631\u064a \u0631\u0627\u0626\u062f \u0644\u062a\u0646\u0641\u064a\u0630 \u0628\u0631\u0646\u0627\u0645\u062c \u062a\u062d\u0648\u0651\u0644 \u0634\u0627\u0645\u0644 \u0642\u0627\u0626\u0645 \u0639\u0644\u0649 SAP \u0639\u0644\u0649 \u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u0628\u0646\u0643\u060c \u0627\u0633\u062a\u0628\u062f\u0644 \u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a \u0627\u0644\u0648\u0631\u0642\u064a\u0629 \u0627\u0644\u062a\u0642\u0644\u064a\u062f\u064a\u0629 \u0628\u0645\u0646\u0635\u0651\u0629 \u0645\u0624\u0633\u0633\u064a\u0629 \u0645\u062a\u0643\u0627\u0645\u0644\u0629 \u0648\u0622\u0644\u064a\u0629 \u0628\u0627\u0644\u0643\u0627\u0645\u0644. \u0648\u0634\u0645\u0644 \u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062c \u0648\u062d\u062f\u0627\u062a \u0627\u0644\u0645\u0627\u0644\u064a\u0629 (FICO) \u0648\u0627\u0644\u0645\u0634\u062a\u0631\u064a\u0627\u062a (MM) \u0648\u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u0645\u0634\u0627\u0631\u064a\u0639 (Project Systems)\u060c \u0645\u0639 \u062a\u0643\u0627\u0645\u0644 \u0648\u062b\u064a\u0642 \u0645\u0639 \u0646\u0638\u0627\u0645 \u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0645\u0635\u0631\u0641\u064a\u0629 \u0627\u0644\u0623\u0633\u0627\u0633\u064a T24\u060c \u0644\u064a\u064f\u0644\u063a\u064a \u0639\u0645\u0644\u064a\u0627\u062a \u0627\u0644\u062a\u0633\u0648\u064a\u0629 \u0627\u0644\u064a\u062f\u0648\u064a\u0629\u060c \u0648\u064a\u0648\u0641\u0651\u0631 \u0631\u0624\u064a\u0629 \u062a\u0646\u0641\u064a\u0630\u064a\u0629 \u0641\u0648\u0631\u064a\u0629 \u0644\u0644\u0628\u064a\u0627\u0646\u0627\u062a\u060c \u0648\u064a\u0648\u0627\u0643\u0628 \u0645\u062a\u0637\u0644\u0628\u0627\u062a \u0627\u0644\u0627\u0645\u062a\u062b\u0627\u0644 \u0627\u0644\u0635\u0627\u062f\u0631\u0629 \u0639\u0646 \u0627\u0644\u0628\u0646\u0643 \u0627\u0644\u0645\u0631\u0643\u0632\u064a \u0627\u0644\u0645\u0635\u0631\u064a (CBE) \u2014 \u0628\u0645\u0627 \u064a\u064f\u062d\u062f\u0651\u062b \u0646\u0645\u0648\u0630\u062c \u0627\u0644\u062a\u0634\u063a\u064a\u0644 \u0641\u064a \u0627\u0644\u0628\u0646\u0643 \u0648\u064a\u062d\u062f\u0651 \u0645\u0646 \u0627\u0644\u0645\u062e\u0627\u0637\u0631 \u0627\u0644\u062a\u0634\u063a\u064a\u0644\u064a\u0629.",
    challengeIntro: "A bank running on paper in a digital age \u2014 needing a partner to lead full-scale transformation:",
    challengeIntroAr: "\u0628\u0646\u0643 \u064a\u0639\u0645\u0644 \u0628\u0646\u0638\u0627\u0645 \u0648\u0631\u0642\u064a \u0641\u064a \u0639\u0635\u0631 \u0631\u0642\u0645\u064a \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u2014 \u0648\u0643\u0627\u0646 \u0628\u062d\u0627\u062c\u0629 \u0625\u0644\u0649 \u0634\u0631\u064a\u0643 \u064a\u0642\u0648\u062f \u062a\u062d\u0648\u0651\u0644\u064b\u0627 \u0634\u0627\u0645\u0644\u064b\u0627:",
    challengeBullets: ["Fully manual transactions across finance, procurement & sales", "No real-time visibility into financial or operational KPIs", "Rising CBE audit & regulatory compliance pressure", "Disconnected core banking and back-office systems", "Heavy human dependence on workflows that should be automated"],
    challengeBulletsAr: ["\u0645\u0639\u0627\u0645\u0644\u0627\u062a \u064a\u062f\u0648\u064a\u0629 \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u0641\u064a \u0627\u0644\u0645\u0627\u0644\u064a\u0629 \u0648\u0627\u0644\u0645\u0634\u062a\u0631\u064a\u0627\u062a \u0648\u0627\u0644\u0645\u0628\u064a\u0639\u0627\u062a", "\u063a\u064a\u0627\u0628 \u0627\u0644\u0631\u0624\u064a\u0629 \u0627\u0644\u0641\u0648\u0631\u064a\u0629 \u0644\u0645\u0624\u0634\u0631\u0627\u062a \u0627\u0644\u0623\u062f\u0627\u0621 \u0627\u0644\u0645\u0627\u0644\u064a\u0629 \u0648\u0627\u0644\u062a\u0634\u063a\u064a\u0644\u064a\u0629", "\u062a\u0635\u0627\u0639\u062f \u0636\u063a\u0648\u0637 \u0627\u0644\u062a\u062f\u0642\u064a\u0642 \u0648\u0627\u0644\u0627\u0645\u062a\u062b\u0627\u0644 \u0627\u0644\u062a\u0646\u0638\u064a\u0645\u064a \u0648\u0641\u0642 \u0645\u062a\u0637\u0644\u0628\u0627\u062a \u0627\u0644\u0628\u0646\u0643 \u0627\u0644\u0645\u0631\u0643\u0632\u064a \u0627\u0644\u0645\u0635\u0631\u064a", "\u0627\u0646\u0641\u0635\u0627\u0644 \u0627\u0644\u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u0645\u0635\u0631\u0641\u064a\u0629 \u0627\u0644\u0623\u0633\u0627\u0633\u064a\u0629 \u0639\u0646 \u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a \u0627\u0644\u062f\u0627\u062e\u0644\u064a\u0629", "\u0627\u0639\u062a\u0645\u0627\u062f \u0643\u0628\u064a\u0631 \u0639\u0644\u0649 \u062a\u062f\u062e\u0651\u0644 \u0628\u0634\u0631\u064a \u0641\u064a \u0645\u0633\u0627\u0631\u0627\u062a \u0639\u0645\u0644 \u064a\u0646\u0628\u063a\u064a \u0623\u062a\u0645\u062a\u062a\u0647\u0627"],
    solutionIntro: "WAVZ delivered an end-to-end SAP ecosystem engineered for banking:",
    solutionIntroAr: "\u0642\u062f\u0651\u0645\u062a WAVZ \u0645\u0646\u0638\u0648\u0645\u0629 SAP \u0645\u062a\u0643\u0627\u0645\u0644\u0629 \u0645\u0646 \u0627\u0644\u0628\u062f\u0627\u064a\u0629 \u0625\u0644\u0649 \u0627\u0644\u0646\u0647\u0627\u064a\u0629\u060c \u0645\u0635\u0645\u0651\u0645\u0629 \u062e\u0635\u064a\u0635\u064b\u0627 \u0644\u0644\u0642\u0637\u0627\u0639 \u0627\u0644\u0645\u0635\u0631\u0641\u064a:",
    solutionBullets: ["SAP FICO \u2014 automated financial cycle & real-time controlling", "SAP MM \u2014 digital procurement & vendor governance", "SAP Project Systems \u2014 full lifecycle cost & timeline control", "Real-time SAP \u2194 T24 core banking integration", "CBE-aligned cost centers, profit centers & audit trails"],
    solutionBulletsAr: ["SAP FICO \u2014 \u0623\u062a\u0645\u062a\u0629 \u0627\u0644\u062f\u0648\u0631\u0629 \u0627\u0644\u0645\u0627\u0644\u064a\u0629 \u0648\u0627\u0644\u0631\u0642\u0627\u0628\u0629 \u0627\u0644\u0645\u0627\u0644\u064a\u0629 \u0627\u0644\u0641\u0648\u0631\u064a\u0629", "SAP MM \u2014 \u0645\u0634\u062a\u0631\u064a\u0627\u062a \u0631\u0642\u0645\u064a\u0629 \u0648\u062d\u0648\u0643\u0645\u0629 \u0641\u0639\u0651\u0627\u0644\u0629 \u0644\u0644\u0645\u0648\u0631\u062f\u064a\u0646", "SAP Project Systems \u2014 \u0636\u0628\u0637 \u0643\u0627\u0645\u0644 \u0644\u0644\u062a\u0643\u0627\u0644\u064a\u0641 \u0648\u0627\u0644\u062c\u062f\u0648\u0644 \u0627\u0644\u0632\u0645\u0646\u064a \u0639\u0628\u0631 \u062f\u0648\u0631\u0629 \u062d\u064a\u0627\u0629 \u0627\u0644\u0645\u0634\u0631\u0648\u0639", "\u062a\u0643\u0627\u0645\u0644 \u0641\u0648\u0631\u064a \u0628\u064a\u0646 SAP \u0648\u0646\u0638\u0627\u0645 T24 \u0627\u0644\u0645\u0635\u0631\u0641\u064a \u0627\u0644\u0623\u0633\u0627\u0633\u064a", "\u0645\u0631\u0627\u0643\u0632 \u062a\u0643\u0644\u0641\u0629 \u0648\u0631\u0628\u062d\u064a\u0629 \u0648\u0645\u0633\u0627\u0631\u0627\u062a \u062a\u062f\u0642\u064a\u0642 \u0645\u062a\u0648\u0627\u0641\u0642\u0629 \u0645\u0639 \u0645\u062a\u0637\u0644\u0628\u0627\u062a \u0627\u0644\u0628\u0646\u0643 \u0627\u0644\u0645\u0631\u0643\u0632\u064a \u0627\u0644\u0645\u0635\u0631\u064a"],
    metrics: [
      { icon: TrendingUp, value: "100%", label: "Automated Workflows", labelAr: "\u0623\u062a\u0645\u062a\u0629 \u0643\u0627\u0645\u0644\u0629 \u0644\u0645\u0633\u0627\u0631\u0627\u062a \u0627\u0644\u0639\u0645\u0644", color: "#059669" },
      { icon: CheckCircle, value: "3 Modules", label: "FICO \u00b7 MM \u00b7 PS Live", labelAr: "\u0648\u062d\u062f\u0627\u062a \u062a\u0634\u063a\u064a\u0644 FICO \u00b7 MM \u00b7 PS", color: "#059669" },
      { icon: Shield, value: "CBE", label: "Audit-Ready Reporting", labelAr: "\u062a\u0642\u0627\u0631\u064a\u0631 \u062c\u0627\u0647\u0632\u0629 \u0644\u0644\u062a\u062f\u0642\u064a\u0642", color: "#1173BD" },
      { icon: BarChart3, value: "SAP \u2194 T24", label: "Unified Data Backbone", labelAr: "\u0628\u0646\u064a\u0629 \u0628\u064a\u0627\u0646\u0627\u062a \u0645\u0648\u062d\u0651\u062f\u0629", color: "#059669" },
    ],
    beforeAfterIntro: "Transformation across every operational dimension \u2014 paper-based, fragmented activity replaced by a unified, automated, audit-ready enterprise platform:",
    beforeAfterIntroAr: "\u062a\u062d\u0648\u0651\u0644 \u0634\u0645\u0644 \u0643\u0644 \u0628\u064f\u0639\u062f \u062a\u0634\u063a\u064a\u0644\u064a \u0641\u064a \u0627\u0644\u0628\u0646\u0643 \u2014 \u062d\u064a\u062b \u062d\u0644\u0651\u062a \u0645\u0646\u0635\u0651\u0629 \u0645\u0624\u0633\u0633\u064a\u0629 \u0645\u0648\u062d\u0651\u062f\u0629 \u0648\u0622\u0644\u064a\u0629 \u0648\u062c\u0627\u0647\u0632\u0629 \u0644\u0644\u062a\u062f\u0642\u064a\u0642 \u0645\u062d\u0644 \u0623\u0646\u0634\u0637\u0629 \u0648\u0631\u0642\u064a\u0629 \u0645\u062c\u0632\u0651\u0623\u0629:",
    beforeAfter: [
      {
            "metric": "Financial Operations",
            "metricAr": "\u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a \u0627\u0644\u0645\u0627\u0644\u064a\u0629",
            "before": "Manual & paper-based",
            "beforeAr": "\u064a\u062f\u0648\u064a\u0629 \u0648\u0648\u0631\u0642\u064a\u0629",
            "after": "End-to-end automated",
            "afterAr": "\u0622\u0644\u064a\u0629 \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u0645\u0646 \u0627\u0644\u0628\u062f\u0627\u064a\u0629 \u0625\u0644\u0649 \u0627\u0644\u0646\u0647\u0627\u064a\u0629",
            "impact": "Errors & delays eliminated",
            "impactAr": "\u0627\u0644\u0642\u0636\u0627\u0621 \u0639\u0644\u0649 \u0627\u0644\u0623\u062e\u0637\u0627\u0621 \u0648\u0627\u0644\u062a\u0623\u062e\u064a\u0631"
      },
      {
            "metric": "Reconciliation",
            "metricAr": "\u0627\u0644\u062a\u0633\u0648\u064a\u0629",
            "before": "Manual SAP \u2194 core",
            "beforeAr": "\u062a\u0633\u0648\u064a\u0629 \u064a\u062f\u0648\u064a\u0629 \u0628\u064a\u0646 SAP \u0648\u0627\u0644\u0646\u0638\u0627\u0645 \u0627\u0644\u0623\u0633\u0627\u0633\u064a",
            "after": "Real-time integration",
            "afterAr": "\u062a\u0643\u0627\u0645\u0644 \u0641\u0648\u0631\u064a",
            "impact": "Single source of truth",
            "impactAr": "\u0645\u0635\u062f\u0631 \u0628\u064a\u0627\u0646\u0627\u062a \u0645\u0648\u062d\u0651\u062f \u0648\u0645\u0648\u062b\u0648\u0642"
      },
      {
            "metric": "Reporting",
            "metricAr": "\u0627\u0644\u062a\u0642\u0627\u0631\u064a\u0631",
            "before": "Lagging & fragmented",
            "beforeAr": "\u0645\u062a\u0623\u062e\u0631\u0629 \u0648\u0645\u062c\u0632\u0651\u0623\u0629",
            "after": "Live dashboards",
            "afterAr": "\u0644\u0648\u062d\u0627\u062a \u0628\u064a\u0627\u0646\u0627\u062a \u0644\u062d\u0638\u064a\u0629",
            "impact": "Evidence-based decisions",
            "impactAr": "\u0642\u0631\u0627\u0631\u0627\u062a \u0645\u0633\u062a\u0646\u062f\u0629 \u0625\u0644\u0649 \u0628\u064a\u0627\u0646\u0627\u062a \u062f\u0642\u064a\u0642\u0629"
      },
      {
            "metric": "CBE Compliance",
            "metricAr": "\u0627\u0644\u0627\u0645\u062a\u062b\u0627\u0644 \u0644\u0644\u0628\u0646\u0643 \u0627\u0644\u0645\u0631\u0643\u0632\u064a",
            "before": "Audit-trail gaps",
            "beforeAr": "\u062b\u063a\u0631\u0627\u062a \u0641\u064a \u0645\u0633\u0627\u0631\u0627\u062a \u0627\u0644\u062a\u062f\u0642\u064a\u0642",
            "after": "Structured & on-demand",
            "afterAr": "\u0645\u0633\u0627\u0631\u0627\u062a \u062a\u062f\u0642\u064a\u0642 \u0645\u0646\u0638\u0645\u0629 \u0648\u0641\u0648\u0631\u064a\u0629 \u0639\u0646\u062f \u0627\u0644\u0637\u0644\u0628",
            "impact": "Audit-ready by default",
            "impactAr": "\u062c\u0627\u0647\u0632\u064a\u0629 \u062f\u0627\u0626\u0645\u0629 \u0644\u0644\u062a\u062f\u0642\u064a\u0642"
      },
      {
            "metric": "Procurement",
            "metricAr": "\u0627\u0644\u0645\u0634\u062a\u0631\u064a\u0627\u062a",
            "before": "Paper approvals",
            "beforeAr": "\u0627\u0639\u062a\u0645\u0627\u062f\u0627\u062a \u0648\u0631\u0642\u064a\u0629",
            "after": "Digital workflows",
            "afterAr": "\u0645\u0633\u0627\u0631\u0627\u062a \u0639\u0645\u0644 \u0631\u0642\u0645\u064a\u0629",
            "impact": "Policy enforced at speed",
            "impactAr": "\u062a\u0637\u0628\u064a\u0642 \u0627\u0644\u0633\u064a\u0627\u0633\u0627\u062a \u0628\u0633\u0631\u0639\u0629"
      },
      {
            "metric": "Project Costs",
            "metricAr": "\u062a\u0643\u0627\u0644\u064a\u0641 \u0627\u0644\u0645\u0634\u0627\u0631\u064a\u0639",
            "before": "Manual reconciliation",
            "beforeAr": "\u062a\u0633\u0648\u064a\u0629 \u064a\u062f\u0648\u064a\u0629",
            "after": "Integrated controlling",
            "afterAr": "\u0631\u0642\u0627\u0628\u0629 \u0645\u0627\u0644\u064a\u0629 \u0645\u062a\u0643\u0627\u0645\u0644\u0629",
            "impact": "Bounded financial risk",
            "impactAr": "\u0645\u062e\u0627\u0637\u0631 \u0645\u0627\u0644\u064a\u0629 \u0645\u062d\u062f\u0648\u062f\u0629 \u0648\u0645\u0636\u0628\u0648\u0637\u0629"
      }
],
    quote: "\u201c From paper-based operations to a fully automated, CBE-compliant enterprise \u2014 WAVZ turned a regulated bank into a digitally-native operating model in a single integrated program. \u201d",
    quoteAr: "",
    keyDiffs: [
      {
            "icon": "\u25c6",
            "title": "Banking-Grade",
            "titleAr": "\u0628\u0645\u0639\u0627\u064a\u064a\u0631 \u0645\u0635\u0631\u0641\u064a\u0629",
            "desc": "Designed for regulated financial services from day one \u2014 not a generic ERP retrofit.",
            "descAr": "\u0645\u0635\u0645\u0651\u0645 \u062e\u0635\u064a\u0635\u064b\u0627 \u0644\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0645\u0627\u0644\u064a\u0629 \u0627\u0644\u062e\u0627\u0636\u0639\u0629 \u0644\u0644\u062a\u0646\u0638\u064a\u0645 \u0645\u0646\u0630 \u0627\u0644\u064a\u0648\u0645 \u0627\u0644\u0623\u0648\u0644 \u2014 \u0648\u0644\u064a\u0633 \u0645\u062c\u0631\u062f \u062a\u062d\u062f\u064a\u062b \u0639\u0627\u0645 \u0644\u0646\u0638\u0627\u0645 \u062a\u062e\u0637\u064a\u0637 \u0627\u0644\u0645\u0648\u0627\u0631\u062f."
      },
      {
            "icon": "\u25c9",
            "title": "T24-Integrated",
            "titleAr": "\u0645\u062a\u0643\u0627\u0645\u0644 \u0645\u0639 T24",
            "desc": "Real-time, two-way data flow between SAP and core banking \u2014 no reconciliation tax.",
            "descAr": "\u062a\u0628\u0627\u062f\u0644 \u0628\u064a\u0627\u0646\u0627\u062a \u0641\u0648\u0631\u064a \u0648\u062b\u0646\u0627\u0626\u064a \u0627\u0644\u0627\u062a\u062c\u0627\u0647 \u0628\u064a\u0646 SAP \u0648\u0627\u0644\u0646\u0638\u0627\u0645 \u0627\u0644\u0645\u0635\u0631\u0641\u064a \u0627\u0644\u0623\u0633\u0627\u0633\u064a \u2014 \u062f\u0648\u0646 \u0623\u064a \u0639\u0628\u0621 \u062a\u0633\u0648\u064a\u0629 \u0625\u0636\u0627\u0641\u064a."
      },
      {
            "icon": "\u2191",
            "title": "Compliance by Design",
            "titleAr": "\u0627\u0644\u0627\u0645\u062a\u062b\u0627\u0644 \u0644\u0646\u0638\u0645 \u0627\u0644\u062d\u0648\u0643\u0645\u0647",
            "desc": "Cost & profit center structures aligned with CBE reporting from the foundation up.",
            "descAr": "\u0628\u0646\u064a\u0629 \u0645\u0631\u0627\u0643\u0632 \u0627\u0644\u062a\u0643\u0644\u0641\u0629 \u0648\u0627\u0644\u0631\u0628\u062d\u064a\u0629 \u0645\u062a\u0648\u0627\u0641\u0642\u0629 \u0645\u0639 \u0645\u062a\u0637\u0644\u0628\u0627\u062a \u062a\u0642\u0627\u0631\u064a\u0631 \u0627\u0644\u0628\u0646\u0643 \u0627\u0644\u0645\u0631\u0643\u0632\u064a \u0627\u0644\u0645\u0635\u0631\u064a \u0645\u0646\u0630 \u0627\u0644\u0623\u0633\u0627\u0633."
      },
      {
            "icon": "\u2726",
            "title": "Transformation, Not IT",
            "titleAr": "\u062a\u062d\u0648\u0651\u0644 \u062d\u0642\u064a\u0642\u064a\u060c \u0644\u0627 \u062a\u0642\u0646\u064a\u0629 \u0641\u0642\u0637",
            "desc": "Process redesign delivered alongside the technical build \u2014 automation that sticks.",
            "descAr": "\u0625\u0639\u0627\u062f\u0629 \u062a\u0635\u0645\u064a\u0645 \u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a \u0625\u0644\u0649 \u062c\u0627\u0646\u0628 \u0627\u0644\u0628\u0646\u0627\u0621 \u0627\u0644\u062a\u0642\u0646\u064a \u2014 \u0623\u062a\u0645\u062a\u0629 \u062a\u062f\u0648\u0645 \u0648\u062a\u062a\u0631\u0633\u0651\u062e."
      }
],
    roadmapTitle: "WHAT'S NEXT \u2014 THE ROADMAP",
    roadmapTitleAr: "\u0645\u0627 \u0647\u0648 \u0627\u0644\u0642\u0627\u062f\u0645 \u2014 \u062e\u0627\u0631\u0637\u0629 \u0627\u0644\u0637\u0631\u064a\u0642",
    roadmap: [
      {
            "tag": "SCALE",
            "tagAr": "\u0627\u0644\u062a\u0648\u0633\u0651\u0639",
            "desc": "Extend SAP modules to additional bank operations & subsidiaries.",
            "descAr": "\u062a\u0645\u062f\u064a\u062f \u0648\u062d\u062f\u0627\u062a SAP \u0625\u0644\u0649 \u0639\u0645\u0644\u064a\u0627\u062a \u0648\u0634\u0631\u0643\u0627\u062a \u062a\u0627\u0628\u0639\u0629 \u0625\u0636\u0627\u0641\u064a\u0629 \u0644\u0644\u0628\u0646\u0643."
      },
      {
            "tag": "ANALYTICS",
            "tagAr": "\u0627\u0644\u062a\u062d\u0644\u064a\u0644\u0627\u062a",
            "desc": "Layer advanced reporting & BI on the unified SAP\u2013T24 data backbone.",
            "descAr": "\u0625\u0636\u0627\u0641\u0629 \u062a\u0642\u0627\u0631\u064a\u0631 \u0645\u062a\u0642\u062f\u0645\u0629 \u0648\u0630\u0643\u0627\u0621 \u0623\u0639\u0645\u0627\u0644 \u0639\u0644\u0649 \u0627\u0644\u0628\u0646\u064a\u0629 \u0627\u0644\u0645\u0648\u062d\u0651\u062f\u0629 \u0644\u0628\u064a\u0627\u0646\u0627\u062a SAP\u2013T24."
      },
      {
            "tag": "AUTOMATION",
            "tagAr": "\u0627\u0644\u0623\u062a\u0645\u062a\u0629",
            "desc": "RPA & AI for high-volume finance and procurement workflows.",
            "descAr": "\u062a\u0637\u0628\u064a\u0642 RPA \u0648\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0639\u0644\u0649 \u0645\u0633\u0627\u0631\u0627\u062a \u0627\u0644\u0639\u0645\u0644 \u0627\u0644\u0645\u0627\u0644\u064a\u0629 \u0648\u0627\u0644\u0634\u0631\u0627\u0626\u064a\u0629 \u0630\u0627\u062a \u0627\u0644\u062d\u062c\u0645 \u0627\u0644\u0643\u0628\u064a\u0631."
      },
      {
            "tag": "COMPLIANCE",
            "tagAr": "\u0627\u0644\u062d\u0648\u0643\u0645\u0647",
            "desc": "Continuous alignment with evolving CBE & sector regulations.",
            "descAr": "\u0645\u0648\u0627\u0643\u0628\u0629 \u0645\u0633\u062a\u0645\u0631\u0629 \u0644\u062a\u0637\u0648\u0651\u0631\u0627\u062a \u062a\u0646\u0638\u064a\u0645\u0627\u062a \u0627\u0644\u0628\u0646\u0643 \u0627\u0644\u0645\u0631\u0643\u0632\u064a \u0627\u0644\u0645\u0635\u0631\u064a \u0648\u0627\u0644\u0642\u0637\u0627\u0639."
      }
],
    closingText: "",
    closingTextAr: "",
  },
  {
    id: "national-entity-ccc",
    client: "A Major National Government Entity",
    clientAr: "\u0645\u0624\u0633\u0633\u0647 \u062d\u0643\u0648\u0645\u064a\u0629 \u0648\u0637\u0646\u064a\u0629 \u0643\u0628\u0631\u0649",
    subtitle: "Command & Control Center",
    subtitleAr: "\u0645\u0631\u0643\u0632 \u0627\u0644\u0642\u064a\u0627\u062f\u0647 \u0648\u0627\u0644\u062a\u062d\u0643\u0645",
    industry: "Governmental & Public Services",
    industryAr: "\u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0639\u0627\u0645\u0629",
    region: "Egypt \u2013 Nationwide",
    regionAr: "\u062c\u0645\u0647\u0648\u0631\u064a\u0629 \u0645\u0635\u0631 \u0627\u0644\u0639\u0631\u0628\u064a\u0629 \u2014 \u0639\u0644\u0649 \u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u062c\u0645\u0647\u0648\u0631\u064a\u0629",
    scope: "Managed Services Operations",
    scopeAr: "\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0623\u0645\u0646 \u0627\u0644\u0645\u064f\u062f\u0627\u0631\u0629",
    color: "#1173BD",
    bgGradient: "linear-gradient(135deg, #061E31 0%, #0d3a6e 100%)",
    tagColor: "rgba(17,115,189,0.12)",
    tagBorder: "rgba(17,115,189,0.3)",
    tagText: "#1173BD",
    headline: "Securing 3,300+ Branches with a Nationwide 24/7 Command & Control Center",
    headlineAr: "\u062a\u0623\u0645\u064a\u0646 \u0623\u0643\u062b\u0631 \u0645\u0646 3,300 \u0641\u0631\u0639 \u0639\u0628\u0631 \u0645\u0631\u0643\u0632 \u0642\u064a\u0627\u062f\u0629 \u0648\u062a\u062d\u0643\u0645 \u0648\u0637\u0646\u064a \u064a\u0639\u0645\u0644 \u0639\u0644\u0649 \u0645\u062f\u0627\u0631 \u0627\u0644\u0633\u0627\u0639\u0629",
    summary: "WAVZ designed and operates a centralized Command & Control Center (CCC) delivering 24/7 nationwide security operations for a major national government entity \u2014 supervising 30,000+ devices across 3,300+ branches, processing ~103 alerts daily, and coordinating directly with Najda emergency services. Result: theft incidents collapsed to just 1\u20132 cases per year, with audit-ready governance built for national scale.",
    summaryAr: "\u0635\u0645\u0651\u0645\u062a WAVZ \u0648\u062a\u064f\u0634\u063a\u0651\u0644 \u0645\u0631\u0643\u0632 \u0642\u064a\u0627\u062f\u0629 \u0648\u062a\u062d\u0643\u0645 \u0645\u0631\u0643\u0632\u064a\u0627\u064b (CCC) \u064a\u0642\u062f\u0651\u0645 \u0639\u0645\u0644\u064a\u0627\u062a \u0623\u0645\u0646 \u0648\u0637\u0646\u064a\u0629 \u0639\u0644\u0649 \u0645\u062f\u0627\u0631 \u0627\u0644\u0633\u0627\u0639\u0629 \u0644\u062c\u0647\u0629 \u062d\u0643\u0648\u0645\u064a\u0629 \u0648\u0637\u0646\u064a\u0629 \u0643\u0628\u0631\u0649 \u2014 \u0628\u0625\u0634\u0631\u0627\u0641 \u0639\u0644\u0649 \u0623\u0643\u062b\u0631 \u0645\u0646 30,000 \u062c\u0647\u0627\u0632 \u0645\u0648\u0632\u0651\u0639\u064a\u0646 \u0639\u0644\u0649 \u0623\u0643\u062b\u0631 \u0645\u0646 3,300 \u0641\u0631\u0639\u060c \u0648\u0645\u0639\u0627\u0644\u062c\u0629 \u0646\u062d\u0648 103 \u062a\u0646\u0628\u064a\u0647\u0627\u062a \u064a\u0648\u0645\u064a\u0627\u064b\u060c \u0648\u0628\u062a\u0646\u0633\u064a\u0642 \u0645\u0628\u0627\u0634\u0631 \u0645\u0639 \u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0637\u0648\u0627\u0631\u0626 \u0628\u0646\u062c\u062f\u0629 \u0648\u0632\u0627\u0631\u0629 \u0627\u0644\u062f\u0627\u062e\u0644\u064a\u0629. \u0627\u0644\u0646\u062a\u064a\u062c\u0629: \u062a\u0631\u0627\u062c\u0639\u062a \u062d\u0648\u0627\u062f\u062b \u0627\u0644\u0633\u0631\u0642\u0629 \u0625\u0644\u0649 \u062d\u0627\u0644\u0629 \u0648\u0627\u062d\u062f\u0629 \u0623\u0648 \u062d\u0627\u0644\u062a\u064a\u0646 \u0641\u0642\u0637 \u0633\u0646\u0648\u064a\u0627\u064b\u060c \u0636\u0645\u0646 \u062d\u0648\u0643\u0645\u0629 \u062a\u0634\u063a\u064a\u0644\u064a\u0629 \u0645\u0648\u062b\u0651\u0642\u0629 \u0648\u062c\u0627\u0647\u0632\u0629 \u0644\u0644\u062a\u062f\u0642\u064a\u0642 \u0645\u0628\u0646\u064a\u0629 \u0644\u0644\u062a\u0648\u0633\u0651\u0639 \u0639\u0644\u0649 \u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u062c\u0645\u0647\u0648\u0631\u064a\u0629.",
    challengeIntro: "Securing one of Egypt's largest distributed networks demanded a new operating model:",
    challengeIntroAr: "\u062a\u0623\u0645\u064a\u0646 \u0648\u0627\u062d\u062f\u0629 \u0645\u0646 \u0623\u0643\u0628\u0631 \u0627\u0644\u0634\u0628\u0643\u0627\u062a \u0627\u0644\u0645\u0648\u0632\u0639\u0629 \u0641\u064a \u0645\u0635\u0631 \u062a\u0637\u0644\u0628 \u0646\u0645\u0648\u0630\u062c \u062a\u0634\u063a\u064a\u0644 \u062c\u062f\u064a\u062f\u0627\u064b \u0643\u0644\u064a\u0627\u064b:",
    challengeBullets: ["Zero centralized visibility across 3,300+ branches", "Fragmented monitoring, delayed incident response", "No unified incident management framework", "Slow, inconsistent coordination with Najda emergency services", "Absence of management-level operational reporting"],
    challengeBulletsAr: ["\u063a\u064a\u0627\u0628 \u0627\u0644\u0631\u0624\u064a\u0629 \u0627\u0644\u0645\u0631\u0643\u0632\u064a\u0629 \u0639\u0628\u0631 \u0623\u0643\u062b\u0631 \u0645\u0646 3,300 \u0641\u0631\u0639", "\u0627\u0633\u062a\u062c\u0627\u0628\u0629 \u0645\u062c\u0632\u0651\u0623\u0629 \u0648\u0628\u0637\u064a\u0626\u0629 \u0646\u062a\u064a\u062c\u0629 \u0627\u0644\u0645\u0631\u0627\u0642\u0628\u0629 \u0639\u0644\u0649 \u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u0641\u0631\u0639 \u0641\u0642\u0637", "\u063a\u064a\u0627\u0628 \u0625\u0637\u0627\u0631 \u0645\u0648\u062d\u0651\u062f \u0644\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u062d\u0648\u0627\u062f\u062b", "\u062a\u0646\u0633\u064a\u0642 \u063a\u064a\u0631 \u0645\u0646\u062a\u0638\u0645 \u0645\u0639 \u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0637\u0648\u0627\u0631\u0626 \u0628\u0646\u062c\u062f\u0629 \u0627\u0644\u0634\u0631\u0637\u0629", "\u0642\u0635\u0648\u0631 \u0641\u064a \u0627\u0644\u062a\u0642\u0627\u0631\u064a\u0631 \u0627\u0644\u062a\u0634\u063a\u064a\u0644\u064a\u0629 \u0627\u0644\u0645\u0648\u062c\u0651\u0647\u0629 \u0644\u0644\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0639\u0644\u064a\u0627"],
    solutionIntro: "WAVZ designed and operates a centralized Command & Control Center delivering 24/7:",
    solutionIntroAr: "\u0635\u0645\u0645\u062a WAVZ \u0648\u062a\u064f\u0634\u063a\u0651\u0644 \u0645\u0631\u0643\u0632 \u0642\u064a\u0627\u062f\u0629 \u0648\u062a\u062d\u0643\u0645 \u0645\u0631\u0643\u0632\u064a \u064a\u0639\u0645\u0644 \u0639\u0644\u0649 \u0645\u062f\u0627\u0631 \u0627\u0644\u0633\u0627\u0639\u0629 \u064a\u0642\u062f\u0651\u0645:",
    solutionBullets: ["Centralized monitoring of CCTV, intrusion, fire, access & video systems", "~103 alerts/day verified, classified, and actioned", "Proactive surveillance of critical branches", "Structured incident lifecycle: detect \u2192 verify \u2192 escalate \u2192 report", "Direct integration with Najda \u2014 Ministry of Interior", "15+ standardized SOPs governing every workflow"],
    solutionBulletsAr: ["\u0645\u0631\u0627\u0642\u0628\u0629 \u0645\u0631\u0643\u0632\u064a\u0629 \u0644\u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u0643\u0627\u0645\u064a\u0631\u0627\u062a \u0648\u0643\u0634\u0641 \u0627\u0644\u062a\u0633\u0644\u0644 \u0648\u0627\u0644\u062d\u0631\u064a\u0642 \u0648\u0627\u0644\u062f\u062e\u0648\u0644 \u0648\u0627\u0644\u062a\u0633\u062c\u064a\u0644", "\u0645\u0639\u0627\u0644\u062c\u0629 \u0646\u062d\u0648 103 \u062a\u0646\u0628\u064a\u0647\u0627\u062a \u064a\u0648\u0645\u064a\u0627\u064b \u0628\u0639\u062f \u0627\u0644\u062a\u062d\u0642\u0642 \u0627\u0644\u0628\u0635\u0631\u064a \u0648\u0627\u0644\u062a\u0635\u0646\u064a\u0641", "\u0645\u0631\u0627\u0642\u0628\u0629 \u0627\u0633\u062a\u0628\u0627\u0642\u064a\u0629 \u0644\u0644\u0641\u0631\u0648\u0639 \u0627\u0644\u062d\u064a\u0648\u064a\u0629 \u0644\u0644\u0643\u0634\u0641 \u0627\u0644\u0645\u0628\u0643\u0631 \u0639\u0646 \u0623\u064a \u0646\u0634\u0627\u0637 \u0645\u0634\u0628\u0648\u0647", "\u062f\u0648\u0631\u0629 \u0625\u062f\u0627\u0631\u0629 \u062d\u0648\u0627\u062f\u062b \u0645\u062a\u0643\u0627\u0645\u0644\u0629: \u0627\u0644\u0627\u0643\u062a\u0634\u0627\u0641 \u2190 \u0627\u0644\u062a\u062d\u0642\u0642 \u2190 \u0627\u0644\u062a\u0635\u0639\u064a\u062f \u2190 \u0627\u0644\u062a\u0648\u062b\u064a\u0642", "\u0642\u0646\u0627\u0629 \u062a\u0646\u0633\u064a\u0642 \u0645\u0628\u0627\u0634\u0631\u0629 \u0645\u0639 \u0645\u0631\u0627\u0643\u0632 \u0646\u062c\u062f\u0629 \u0648\u0632\u0627\u0631\u0629 \u0627\u0644\u062f\u0627\u062e\u0644\u064a\u0629 \u0639\u0644\u0649 \u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u062c\u0645\u0647\u0648\u0631\u064a\u0629", "\u0623\u0643\u062b\u0631 \u0645\u0646 15 \u0625\u062c\u0631\u0627\u0621 \u062a\u0634\u063a\u064a\u0644 \u0642\u064a\u0627\u0633\u064a (SOPs) \u064a\u062d\u0643\u0645 \u0643\u0644 \u0645\u0633\u0627\u0631 \u0639\u0645\u0644"],
    metrics: [
      { icon: Shield, value: "3,300+", label: "Branches Monitored", labelAr: "\u0641\u0631\u0639 \u062a\u062d\u062a \u0627\u0644\u0645\u0631\u0627\u0642\u0628\u0629", color: "#1173BD" },
      { icon: BarChart3, value: "30,000+", label: "Connected Devices", labelAr: "\u062c\u0647\u0627\u0632 \u0645\u062a\u0635\u0644", color: "#1173BD" },
      { icon: Clock, value: "24/7", label: "Continuous Coverage", labelAr: "\u062a\u063a\u0637\u064a\u0629 \u0645\u0633\u062a\u0645\u0631\u0629", color: "#1173BD" },
      { icon: TrendingUp, value: "1\u20132", label: "Theft Cases / Year", labelAr: "\u062d\u0627\u0644\u0627\u062a \u0633\u0631\u0642\u0629 \u0633\u0646\u0648\u064a\u0627\u064b", color: "#059669" },
    ],
    beforeAfterIntro: "Transformation across every operational dimension \u2014 fragmented activity replaced by a unified, accountable national capability:",
    beforeAfterIntroAr: "\u062a\u062d\u0648\u0651\u0644 \u0639\u0628\u0631 \u0643\u0644 \u0628\u064f\u0639\u062f \u062a\u0634\u063a\u064a\u0644\u064a \u2014 \u0645\u0646 \u0646\u0634\u0627\u0637 \u0645\u062c\u0632\u0651\u0623 \u0625\u0644\u0649 \u0645\u0646\u0638\u0648\u0645\u0629 \u0648\u0637\u0646\u064a\u0629 \u0645\u0648\u062d\u0651\u062f\u0629 \u0648\u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u0645\u0633\u0627\u0621\u0644\u0629:",
    beforeAfter: [
      {
            "metric": "Branch Visibility",
            "metricAr": "\u0627\u0644\u0631\u0624\u064a\u0629 \u0639\u0644\u0649 \u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u0641\u0631\u0648\u0639",
            "before": "Fragmented",
            "beforeAr": "\u0645\u062c\u0632\u0651\u0623\u0629",
            "after": "3,300+ branches",
            "afterAr": "\u0623\u0643\u062b\u0631 \u0645\u0646 3,300 \u0641\u0631\u0639",
            "impact": "Unified national view",
            "impactAr": "\u0631\u0624\u064a\u0629 \u0645\u0648\u062d\u0651\u062f\u0629 \u0639\u0644\u0649 \u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u062c\u0645\u0647\u0648\u0631\u064a\u0629"
      },
      {
            "metric": "Operations Coverage",
            "metricAr": "\u062a\u063a\u0637\u064a\u0629 \u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a",
            "before": "Business hours",
            "beforeAr": "\u0633\u0627\u0639\u0627\u062a \u0627\u0644\u0639\u0645\u0644 \u0627\u0644\u0631\u0633\u0645\u064a\u0629 \u0641\u0642\u0637",
            "after": "24/7",
            "afterAr": "24/7 \u0639\u0644\u0649 \u0645\u062f\u0627\u0631 \u0627\u0644\u0633\u0627\u0639\u0629",
            "impact": "Always-on protection",
            "impactAr": "\u062d\u0645\u0627\u064a\u0629 \u0645\u0633\u062a\u0645\u0631\u0629 \u0644\u0627 \u062a\u062a\u0648\u0642\u0641"
      },
      {
            "metric": "Theft Incidents (annual)",
            "metricAr": "\u062d\u0648\u0627\u062f\u062b \u0627\u0644\u0633\u0631\u0642\u0629 (\u0633\u0646\u0648\u064a\u0627\u064b)",
            "before": "Frequent",
            "beforeAr": "\u0645\u062a\u0643\u0631\u0631\u0629",
            "after": "1\u20132 cases",
            "afterAr": "\u062d\u0627\u0644\u0629 \u0648\u0627\u062d\u062f\u0629 \u0623\u0648 \u062d\u0627\u0644\u062a\u0627\u0646",
            "impact": "Incident collapse",
            "impactAr": "\u0627\u0646\u062d\u0633\u0627\u0631 \u0634\u0628\u0647 \u0643\u0627\u0645\u0644 \u0644\u0644\u062d\u0648\u0627\u062f\u062b"
      },
      {
            "metric": "Emergency Coordination",
            "metricAr": "\u0627\u0644\u062a\u0646\u0633\u064a\u0642 \u0645\u0639 \u0627\u0644\u0637\u0648\u0627\u0631\u0626",
            "before": "Ad hoc, branch-level",
            "beforeAr": "\u0641\u0631\u062f\u064a \u0648\u063a\u064a\u0631 \u0645\u0646\u062a\u0638\u0645 \u0639\u0644\u0649 \u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u0641\u0631\u0639",
            "after": "Direct with Najda",
            "afterAr": "\u0645\u0628\u0627\u0634\u0631 \u0645\u0639 \u0634\u0631\u0637\u0629 \u0627\u0644\u0646\u062c\u062f\u0629",
            "impact": "Rapid police dispatch",
            "impactAr": "\u0627\u0633\u062a\u062c\u0627\u0628\u0629 \u0648\u062a\u062f\u062e\u0644 \u0623\u0645\u0646\u064a \u0641\u0648\u0631\u064a"
      },
      {
            "metric": "Governance",
            "metricAr": "\u0627\u0644\u062d\u0648\u0643\u0645\u0629 \u0627\u0644\u062a\u0634\u063a\u064a\u0644\u064a\u0629",
            "before": "Inconsistent",
            "beforeAr": "\u063a\u064a\u0631 \u0645\u0648\u062d\u0651\u062f\u0629",
            "after": "15+ SOPs, audit-ready",
            "afterAr": "\u0623\u0643\u062b\u0631 \u0645\u0646 15 \u0625\u062c\u0631\u0627\u0621 \u0642\u064a\u0627\u0633\u064a\u0627\u064b \u0645\u0648\u062b\u0651\u0642\u0627\u064b",
            "impact": "Operational compliance",
            "impactAr": "\u0627\u0646\u0636\u0628\u0627\u0637 \u062a\u0634\u063a\u064a\u0644\u064a \u062e\u0627\u0636\u0639 \u0644\u0644\u062a\u062f\u0642\u064a\u0642"
      },
      {
            "metric": "Reporting",
            "metricAr": "\u0627\u0644\u062a\u0642\u0627\u0631\u064a\u0631 \u0627\u0644\u062a\u0634\u063a\u064a\u0644\u064a\u0629",
            "before": "Manual, delayed",
            "beforeAr": "\u064a\u062f\u0648\u064a\u0629 \u0648\u0628\u0637\u064a\u0626\u0629",
            "after": "Automated dashboards",
            "afterAr": "\u0644\u0648\u062d\u0627\u062a \u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0622\u0644\u064a\u0629",
            "impact": "Executive visibility",
            "impactAr": "\u0631\u0624\u064a\u0629 \u062a\u0646\u0641\u064a\u0630\u064a\u0629 \u0641\u0648\u0631\u064a\u0629 \u0644\u0644\u0625\u062f\u0627\u0631\u0629"
      }
],
    quote: "\u201cTheft incidents reduced to just 1\u20132 cases per year across the entire monitored network \u2014 proving that mission-grade security at national scale is achievable when people, process, and platform operate as one.\u201d",
    quoteAr: "\u201d\u062a\u0631\u0627\u062c\u0639\u062a \u062d\u0648\u0627\u062f\u062b \u0627\u0644\u0633\u0631\u0642\u0629 \u0625\u0644\u0649 \u062d\u0627\u0644\u0629 \u0648\u0627\u062d\u062f\u0629 \u0623\u0648 \u062d\u0627\u0644\u062a\u064a\u0646 \u0641\u0642\u0637 \u0633\u0646\u0648\u064a\u0627\u064b \u0639\u0644\u0649 \u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u0634\u0628\u0643\u0629 \u0628\u0623\u0643\u0645\u0644\u0647\u0627 \u2014 \u062f\u0644\u064a\u0644 \u0639\u0645\u0644\u064a \u0639\u0644\u0649 \u0623\u0646 \u0627\u0644\u0623\u0645\u0646 \u0627\u0644\u062a\u0634\u063a\u064a\u0644\u064a \u0628\u0645\u0633\u062a\u0648\u0649 \u0648\u0637\u0646\u064a \u0642\u0627\u0628\u0644 \u0644\u0644\u062a\u062d\u0642\u0642 \u0639\u0646\u062f\u0645\u0627 \u064a\u0639\u0645\u0644 \u0627\u0644\u0625\u0646\u0633\u0627\u0646 \u0648\u0627\u0644\u0625\u062c\u0631\u0627\u0621 \u0648\u0627\u0644\u0645\u0646\u0635\u0629 \u0643\u0645\u0646\u0638\u0648\u0645\u0629 \u0648\u0627\u062d\u062f\u0629.\u201c",
    keyDiffs: [
      {
            "icon": "\u25c6",
            "title": "Mission-Grade Service",
            "titleAr": "\u062e\u062f\u0645\u0629 \u0628\u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u0645\u0647\u0627\u0645 \u0627\u0644\u062d\u064a\u0648\u064a\u0629",
            "desc": "Managed end-to-end \u2014 people, process, and platform owned by WAVZ.",
            "descAr": "\u0625\u062f\u0627\u0631\u0629 \u0634\u0627\u0645\u0644\u0629 \u0644\u0644\u0646\u0627\u0633 \u0648\u0627\u0644\u0625\u062c\u0631\u0627\u0621 \u0648\u0627\u0644\u0645\u0646\u0635\u0629 \u062a\u062d\u062a \u0645\u0633\u0624\u0648\u0644\u064a\u0629 WAVZ."
      },
      {
            "icon": "\u25c9",
            "title": "Najda Integrated",
            "titleAr": "\u062a\u0643\u0627\u0645\u0644 \u0645\u0639 \u0627\u0644\u0646\u062c\u062f\u0629",
            "desc": "Direct coordination with Ministry of Interior emergency services.",
            "descAr": "\u0642\u0646\u0627\u0629 \u062a\u0646\u0633\u064a\u0642 \u0645\u0628\u0627\u0634\u0631\u0629 \u0645\u0639 \u0645\u0631\u0627\u0643\u0632 \u0637\u0648\u0627\u0631\u0626 \u0648\u0632\u0627\u0631\u0629 \u0627\u0644\u062f\u0627\u062e\u0644\u064a\u0629."
      },
      {
            "icon": "\u2191",
            "title": "Proactive by Design",
            "titleAr": "\u0627\u0633\u062a\u0628\u0627\u0642\u064a\u0629 \u0628\u0627\u0644\u062a\u0635\u0645\u064a\u0645",
            "desc": "Scheduled surveillance sweeps prevent incidents, not just react.",
            "descAr": "\u062f\u0648\u0631\u064a\u0627\u062a \u0645\u0631\u0627\u0642\u0628\u0629 \u0645\u062c\u062f\u0648\u0644\u0629 \u062a\u0645\u0646\u0639 \u0627\u0644\u062d\u0648\u0627\u062f\u062b \u0642\u0628\u0644 \u0648\u0642\u0648\u0639\u0647\u0627."
      },
      {
            "icon": "\u2726",
            "title": "National Scale",
            "titleAr": "\u062c\u0627\u0647\u0632\u064a\u0629 \u0644\u0644\u0646\u0645\u0648 \u0627\u0644\u0648\u0637\u0646\u064a",
            "desc": "Operating across every governorate, ready to extend to 4,500 branches.",
            "descAr": "\u062d\u0636\u0648\u0631 \u0641\u064a \u0643\u0644 \u0645\u062d\u0627\u0641\u0638\u0629\u060c \u0648\u062c\u0627\u0647\u0632\u064a\u0629 \u0644\u0644\u062a\u0648\u0633\u0639 \u0646\u062d\u0648 4,500 \u0641\u0631\u0639."
      }
],
    roadmapTitle: "WHAT'S NEXT \u2014 OPERATIONAL ENHANCEMENTS",
    roadmapTitleAr: "\u0627\u0644\u0645\u0631\u062d\u0644\u0629 \u0627\u0644\u062a\u0627\u0644\u064a\u0629 \u2014 \u0627\u0644\u062a\u062d\u0633\u064a\u0646\u0627\u062a \u0627\u0644\u062a\u0634\u063a\u064a\u0644\u064a\u0629",
    roadmap: [
      {
            "tag": "ASSET MGMT",
            "tagAr": "\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0623\u0635\u0648\u0644",
            "desc": "Security Asset Management Platform for full device lifecycle.",
            "descAr": "\u0645\u0646\u0635\u0629 \u0625\u062f\u0627\u0631\u0629 \u0623\u0635\u0648\u0644 \u0627\u0644\u0623\u0645\u0646 \u0639\u0628\u0631 \u062f\u0648\u0631\u0629 \u0627\u0644\u062d\u064a\u0627\u0629 \u0627\u0644\u0643\u0627\u0645\u0644\u0629."
      },
      {
            "tag": "HEALTH MON.",
            "tagAr": "\u0633\u0644\u0627\u0645\u0629 \u0627\u0644\u0623\u062c\u0647\u0632\u0629",
            "desc": "Network Monitoring Tool for proactive device health.",
            "descAr": "\u0623\u062f\u0627\u0629 \u0631\u0635\u062f \u0635\u062d\u0629 \u0627\u0644\u0623\u062c\u0647\u0632\u0629 \u0639\u0644\u0649 \u0627\u0644\u0634\u0628\u0643\u0629 \u0628\u0634\u0643\u0644 \u0627\u0633\u062a\u0628\u0627\u0642\u064a."
      },
      {
            "tag": "TICKETING",
            "tagAr": "\u0646\u0638\u0627\u0645 \u0627\u0644\u062a\u0630\u0627\u0643\u0631",
            "desc": "Integrated incident & maintenance ticketing system.",
            "descAr": "\u0646\u0638\u0627\u0645 \u062a\u0630\u0627\u0643\u0631 \u0645\u062a\u0643\u0627\u0645\u0644 \u0644\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u062d\u0648\u0627\u062f\u062b \u0648\u0627\u0644\u0635\u064a\u0627\u0646\u0629."
      },
      {
            "tag": "DASHBOARDS",
            "tagAr": "\u0644\u0648\u062d\u0627\u062a \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062a",
            "desc": "Real-time operational performance intelligence.",
            "descAr": "\u0644\u0648\u062d\u0627\u062a \u0645\u0639\u0644\u0648\u0645\u0627\u062a \u062a\u0634\u063a\u064a\u0644\u064a\u0629 \u0644\u062d\u0638\u064a\u0629 \u0644\u062f\u0639\u0645 \u0627\u0644\u0642\u0631\u0627\u0631."
      }
],
    closingText: "",
    closingTextAr: "",
  },
  {
    id: "economic-zone-authority",
    client: "A Major Economic Zone Authority",
    clientAr: "\u0647\u064a\u0626\u0629 \u0645\u0646\u0637\u0642\u0629 \u0627\u0642\u062a\u0635\u0627\u062f\u064a\u0629 \u0643\u0628\u0631\u0649",
    subtitle: "Enterprise IT Operations Transformation",
    subtitleAr: "\u0639\u0645\u0644\u064a\u0627\u062a \u062a\u0642\u0646\u064a\u0629 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u0645\u0624\u0633\u0633\u064a\u0629",
    industry: "Maritime / Port Technology",
    industryAr: "\u062a\u0642\u0646\u064a\u0629 \u0627\u0644\u0645\u0648\u0627\u0646\u0626 \u0648\u0627\u0644\u0646\u0642\u0644 \u0627\u0644\u0628\u062d\u0631\u064a",
    region: "Egypt \u2013 Special Economic Zone",
    regionAr: "\u0645\u0635\u0631 \u2013 \u0645\u0646\u0637\u0642\u0629 \u0627\u0642\u062a\u0635\u0627\u062f\u064a\u0629 \u062e\u0627\u0635\u0629",
    scope: "Enterprise IT Operations",
    scopeAr: "\u0639\u0645\u0644\u064a\u0627\u062a \u062a\u0642\u0646\u064a\u0629 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u0645\u0624\u0633\u0633\u064a\u0629",
    color: "#7C3AED",
    bgGradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
    tagColor: "rgba(124,58,237,0.12)",
    tagBorder: "rgba(124,58,237,0.3)",
    tagText: "#7C3AED",
    headline: "Transforming Legacy IT into a World-Class, High-Availability Digital Ecosystem",
    headlineAr: "\u062a\u062d\u0648\u064a\u0644 \u0627\u0644\u0628\u0646\u064a\u0629 \u0627\u0644\u062a\u0642\u0646\u064a\u0629 \u0627\u0644\u0642\u062f\u064a\u0645\u0629 \u0625\u0644\u0649 \u0645\u0646\u0638\u0648\u0645\u0629 \u0631\u0642\u0645\u064a\u0629 \u0639\u0627\u0644\u0645\u064a\u0629 \u0627\u0644\u0645\u0633\u062a\u0648\u0649 \u0648\u0639\u0627\u0644\u064a\u0629 \u0627\u0644\u062a\u0648\u0641\u0631",
    summary: "A major economic zone authority engaged our specialized managed IT services team to execute a full-scale transformation of its legacy technology infrastructure \u2014 one of the most operationally sensitive environments in global maritime commerce. The engagement delivered a multi-disciplinary operations framework spanning five critical disciplines, underpinned by 24/7 coverage and clearly defined escalation protocols.",
    summaryAr: "\u0627\u0633\u062a\u0639\u0627\u0646\u062a \u0647\u064a\u0626\u0629 \u0645\u0646\u0637\u0642\u0629 \u0627\u0642\u062a\u0635\u0627\u062f\u064a\u0629 \u0643\u0628\u0631\u0649 \u0628\u0641\u0631\u064a\u0642\u0646\u0627 \u0627\u0644\u0645\u062a\u062e\u0635\u0635 \u0641\u064a \u062e\u062f\u0645\u0627\u062a \u062a\u0642\u0646\u064a\u0629 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u0645\u062f\u0627\u0631\u0629 \u0644\u062a\u0646\u0641\u064a\u0630 \u0639\u0645\u0644\u064a\u0629 \u062a\u062d\u0648\u0644 \u0634\u0627\u0645\u0644\u0629 \u0644\u0628\u0646\u064a\u062a\u0647\u0627 \u0627\u0644\u062a\u0642\u0646\u064a\u0629 \u0627\u0644\u0642\u062f\u064a\u0645\u0629 \u2014 \u0641\u064a \u0648\u0627\u062d\u062f\u0629 \u0645\u0646 \u0623\u0643\u062b\u0631 \u0627\u0644\u0628\u064a\u0626\u0627\u062a \u0627\u0644\u062a\u0634\u063a\u064a\u0644\u064a\u0629 \u062d\u0633\u0627\u0633\u064a\u0629 \u0641\u064a \u0642\u0637\u0627\u0639 \u0627\u0644\u062a\u062c\u0627\u0631\u0629 \u0627\u0644\u0628\u062d\u0631\u064a\u0629 \u0627\u0644\u0639\u0627\u0644\u0645\u064a\u0629. \u0623\u0646\u062a\u062c \u0647\u0630\u0627 \u0627\u0644\u062a\u0639\u0627\u0648\u0646 \u0625\u0637\u0627\u0631 \u0639\u0645\u0644\u064a\u0627\u062a \u0645\u062a\u0639\u062f\u062f \u0627\u0644\u062a\u062e\u0635\u0635\u0627\u062a \u064a\u063a\u0637\u064a \u062e\u0645\u0633\u0629 \u0645\u062c\u0627\u0644\u0627\u062a \u062d\u064a\u0648\u064a\u0629\u060c \u064a\u0639\u0645\u0644 \u0639\u0644\u0649 \u0645\u062f\u0627\u0631 \u0627\u0644\u0633\u0627\u0639\u0629\u060c \u0648\u0628\u0636\u0648\u0627\u0628\u0637 \u062a\u0635\u0639\u064a\u062f \u0648\u0627\u0636\u062d\u0629 \u0648\u0645\u062d\u062f\u062f\u0629.",
    challengeIntro: "The Authority's aging infrastructure created critical operational risk in one of the world's most sensitive trade environments:",
    challengeIntroAr: "\u0623\u062f\u062a \u0627\u0644\u0628\u0646\u064a\u0629 \u0627\u0644\u062a\u0642\u0646\u064a\u0629 \u0627\u0644\u0642\u062f\u064a\u0645\u0629 \u0644\u0644\u0647\u064a\u0626\u0629 \u0625\u0644\u0649 \u0645\u062e\u0627\u0637\u0631 \u062a\u0634\u063a\u064a\u0644\u064a\u0629 \u062c\u0648\u0647\u0631\u064a\u0629 \u0641\u064a \u0623\u062d\u062f \u0623\u0643\u062b\u0631 \u0628\u064a\u0626\u0627\u062a \u0627\u0644\u062a\u062c\u0627\u0631\u0629 \u0627\u0644\u0639\u0627\u0644\u0645\u064a\u0629 \u062d\u0633\u0627\u0633\u064a\u0629:",
    challengeBullets: ["Zero monitoring visibility across systems", "SLA compliance stalled at 89%", "Incident resolution averaging 4 hours", "No structured framework for new site deployments", "Must modernize without disrupting live port operations"],
    challengeBulletsAr: ["\u063a\u064a\u0627\u0628 \u0643\u0627\u0645\u0644 \u0644\u0644\u0631\u0624\u064a\u0629 \u0627\u0644\u0631\u0642\u0627\u0628\u064a\u0629 \u0639\u0628\u0631 \u0627\u0644\u0623\u0646\u0638\u0645\u0629", "\u0627\u0644\u062a\u0632\u0627\u0645 \u0628\u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u062e\u062f\u0645\u0629 \u0645\u062a\u0639\u062b\u0631 \u0639\u0646\u062f 89%", "\u0645\u062a\u0648\u0633\u0637 \u0632\u0645\u0646 \u062d\u0644 \u0627\u0644\u0623\u0639\u0637\u0627\u0644 4 \u0633\u0627\u0639\u0627\u062a", "\u0639\u062f\u0645 \u0648\u062c\u0648\u062f \u0625\u0637\u0627\u0631 \u0639\u0645\u0644 \u0645\u0646\u0638\u0645 \u0644\u0646\u0634\u0631 \u0645\u0648\u0627\u0642\u0639 \u062c\u062f\u064a\u062f\u0629", "\u0636\u0631\u0648\u0631\u0629 \u0627\u0644\u062a\u062d\u062f\u064a\u062b \u062f\u0648\u0646 \u0623\u064a \u062a\u0639\u0637\u064a\u0644 \u0644\u0639\u0645\u0644\u064a\u0627\u062a \u0627\u0644\u0645\u064a\u0646\u0627\u0621 \u0627\u0644\u062c\u0627\u0631\u064a\u0629"],
    solutionIntro: "A unified managed operations framework across five specialized disciplines, delivered 24/7:",
    solutionIntroAr: "\u0625\u0637\u0627\u0631 \u0639\u0645\u0644\u064a\u0627\u062a \u0645\u062f\u0627\u0631\u0629 \u0648\u0645\u0648\u062d\u0651\u062f \u0639\u0628\u0631 \u062e\u0645\u0633 \u062a\u062e\u0635\u0635\u0627\u062a \u0645\u062a\u062e\u0635\u0635\u0629\u060c \u064a\u0639\u0645\u0644 \u0639\u0644\u0649 \u0645\u062f\u0627\u0631 \u0627\u0644\u0633\u0627\u0639\u0629:",
    solutionBullets: ["Network Operations \u2014 end-to-end connectivity management", "Network Security \u2014 continuous threat detection & response", "Systems Administration \u2014 enterprise server & storage platforms", "IT Helpdesk \u2014 tiered support with defined SLAs", "Electro-Mechanical \u2014 physical & facilities-layer infrastructure"],
    solutionBulletsAr: ["\u0639\u0645\u0644\u064a\u0627\u062a \u0627\u0644\u0634\u0628\u0643\u0627\u062a \u2014 \u0625\u062f\u0627\u0631\u0629 \u0634\u0627\u0645\u0644\u0629 \u0644\u0636\u0645\u0627\u0646 \u0627\u0633\u062a\u0645\u0631\u0627\u0631\u064a\u0629 \u0627\u0644\u0627\u062a\u0635\u0627\u0644", "\u0623\u0645\u0646 \u0627\u0644\u0634\u0628\u0643\u0627\u062a \u2014 \u0643\u0634\u0641 \u0627\u0644\u062a\u0647\u062f\u064a\u062f\u0627\u062a \u0648\u0627\u0644\u0627\u0633\u062a\u062c\u0627\u0628\u0629 \u0644\u0647\u0627 \u0628\u0634\u0643\u0644 \u0645\u0633\u062a\u0645\u0631", "\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0623\u0646\u0638\u0645\u0629 \u2014 \u0645\u0646\u0635\u0627\u062a \u062e\u0648\u0627\u062f\u0645 \u0648\u062a\u062e\u0632\u064a\u0646 \u0628\u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u0645\u0624\u0633\u0633\u0627\u062a", "\u0627\u0644\u062f\u0639\u0645 \u0627\u0644\u062a\u0642\u0646\u064a \u2014 \u062f\u0639\u0645 \u0645\u062a\u0639\u062f\u062f \u0627\u0644\u0645\u0633\u062a\u0648\u064a\u0627\u062a \u0628\u0645\u0633\u062a\u0648\u064a\u0627\u062a \u062e\u062f\u0645\u0629 \u0645\u062d\u062f\u062f\u0629", "\u0627\u0644\u062f\u0639\u0645 \u0627\u0644\u0643\u0647\u0631\u0648\u0645\u064a\u0643\u0627\u0646\u064a\u0643\u064a \u2014 \u062a\u063a\u0637\u064a\u0629 \u0627\u0644\u0628\u0646\u064a\u0629 \u0627\u0644\u062a\u062d\u062a\u064a\u0629 \u0627\u0644\u0645\u0627\u062f\u064a\u0629 \u0648\u0627\u0644\u0645\u0631\u0627\u0641\u0642"],
    metrics: [
      { icon: CheckCircle, value: "99%", label: "SLA Achievement", labelAr: "\u0646\u0633\u0628\u0629 \u0627\u0644\u0627\u0644\u062a\u0632\u0627\u0645 \u0628\u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u062e\u062f\u0645\u0629", color: "#7C3AED" },
      { icon: TrendingUp, value: "75%", label: "MTTR Reduction", labelAr: "\u062e\u0641\u0636 \u0632\u0645\u0646 \u0627\u0644\u0627\u0633\u062a\u062c\u0627\u0628\u0629", color: "#7C3AED" },
      { icon: Shield, value: "4", label: "Monitoring Platforms Deployed", labelAr: "\u0645\u0646\u0635\u0629 \u0645\u0631\u0627\u0642\u0628\u0629 \u0645\u062a\u0643\u0627\u0645\u0644\u0629", color: "#7C3AED" },
      { icon: Clock, value: "24/7", label: "Always-On Operations", labelAr: "\u062a\u063a\u0637\u064a\u0629 \u0645\u0633\u062a\u0645\u0631\u0629 \u0639\u0644\u0649 \u0645\u062f\u0627\u0631 \u0627\u0644\u0633\u0627\u0639\u0629", color: "#059669" },
    ],
    beforeAfterIntro: "The transformation delivered sustained, measurable improvements across every critical performance dimension:",
    beforeAfterIntroAr: "\u062d\u0642\u0642 \u0647\u0630\u0627 \u0627\u0644\u062a\u062d\u0648\u0644 \u062a\u062d\u0633\u064a\u0646\u0627\u062a \u0645\u0633\u062a\u062f\u0627\u0645\u0629 \u0648\u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u0642\u064a\u0627\u0633 \u0639\u0628\u0631 \u0643\u0644 \u0628\u064f\u0639\u062f \u0631\u0626\u064a\u0633\u064a \u0645\u0646 \u0623\u0628\u0639\u0627\u062f \u0627\u0644\u0623\u062f\u0627\u0621 \u0627\u0644\u062a\u0634\u063a\u064a\u0644\u064a:",
    beforeAfter: [
      {
            "metric": "SLA Compliance",
            "metricAr": "\u0627\u0644\u0627\u0644\u062a\u0632\u0627\u0645 \u0628\u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u062e\u062f\u0645\u0629",
            "before": "89%",
            "beforeAr": "89%",
            "after": "99%",
            "afterAr": "99%",
            "impact": "+10 percentage points",
            "impactAr": "+10 \u0646\u0642\u0627\u0637 \u0646\u0633\u0628\u064a\u0629"
      },
      {
            "metric": "Mean Time to Resolve (MTTR)",
            "metricAr": "\u0645\u062a\u0648\u0633\u0637 \u0632\u0645\u0646 \u0627\u0644\u062d\u0644 (MTTR)",
            "before": "4 hours",
            "beforeAr": "4 \u0633\u0627\u0639\u0627\u062a",
            "after": "1 hour",
            "afterAr": "\u0633\u0627\u0639\u0629 \u0648\u0627\u062d\u062f\u0629",
            "impact": "75% faster resolution",
            "impactAr": "\u0623\u0633\u0631\u0639 \u0628\u0646\u0633\u0628\u0629 75%"
      },
      {
            "metric": "Monitoring Platforms",
            "metricAr": "\u0645\u0646\u0635\u0627\u062a \u0627\u0644\u0645\u0631\u0627\u0642\u0628\u0629",
            "before": "0",
            "beforeAr": "0",
            "after": "4 tools",
            "afterAr": "4 \u0623\u062f\u0648\u0627\u062a",
            "impact": "Full environment visibility",
            "impactAr": "\u0631\u0624\u064a\u0629 \u0643\u0627\u0645\u0644\u0629 \u0644\u0644\u0628\u064a\u0626\u0629 \u0627\u0644\u062a\u0634\u063a\u064a\u0644\u064a\u0629"
      },
      {
            "metric": "Operations Coverage",
            "metricAr": "\u062a\u063a\u0637\u064a\u0629 \u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a",
            "before": "Business hours",
            "beforeAr": "\u0633\u0627\u0639\u0627\u062a \u0627\u0644\u0639\u0645\u0644 \u0627\u0644\u0631\u0633\u0645\u064a\u0629",
            "after": "24/7",
            "afterAr": "\u0639\u0644\u0649 \u0645\u062f\u0627\u0631 \u0627\u0644\u0633\u0627\u0639\u0629",
            "impact": "Always-on reliability",
            "impactAr": "\u0645\u0648\u062b\u0648\u0642\u064a\u0629 \u062f\u0627\u0626\u0645\u0629"
      },
      {
            "metric": "Expansion Consultation",
            "metricAr": "\u0627\u0633\u062a\u0634\u0627\u0631\u0627\u062a \u0627\u0644\u062a\u0648\u0633\u0651\u0639",
            "before": "Ad hoc",
            "beforeAr": "\u063a\u064a\u0631 \u0645\u0646\u0638\u0645\u0629",
            "after": "~2 sites/mo",
            "afterAr": "~2 \u0645\u0648\u0642\u0639/\u0634\u0647\u0631\u064a\u0627\u064b",
            "impact": "Structured, scalable model",
            "impactAr": "\u0646\u0645\u0648\u0630\u062c \u0645\u0646\u0638\u0645 \u0648\u0642\u0627\u0628\u0644 \u0644\u0644\u062a\u0648\u0633\u0639"
      }
],
    quote: "\"Achieving 99% SLA compliance while expanding at two new sites per month demonstrates that operational excellence and rapid growth are not mutually exclusive \u2014 when built on the right foundation.\"",
    quoteAr: "\u201c\u064a\u064f\u062b\u0628\u062a \u062a\u062d\u0642\u064a\u0642 \u0646\u0633\u0628\u0629 \u0627\u0644\u062a\u0632\u0627\u0645 99% \u0628\u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u062e\u062f\u0645\u0629\u060c \u0645\u0639 \u0627\u0644\u062a\u0648\u0633\u0639 \u0628\u0645\u0639\u062f\u0644 \u0645\u0648\u0642\u0639\u064a\u0646 \u062c\u062f\u064a\u062f\u064a\u0646 \u0634\u0647\u0631\u064a\u0627\u064b\u060c \u0623\u0646 \u0627\u0644\u062a\u0645\u064a\u0632 \u0627\u0644\u062a\u0634\u063a\u064a\u0644\u064a \u0648\u0627\u0644\u0646\u0645\u0648 \u0627\u0644\u0633\u0631\u064a\u0639 \u0644\u064a\u0633\u0627 \u0645\u062a\u0639\u0627\u0631\u0636\u064a\u0646 \u2014 \u062d\u064a\u0646 \u064a\u064f\u0628\u0646\u0649 \u0630\u0644\u0643 \u0639\u0644\u0649 \u0627\u0644\u0623\u0633\u0627\u0633 \u0627\u0644\u0635\u062d\u064a\u062d.\u201d",
    keyDiffs: [
      {
            "icon": "\u25c6",
            "title": "Domain Breadth",
            "titleAr": "\u062a\u0643\u0627\u0645\u0644 \u0627\u0644\u062a\u062e\u0635\u0635\u0627\u062a",
            "desc": "5 disciplines, one cohesive model \u2014 no coordination gaps.",
            "descAr": "5 \u062a\u062e\u0635\u0635\u0627\u062a \u0641\u064a \u0646\u0645\u0648\u0630\u062c \u0648\u0627\u062d\u062f \u0645\u062a\u0643\u0627\u0645\u0644 \u2014 \u062f\u0648\u0646 \u0641\u062c\u0648\u0627\u062a \u062a\u0646\u0633\u064a\u0642."
      },
      {
            "icon": "\u25c9",
            "title": "Proactive Ops",
            "titleAr": "\u0639\u0645\u0644\u064a\u0627\u062a \u0627\u0633\u062a\u0628\u0627\u0642\u064a\u0629",
            "desc": "4 monitoring platforms shifted us from reactive to predictive.",
            "descAr": "4 \u0645\u0646\u0635\u0627\u062a \u0645\u0631\u0627\u0642\u0628\u0629 \u062d\u0648\u0651\u0644\u062a \u0627\u0644\u0639\u0645\u0644 \u0645\u0646 \u0631\u062f \u0627\u0644\u0641\u0639\u0644 \u0625\u0644\u0649 \u0627\u0644\u0627\u0633\u062a\u0628\u0627\u0642."
      },
      {
            "icon": "\u2191",
            "title": "Zero Downtime",
            "titleAr": "\u0627\u0633\u062a\u0645\u0631\u0627\u0631\u064a\u0629 \u062a\u0627\u0645\u0629",
            "desc": "Full modernization with no operational interruption.",
            "descAr": "\u062a\u062d\u062f\u064a\u062b \u0643\u0627\u0645\u0644 \u062f\u0648\u0646 \u0623\u064a \u0627\u0646\u0642\u0637\u0627\u0639 \u062a\u0634\u063a\u064a\u0644\u064a."
      },
      {
            "icon": "\u2726",
            "title": "Built to Scale",
            "titleAr": "\u062c\u0627\u0647\u0632\u064a\u0629 \u0644\u0644\u062a\u0648\u0633\u0639",
            "desc": "Consultation model governs every new site from day one.",
            "descAr": "\u0646\u0645\u0648\u0630\u062c \u0627\u0644\u0627\u0633\u062a\u0634\u0627\u0631\u0627\u062a \u064a\u0636\u0628\u0637 \u0643\u0644 \u0645\u0648\u0642\u0639 \u062c\u062f\u064a\u062f \u0645\u0646\u0630 \u0627\u0644\u064a\u0648\u0645 \u0627\u0644\u0623\u0648\u0644."
      }
],
    roadmapTitle: "CONCLUSION & FUTURE OUTLOOK",
    roadmapTitleAr: "\u0627\u0644\u062e\u0644\u0627\u0635\u0629 \u0648\u0627\u0644\u062a\u0648\u062c\u0647\u0627\u062a \u0627\u0644\u0645\u0633\u062a\u0642\u0628\u0644\u064a\u0629",
    roadmap: [],
    closingText: "The Operation Optimization program demonstrates that ambitious, large-scale technology transformation is achievable even in mission-critical, zero-downtime environments. With 99% SLA compliance, 24/7 operations coverage, integrated monitoring, and a consultation model that proactively governs every new deployment, the Authority is positioned to sustain operational excellence as it grows its role as a global maritime trade hub for decades to come.",
    closingTextAr: "\u064a\u064f\u062b\u0628\u062a \u0628\u0631\u0646\u0627\u0645\u062c \u062a\u062d\u0633\u064a\u0646 \u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a \u0623\u0646 \u0627\u0644\u062a\u062d\u0648\u0644 \u0627\u0644\u062a\u0642\u0646\u064a \u0627\u0644\u0637\u0645\u0648\u062d \u0648\u0648\u0627\u0633\u0639 \u0627\u0644\u0646\u0637\u0627\u0642 \u0645\u0645\u0643\u0646 \u0627\u0644\u062a\u062d\u0642\u064a\u0642 \u062d\u062a\u0649 \u0641\u064a \u0627\u0644\u0628\u064a\u0626\u0627\u062a \u0627\u0644\u062d\u0633\u0627\u0633\u0629 \u0648\u0630\u0627\u062a \u0627\u0644\u0623\u0647\u0645\u064a\u0629 \u0627\u0644\u0642\u0635\u0648\u0649 \u0627\u0644\u062a\u064a \u0644\u0627 \u062a\u062d\u062a\u0645\u0644 \u0623\u064a \u062a\u0639\u0637\u064a\u0644. \u0648\u0628\u0641\u0636\u0644 \u0627\u0644\u0627\u0644\u062a\u0632\u0627\u0645 \u0628\u0646\u0633\u0628\u0629 99% \u0628\u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u062e\u062f\u0645\u0629\u060c \u0648\u062a\u063a\u0637\u064a\u0629 \u062a\u0634\u063a\u064a\u0644\u064a\u0629 \u0639\u0644\u0649 \u0645\u062f\u0627\u0631 \u0627\u0644\u0633\u0627\u0639\u0629\u060c \u0648\u0645\u0631\u0627\u0642\u0628\u0629 \u0645\u062a\u0643\u0627\u0645\u0644\u0629\u060c \u0648\u0646\u0645\u0648\u0630\u062c \u0627\u0633\u062a\u0634\u0627\u0631\u064a \u064a\u0636\u0628\u0637 \u0643\u0644 \u0639\u0645\u0644\u064a\u0629 \u0646\u0634\u0631 \u062c\u062f\u064a\u062f\u0629 \u0628\u0634\u0643\u0644 \u0627\u0633\u062a\u0628\u0627\u0642\u064a\u060c \u062a\u062a\u0645\u062a\u0639 \u0627\u0644\u0647\u064a\u0626\u0629 \u0628\u0645\u0648\u0642\u0639 \u064a\u0645\u0643\u0651\u0646\u0647\u0627 \u0645\u0646 \u0627\u0644\u062d\u0641\u0627\u0638 \u0639\u0644\u0649 \u0627\u0644\u062a\u0645\u064a\u0632 \u0627\u0644\u062a\u0634\u063a\u064a\u0644\u064a \u0645\u0639 \u062a\u0639\u0632\u064a\u0632 \u062f\u0648\u0631\u0647\u0627 \u0643\u0645\u0631\u0643\u0632 \u0639\u0627\u0644\u0645\u064a \u0631\u0627\u0626\u062f \u0644\u0644\u062a\u062c\u0627\u0631\u0629 \u0627\u0644\u0628\u062d\u0631\u064a\u0629 \u0644\u0639\u0642\u0648\u062f \u0642\u0627\u062f\u0645\u0629.",
  },
];

/* ─── Sub-components ─── */

const MetricCard = ({ icon: Icon, value, label, color }) => (
  <div className="flex flex-col items-center text-center p-5 rounded-2xl border"
    style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
      style={{ background: `${color}20` }}>
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
    <div className="font-black text-white" style={{ fontSize: 26, fontFamily: "'Outfit', sans-serif", lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4, fontWeight: 600 }}>{label}</div>
  </div>
);

/* ─── Card for the hub listing ─── */
const StoryCard = ({ story, ar, dir, i }) => (
  <motion.a
    href={`#/news/use-cases/${story.id}`}
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
    className="group block rounded-2xl overflow-hidden border no-underline flex flex-col h-full"
    style={{
      background: '#fff',
      borderColor: 'rgba(8,45,74,0.09)',
      boxShadow: '0 2px 12px rgba(8,45,74,0.04)',
      textDecoration: 'none',
      transition: 'box-shadow 0.25s ease, border-color 0.25s ease, transform 0.25s ease',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = '0 14px 34px rgba(8,45,74,0.12)';
      e.currentTarget.style.borderColor = story.color + '55';
      e.currentTarget.style.transform = 'translateY(-3px)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = '0 2px 12px rgba(8,45,74,0.04)';
      e.currentTarget.style.borderColor = 'rgba(8,45,74,0.09)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    {/* Coloured header bar */}
    <div className="p-7 pb-6" style={{ background: story.bgGradient }}>
      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md mb-4"
        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase' }}>
          {ar ? story.industryAr : story.industry}
        </span>
      </div>
      <h3 className="font-bold text-white mb-1" style={{ fontSize: 20, fontFamily: "'Outfit', sans-serif", lineHeight: 1.25 }}>
        {ar ? story.clientAr : story.client}
      </h3>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', margin: 0, fontWeight: 500 }}>
        {ar ? story.subtitleAr : story.subtitle}
      </p>

      {/* Metrics row */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {story.metrics.slice(0, 2).map((m, idx) => (
          <div key={idx} className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="font-black text-white" style={{ fontSize: 20, fontFamily: "'Outfit', sans-serif" }}>{m.value}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginTop: 2 }}>
              {ar ? m.labelAr : m.label}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Card body */}
    <div className="p-7 pt-5 flex-1 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span style={{ fontSize: 10.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {ar ? story.regionAr : story.region}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span style={{ fontSize: 10.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }} className="truncate max-w-[200px]" title={ar ? story.scopeAr : story.scope}>
            {ar ? story.scopeAr : story.scope}
          </span>
        </div>

        <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, margin: 0, fontFamily: "'Outfit', sans-serif" }}
          className="line-clamp-3">
          {ar ? story.summaryAr : story.summary}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t flex items-center justify-between" style={{ borderColor: 'rgba(8,45,74,0.07)' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: story.color, fontFamily: "'Outfit', sans-serif" }}
          className="inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-200">
          {ar ? 'عرض حالة الاستخدام' : 'View Use Case'}
          {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </span>
        <div className="flex gap-1.5">
          {story.metrics.slice(0, 3).map((m, idx) => (
            <div key={idx} className="w-2 h-2 rounded-full" style={{ background: m.color, opacity: 0.5 + idx * 0.2 }} />
          ))}
        </div>
      </div>
    </div>
  </motion.a>
);

/* ─── Detail page ─── */
const StoryDetail = ({ story, ar, dir }) => {
  useEffect(() => { window.scrollTo(0, 0); }, [story.id]);

  const hasImpactCol = story.beforeAfter && story.beforeAfter.some(r => r.impact);

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Hero with exact MediaHero styling */}
      <MediaHero
        eyebrow={ar ? story.industryAr : story.industry}
        eyebrowIcon={BookOpen}
        title={ar ? story.headlineAr : story.headline}
        subtitle={ar ? story.summaryAr : story.summary}
        breadcrumbs={[
          { label: ar ? 'المركز الإعلامي' : 'Media Center', href: '#/news' },
          { label: ar ? 'حالات الاستخدام' : 'Use Cases', href: '#/news/use-cases' },
          { label: ar ? story.clientAr : story.client },
        ]}
        eyebrowColor={story.color}
        dir={dir}
        minHeight={360}
      />

      {/* Meta Bar */}
      <div style={{ background: '#082D4A', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px clamp(24px,6vw,80px)' }}>
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-white/70">
            <div>
              <span className="text-white/40 uppercase tracking-wider text-[11px] me-2">{ar ? 'القطاع:' : 'Industry:'}</span>
              <span className="text-white">{ar ? story.industryAr : story.industry}</span>
            </div>
            <div className="hidden sm:block text-white/20">|</div>
            <div>
              <span className="text-white/40 uppercase tracking-wider text-[11px] me-2">{ar ? 'المنطقة:' : 'Region:'}</span>
              <span className="text-white">{ar ? story.regionAr : story.region}</span>
            </div>
            <div className="hidden sm:block text-white/20">|</div>
            <div className="flex-1 min-w-[240px]">
              <span className="text-white/40 uppercase tracking-wider text-[11px] me-2">{ar ? 'النطاق:' : 'Scope:'}</span>
              <span className="text-[#FFB814]">{ar ? story.scopeAr : story.scope}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI strip sits directly below the hero */}
      <div style={{ background: story.bgGradient, paddingTop: 'clamp(36px,5vw,56px)', paddingBottom: 'clamp(36px,5vw,56px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', paddingLeft: 'clamp(24px,6vw,80px)', paddingRight: 'clamp(24px,6vw,80px)' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full" style={{ width: '100%' }}>
            {story.metrics.map((m, i) => (
              <MetricCard key={i} icon={m.icon} value={m.value} label={ar ? m.labelAr : m.label} color={m.color} />
            ))}
          </div>
        </div>
      </div>

      {/* Body content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', paddingLeft: 'clamp(24px,6vw,80px)', paddingRight: 'clamp(24px,6vw,80px)' }} className="py-14 lg:py-20 space-y-14">

        {/* Executive Summary */}
        <section>
          <div className="rounded-2xl p-7 lg:p-9 border" style={{ background: '#fff', borderColor: 'rgba(8,45,74,0.08)', boxShadow: '0 2px 12px rgba(8,45,74,0.04)' }}>
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#1173BD] mb-3">
              {ar ? 'ملخص تنفيذي' : 'EXECUTIVE SUMMARY'}
            </div>
            <p style={{ fontSize: 16, color: '#082D4A', lineHeight: 1.8, margin: 0, fontFamily: "'Outfit', sans-serif", fontWeight: 500 }}>
              {ar ? story.summaryAr : story.summary}
            </p>
          </div>
        </section>

        {/* Challenge & Solution Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Challenge */}
          <section className="h-full flex flex-col">
            <h2 className="font-bold mb-4 flex items-center gap-3"
              style={{ fontSize: 20, color: '#082D4A', fontFamily: "'Outfit', sans-serif" }}>
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black bg-rose-600">1</span>
              {ar ? 'التحدي' : 'THE CHALLENGE'}
            </h2>
            <div className="rounded-2xl p-7 border-l-4 flex-1" style={{ background: '#fff', borderLeftColor: '#e11d48', boxShadow: '0 2px 12px rgba(8,45,74,0.05)', borderTop: '1px solid rgba(8,45,74,0.06)', borderRight: '1px solid rgba(8,45,74,0.06)', borderBottom: '1px solid rgba(8,45,74,0.06)' }}>
              {story.challengeIntro && (
                <p style={{ fontSize: 15, color: '#082D4A', fontWeight: 600, marginBottom: 16, lineHeight: 1.6 }}>
                  {ar ? story.challengeIntroAr : story.challengeIntro}
                </p>
              )}
              {story.challengeBullets && (
                <ul className="space-y-3 m-0 p-0 list-none">
                  {(ar ? story.challengeBulletsAr : story.challengeBullets).map((b, idx) => (
                    <li key={idx} className="flex items-start gap-3" style={{ fontSize: 14.5, color: '#475569', lineHeight: 1.7 }}>
                      <span className="text-rose-600 font-bold mt-1">▸</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Solution */}
          <section className="h-full flex flex-col">
            <h2 className="font-bold mb-4 flex items-center gap-3"
              style={{ fontSize: 20, color: '#082D4A', fontFamily: "'Outfit', sans-serif" }}>
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black"
                style={{ background: story.color }}>2</span>
              {ar ? 'الحل' : 'THE SOLUTION'}
            </h2>
            <div className="rounded-2xl p-7 border-l-4 flex-1" style={{ background: '#fff', borderLeftColor: story.color, boxShadow: '0 2px 12px rgba(8,45,74,0.05)', borderTop: '1px solid rgba(8,45,74,0.06)', borderRight: '1px solid rgba(8,45,74,0.06)', borderBottom: '1px solid rgba(8,45,74,0.06)' }}>
              {story.solutionIntro && (
                <p style={{ fontSize: 15, color: '#082D4A', fontWeight: 600, marginBottom: 16, lineHeight: 1.6 }}>
                  {ar ? story.solutionIntroAr : story.solutionIntro}
                </p>
              )}
              {story.solutionBullets && (
                <ul className="space-y-3 m-0 p-0 list-none">
                  {(ar ? story.solutionBulletsAr : story.solutionBullets).map((b, idx) => (
                    <li key={idx} className="flex items-start gap-3" style={{ fontSize: 14.5, color: '#475569', lineHeight: 1.7 }}>
                      <span className="font-bold mt-1" style={{ color: story.color }}>▸</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>

        {/* Measurable Results & Business Impact */}
        <section>
          <div className="mb-6">
            <h2 className="font-bold mb-2"
              style={{ fontSize: 22, color: '#082D4A', fontFamily: "'Outfit', sans-serif" }}>
              {ar ? 'النتائج الملموسة والأثر على الأعمال' : 'MEASURABLE RESULTS & BUSINESS IMPACT'}
            </h2>
            {story.beforeAfterIntro && (
              <p style={{ fontSize: 14.5, color: '#64748b', margin: 0 }}>
                {ar ? story.beforeAfterIntroAr : story.beforeAfterIntro}
              </p>
            )}
          </div>
          <div className="rounded-2xl overflow-hidden border bg-white shadow-sm" style={{ borderColor: 'rgba(8,45,74,0.09)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left" style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>
                <thead>
                  <tr style={{ background: '#061E31' }}>
                    <th className="p-4 px-5" style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {ar ? 'المجال' : 'Domain / Metric'}
                    </th>
                    <th className="p-4 px-5" style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {ar ? 'قبل' : 'Before'}
                    </th>
                    <th className="p-4 px-5" style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {ar ? 'بعد' : 'After'}
                    </th>
                    {hasImpactCol && (
                      <th className="p-4 px-5" style={{ fontSize: 11.5, fontWeight: 700, color: '#FFB814', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {ar ? 'الأثر' : 'Impact'}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {story.beforeAfter.map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#F8FAFC', borderBottom: '1px solid rgba(8,45,74,0.06)' }}>
                      <td className="p-4 px-5 font-semibold text-[#082D4A]" style={{ fontSize: 14 }}>
                        {ar ? (row.metricAr || row.metric) : row.metric}
                      </td>
                      <td className="p-4 px-5 text-slate-500" style={{ fontSize: 13.5 }}>
                        {ar ? (row.beforeAr || row.before) : row.before}
                      </td>
                      <td className="p-4 px-5">
                        <span className="inline-flex items-center gap-1.5 font-bold" style={{ fontSize: 13.5, color: story.color }}>
                          <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          {ar ? (row.afterAr || row.after) : row.after}
                        </span>
                      </td>
                      {hasImpactCol && (
                        <td className="p-4 px-5 font-semibold text-emerald-600" style={{ fontSize: 13.5 }}>
                          {ar ? (row.impactAr || row.impact) : row.impact}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Quote */}
        {story.quote && (
          <section className="rounded-2xl p-8 lg:p-11 relative overflow-hidden" style={{ background: story.bgGradient }}>
            <div className="absolute top-4 start-6 text-7xl font-black opacity-10 text-white leading-none">“</div>
            <blockquote className="relative z-10 text-white font-medium italic"
              style={{ fontSize: 'clamp(15.5px,1.6vw,19px)', lineHeight: 1.8, fontFamily: "'Outfit', sans-serif", margin: 0 }}>
              {ar ? story.quoteAr : story.quote}
            </blockquote>
          </section>
        )}

        {/* Key differentiators */}
        <section>
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#1173BD] mb-2">
            {ar ? 'أبرز عوامل التميز' : 'WHY WAVZ'}
          </div>
          <h2 className="font-bold mb-6" style={{ fontSize: 22, color: '#082D4A', fontFamily: "'Outfit', sans-serif" }}>
            {ar ? 'أبرز عوامل التميز' : 'KEY DIFFERENTIATORS'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full" style={{ width: '100%' }}>
            {story.keyDiffs.map((d, i) => (
              <div key={i} className="rounded-2xl p-6 border flex flex-col justify-between" style={{ background: '#fff', borderColor: 'rgba(8,45,74,0.08)', boxShadow: '0 2px 8px rgba(8,45,74,0.04)' }}>
                <div>
                  <div className="font-black text-2xl mb-3" style={{ color: story.color }}>{d.icon}</div>
                  <h4 className="font-bold mb-2" style={{ fontSize: 15, color: '#082D4A', fontFamily: "'Outfit', sans-serif" }}>
                    {ar ? (d.titleAr || d.title) : d.title}
                  </h4>
                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, margin: 0 }}>
                    {ar ? (d.descAr || d.desc) : d.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What's Next / Roadmap if present */}
        {story.roadmap && story.roadmap.length > 0 && (
          <section>
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#1173BD] mb-2">
              {ar ? 'المستقبل' : 'FUTURE VISION'}
            </div>
            <h2 className="font-bold mb-6" style={{ fontSize: 22, color: '#082D4A', fontFamily: "'Outfit', sans-serif" }}>
              {ar ? (story.roadmapTitleAr || 'ما هو القادم — خارطة الطريق') : (story.roadmapTitle || "WHAT'S NEXT — ROADMAP FOR CONTINUED GROWTH")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              {story.roadmap.map((item, idx) => (
                <div key={idx} className="rounded-2xl p-6 border" style={{ background: '#082D4A', borderColor: 'rgba(255,255,255,0.08)', color: '#fff' }}>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#FFB814] mb-2">
                    {ar ? item.tagAr : item.tag}
                  </div>
                  <p className="text-white/80 text-[13.5px] leading-relaxed m-0">
                    {ar ? item.descAr : item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Closing banner if present */}
        {story.closingText && (
          <section className="rounded-2xl p-7 lg:p-8 border text-center" style={{ background: 'rgba(17,115,189,0.06)', borderColor: 'rgba(17,115,189,0.2)' }}>
            <p className="text-[#082D4A] font-bold text-base sm:text-lg m-0" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {ar ? story.closingTextAr : story.closingText}
            </p>
          </section>
        )}

        {/* CTA */}
        <section className="rounded-2xl p-8 lg:p-10 text-center border" style={{ background: '#fff', borderColor: 'rgba(8,45,74,0.08)' }}>
          <h3 className="font-bold mb-3" style={{ fontSize: 22, color: '#082D4A', fontFamily: "'Outfit', sans-serif" }}>
            {ar ? 'هل أنت مستعد لتحويل عملياتك؟' : 'Ready to Transform Your Operations?'}
          </h3>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 24, lineHeight: 1.7 }}>
            {ar ? 'اكتشف كيف يمكن لـ WAVZ مساعدتك في تحقيق نتائج مماثلة.' : 'Discover how WAVZ can help you achieve similar results with our digital transformation & managed services.'}
          </p>
          <a href="#/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-bold no-underline"
            style={{ background: story.color, fontSize: 14, textDecoration: 'none', boxShadow: `0 4px 20px ${story.color}40` }}>
            {ar ? 'تواصل معنا' : 'Get in Touch'}
            {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </a>
        </section>

        {/* Back links */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t" style={{ borderColor: 'rgba(8,45,74,0.08)' }}>
          <a href="#/news/use-cases"
            className="inline-flex items-center gap-1.5 font-semibold hover:underline"
            style={{ fontSize: 14, color: '#1173BD', textDecoration: 'none' }}>
            {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {ar ? 'جميع حالات الاستخدام' : 'All Use Cases'}
          </a>
          <span className="text-slate-300">|</span>
          <a href="#/news"
            className="inline-flex items-center gap-1.5 font-semibold hover:underline"
            style={{ fontSize: 14, color: '#1173BD', textDecoration: 'none' }}>
            {ar ? 'المركز الإعلامي' : 'Media Center'}
          </a>
        </div>
      </div>
    </div>
  );
};

/* ─── Main exported component ─── */
export const ClientStories = ({ route }) => {
  const { lang, dir } = useLang();
  const ar = lang === 'ar';

  useEffect(() => { window.scrollTo(0, 0); }, [route]);

  // Detail page: #/news/use-cases/:id or #/news/client-stories/:id
  const detailMatch = route?.match(/^#\/news\/(?:use-cases|client-stories)\/(.+)$/);
  if (detailMatch) {
    const id = detailMatch[1];
    const story = CASE_STUDIES.find(s => s.id === id);
    if (!story) {
      return (
        <div className="max-w-[800px] mx-auto px-6 py-24 text-center">
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#082D4A' }}>{ar ? 'دراسة الحالة غير موجودة' : 'Case study not found'}</h2>
          <a href="#/news/use-cases" style={{ color: '#1173BD', textDecoration: 'none', fontWeight: 600, marginTop: 12, display: 'inline-block' }}>
            {ar ? '← العودة إلى حالات الاستخدام' : '← Back to Use Cases'}
          </a>
        </div>
      );
    }
    return <StoryDetail story={story} ar={ar} dir={dir} />;
  }

  // Hub listing: #/news/use-cases or #/news/client-stories
  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Hero with exact MediaHero styling */}
      <MediaHero
        eyebrow={ar ? 'حالات الاستخدام' : 'Use Cases'}
        eyebrowIcon={BookOpen}
        eyebrowColor="#34d399"
        title={
          ar
            ? <>حالات الاستخدام <span style={{ color: '#FFB814', fontStyle: 'italic' }}>وقصص النجاح</span></>
            : <>Client <span style={{ color: '#FFB814', fontStyle: 'italic' }}>Use Cases</span> &amp; Transformations</>
        }
        subtitle={
          ar
            ? 'دراسات حالة موثقة ومُصنَّفة حسب القطاع والتقنية — تُظهِر كيف تُحدِث WAVZ تحولاً تشغيلياً ورقمياً قابلاً للقياس.'
            : 'Verified, anonymized use cases structured by sector and technology scope — showing how WAVZ delivers measurable, lasting operational impact.'
        }
        breadcrumbs={[
          { label: ar ? 'المركز الإعلامي' : 'Media Center', href: '#/news' },
          { label: ar ? 'حالات الاستخدام' : 'Use Cases' },
        ]}
        dir={dir}
        minHeight={280}
      />

      {/* Cards grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', paddingLeft: 'clamp(24px,6vw,80px)', paddingRight: 'clamp(24px,6vw,80px)' }} className="py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 w-full" style={{ width: '100%' }}>
          {CASE_STUDIES.map((story, i) => (
            <StoryCard key={story.id} story={story} ar={ar} dir={dir} i={i} />
          ))}
        </div>

        {/* Back to hub */}
        <div className="mt-14 pt-8 border-t" style={{ borderColor: 'rgba(8,45,74,0.08)' }}>
          <a href="#/news"
            className="inline-flex items-center gap-2 font-semibold"
            style={{ fontSize: 14, color: '#1173BD', textDecoration: 'none' }}>
            {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {ar ? 'العودة إلى المركز الإعلامي' : 'Back to Media Center'}
          </a>
        </div>
      </div>
    </div>
  );
};
