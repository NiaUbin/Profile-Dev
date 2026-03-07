"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'th' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  th: {
    // Navbar
    'nav.home': 'หน้าแรก',
    'nav.about': 'เกี่ยวกับ',
    'nav.projects': 'ผลงาน',
    'nav.contact': 'ติดต่อ',
    'nav.online': 'ออนไลน์',

    // Hero
    'hero.available': 'พร้อมรับงาน',
    'hero.greeting': 'สวัสดี, ผมคือ',
    'hero.description': 'โปรแกรมเมอร์ที่หลงใหลในการสร้าง',
    'hero.website': 'เว็บไซต์',
    'hero.and': 'และ',
    'hero.application': 'แอปพลิเคชัน',
    'hero.descriptionEnd': 'ที่สวยงาม ใช้งานง่าย พร้อมระบบ Backend ที่มั่นคง',
    'hero.viewWork': 'ดูผลงาน',
    'hero.contactMe': 'ติดต่อฉัน',

    // About
    'about.title': 'เกี่ยวกับฉัน',
    'about.subtitle': 'ABOUT_ME.EXE',
    'about.experience': 'ประสบการณ์',
    'about.experienceValue': '3+ ปี พัฒนาเว็บ',
    'about.education': 'การศึกษา',
    'about.educationValue': 'วิศวกรรมคอมพิวเตอร์และสารสนเทศ',
    'about.location': 'สถานที่',
    'about.locationValue': 'กรุงเทพฯ, ประเทศไทย',
    'about.introduction': 'แนะนำตัว',
    'about.introPart1': 'สวัสดีครับ! ผมคือ',
    'about.introPart2': 'โปรแกรมเมอร์ที่หลงใหลในการพัฒนาเว็บไซต์และแอปพลิเคชัน ผมเชี่ยวชาญทั้ง',
    'about.introPart3': 'ผมสร้างเว็บไซต์ที่',
    'about.beautiful': 'สวยงาม',
    'about.easyToUse': 'ใช้งานง่าย',
    'about.fast': 'ทำงานได้รวดเร็ว',
    'about.introPart4': 'บนทุกอุปกรณ์ ไม่ว่าจะเป็นมือถือหรือคอมพิวเตอร์',
    'about.tools': 'เครื่องมือที่ใช้',

    // Projects
    'projects.title': 'ผลงานของฉัน',
    'projects.subtitle': 'PROJECTS.EXE',
    'projects.viewProject': 'ดูเว็บไซต์',
    'projects.viewCode': 'ดูโค้ด',

    // Contact
    'contact.title': 'ติดต่อฉัน',
    'contact.subtitle': 'CONTACT.EXE',
    'contact.description': 'สนใจร่วมงานหรือมีโปรเจกต์อยากปรึกษา? ติดต่อฉันได้เลย!',
    'contact.channels': 'ช่องทางติดต่อ',
    'contact.email': 'อีเมล',
    'contact.phone': 'โทรศัพท์',
    'contact.location': 'สถานที่',
    'contact.locationValue': 'กรุงเทพมหานคร, ไทย',
    'contact.social': 'โซเชียลมีเดีย',
    'contact.available': 'พร้อมรับงาน',
    'contact.replyTime': 'ตอบกลับภายใน 24 ชม.',
    'contact.sendMessage': 'ส่งข้อความถึงฉัน',
    'contact.name': 'ชื่อ',
    'contact.namePlaceholder': 'ชื่อของคุณ',
    'contact.emailLabel': 'อีเมล',
    'contact.subject': 'หัวข้อ',
    'contact.selectSubject': 'เลือกหัวข้อ',
    'contact.projectHire': 'ต้องการจ้างทำโปรเจกต์',
    'contact.jobOffer': 'เสนองานประจำ',
    'contact.consultation': 'ปรึกษาเรื่องเทคนิค',
    'contact.other': 'อื่นๆ',
    'contact.message': 'ข้อความ',
    'contact.messagePlaceholder': 'รายละเอียดที่ต้องการติดต่อ...',
    'contact.send': 'ส่งข้อความ',

    // Footer
    'footer.description': 'โปรแกรมเมอร์ที่หลงใหลในการสร้างเว็บไซต์และแอปพลิเคชันที่สวยงาม',
    'footer.expertise': 'EXPERTISE',
    'footer.links': 'LINKS',
    'footer.madeWith': 'Made with',
    'footer.inBangkok': 'in Bangkok, Thailand',
  },
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    'nav.online': 'ONLINE',

    // Hero
    'hero.available': 'Available for Work',
    'hero.greeting': "Hi, I'm",
    'hero.description': 'A programmer passionate about creating',
    'hero.website': 'websites',
    'hero.and': 'and',
    'hero.application': 'applications',
    'hero.descriptionEnd': 'that are beautiful, user-friendly, with a robust Backend system',
    'hero.viewWork': 'View Projects',
    'hero.contactMe': 'Contact Me',

    // About
    'about.title': 'About Me',
    'about.subtitle': 'ABOUT_ME.EXE',
    'about.experience': 'Experience',
    'about.experienceValue': '3+ years Web Dev',
    'about.education': 'Education',
    'about.educationValue': 'Computer & Information Engineering',
    'about.location': 'Location',
    'about.locationValue': 'Bangkok, Thailand',
    'about.introduction': 'Introduction',
    'about.introPart1': 'Hello! I am',
    'about.introPart2': 'a programmer passionate about web development and applications. I am proficient in both',
    'about.introPart3': 'I create websites that are',
    'about.beautiful': 'beautiful',
    'about.easyToUse': 'easy to use',
    'about.fast': 'fast',
    'about.introPart4': 'on all devices, whether mobile or desktop',
    'about.tools': 'Tools I Use',

    // Projects
    'projects.title': 'My Projects',
    'projects.subtitle': 'PROJECTS.EXE',
    'projects.viewProject': 'View Website',
    'projects.viewCode': 'View Code',

    // Contact
    'contact.title': 'Contact Me',
    'contact.subtitle': 'CONTACT.EXE',
    'contact.description': 'Interested in working together or have a project to discuss? Contact me!',
    'contact.channels': 'Contact Channels',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.location': 'Location',
    'contact.locationValue': 'Bangkok, Thailand',
    'contact.social': 'Social Media',
    'contact.available': 'Available for Work',
    'contact.replyTime': 'Response within 24 hours',
    'contact.sendMessage': 'Send me a message',
    'contact.name': 'Name',
    'contact.namePlaceholder': 'Your name',
    'contact.emailLabel': 'Email',
    'contact.subject': 'Subject',
    'contact.selectSubject': 'Select subject',
    'contact.projectHire': 'Project Inquiry',
    'contact.jobOffer': 'Job Offer',
    'contact.consultation': 'Technical Consultation',
    'contact.other': 'Other',
    'contact.message': 'Message',
    'contact.messagePlaceholder': 'Your message details...',
    'contact.send': 'Send Message',

    // Footer
    'footer.description': 'A programmer passionate about creating beautiful websites and applications',
    'footer.expertise': 'EXPERTISE',
    'footer.links': 'LINKS',
    'footer.madeWith': 'Made with',
    'footer.inBangkok': 'in Bangkok, Thailand',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('th');

  useEffect(() => {
    // Load saved language preference from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'th' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'th' ? 'en' : 'th';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['th']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
