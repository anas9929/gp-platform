/**
 * بيانات تجريبية تُستخدم كاحتياط عند تعذّر الوصول للـ API فقط
 * (مثلًا قبل ربط الباك إند). بمجرد أن يستجيب /public/* بنجاح
 * تُستبدل هذه البيانات تلقائيًا بالبيانات الحقيقية — لا تُعدَّل هنا لإضافة بيانات حقيقية.
 */

export const DEMO_STATS = {
  departments: 2,
  teams: 3,
  supervisors: 15,
  students: 102,
  projects: 10,
  avg_completion: 68
}

export const DEMO_DEPARTMENTS = [
  {
    id: 1,
    name: 'قسم البرمجيات',
    programs: [
      { id: 1, name: 'تصميم وتطوير مواقع الويب', degree: 'دبلوم' },
      { id: 2, name: 'تصميم وبرمجة تطبيقات الموبايل', degree: 'بكالوريوس' },
      { id: 3, name: 'برمجيات وقواعد البيانات', degree: 'دبلوم' }
    ]
  },
  {
    id: 2,
    name: 'قسم الوسائط',
    programs: [
      { id: 4, name: 'تكنولوجيا الوسائط المتعددة', degree: 'دبلوم' },
      { id: 5, name: 'تكنولوجيا الوسائط المتعددة', degree: 'بكالوريوس' }
    ]
  }
]

export const DEMO_PROJECTS = [
  { id: 1, title: 'نظام إدارة عيادات طبية', supervisor_name: 'د. يوسف الجندي', department_name: 'قسم البرمجيات', program_name: 'قواعد البيانات', degree: 'دبلوم', youtube_id: 'dQw4w9WgXcQ', thumbnail_url: null, year: 2027 },
  { id: 2, title: 'تطبيق إدارة المهام الذكي', supervisor_name: 'د. سلطان الدسري', department_name: 'قسم البرمجيات', program_name: 'تطبيقات الموبايل', degree: 'بكالوريوس', youtube_id: 'dQw4w9WgXcQ', thumbnail_url: null, year: 2027 },
  { id: 3, title: 'منصة تعلم ذكية بالواقع المعزز', supervisor_name: 'د. أحمد الحربي', department_name: 'قسم الوسائط', program_name: 'الوسائط المتعددة', degree: 'دبلوم', youtube_id: 'dQw4w9WgXcQ', thumbnail_url: null, year: 2027 },
  { id: 4, title: 'متجر إلكتروني بتقنيات AR', supervisor_name: 'د. مروان الجهني', department_name: 'قسم الوسائط', program_name: 'الوسائط المتعددة', degree: 'بكالوريوس', youtube_id: 'dQw4w9WgXcQ', thumbnail_url: null, year: 2027 },
  { id: 5, title: 'لعبة تعليمية للأطفال', supervisor_name: 'د. عمر الجهني', department_name: 'قسم البرمجيات', program_name: 'تصميم مواقع', degree: 'دبلوم', youtube_id: 'dQw4w9WgXcQ', thumbnail_url: null, year: 2027 },
  { id: 6, title: 'منصة تصميم ذكية', supervisor_name: 'د. ماجد الدسري', department_name: 'قسم الوسائط', program_name: 'الوسائط المتعددة', degree: 'بكالوريوس', youtube_id: 'dQw4w9WgXcQ', thumbnail_url: null, year: 2027 },
  { id: 7, title: 'نظام تسجيل حضور بالوجه', supervisor_name: 'د. هدى الجهني', department_name: 'قسم البرمجيات', program_name: 'تطبيقات الموبايل', degree: 'بكالوريوس', youtube_id: 'dQw4w9WgXcQ', thumbnail_url: null, year: 2026 },
  { id: 8, title: 'تطبيق تحليل الصور الطبية', supervisor_name: 'د. لمى الحربي', department_name: 'قسم البرمجيات', program_name: 'قواعد البيانات', degree: 'دبلوم', youtube_id: 'dQw4w9WgXcQ', thumbnail_url: null, year: 2026 },
  { id: 9, title: 'منصة إدارة مشاريع التخرج', supervisor_name: 'د. جود الدسري', department_name: 'قسم الوسائط', program_name: 'الوسائط المتعددة', degree: 'دبلوم', youtube_id: 'dQw4w9WgXcQ', thumbnail_url: null, year: 2026 },
  { id: 10, title: 'متجر إلكتروني بتوصيات ذكية', supervisor_name: 'د. رنا الدسري', department_name: 'قسم البرمجيات', program_name: 'تصميم مواقع', degree: 'بكالوريوس', youtube_id: 'dQw4w9WgXcQ', thumbnail_url: null, year: 2026 }
]
