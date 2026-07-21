import api from '@/services/api'

/**
 * كل نداءات لوحة لجنة الإشراف.
 * شكل الاستجابة والبيانات موثّق بالكامل في API_REFERENCE.md بجذر المشروع.
 */
export default {
  /* ---------- لوحة التحكم ---------- */
  // GET /committee/dashboard/stats?semester_id=
  getDashboardStats: (params) => api.get('/committee/dashboard/stats', { params }),

  /* ---------- الفرق (المجموعات) ---------- */
  // GET /committee/groups?semester_id=&search=
  getGroups: (params) => api.get('/committee/groups', { params }),
  // POST /committee/groups
  createGroup: (payload) => api.post('/committee/groups', payload),
  // PUT /committee/groups/:id
  updateGroup: (id, payload) => api.put(`/committee/groups/${id}`, payload),
  // DELETE /committee/groups/:id
  deleteGroup: (id) => api.delete(`/committee/groups/${id}`),
  // POST /committee/groups/:id/members
  addGroupMember: (groupId, payload) => api.post(`/committee/groups/${groupId}/members`, payload),
  // PUT /committee/groups/:id/members/:memberId
  updateGroupMember: (groupId, memberId, payload) => api.put(`/committee/groups/${groupId}/members/${memberId}`, payload),
  // DELETE /committee/groups/:id/members/:memberId
  deleteGroupMember: (groupId, memberId) => api.delete(`/committee/groups/${groupId}/members/${memberId}`),
  // POST /committee/groups/import  body: FormData{ file }
  importGroups: (formData) => api.post('/committee/groups/import', formData),

  /* ---------- الأعضاء (طلاب ومشرفون) ---------- */
  // GET /committee/students?search=&specialization=&supervisor_id=
  getStudents: (params) => api.get('/committee/students', { params }),
  // PUT /committee/students/:id
  updateStudent: (id, payload) => api.put(`/committee/students/${id}`, payload),
  // PATCH /committee/students/:id/restrict  body: { restricted }
  restrictStudent: (id, restricted) => api.patch(`/committee/students/${id}/restrict`, { restricted }),

  // GET /committee/supervisors?search=
  getSupervisors: (params) => api.get('/committee/supervisors', { params }),
  // POST /committee/supervisors
  createSupervisor: (payload) => api.post('/committee/supervisors', payload),
  // PUT /committee/supervisors/:id
  updateSupervisor: (id, payload) => api.put(`/committee/supervisors/${id}`, payload),
  // PATCH /committee/supervisors/:id/restrict  body: { restricted }
  restrictSupervisor: (id, restricted) => api.patch(`/committee/supervisors/${id}/restrict`, { restricted }),

  /* ---------- المقترحات ---------- */
  // GET /committee/proposals?search=&specialization=&status=
  getProposals: (params) => api.get('/committee/proposals', { params }),
  // POST /committee/proposals/:id/approve
  approveProposal: (id) => api.post(`/committee/proposals/${id}/approve`),
  // POST /committee/proposals/:id/reject  body: { reason }
  rejectProposal: (id, reason) => api.post(`/committee/proposals/${id}/reject`, { reason }),

  /* ---------- مواعيد المناقشات ---------- */
  // GET /committee/appointments?search=&department_id=&specialization=
  getAppointments: (params) => api.get('/committee/appointments', { params }),
  // POST /committee/appointments
  createAppointment: (payload) => api.post('/committee/appointments', payload),
  // PUT /committee/appointments/:id
  updateAppointment: (id, payload) => api.put(`/committee/appointments/${id}`, payload),
  // DELETE /committee/appointments/:id
  deleteAppointment: (id) => api.delete(`/committee/appointments/${id}`),
  // POST /committee/appointments/:id/students
  addAppointmentStudent: (id, payload) => api.post(`/committee/appointments/${id}/students`, payload),
  // PUT /committee/appointments/:id/students/:studentId
  updateAppointmentStudent: (id, studentId, payload) => api.put(`/committee/appointments/${id}/students/${studentId}`, payload),
  // DELETE /committee/appointments/:id/students/:studentId
  deleteAppointmentStudent: (id, studentId) => api.delete(`/committee/appointments/${id}/students/${studentId}`),
  // POST /committee/appointments/import  body: FormData{ file }
  importAppointments: (formData) => api.post('/committee/appointments/import', formData),

  /* ---------- أرشيف المشاريع ---------- */
  // GET /committee/projects/archive?search=&department_id=
  getArchivedProjects: (params) => api.get('/committee/projects/archive', { params }),
  // GET /committee/projects/:id  → { data: Project + description + files: [{ name, type, url }] }
  getProjectDetail: (id) => api.get(`/committee/projects/${id}`),
  // PATCH /committee/projects/:id/star  body: { starred }
  starProject: (id, starred) => api.patch(`/committee/projects/${id}/star`, { starred }),

  /* ---------- نسبة تقدّم المشاريع ---------- */
  // GET /committee/projects/progress?search=&specialization=&supervisor_id=&status=
  getProjectsProgress: (params) => api.get('/committee/projects/progress', { params })
}
