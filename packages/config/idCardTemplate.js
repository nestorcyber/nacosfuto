/**
 * NACOS FUTO Student ID Card Template Configuration
 * Centralized coordinates and styling tokens for dynamic card rendering
 */

export const ID_CARD_TEMPLATE = {
  version: '2026.1',
  dimensions: {
    width: 1012,  // 3.375 inches @ 300 DPI (CR80 Standard ID)
    height: 638,  // 2.125 inches @ 300 DPI
    aspectRatio: 1012 / 638
  },
  background: {
    primaryColor: '#083002',
    accentColor: '#138601',
    borderColor: '#138601',
    borderWidth: 4,
    borderRadius: 24
  },
  header: {
    title: 'NIGERIA ASSOCIATION OF COMPUTING STUDENTS',
    chapter: 'FEDERAL UNIVERSITY OF TECHNOLOGY, OWERRI (FUTO CHAPTER)',
    department: 'DEPARTMENT OF COMPUTER SCIENCE',
    tag: 'OFFICIAL STUDENT IDENTITY CARD',
    height: 120
  },
  photo: {
    x: 65,
    y: 165,
    width: 240,
    height: 300,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#138601',
    placeholderColor: '#041801'
  },
  name: {
    x: 345,
    y: 220,
    maxWidth: 600,
    maxFontSize: 30,
    minFontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
  },
  registrationNumber: {
    x: 345,
    y: 275,
    fontSize: 22,
    color: '#4bd043',
    fontWeight: 'bold',
    fontFamily: 'Courier New, monospace'
  },
  programme: {
    x: 345,
    y: 330,
    label: 'PROGRAMME:',
    fontSize: 16,
    color: '#cbe1ff'
  },
  academicLevel: {
    x: 345,
    y: 380,
    label: 'LEVEL & SESSION:',
    fontSize: 16,
    color: '#cbe1ff'
  },
  faculty: {
    x: 345,
    y: 430,
    label: 'FACULTY:',
    fontSize: 15,
    color: '#a3cfbb'
  },
  footer: {
    y: 530,
    height: 80,
    authorizedText: 'AUTHORIZED BY NACOS FUTO EXECUTIVE COUNCIL',
    securityHashPrefix: 'VERIFIED-MEMBER-FUTO-CSC'
  },
  qrCode: {
    x: 840,
    y: 350,
    size: 110
  }
};

export default ID_CARD_TEMPLATE;
