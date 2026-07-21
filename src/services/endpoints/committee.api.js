import api from '@/services/api'

/**
 * نداءات لوحة لجنة الإشراف — مطابقة لعقد الباك إند الفعلي (راجعي docs/api-reference.html).
 * الباك إند غير مقسّم بمسارات لكل دور (لا يوجد بادئة /committee/*) — كل الموارد
 * عامة الشكل (teams, discussions, proposals) وتُستهلك بنفس الشكل من كل الأدوار
 * المخوّلة، والباك إند نفسه يقرر الصلاحية حسب دور المستخدم المسجّل دخوله.
 *
 * ⚠️ لا يوجد بهذا الباك إند حاليًا: إحصائيات لوحة تحكم مجمّعة، إدارة مستخدمين
 * عامة (إنشاء مشرف/عضو لجنة)، تعديل/حذف فريق أو عضو فريق، تعديل/حذف موعد مناقشة،
 * تمييز مشروع بنجمة، أو أي مفهوم "مشروع مكتمل/أرشيف" فعلي. راجعي API_REFERENCE.md
 * لتفاصيل كل فجوة والبديل المؤقت المستخدم بكل صفحة.
 */
export default {
  /* ---------- الفرق ---------- */
  // GET /teams?term_id= → كل الفرق بالفصل الحالي مع المشرف/القائد/الأعضاء/المشروع
  getTeams: (params) => api.get('/teams', { params }),
  // GET /teams/:id
  getTeam: (id) => api.get(`/teams/${id}`),
  // POST /teams  body: { name, supervisor_id, specialization_id, member_ids: number[], leader_id }
  // leader_id يجب أن يكون ضمن member_ids، وأقصى عدد أعضاء 4
  createTeam: (payload) => api.post('/teams', payload),

  /* ---------- استيراد الطلاب بالجملة (خطوتان: معاينة ثم تأكيد) ---------- */
  // POST /teams/import/preview  body: FormData{ file } → { valid: [...], invalid: [{row,data,errors}] }
  previewTeamsImport: (formData) => api.post('/teams/import/preview', formData),
  // POST /teams/import/confirm  body: { specialization_id, rows: [...] }
  // → { valid: [], invalid: [], created: [{ user, invite_token }] }
  confirmTeamsImport: (payload) => api.post('/teams/import/confirm', payload),

  /* ---------- نسبة تقدّم الفرق ---------- */
  // GET /teams/:id/progress → { total, done, percentage }  — طلب واحد لكل فريق، لا يوجد نسخة جماعية
  getTeamProgress: (teamId) => api.get(`/teams/${teamId}/progress`),
  // GET /progress/export → ملف xlsx مباشر (كل الفرق دفعة واحدة)
  exportProgress: () => api.get('/progress/export', { responseType: 'blob' }),

  /* ---------- مواعيد المناقشات (Discussions) ---------- */
  // GET /discussions?department_id=&specialization_id= → مصفوفة مباشرة (بدون pagination)
  getDiscussions: (params) => api.get('/discussions', { params }),
  // GET /discussions/export → ملف discussions.xlsx مباشر
  exportDiscussions: () => api.get('/discussions/export', { responseType: 'blob' }),
  // POST /discussions
  // body: { project_id, supervisor_id, place, discussion_date, discussion_time, committee, whatsapp, status }
  // whatsapp يجب أن يبدأ بـ 970 أو 972
  createDiscussion: (payload) => api.post('/discussions', payload),

  /* ---------- المقترحات ---------- */
  // POST /proposals/:id/approve  بدون body
  approveProposal: (id) => api.post(`/proposals/${id}/approve`),
  // POST /proposals/:id/reject  body: { rejection_reason }
  rejectProposal: (id, rejectionReason) => api.post(`/proposals/${id}/reject`, { rejection_reason: rejectionReason }),

  /* ---------- دعوة عضو موجود (إرسال/إعادة إرسال رابط تعيين كلمة مرور) ---------- */
  // POST /users/:id/invite → { token, expires_at } — لا يُنشئ مستخدمًا، فقط يرسل رابط لعضو id موجود سلفًا
  inviteUser: (userId) => api.post(`/users/${userId}/invite`),

  /* ---------- قوائم مرجعية للفلاتر (تتطلب تسجيل دخول) ---------- */
  // GET /departments
  getDepartments: () => api.get('/departments'),
  // GET /specializations
  getSpecializations: () => api.get('/specializations')
}
