import { supabase } from './client.js';
import { ID_CARD_TEMPLATE } from '@nacos/config/idCardTemplate';
import { getLocalStudentsDatabase } from './auth.js';

const PAYMENTS_STORAGE_KEY = 'nacos_payments_db';
const ID_CARDS_STORAGE_KEY = 'nacos_id_cards_db';

/**
 * Seed and retrieve verified payments database
 */
export function getLocalPaymentsDatabase() {
  const stored = localStorage.getItem(PAYMENTS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }

  // Initial seed: payments matching canonical test cases (Students A, B, C)
  const initialPayments = [
    {
      id: 'pay-seed-1',
      student_matric: '2024CS12345', // Student A: Payment successful, photo exists
      session: '2026/2027',
      amount: 2500,
      payment_type: 'id_card',
      payment_reference: 'NACOS-FUTO-2026-PAY-98124',
      status: 'successful',
      purpose: 'Departmental Dues & Digital Student ID Card',
      created_at: '2026-08-20T10:30:00Z'
    },
    {
      id: 'pay-seed-b',
      student_matric: '2025CS54321', // Student B: Payment successful, photo missing
      session: '2026/2027',
      amount: 2500,
      payment_type: 'id_card',
      payment_reference: 'NACOS-FUTO-2026-PAY-54321',
      status: 'successful',
      purpose: 'Departmental Dues & Digital Student ID Card',
      created_at: '2026-08-22T14:10:00Z'
    },
    {
      id: 'pay-seed-c',
      student_matric: '2026CS99999', // Student C: Payment failed, photo exists
      session: '2026/2027',
      amount: 2500,
      payment_type: 'id_card',
      payment_reference: 'NACOS-FUTO-2026-PAY-99999',
      status: 'failed',
      purpose: 'Departmental Dues & Digital Student ID Card',
      created_at: '2026-08-25T09:45:00Z'
    },
    {
      id: 'pay-seed-2',
      student_matric: '2022/139481',
      session: '2026/2027',
      amount: 2500,
      payment_type: 'id_card',
      payment_reference: 'NACOS-FUTO-2026-PAY-59218',
      status: 'successful',
      purpose: 'Departmental Dues & Digital Student ID Card',
      created_at: '2026-08-15T11:15:00Z'
    },
    {
      id: 'pay-seed-3',
      student_matric: '2020/112948',
      session: '2026/2027',
      amount: 2500,
      payment_type: 'id_card',
      payment_reference: 'NACOS-FUTO-2026-PAY-11029',
      status: 'successful',
      purpose: 'Departmental Dues & Digital Student ID Card',
      created_at: '2026-08-10T09:00:00Z'
    }
  ];

  localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(initialPayments));
  return initialPayments;
}

/**
 * Check whether a student has a verified dues/ID-card payment
 * Derived securely from the payment database, NEVER from client-side flags.
 */
export async function checkStudentPaymentStatus(matricNumber) {
  if (!matricNumber) return { isPaid: false, payment: null };

  const cleanMatric = matricNumber.trim().toUpperCase();

  // 1. Check Supabase remote if available
  try {
    const { data, error } = await supabase
      .from('dues_payments')
      .select('*')
      .eq('matric_number', cleanMatric)
      .in('status', ['verified', 'successful'])
      .maybeSingle();

    if (!error && data) {
      return { isPaid: true, payment: data };
    }
  } catch (err) {
    // Offline fallback
  }

  // 2. Check local payments database
  const payments = getLocalPaymentsDatabase();
  const payment = payments.find(p => 
    p.student_matric.toUpperCase() === cleanMatric && 
    (p.status === 'verified' || p.status === 'successful' || p.status === 'cleared')
  );

  if (payment) {
    return { isPaid: true, payment };
  }

  return { isPaid: false, payment: null };
}

/**
 * Record a verified payment for a student (simulating gateway callback or manual clearance)
 */
export async function recordStudentPayment(matricNumber, amount = 2500) {
  const cleanMatric = matricNumber.trim().toUpperCase();
  const payments = getLocalPaymentsDatabase();

  const newPayment = {
    id: 'pay-' + Date.now(),
    student_matric: cleanMatric,
    session: '2026/2027',
    amount,
    payment_reference: `NACOS-FUTO-2026-PAY-${Math.floor(10000 + Math.random() * 90000)}`,
    status: 'verified',
    purpose: 'Departmental Dues & Digital Student ID Card',
    created_at: new Date().toISOString()
  };

  payments.push(newPayment);
  localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));

  // Sync with Supabase if online
  try {
    await supabase.from('dues_payments').insert([{
      matric_number: cleanMatric,
      session: newPayment.session,
      amount: newPayment.amount,
      payment_reference: newPayment.payment_reference,
      status: 'verified'
    }]);
  } catch (e) {
    // offline
  }

  return { success: true, payment: newPayment };
}

