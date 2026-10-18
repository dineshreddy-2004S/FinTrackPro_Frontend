import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { formatINR } from '../utils/formatters';
import { exportToolToColorPDF, exportToolToExcel } from '../utils/exportFinancialTools';
import { useDraggableScroll } from '../utils/useDraggableScroll';
import {
  Calculator,
  FileSpreadsheet,
  FileText,
  DollarSign,
  TrendingUp,
  Percent,
  Landmark,
  CalendarCheck,
  Building,
  HelpCircle,
  BarChart,
  Repeat,
  Clock,
  ChevronsUpDown,
} from 'lucide-react';

export default function FinancialToolsSection() {
  const { theme } = useTheme();
  const scheduleScrollRef = useDraggableScroll();
  const [activeTool, setActiveTool] = useState('sip');

  // Input states stored as strings so users can clear/backspace without snapping to 0
  // 1. SIP State
  const [sipType, setSipType] = useState('monthly');
  const [sipAmount, setSipAmount] = useState('10000');
  const [sipRate, setSipRate] = useState('12.5');
  const [sipYears, setSipYears] = useState('10');

  // 2. TVM State
  const [tvmMode, setTvmMode] = useState('annuity');
  const [tvmPayment, setTvmPayment] = useState('25000');
  const [tvmRate, setTvmRate] = useState('8.5');
  const [tvmYears, setTvmYears] = useState('5');
  const [tvmAnnuityTiming, setTvmAnnuityTiming] = useState('end');

  // 3. Loan State
  const [loanPrincipal, setLoanPrincipal] = useState('2500000');
  const [loanRate, setLoanRate] = useState('8.75');
  const [loanTenureYears, setLoanTenureYears] = useState('15');

  // 4. FD State
  const [fdDeposit, setFdDeposit] = useState('100000');
  const [fdRate, setFdRate] = useState('6.75');
  const [fdTenureMonths, setFdTenureMonths] = useState('12');
  const [fdCompounding, setFdCompounding] = useState(4);

  // 5. SI & CI State
  const [sciPrincipal, setSciPrincipal] = useState('100000');
  const [sciRate, setSciRate] = useState('9.5');
  const [sciYears, setSciYears] = useState('5');

  // 6. Equity State
  const [eqDividend, setEqDividend] = useState('15');
  const [eqGrowthRate, setEqGrowthRate] = useState('6.5');
  const [eqRiskFree, setEqRiskFree] = useState('7.0');
  const [eqBeta, setEqBeta] = useState('1.15');
  const [eqMarketReturn, setEqMarketReturn] = useState('13.0');

  // 7. Preference Shares State
  const [prefDividend, setPrefDividend] = useState('12');
  const [prefMarketPrice, setPrefMarketPrice] = useState('105');
  const [prefRedemptionPrice, setPrefRedemptionPrice] = useState('100');
  const [prefRedemptionYears, setPrefRedemptionYears] = useState('5');

  // 8. Bond State
  const [bondFaceValue, setBondFaceValue] = useState('1000');
  const [bondCouponRate, setBondCouponRate] = useState('8.5');
  const [bondMarketPrice, setBondMarketPrice] = useState('975');
  const [bondTenure, setBondTenure] = useState('7');

  // 9. Debentures State
  const [debInterestRate, setDebInterestRate] = useState('9.0');
  const [debTaxRate, setDebTaxRate] = useState('25.17');
  const [debNetProceeds, setDebNetProceeds] = useState('98');
  const [debRedeemValue, setDebRedeemValue] = useState('100');
  const [debYears, setDebYears] = useState('5');

  // ================= CALCULATION ENGINES =================

  const calculateSIP = () => {
    const P = parseFloat(sipAmount) || 0;
    const annualR = (parseFloat(sipRate) || 0) / 100;
    const y = parseFloat(sipYears) || 0;

    if (sipType === 'monthly') {
      const i = annualR / 12;
      const n = y * 12;
      const maturityValue = i > 0 && n > 0 ? P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i) : P * n;
      const totalInvested = P * n;
      const wealthGain = maturityValue - totalInvested;

      const schedule = [];
      for (let yr = 1; yr <= y; yr++) {
        const m = yr * 12;
        const curMaturity = i > 0 ? P * ((Math.pow(1 + i, m) - 1) / i) * (1 + i) : P * m;
        schedule.push({
          Period: `Year ${yr}`,
          'Total Invested': formatINR(P * m, 2),
          'Estimated Corpus': formatINR(curMaturity, 2),
          'Wealth Gain': formatINR(curMaturity - P * m, 2),
        });
      }

      return {
        name: 'Monthly SIP Calculator',
        inputs: {
          'Monthly Investment': formatINR(P, 2),
          'Expected Return Rate (CAGR)': `${sipRate || 0}%`,
          'Investment Duration': `${y} Years (${n} Installments)`,
        },
        results: {
          'Expected Total Corpus': maturityValue,
          'Total Amount Invested': totalInvested,
          'Estimated Wealth Profit': wealthGain,
        },
        steps: [
          `Formula: M = P × [((1 + i)^n - 1) / i] × (1 + i)`,
          `Monthly Periodic Rate (i) = ${sipRate || 0}% ÷ 12 = ${(i * 100).toFixed(4)}%`,
          `Total Number of Installments (n) = ${y} years × 12 = ${n}`,
          `Total Capital Invested = ${formatINR(totalInvested, 2)}`,
          `Projected Wealth Gain = ${formatINR(wealthGain, 2)}`,
        ],
        schedule,
      };
    } else {
      const maturityValue = P * Math.pow(1 + annualR, y);
      const totalInvested = P;
      const wealthGain = maturityValue - totalInvested;

      const schedule = [];
      for (let yr = 1; yr <= y; yr++) {
        const val = P * Math.pow(1 + annualR, yr);
        schedule.push({
          Period: `Year ${yr}`,
          'Invested Capital': formatINR(P, 2),
          'Compounded Corpus': formatINR(val, 2),
          'Total Growth': formatINR(val - P, 2),
        });
      }

      return {
        name: 'One-Time Lumpsum SIP Calculator',
        inputs: {
          'One-Time Lumpsum Investment': formatINR(P, 2),
          'Expected Annual Return (CAGR)': `${sipRate || 0}%`,
          'Investment Horizon': `${y} Years`,
        },
        results: {
          'Maturity Corpus Value': maturityValue,
          'Principal Invested': totalInvested,
          'Total Wealth Gain': wealthGain,
        },
        steps: [
          `Formula: A = P × (1 + r)^t`,
          `Annual Compounding Rate (r) = ${sipRate || 0}%`,
          `Compounding Tenure (t) = ${y} Years`,
          `Effective Future Value = ${formatINR(maturityValue, 2)}`,
          `Absolute Profit Generated = ${formatINR(wealthGain, 2)}`,
        ],
        schedule,
      };
    }
  };

  const calculateTVM = () => {
    const C = parseFloat(tvmPayment) || 0;
    const r = (parseFloat(tvmRate) || 0) / 100;
    const n = parseFloat(tvmYears) || 0;
    const isDue = tvmAnnuityTiming === 'begin';
    const timingFactor = isDue ? 1 + r : 1;

    if (tvmMode === 'annuity') {
      const fvAnnuity = r > 0 && n > 0 ? C * ((Math.pow(1 + r, n) - 1) / r) * timingFactor : C * n;
      const pvAnnuity = r > 0 && n > 0 ? C * ((1 - Math.pow(1 + r, -n)) / r) * timingFactor : C * n;

      const schedule = [];
      for (let yr = 1; yr <= n; yr++) {
        const fvYear = r > 0 ? C * ((Math.pow(1 + r, yr) - 1) / r) * timingFactor : C * yr;
        const pvYear = r > 0 ? C * ((1 - Math.pow(1 + r, -yr)) / r) * timingFactor : C * yr;
        schedule.push({
          Year: `Year ${yr}`,
          'Cumulative Cash Outflow': formatINR(C * yr, 2),
          'Future Value (FV)': formatINR(fvYear, 2),
          'Present Value (PV)': formatINR(pvYear, 2),
        });
      }

      return {
        name: `Time Value of Money (Annuity ${isDue ? 'Due' : 'Ordinary'})`,
        inputs: {
          'Periodic Cash Flow (PMT)': formatINR(C, 2),
          'Discount / Interest Rate (r)': `${tvmRate || 0}%`,
          'Number of Periods (n)': `${n} Years`,
          'Payment Timing': isDue ? 'Beginning of Period (Annuity Due)' : 'End of Period (Ordinary Annuity)',
        },
        results: {
          'Future Value of Annuity (FV)': fvAnnuity,
          'Present Value of Annuity (PV)': pvAnnuity,
          'Total Nominal Cash Flows': C * n,
        },
        steps: [
          `FV Formula: FV = PMT × [((1 + r)^n - 1) / r] ${isDue ? '× (1 + r)' : ''}`,
          `PV Formula: PV = PMT × [(1 - (1 + r)^-n) / r] ${isDue ? '× (1 + r)' : ''}`,
          `Future Value Result: ${formatINR(fvAnnuity, 2)} at Year ${n}`,
          `Present Value Result: ${formatINR(pvAnnuity, 2)} required today`,
        ],
        schedule,
      };
    } else {
      const fvLumpsum = C * Math.pow(1 + r, n);
      const pvLumpsum = r > 0 ? C / Math.pow(1 + r, n) : C;

      const schedule = [];
      for (let yr = 1; yr <= n; yr++) {
        schedule.push({
          Year: `Year ${yr}`,
          'FV if invested today': formatINR(C * Math.pow(1 + r, yr), 2),
          'PV needed today': formatINR(C / Math.pow(1 + r, yr), 2),
        });
      }

      return {
        name: 'Time Value of Money (Lumpsum PV & FV)',
        inputs: {
          'Cash Flow Amount': formatINR(C, 2),
          'Discount / Interest Rate': `${tvmRate || 0}%`,
          'Time Horizon': `${n} Years`,
        },
        results: {
          'Future Value (if deposited today)': fvLumpsum,
          'Present Value (discounted to today)': pvLumpsum,
          'Discounting Factor': `${(1 / (Math.pow(1 + r, n) || 1)).toFixed(4)}`,
        },
        steps: [
          `Future Value Formula: FV = PV × (1 + r)^n = ${formatINR(fvLumpsum, 2)}`,
          `Present Value Formula: PV = FV / (1 + r)^n = ${formatINR(pvLumpsum, 2)}`,
        ],
        schedule,
      };
    }
  };

  const calculateLoan = () => {
    const P = parseFloat(loanPrincipal) || 0;
    const r = (parseFloat(loanRate) || 0) / 12 / 100;
    const n = (parseFloat(loanTenureYears) || 0) * 12;

    const emi = r > 0 && n > 0 ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    let balance = P;
    const schedule = [];
    for (let m = 1; m <= n; m++) {
      const interestPayment = balance * r;
      const principalPayment = emi - interestPayment;
      balance = Math.max(0, balance - principalPayment);

      schedule.push({
        Month: `Month ${m}`,
        'Opening Balance': Math.round(balance + principalPayment),
        EMI: Math.round(emi),
        'Principal Paid': Math.round(principalPayment),
        'Interest Paid': Math.round(interestPayment),
        'Closing Balance': Math.round(balance),
      });
    }

    return {
      name: 'Loan Amortization Schedule',
      inputs: {
        'Loan Principal': formatINR(P, 2),
        'Interest Rate per Annum': `${loanRate || 0}%`,
        'Loan Tenure': `${loanTenureYears || 0} Years (${n} Months)`,
      },
      results: {
        'Monthly EMI': emi,
        'Total Interest Payable': totalInterest,
        'Total Amount Repaid': totalPayment,
      },
      steps: [
        `Formula: EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]`,
        `Calculated Monthly EMI = ${formatINR(emi, 2)}`,
        `Total Repayment = ${formatINR(totalPayment, 2)} across all ${n} monthly installments`,
      ],
      schedule,
    };
  };

  const calculateFD = () => {
    const P = parseFloat(fdDeposit) || 0;
    const r = (parseFloat(fdRate) || 0) / 100;
    const t = (parseFloat(fdTenureMonths) || 0) / 12;
    const n = Number(fdCompounding) || 4;

    const maturityAmount = P * Math.pow(1 + r / n, n * t);
    const totalInterest = maturityAmount - P;
    const isTds = totalInterest > 40000;

    const schedule = [];
    const quarters = Math.ceil(t * n);
    for (let q = 1; q <= quarters; q++) {
      const balance = P * Math.pow(1 + r / n, q);
      schedule.push({
        Period: `Quarter ${q}`,
        'Principal Base': formatINR(P, 2),
        'Compound Value': formatINR(balance, 2),
        'Cumulative Interest': formatINR(balance - P, 2),
      });
    }

    return {
      name: 'Fixed Deposit (FD) Yield',
      inputs: {
        'Principal Deposit': formatINR(P, 2),
        'Interest Rate (% p.a.)': `${fdRate || 0}%`,
        'Tenure': `${fdTenureMonths || 0} Months (${t.toFixed(1)} Years)`,
        'Compounding Frequency': n === 4 ? 'Quarterly' : n === 12 ? 'Monthly' : 'Annual',
      },
      results: {
        'Maturity Value': maturityAmount,
        'Interest Earned': totalInterest,
        'TDS Tax Rule': isTds ? 'TDS Applicable (> Rs. 40,000)' : 'No TDS (< Rs. 40,000)',
      },
      steps: [
        `Formula: A = P × [1 + (r / n)]^(n × t)`,
        `Maturity Yield: ${formatINR(maturityAmount, 2)}`,
      ],
      schedule,
    };
  };

  const calculateSCI = () => {
    const P = parseFloat(sciPrincipal) || 0;
    const r = (parseFloat(sciRate) || 0) / 100;
    const t = parseFloat(sciYears) || 0;

    const siInterest = (P * (parseFloat(sciRate) || 0) * t) / 100;
    const ciMaturity = P * Math.pow(1 + r, t);
    const ciInterest = ciMaturity - P;
    const advantage = ciInterest - siInterest;

    return {
      name: 'Simple vs Compound Interest',
      inputs: {
        'Principal Sum': formatINR(P, 2),
        'Interest Rate (% p.a.)': `${sciRate || 0}%`,
        'Tenure Duration': `${t} Years`,
      },
      results: {
        'Simple Interest': siInterest,
        'Compound Interest': ciInterest,
        'Compounding Wealth Bonus': advantage,
      },
      steps: [
        `Simple Interest: I = (P × R × T) / 100 = ${formatINR(siInterest, 2)}`,
        `Compound Interest: A = P × (1 + r)^t = ${formatINR(ciMaturity, 2)}`,
      ],
      schedule: [],
    };
  };

  const calculateEquity = () => {
    const D0 = parseFloat(eqDividend) || 0;
    const g = (parseFloat(eqGrowthRate) || 0) / 100;
    const Rf = (parseFloat(eqRiskFree) || 0) / 100;
    const beta = parseFloat(eqBeta) || 0;
    const Rm = (parseFloat(eqMarketReturn) || 0) / 100;

    const Ke = Rf + beta * (Rm - Rf);
    const D1 = D0 * (1 + g);
    const isValid = Ke > g;
    const intrinsicValue = isValid ? D1 / (Ke - g) : 0;

    return {
      name: 'Equity Valuation (CAPM & Gordon Growth)',
      inputs: {
        'Latest Dividend (D0)': `Rs. ${D0.toFixed(2)}`,
        'Perpetual Growth Rate (g)': `${eqGrowthRate || 0}%`,
        'Risk-Free Rate (Rf)': `${eqRiskFree || 0}%`,
        'Equity Beta (β)': beta.toFixed(2),
        'Market Return (Rm)': `${eqMarketReturn || 0}%`,
      },
      results: {
        'Cost of Equity (Ke via CAPM)': `${(Ke * 100).toFixed(2)}%`,
        'Expected Dividend (D1)': `Rs. ${D1.toFixed(2)}`,
        'Intrinsic Value per Share': isValid ? intrinsicValue : 'Undefined (Ke <= g)',
      },
      steps: [
        `Step 1 (CAPM): Ke = Rf + β × (Rm - Rf) = ${(Ke * 100).toFixed(2)}%`,
        `Step 2 (Gordon Growth Model): P0 = D1 / (Ke - g) = ${formatINR(intrinsicValue, 2)}`,
      ],
      schedule: [],
    };
  };

  const calculatePreference = () => {
    const Dp = parseFloat(prefDividend) || 0;
    const P0 = parseFloat(prefMarketPrice) || 0;
    const RV = parseFloat(prefRedemptionPrice) || 0;
    const n = parseFloat(prefRedemptionYears) || 0;

    const kpIrredeemable = P0 > 0 ? (Dp / P0) * 100 : 0;
    const numerator = Dp + (RV - P0) / (n || 1);
    const denominator = (RV + P0) / 2;
    const kpRedeemable = denominator > 0 ? (numerator / denominator) * 100 : 0;

    return {
      name: 'Preference Share Valuation & Cost',
      inputs: {
        'Annual Dividend (Dp)': `Rs. ${Dp}`,
        'Current Market Price (P0)': `Rs. ${P0}`,
        'Redemption Value (RV)': `Rs. ${RV}`,
        'Redemption Period (n)': `${n} Years`,
      },
      results: {
        'Irredeemable Yield (Kp)': `${kpIrredeemable.toFixed(2)}%`,
        'Redeemable Cost of Capital': `${kpRedeemable.toFixed(2)}%`,
        'Price Status': RV > P0 ? 'Discount (Capital Gain)' : 'Par / Premium',
      },
      steps: [
        `Irredeemable: Kp = Dp / P0 = ${kpIrredeemable.toFixed(2)}%`,
        `Redeemable Approximation: Kp = [Dp + (RV - P0)/n] / [(RV + P0)/2] = ${kpRedeemable.toFixed(2)}%`,
      ],
      schedule: [],
    };
  };

  const calculateBond = () => {
    const M = parseFloat(bondFaceValue) || 0;
    const c = ((parseFloat(bondCouponRate) || 0) / 100) * M;
    const P = parseFloat(bondMarketPrice) || 0;
    const n = parseFloat(bondTenure) || 0;

    const ytmApprox = P > 0 && n > 0 ? ((c + (M - P) / n) / ((M + P) / 2)) * 100 : 0;
    const currentYield = P > 0 ? (c / P) * 100 : 0;

    return {
      name: 'Bond Valuation & Yield to Maturity',
      inputs: {
        'Bond Face Value': `Rs. ${M}`,
        'Coupon Rate': `${bondCouponRate || 0}% (Rs. ${c}/yr)`,
        'Market Purchase Price': `Rs. ${P}`,
        'Maturity Period': `${n} Years`,
      },
      results: {
        'Approximate YTM': `${ytmApprox.toFixed(2)}%`,
        'Current Yield': `${currentYield.toFixed(2)}%`,
        'Trading Status': P < M ? 'Trading at Discount' : 'Trading at Premium',
      },
      steps: [
        `Annual Coupon = ${bondCouponRate || 0}% × Rs. ${M} = Rs. ${c}`,
        `Current Yield = Coupon / Price = ${currentYield.toFixed(2)}%`,
        `YTM Approximation = [C + (M - P)/n] / [(M + P)/2] = ${ytmApprox.toFixed(2)}%`,
      ],
      schedule: [],
    };
  };

  const calculateDebenture = () => {
    const I = parseFloat(debInterestRate) || 0;
    const T = (parseFloat(debTaxRate) || 0) / 100;
    const NP = parseFloat(debNetProceeds) || 0;
    const RV = parseFloat(debRedeemValue) || 0;
    const n = parseFloat(debYears) || 0;

    const annualInterestPostTax = I * (1 - T);
    const capitalAmortization = (RV - NP) / (n || 1);
    const avgPrice = (RV + NP) / 2;
    const postTaxKd = avgPrice > 0 ? ((annualInterestPostTax + capitalAmortization) / avgPrice) * 100 : 0;

    return {
      name: 'Debenture Post-Tax Cost of Debt',
      inputs: {
        'Coupon Interest Rate': `${I}%`,
        'Corporate Tax Rate': `${debTaxRate || 0}%`,
        'Net Issue Proceeds': `Rs. ${NP}`,
        'Redemption Value': `Rs. ${RV}`,
        'Debenture Horizon': `${n} Years`,
      },
      results: {
        'Post-Tax Cost of Debt (Kd)': `${postTaxKd.toFixed(2)}%`,
        'Annual Tax Shield': `Rs. ${(I * T).toFixed(2)} per unit`,
      },
      steps: [
        `Formula: Kd = [I(1 - T) + (RV - NP)/n] / [(RV + NP)/2]`,
        `Effective Enterprise Cost of Debt = ${postTaxKd.toFixed(2)}%`,
      ],
      schedule: [],
    };
  };

  const getActiveData = () => {
    switch (activeTool) {
      case 'sip': return calculateSIP();
      case 'tvm': return calculateTVM();
      case 'loan': return calculateLoan();
      case 'fd': return calculateFD();
      case 'sci': return calculateSCI();
      case 'equity': return calculateEquity();
      case 'preference': return calculatePreference();
      case 'bond': return calculateBond();
      case 'debenture': return calculateDebenture();
      default: return calculateSIP();
    }
  };

  const currentCalc = getActiveData();

  const toolTabs = [
    { id: 'sip', label: 'SIP & Lumpsum', icon: Repeat },
    { id: 'tvm', label: 'Time Value (PV & FV)', icon: Clock },
    { id: 'loan', label: 'Loan Amortization', icon: Landmark },
    { id: 'fd', label: 'Fixed Deposits (FD)', icon: CalendarCheck },
    { id: 'sci', label: 'Interest (SI & CI)', icon: Percent },
    { id: 'equity', label: 'Equity Valuation', icon: TrendingUp },
    { id: 'preference', label: 'Preference Shares', icon: Building },
    { id: 'bond', label: 'Bonds & YTM', icon: DollarSign },
    { id: 'debenture', label: 'Debentures (Kd)', icon: BarChart },
  ];

  return (
    <div className="space-y-5 w-full">
      {/* Tool Selector Bar */}
      <div
        className={`p-3 rounded-xl border shadow-sm flex flex-wrap items-center gap-1.5 ${
          theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
        }`}
      >
        {toolTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTool === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTool(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                isActive
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                  : theme === 'dark'
                  ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Inputs Column */}
        <div
          className={`p-5 rounded-xl border shadow-sm space-y-4 ${
            theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-500/10">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Calculator className="w-4 h-4 text-sky-400" />
              <span>Input Parameters</span>
            </h3>
            <span className="text-[10px] uppercase font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
              Verified Formula
            </span>
          </div>

          {activeTool === 'sip' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">SIP Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSipType('monthly')}
                    className={`py-1.5 rounded-lg font-bold border transition ${
                      sipType === 'monthly'
                        ? 'bg-sky-500/15 border-sky-500/40 text-sky-400'
                        : 'border-zinc-500/20 text-zinc-400'
                    }`}
                  >
                    Monthly SIP
                  </button>
                  <button
                    type="button"
                    onClick={() => setSipType('lumpsum')}
                    className={`py-1.5 rounded-lg font-bold border transition ${
                      sipType === 'lumpsum'
                        ? 'bg-sky-500/15 border-sky-500/40 text-sky-400'
                        : 'border-zinc-500/20 text-zinc-400'
                    }`}
                  >
                    One-Time Lumpsum
                  </button>
                </div>
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">
                  {sipType === 'monthly' ? 'Monthly Investment (₹)' : 'Lumpsum Deposit (₹)'}
                </label>
                <input
                  type="text"
                  value={sipAmount}
                  onChange={(e) => setSipAmount(e.target.value)}
                  placeholder="e.g. 10000"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Expected Annual Return (% CAGR)</label>
                <input
                  type="text"
                  value={sipRate}
                  onChange={(e) => setSipRate(e.target.value)}
                  placeholder="e.g. 12.5"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Investment Duration (Years)</label>
                <input
                  type="text"
                  value={sipYears}
                  onChange={(e) => setSipYears(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTool === 'tvm' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Cash Flow Pattern</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTvmMode('annuity')}
                    className={`py-1.5 rounded-lg font-bold border transition ${
                      tvmMode === 'annuity'
                        ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-400'
                        : 'border-zinc-500/20 text-zinc-400'
                    }`}
                  >
                    Annuity Cash Flows
                  </button>
                  <button
                    type="button"
                    onClick={() => setTvmMode('lumpsum')}
                    className={`py-1.5 rounded-lg font-bold border transition ${
                      tvmMode === 'lumpsum'
                        ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-400'
                        : 'border-zinc-500/20 text-zinc-400'
                    }`}
                  >
                    Single Lumpsum
                  </button>
                </div>
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">
                  {tvmMode === 'annuity' ? 'Periodic Cash Flow (₹ PMT)' : 'Lumpsum Cash Flow (₹)'}
                </label>
                <input
                  type="text"
                  value={tvmPayment}
                  onChange={(e) => setTvmPayment(e.target.value)}
                  placeholder="e.g. 25000"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
              {tvmMode === 'annuity' && (
                <div>
                  <label className="text-zinc-400 font-semibold block mb-1">Annuity Timing</label>
                  <select
                    value={tvmAnnuityTiming}
                    onChange={(e) => setTvmAnnuityTiming(e.target.value)}
                    className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none text-black"
                  >
                    <option value="end">Ordinary Annuity (End of Period)</option>
                    <option value="begin">Annuity Due (Beginning of Period)</option>
                  </select>
                </div>
              )}
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Discount / Interest Rate (% p.a.)</label>
                <input
                  type="text"
                  value={tvmRate}
                  onChange={(e) => setTvmRate(e.target.value)}
                  placeholder="e.g. 8.5"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Tenure / Periods (Years)</label>
                <input
                  type="text"
                  value={tvmYears}
                  onChange={(e) => setTvmYears(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTool === 'loan' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Loan Principal (₹)</label>
                <input
                  type="text"
                  value={loanPrincipal}
                  onChange={(e) => setLoanPrincipal(e.target.value)}
                  placeholder="e.g. 2500000"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Annual Interest Rate (%)</label>
                <input
                  type="text"
                  value={loanRate}
                  onChange={(e) => setLoanRate(e.target.value)}
                  placeholder="e.g. 8.75"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Tenure (Years)</label>
                <input
                  type="text"
                  value={loanTenureYears}
                  onChange={(e) => setLoanTenureYears(e.target.value)}
                  placeholder="e.g. 15"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTool === 'fd' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Deposit Principal (₹)</label>
                <input
                  type="text"
                  value={fdDeposit}
                  onChange={(e) => setFdDeposit(e.target.value)}
                  placeholder="e.g. 100000"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Interest Rate (% p.a.)</label>
                <input
                  type="text"
                  value={fdRate}
                  onChange={(e) => setFdRate(e.target.value)}
                  placeholder="e.g. 6.75"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Tenure (Months)</label>
                <input
                  type="text"
                  value={fdTenureMonths}
                  onChange={(e) => setFdTenureMonths(e.target.value)}
                  placeholder="e.g. 12"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Compounding Frequency</label>
                <select
                  value={fdCompounding}
                  onChange={(e) => setFdCompounding(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none text-black"
                >
                  <option value={4}>Quarterly Compounding</option>
                  <option value={12}>Monthly Compounding</option>
                  <option value={1}>Annual Compounding</option>
                </select>
              </div>
            </div>
          )}

          {activeTool === 'sci' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Principal Sum (₹)</label>
                <input
                  type="text"
                  value={sciPrincipal}
                  onChange={(e) => setSciPrincipal(e.target.value)}
                  placeholder="e.g. 100000"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Annual Interest Rate (%)</label>
                <input
                  type="text"
                  value={sciRate}
                  onChange={(e) => setSciRate(e.target.value)}
                  placeholder="e.g. 9.5"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Time Horizon (Years)</label>
                <input
                  type="text"
                  value={sciYears}
                  onChange={(e) => setSciYears(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTool === 'equity' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Last Annual Dividend (D0 ₹)</label>
                <input
                  type="text"
                  value={eqDividend}
                  onChange={(e) => setEqDividend(e.target.value)}
                  placeholder="e.g. 15"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Perpetual Dividend Growth Rate (g %)</label>
                <input
                  type="text"
                  value={eqGrowthRate}
                  onChange={(e) => setEqGrowthRate(e.target.value)}
                  placeholder="e.g. 6.5"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Risk-Free Rate Rf (10Y G-Sec %)</label>
                <input
                  type="text"
                  value={eqRiskFree}
                  onChange={(e) => setEqRiskFree(e.target.value)}
                  placeholder="e.g. 7.0"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Stock Beta (β)</label>
                <input
                  type="text"
                  value={eqBeta}
                  onChange={(e) => setEqBeta(e.target.value)}
                  placeholder="e.g. 1.15"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Expected Market Return Rm (%)</label>
                <input
                  type="text"
                  value={eqMarketReturn}
                  onChange={(e) => setEqMarketReturn(e.target.value)}
                  placeholder="e.g. 13.0"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTool === 'preference' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Preference Dividend (₹/share)</label>
                <input
                  type="text"
                  value={prefDividend}
                  onChange={(e) => setPrefDividend(e.target.value)}
                  placeholder="e.g. 12"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Current Market Price (P0 ₹)</label>
                <input
                  type="text"
                  value={prefMarketPrice}
                  onChange={(e) => setPrefMarketPrice(e.target.value)}
                  placeholder="e.g. 105"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Redemption Value (RV ₹)</label>
                <input
                  type="text"
                  value={prefRedemptionPrice}
                  onChange={(e) => setPrefRedemptionPrice(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Maturity Horizon (Years)</label>
                <input
                  type="text"
                  value={prefRedemptionYears}
                  onChange={(e) => setPrefRedemptionYears(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTool === 'bond' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Bond Face Value (M ₹)</label>
                <input
                  type="text"
                  value={bondFaceValue}
                  onChange={(e) => setBondFaceValue(e.target.value)}
                  placeholder="e.g. 1000"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Coupon Interest Rate (%)</label>
                <input
                  type="text"
                  value={bondCouponRate}
                  onChange={(e) => setBondCouponRate(e.target.value)}
                  placeholder="e.g. 8.5"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Market Purchase Price (P ₹)</label>
                <input
                  type="text"
                  value={bondMarketPrice}
                  onChange={(e) => setBondMarketPrice(e.target.value)}
                  placeholder="e.g. 975"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Tenure to Maturity (Years)</label>
                <input
                  type="text"
                  value={bondTenure}
                  onChange={(e) => setBondTenure(e.target.value)}
                  placeholder="e.g. 7"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTool === 'debenture' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Debenture Coupon Rate (%)</label>
                <input
                  type="text"
                  value={debInterestRate}
                  onChange={(e) => setDebInterestRate(e.target.value)}
                  placeholder="e.g. 9.0"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Corporate Tax Rate (%)</label>
                <input
                  type="text"
                  value={debTaxRate}
                  onChange={(e) => setDebTaxRate(e.target.value)}
                  placeholder="e.g. 25.17"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Net Issue Proceeds (NP ₹)</label>
                <input
                  type="text"
                  value={debNetProceeds}
                  onChange={(e) => setDebNetProceeds(e.target.value)}
                  placeholder="e.g. 98"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Redemption Value (RV ₹)</label>
                <input
                  type="text"
                  value={debRedeemValue}
                  onChange={(e) => setDebRedeemValue(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Tenure (Years)</label>
                <input
                  type="text"
                  value={debYears}
                  onChange={(e) => setDebYears(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full p-2 rounded-lg border bg-zinc-500/5 border-zinc-500/20 font-mono font-bold focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Export Action Buttons */}
          <div className="pt-2 border-t border-zinc-500/10 grid grid-cols-2 gap-2">
            <button
              onClick={() =>
                exportToolToColorPDF(
                  currentCalc.name,
                  currentCalc.inputs,
                  currentCalc.results,
                  currentCalc.schedule,
                  currentCalc.steps
                )
              }
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Color PDF</span>
            </button>
            <button
              onClick={() =>
                exportToolToExcel(
                  currentCalc.name,
                  currentCalc.inputs,
                  currentCalc.results,
                  currentCalc.schedule
                )
              }
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Outputs & Derivations */}
        <div className="lg:col-span-2 space-y-4">
          {/* Key Output Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.entries(currentCalc.results).slice(0, 3).map(([key, val]) => (
              <div
                key={key}
                className={`p-4 rounded-xl border shadow-sm relative overflow-hidden ${
                  theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
                }`}
              >
                <div className="h-1 w-full bg-gradient-to-r from-sky-400 to-indigo-600 absolute top-0 left-0" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  {key}
                </span>
                <p className="text-xl font-bold font-mono text-sky-400 mt-1">
                  {typeof val === 'number' &&
                  !String(key).toLowerCase().includes('rate') &&
                  !String(key).toLowerCase().includes('percent') &&
                  !String(key).toLowerCase().includes('factor')
                    ? formatINR(val, 2)
                    : String(val)}
                </p>
              </div>
            ))}
          </div>

          {/* Mathematical Proof & Formulas */}
          <div
            className={`p-5 rounded-xl border shadow-sm space-y-2.5 ${
              theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
            }`}
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-sky-400" />
              <span>Mathematical Proof & Formula Derivations</span>
            </h4>
            <div className="space-y-1.5 text-xs font-mono text-zinc-300">
              {currentCalc.steps.map((st, i) => (
                <div key={i} className="p-2 rounded bg-zinc-500/5 border border-zinc-500/10">
                  {st}
                </div>
              ))}
            </div>
          </div>

          {/* Fully Scrollable Schedule / Amortization Table */}
          {currentCalc.schedule && currentCalc.schedule.length > 0 && (
            <div
              className={`rounded-xl border shadow-sm overflow-hidden ${
                theme === 'dark' ? 'bg-[#0a0f1d] border-zinc-800' : 'bg-white border-zinc-200'
              }`}
            >
              <div className="p-3 border-b border-zinc-500/10 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Amortization / Growth Schedule Projection ({currentCalc.schedule.length} Periods)
                </span>
                <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                  <ChevronsUpDown className="w-3 h-3 text-sky-400" />
                  Scrollable / Drag-enabled
                </span>
              </div>

              {/* Unlocked Vertical + Horizontal Container */}
              <div
                ref={scheduleScrollRef}
                tabIndex={0}
                className="overflow-x-auto overflow-y-auto max-h-[460px] no-scrollbar select-none cursor-grab active:cursor-grabbing focus:outline-none"
              >
                <table className="w-full text-left text-xs whitespace-nowrap min-w-[620px]">
                  <thead className="sticky top-0 z-20 bg-indigo-600 text-white font-bold uppercase text-[10px] shadow-sm">
                    <tr>
                      {Object.keys(currentCalc.schedule[0]).map((h) => (
                        <th key={h} className="py-2.5 px-3">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={`divide-y font-mono ${theme === 'dark' ? 'divide-zinc-800/80' : 'divide-zinc-200/90'}`}>
                    {currentCalc.schedule.map((row, idx) => (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          theme === 'dark' ? 'hover:bg-zinc-800/50' : 'hover:bg-zinc-100/70'
                        }`}
                      >
                        {Object.values(row).map((v, i) => (
                          <td key={i} className="py-2 px-3 text-zinc-300">
                            {typeof v === 'number' ? formatINR(v, 2) : String(v)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}