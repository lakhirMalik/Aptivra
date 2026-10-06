export const roles = {
  frontend: { title: 'Frontend Development', required: ['HTML', 'CSS', 'JavaScript', 'React'], preferred: ['TypeScript', 'Accessibility', 'Testing', 'Git', 'REST APIs'] },
  backend: { title: 'Backend Development', required: ['PHP', 'SQL', 'REST APIs', 'Git'], preferred: ['Laravel', 'PostgreSQL', 'Queues', 'Testing'] },
  data: { title: 'Data Analysis', required: ['SQL', 'Python', 'Data cleaning', 'Data visualization', 'Statistics'], preferred: ['pandas', 'Excel', 'A/B testing'] },
} as const;
export type RoleKey = keyof typeof roles;

export const applicants = [
  { id: 'cv01', name: 'Areeba Siddiqui', status: 'ready', skills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Git', 'Accessibility', 'REST APIs'] },
  { id: 'cv02', name: 'Hamza Qureshi', status: 'ready', skills: ['HTML', 'CSS', 'JavaScript', 'Git'] },
  { id: 'cv07', name: 'Mehwish Ali', status: 'ready', skills: ['HTML', 'CSS', 'JavaScript', 'React', 'PHP', 'Git'] },
  { id: 'cv10', name: 'Imran Sheikh', status: 'needs_clarification', skills: ['HTML', 'CSS', 'JavaScript', 'React'] },
  { id: 'cv09', name: 'Zoya Farooqui', status: 'failed_unreadable', skills: [] },
];
export type Applicant = (typeof applicants)[number];

export const statusText: Record<string, string> = {
  ready: 'Ready',
  needs_clarification: 'Needs clarification: text differs between extraction methods. Reviewed safely, not scored.',
  failed_unreadable: 'Unreadable file. Ask the candidate to upload a PDF or DOCX that opens normally.',
};

export const compare = (criteria: string[], skills: string[]) =>
  criteria.map((c) => {
    const hit = skills.some((s) => s.toLowerCase() === c.toLowerCase());
    return { criterion: c, found: hit, ref: hit ? 'Skills section, page 1' : '' };
  });

export const questions = [
  { role: 'frontend', q: 'Which HTML element best represents site navigation links?', o: ['<div>', '<nav>', '<section>'], a: 1 },
  { role: 'frontend', q: 'Which React hook adds local state?', o: ['useRef', 'useMemo', 'useState'], a: 2 },
  { role: 'backend', q: 'Which HTTP status means a resource was created?', o: ['200', '204', '201'], a: 2 },
  { role: 'backend', q: 'Best defence against SQL injection?', o: ['Parameterized queries', 'Hiding the port', 'Longer passwords'], a: 0 },
  { role: 'data', q: 'Which measure of centre resists outliers?', o: ['Mean', 'Median', 'Range'], a: 1 },
  { role: 'data', q: 'Which join keeps all rows from the left table?', o: ['INNER JOIN', 'RIGHT JOIN', 'LEFT JOIN'], a: 2 },
];