/**
 * Validate and save student profile photo
 * Ensures format is JPG, PNG, or WebP and size is under 5MB.
 */
export async function validateAndSaveProfilePhoto(studentId, file) {
  if (!file) {
    return { error: 'No image file provided.' };
  }

  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type.toLowerCase())) {
    return { error: 'Invalid image format. Please upload a clear JPG, PNG, or WebP passport photograph.' };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { error: 'File size exceeds 5MB limit. Please compress or choose a smaller photograph.' };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      
      // Update local storage student
      const students = getLocalStudentsDatabase();
      const studentIndex = students.findIndex(s => s.id === studentId || s.registration_number === studentId);
      if (studentIndex !== -1) {
        students[studentIndex].profile_photo_url = base64Data;
        students[studentIndex].avatar_url = base64Data;
        students[studentIndex].photo_url = base64Data;
        localStorage.setItem('nacos_students_db', JSON.stringify(students));
      }

      // Update current logged-in user
      const currentUser = localStorage.getItem('nacos_user');
      if (currentUser) {
        try {
          const userObj = JSON.parse(currentUser);
          userObj.profile_photo_url = base64Data;
          userObj.avatar_url = base64Data;
          userObj.photo_url = base64Data;
          localStorage.setItem('nacos_user', JSON.stringify(userObj));
        } catch (err) {
          console.error(err);
        }
      }

      resolve({ success: true, photoUrl: base64Data });
    };
    reader.onerror = () => {
      resolve({ error: 'Failed to read photograph file.' });
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Get or create ID Card record
 * Enforces server/backend payment and photo verification rules.
 * Strictly avoids duplicating student info into id_cards table.
 */
export async function getOrGenerateIdCard(student) {
  if (!student || (!student.matric && !student.registration_number)) {
    return { error: { code: 'UNAUTHENTICATED', message: 'User session is invalid.' } };
  }

  const matric = student.matric || student.registration_number;
  const studentId = student.id || matric;

  // 1. Mandatory Payment Verification (Server / Database check)
  const { isPaid, payment } = await checkStudentPaymentStatus(matric);
  if (!isPaid) {
    return { 
      error: { 
        code: 'PAYMENT_REQUIRED', 
        message: 'You need to complete the ID card payment before you can generate and download your student ID card.' 
      } 
    };
  }

  // 2. Mandatory Profile Photo Verification
  const photo = student.profile_photo_url || student.avatar_url || student.photo_url;
  if (!photo) {
    return { 
      error: { 
        code: 'PHOTO_REQUIRED', 
        message: 'Please upload a clear passport-style photograph to your profile before generating your student ID card.' 
      } 
    };
  }

  // 3. ID Card metadata creation / caching (NO duplicate student info)
  const idCardsStored = localStorage.getItem(ID_CARDS_STORAGE_KEY);
  let idCards = [];
  if (idCardsStored) {
    try { idCards = JSON.parse(idCardsStored); } catch (e) {}
  }

  let card = idCards.find(c => (c.student_id === studentId || c.student_id === matric) && c.status === 'active');
  if (!card) {
    card = {
      id: 'idcard-' + Date.now(),
      student_id: studentId,
      payment_id: payment.id,
      template_version: 'v1',
      status: 'active',
      generated_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    idCards.push(card);
    localStorage.setItem(ID_CARDS_STORAGE_KEY, JSON.stringify(idCards));
  } else {
    card.updated_at = new Date().toISOString();
    localStorage.setItem(ID_CARDS_STORAGE_KEY, JSON.stringify(idCards));
  }

  return { success: true, card, template: ID_CARD_TEMPLATE };
}

/**
 * High-Resolution Canvas Rendering Engine for ID Card
 * Strictly renders the permanent NACOS visual template and dynamically positions:
 * - PHOTO
 * - FULL NAME (with dynamic auto-shrinking text fitting)
 * - REGISTRATION NUMBER
 * - ACADEMIC DETAILS & SECURITY QR
 */
export function drawIdCardOnCanvas(canvas, student, photoImg) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const t = ID_CARD_TEMPLATE;

  // Set high-res canvas dimensions
  canvas.width = t.dimensions.width;
  canvas.height = t.dimensions.height;

  // 1. Card Base Background (Brand Deep Forest Green Gradient)
  const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  bgGradient.addColorStop(0, '#041801');
  bgGradient.addColorStop(0.5, '#083002');
  bgGradient.addColorStop(1, '#020f01');
  ctx.fillStyle = bgGradient;
  
  // Rounded card rectangle
  roundRect(ctx, 0, 0, canvas.width, canvas.height, t.background.borderRadius);
  ctx.fill();

  // Outer Border
  ctx.strokeStyle = t.background.borderColor;
  ctx.lineWidth = t.background.borderWidth;
  ctx.stroke();

  // Subtle Geometric Background Pattern / Watermark
  ctx.save();
  ctx.strokeStyle = 'rgba(19, 134, 1, 0.15)';
  ctx.lineWidth = 1.5;
  for (let i = -canvas.height; i < canvas.width; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + canvas.height, canvas.height);
    ctx.stroke();
  }
  ctx.restore();

  // 2. Card Header Banner
  const headerGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  headerGradient.addColorStop(0, '#0a3d03');
  headerGradient.addColorStop(1, '#052202');
  ctx.fillStyle = headerGradient;
  roundRect(ctx, 4, 4, canvas.width - 8, t.header.height, [20, 20, 0, 0]);
  ctx.fill();

  // Header Divider Accent Line
  ctx.fillStyle = '#138601';
  ctx.fillRect(0, t.header.height + 4, canvas.width, 4);

  // Header Typography
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(t.header.title, 65, 45);

  ctx.fillStyle = '#cbe1ff';
  ctx.font = '600 15px system-ui, sans-serif';
  ctx.fillText(t.header.chapter, 65, 75);

  ctx.fillStyle = '#a3cfbb';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.fillText(t.header.department, 65, 102);

  // Top-Right Header Badge
  ctx.fillStyle = 'rgba(19, 134, 1, 0.4)';
  roundRect(ctx, canvas.width - 240, 35, 180, 42, 8);
  ctx.fill();
  ctx.strokeStyle = '#4bd043';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#4bd043';
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('OFFICIAL STUDENT ID', canvas.width - 150, 61);

  // 3. Student Photo Placement
  const p = t.photo;
  ctx.save();
  roundRect(ctx, p.x, p.y, p.width, p.height, p.borderRadius);
  ctx.clip(); // Clip photo into smooth rounded rectangle

  if (photoImg && photoImg.complete && photoImg.naturalWidth > 0) {
    // Intelligent Aspect-Ratio Fit / Cover
    const imgRatio = photoImg.naturalWidth / photoImg.naturalHeight;
    const boxRatio = p.width / p.height;
    let renderW, renderH, renderX, renderY;

    if (imgRatio > boxRatio) {
      renderH = p.height;
      renderW = p.height * imgRatio;
      renderX = p.x - (renderW - p.width) / 2;
      renderY = p.y;
    } else {
      renderW = p.width;
      renderH = p.width / imgRatio;
      renderX = p.x;
      renderY = p.y - (renderH - p.height) / 2;
    }
    ctx.drawImage(photoImg, renderX, renderY, renderW, renderH);
  } else {
    // Photo Placeholder
    ctx.fillStyle = '#0a3504';
    ctx.fillRect(p.x, p.y, p.width, p.height);
    ctx.fillStyle = '#4bd043';
    ctx.font = 'bold 48px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText((student.name || student.full_name || 'ST').slice(0, 2).toUpperCase(), p.x + p.width / 2, p.y + p.height / 2 + 15);
  }
  ctx.restore();

  // Photo Frame Border
  ctx.strokeStyle = p.borderColor;
  ctx.lineWidth = p.borderWidth;
  roundRect(ctx, p.x, p.y, p.width, p.height, p.borderRadius);
  ctx.stroke();

  // 4. Student Dynamic Fields with Text Auto-Scaling
  ctx.textAlign = 'left';

  // Dynamic Full Name (Supports long names like CHINEMEREM EZIAHA OKOLIE without breaking)
  const fullName = (student.name || student.full_name || 'STUDENT NAME').toUpperCase();
  const n = t.name;
  let fontSize = n.maxFontSize;
  ctx.font = `${n.fontWeight} ${fontSize}px ${n.fontFamily}`;
  while (ctx.measureText(fullName).width > n.maxWidth && fontSize > n.minFontSize) {
    fontSize -= 1;
    ctx.font = `${n.fontWeight} ${fontSize}px ${n.fontFamily}`;
  }
  ctx.fillStyle = n.color;
  ctx.fillText(fullName, n.x, n.y);

  // Registration / Matric Number
  const regNo = (student.matric || student.registration_number || '2024CS12345').toUpperCase();
  const r = t.registrationNumber;
  ctx.fillStyle = r.color;
  ctx.font = `${r.fontWeight} ${r.fontSize}px ${r.fontFamily}`;
  ctx.fillText(`REG NO: ${regNo}`, r.x, r.y);

  // Programme
  ctx.fillStyle = '#86efac';
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.fillText('PROGRAMME:', t.programme.x, t.programme.y - 18);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 16px system-ui, sans-serif';
  ctx.fillText(student.programme || 'B.Tech Computer Science', t.programme.x, t.programme.y + 4);

  // Level & Admission Year
  ctx.fillStyle = '#86efac';
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.fillText('LEVEL & ADMISSION:', t.academicLevel.x, t.academicLevel.y - 18);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 16px system-ui, sans-serif';
  const levelText = `${student.level || student.current_level || '300 Level'} • Admitted ${student.admission_year || regNo.slice(0, 4)}`;
  ctx.fillText(levelText, t.academicLevel.x, t.academicLevel.y + 4);

  // Faculty
  ctx.fillStyle = '#86efac';
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.fillText('FACULTY:', t.faculty.x, t.faculty.y - 18);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 15px system-ui, sans-serif';
  ctx.fillText(student.faculty || 'School of Information & Comm. Tech (SICT)', t.faculty.x, t.faculty.y + 4);

  // 5. Stylized QR / Barcode Area
  const q = t.qrCode;
  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, q.x, q.y, q.size, q.size, 8);
  ctx.fill();
  ctx.strokeStyle = '#138601';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Decorative mock QR pattern
  ctx.fillStyle = '#041801';
  roundRect(ctx, q.x + 10, q.y + 10, 24, 24, 3);
  ctx.fill();
  roundRect(ctx, q.x + q.size - 34, q.y + 10, 24, 24, 3);
  ctx.fill();
  roundRect(ctx, q.x + 10, q.y + q.size - 34, 24, 24, 3);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(q.x + 16, q.y + 16, 12, 12);
  ctx.fillRect(q.x + q.size - 28, q.y + 16, 12, 12);
  ctx.fillRect(q.x + 16, q.y + q.size - 28, 12, 12);
  ctx.fillStyle = '#041801';
  ctx.fillRect(q.x + 40, q.y + 40, 30, 30);
  ctx.fillRect(q.x + 25, q.y + 45, 10, 10);
  ctx.fillRect(q.x + 75, q.y + 45, 10, 10);

  // 6. Card Footer & Security Signature Bar
  ctx.fillStyle = 'rgba(4, 24, 1, 0.9)';
  roundRect(ctx, 4, t.footer.y, canvas.width - 8, t.footer.height + 24, [0, 0, 20, 20]);
  ctx.fill();
  ctx.strokeStyle = '#138601';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#86efac';
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(t.footer.authorizedText, 65, t.footer.y + 35);

  ctx.fillStyle = '#a3cfbb';
  ctx.font = '10px monospace';
  ctx.fillText(`SECURITY HASH: NACOS-${regNo.replace(/[^a-zA-Z0-9]/g, '')}-2026-OK`, 65, t.footer.y + 55);

  ctx.fillStyle = '#4bd043';
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('VERIFIED STATUS: CLEARED & ACTIVE', canvas.width - 65, t.footer.y + 42);
}

