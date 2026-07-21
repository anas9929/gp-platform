import { defineStore } from 'pinia'
import committeeApi from '@/services/endpoints/committee.api'

/**
 * ملاحظة مهمة: لا توجد بيانات وهمية بهذا الـ store إطلاقًا. كل state هنا يقابل
 * endpoint حقيقي موثّق بـ docs/api-reference.html. الميزات التي لا يدعمها الباك
 * إند حاليًا (لوحة تحكم مجمّعة، قائمة مقترحات، إدارة أعضاء) لا حالة لها هنا —
 * الصفحات المعنية تعرض رسالة فجوة صريحة بدل تحميل بلا نهاية أو بيانات مصطنعة.
 */
export const useCommitteeStore = defineStore('committee', {
  state: () => ({
    /* الفرق — GET /teams، تُشتق منها لوحة التحكم/الأعضاء/الأرشيف محليًا */
    teams: [],
    teamsLoading: false,
    teamsError: null,

    /* نسبة تقدّم كل فريق — GET /teams/:id/progress، طلب منفصل لكل فريق */
    teamProgress: {}, // { [teamId]: { total, done, percentage } }
    progressLoading: false,
    progressError: null,

    /* مواعيد المناقشات — GET /discussions */
    discussions: [],
    discussionsLoading: false,
    discussionsError: null,

    /* قوائم مرجعية للفلاتر */
    departments: [],
    specializations: [],
    refDataLoading: false
  }),

  getters: {
    /** الطلاب مشتقّون من أعضاء كل الفرق — لا يوجد endpoint مستقل لقائمة الطلاب */
    studentsFromTeams: (state) => {
      const seen = new Map()
      state.teams.forEach((team) => {
        team.members?.forEach((member) => {
          const student = member.student
          if (student && !seen.has(student.id)) {
            seen.set(student.id, { ...student, teamId: team.id, teamName: team.name, isLeader: member.is_leader })
          }
        })
      })
      return [...seen.values()]
    },

    /** المشرفون مشتقّون من مشرف كل فريق — لا يوجد endpoint مستقل لقائمة المشرفين */
    supervisorsFromTeams: (state) => {
      const seen = new Map()
      state.teams.forEach((team) => {
        if (team.supervisor && !seen.has(team.supervisor.id)) {
          seen.set(team.supervisor.id, { ...team.supervisor, teamCount: 0 })
        }
        if (team.supervisor) seen.get(team.supervisor.id).teamCount += 1
      })
      return [...seen.values()]
    }
  },

  actions: {
    // GET /teams?term_id=
    async fetchTeams(params = {}) {
      this.teamsLoading = true
      this.teamsError = null
      try {
        const { data } = await committeeApi.getTeams(params)
        this.teams = data.data || data
        return this.teams
      } catch (err) {
        this.teamsError = err.normalized?.message || 'تعذّر تحميل الفرق'
        throw err
      } finally {
        this.teamsLoading = false
      }
    },

    // POST /teams  body: { name, supervisor_id, specialization_id, member_ids, leader_id }
    async createTeam(payload) {
      const { data } = await committeeApi.createTeam(payload)
      const team = data.data || data
      this.teams.push(team)
      return team
    },

    // POST /teams/import/preview  body: FormData{ file }
    previewImport(formData) {
      return committeeApi.previewTeamsImport(formData).then((res) => res.data)
    },

    // POST /teams/import/confirm  body: { specialization_id, rows }
    confirmImport(payload) {
      return committeeApi.confirmTeamsImport(payload).then((res) => res.data)
    },

    /**
     * نسبة تقدّم كل الفرق — لا يوجد endpoint جماعي، فنكرر GET /teams/:id/progress
     * لكل فريق (بالتوازي). مخصّصة لصفحة "نسبة تقدّم المشاريع" فقط.
     */
    async fetchAllTeamsProgress() {
      if (!this.teams.length) await this.fetchTeams().catch(() => {})
      this.progressLoading = true
      this.progressError = null
      try {
        const results = await Promise.allSettled(
          this.teams.map((team) => committeeApi.getTeamProgress(team.id).then((res) => [team.id, res.data.data || res.data]))
        )
        const map = {}
        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            const [teamId, progress] = result.value
            map[teamId] = progress
          }
        })
        this.teamProgress = map
        return map
      } catch (err) {
        this.progressError = err.normalized?.message || 'تعذّر تحميل نسبة التقدّم'
        throw err
      } finally {
        this.progressLoading = false
      }
    },

    // GET /progress/export → تنزيل مباشر
    async exportProgress() {
      const { data } = await committeeApi.exportProgress()
      return data
    },

    // GET /discussions?department_id=&specialization_id=
    async fetchDiscussions(params = {}) {
      this.discussionsLoading = true
      this.discussionsError = null
      try {
        const { data } = await committeeApi.getDiscussions(params)
        this.discussions = Array.isArray(data) ? data : (data.data || [])
        return this.discussions
      } catch (err) {
        this.discussionsError = err.normalized?.message || 'تعذّر تحميل مواعيد المناقشات'
        throw err
      } finally {
        this.discussionsLoading = false
      }
    },

    // GET /discussions/export → تنزيل مباشر
    async exportDiscussions() {
      const { data } = await committeeApi.exportDiscussions()
      return data
    },

    // POST /discussions
    async createDiscussion(payload) {
      const { data } = await committeeApi.createDiscussion(payload)
      const discussion = data.data || data
      this.discussions.push(discussion)
      return discussion
    },

    async fetchRefData() {
      if (this.departments.length || this.refDataLoading) return
      this.refDataLoading = true
      try {
        const [deptRes, specRes] = await Promise.all([
          committeeApi.getDepartments(),
          committeeApi.getSpecializations()
        ])
        this.departments = deptRes.data.data || deptRes.data
        this.specializations = specRes.data.data || specRes.data
      } catch (_) {
        // الفلاتر تبقى فارغة بصمت — ليست بيانات جوهرية للصفحة
      } finally {
        this.refDataLoading = false
      }
    }
  }
})
