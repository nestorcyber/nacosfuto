import React, { useState } from 'react';
import { CheckCircle, QrCode, ShieldCheck, Printer } from 'lucide-react';
import PortalLayout from '../components/PortalLayout';
import logoDark from '../assets/full-logo-dark.png';
import logoLight from '../assets/full-logo-light.png';
import { useTheme } from '../context/ThemeContext';

const Dues = () => {
  const [isPrinting, setIsPrinting] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const paymentRecord = {
    receiptNo: 'NACOS-FUTO-2025-08941',
    session: '2024/2025 Academic Session',
    studentName: 'David Okonkwo',
    matricNo: '2022/139481',
    level: '300 Level',
    department: 'Computer Science',
    amount: '₦2,500.00',
    amountInWords: 'Two Thousand Five Hundred Naira Only',
    paymentDate: '12th November, 2024 (14:32:10 GMT+1)',
    paymentMethod: 'Interswitch WebPAY / Direct Card Debit',
    status: 'Verified & Cleared',
    authorizedBy: 'NACOS FUTO Directorate of Finance'
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      window.print();
    }, 400);
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Dues Clearance & Receipts
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-green-200/80 font-normal mt-0.5">
              Official annual departmental association dues payment confirmation and electronic receipt.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            disabled={isPrinting}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{isPrinting ? 'Generating Printout...' : 'Print Official Receipt'}</span>
          </button>
        </div>

        {/* 3 Overview Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 sm:p-5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 space-y-1.5">
            <span className="text-xs font-semibold text-gray-500 dark:text-green-200/80">Clearance Status</span>
            <div className="flex items-center gap-2 text-xl font-bold text-[#138601] dark:text-[#4bd043]">
              <CheckCircle className="w-5 h-5" />
              <span>Dues Cleared</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-green-200/70 font-normal">Eligible for departmental clearance</p>
          </div>

          <div className="p-4 sm:p-5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 space-y-1.5">
            <span className="text-xs font-semibold text-gray-500 dark:text-green-200/80">Current Session Amount</span>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">₦2,500.00</div>
            <p className="text-xs text-gray-500 dark:text-green-200/70 font-normal">2024/2025 Academic Session</p>
          </div>

          <div className="p-4 sm:p-5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 space-y-1.5">
            <span className="text-xs font-semibold text-gray-500 dark:text-green-200/80">Electronic Receipt Number</span>
            <div className="text-sm font-semibold text-gray-900 dark:text-white font-mono">{paymentRecord.receiptNo}</div>
            <p className="text-xs text-[#138601] dark:text-[#4bd043] font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Cryptographically Signed
            </p>
          </div>
        </div>

        {/* Official Printable Electronic Receipt Box */}
        <div className="p-6 sm:p-8 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/40 space-y-6">
          
          {/* Receipt Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-gray-200 dark:border-[#138601]/30 text-center sm:text-left">
            <div className="flex items-center space-x-3">
              <img src={isDark ? logoDark : logoLight} alt="NACOS Logo" className="h-9 w-auto object-contain" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-tight">
                  Nigeria Association of Computing Students
                </h3>
                <p className="text-xs text-gray-500 dark:text-green-200 font-medium">Department of Computer Science • FUTO Chapter</p>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="inline-block px-3 py-1 rounded text-xs font-semibold bg-[#ebf3ff] text-[#138601] dark:bg-[#138601]/30 dark:text-[#4bd043]">
                Official Electronic Receipt
              </div>
              <div className="text-xs text-gray-500 dark:text-green-200/70 mt-1 font-mono">{paymentRecord.receiptNo}</div>
            </div>
          </div>

          {/* Receipt Data Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-xs">
            <div>
              <span className="text-gray-500 dark:text-green-200/70 block mb-0.5">Student Full Name</span>
              <span className="font-semibold text-sm text-gray-900 dark:text-white">{paymentRecord.studentName}</span>
            </div>

            <div>
              <span className="text-gray-500 dark:text-green-200/70 block mb-0.5">Matriculation Number</span>
              <span className="font-semibold text-sm text-gray-900 dark:text-white font-mono">{paymentRecord.matricNo}</span>
            </div>

            <div>
              <span className="text-gray-500 dark:text-green-200/70 block mb-0.5">Department & Level</span>
              <span className="font-semibold text-sm text-gray-900 dark:text-white">{paymentRecord.department} ({paymentRecord.level})</span>
            </div>

            <div>
              <span className="text-gray-500 dark:text-green-200/70 block mb-0.5">Academic Session</span>
              <span className="font-semibold text-sm text-gray-900 dark:text-white">{paymentRecord.session}</span>
            </div>

            <div>
              <span className="text-gray-500 dark:text-green-200/70 block mb-0.5">Payment Date & Time</span>
              <span className="font-semibold text-sm text-gray-900 dark:text-white">{paymentRecord.paymentDate}</span>
            </div>

            <div>
              <span className="text-gray-500 dark:text-green-200/70 block mb-0.5">Payment Method</span>
              <span className="font-semibold text-sm text-gray-900 dark:text-white">{paymentRecord.paymentMethod}</span>
            </div>

            <div className="sm:col-span-2 pt-4 border-t border-gray-100 dark:border-[#138601]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-gray-500 dark:text-green-200/70 block mb-0.5">Amount Paid</span>
                <span className="text-2xl font-bold text-[#138601] dark:text-[#4bd043]">{paymentRecord.amount}</span>
                <span className="text-xs text-gray-500 dark:text-green-200/70 block italic font-normal">{paymentRecord.amountInWords}</span>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded bg-[#f1f3f5] dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/30">
                <QrCode className="w-9 h-9 text-gray-700 dark:text-[#4bd043]" />
                <div className="text-[11px] text-gray-600 dark:text-green-200/80 font-normal">
                  <div className="font-semibold text-gray-900 dark:text-white">Scan to Verify</div>
                  <div>Authenticity Token Valid</div>
                </div>
              </div>
            </div>
          </div>

          {/* Receipt Footer */}
          <div className="pt-5 border-t border-gray-100 dark:border-[#138601]/20 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-green-200/70 gap-2 text-center sm:text-left font-normal">
            <span>Authorized by: {paymentRecord.authorizedBy}</span>
            <span>This is a computer-generated receipt. No physical stamp required.</span>
          </div>

        </div>

      </div>
    </PortalLayout>
  );
};

export default Dues;