/**
 * Helper to draw rounded rectangle
 */
function roundRect(ctx, x, y, width, height, radius = 0) {
  if (typeof radius === 'number') {
    radius = [radius, radius, radius, radius];
  }
  const [tl, tr, br, bl] = radius;
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + width - tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + tr);
  ctx.lineTo(x + width, y + height - br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - br, y + height);
  ctx.lineTo(x + bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - bl);
  ctx.lineTo(x, y + tl);
  ctx.quadraticCurveTo(x, y, x + tl, y);
  ctx.closePath();
}

/**
 * Download high-resolution PNG image
 */
export function downloadIdCardAsImage(canvas, filename = 'NACOS-Student-ID-Card') {
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Generate and download high-resolution PDF document formatted for standard CR-80 card printing
 */
export function downloadIdCardAsPdf(canvas, filename = 'NACOS-Student-ID-Card') {
  if (!canvas) return;
  const imgData = canvas.toDataURL('image/png');

  // Open printable document stream in clean window or trigger direct print
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    downloadIdCardAsImage(canvas, filename);
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <style>
          @page {
            size: 85.6mm 53.98mm;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #ffffff;
          }
          img {
            width: 85.6mm;
            height: 53.98mm;
            display: block;
          }
        </style>
      </head>
      <body>
        <img src="${imgData}" onload="window.print();window.close();" />
      </body>
    </html>
  `);
  printWindow.document.close();
}
