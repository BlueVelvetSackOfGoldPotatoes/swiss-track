export interface ChangeLogEntry {
  id: string;
  timestamp: string;
  type: 'proposal_added' | 'revision' | 'correction' | 'ingestion' | 'forecast_update';
  title: string;
  subject: string;
  subjectType: 'proposal' | 'actor' | 'legal_document';
  subjectId: string;
  revisionId: string;
  evidenceCount: number;
  summary: string;
}

export interface Actor {
  id: string;
  name: string;
  party: string;
  canton: string;
  role: string;
  jurisdiction: 'confederation' | 'canton' | 'commune';
  committees: string[];
  recentVotes: { date: string; proposal: string; vote: 'yes' | 'no' | 'abstain' }[];
  revisionId: string;
  updatedAt: string;
}

export interface Proposal {
  id: string;
  title: string;
  officialTitle: string;
  status: 'consultation' | 'parliamentary_deliberation' | 'pending_vote' | 'accepted' | 'rejected';
  type: 'referendum' | 'initiative' | 'counter_proposal' | 'bill';
  jurisdiction: 'confederation' | 'canton' | 'commune';
  voteDate?: string;
  submittedDate: string;
  sponsors: string[];
  affectedLaws: string[];
  evidenceCount: number;
  revisionId: string;
  summary: string;
}

export const mockChangelog: ChangeLogEntry[] = [
  {
    id: 'cl-001',
    timestamp: '2026-04-03T14:22:00Z',
    type: 'proposal_added',
    title: 'New initiative registered',
    subject: 'Volksinitiative «Für eine sichere Energieversorgung»',
    subjectType: 'proposal',
    subjectId: 'prop-001',
    revisionId: 'rev-a1b2c3',
    evidenceCount: 12,
    summary: 'Federal Chancellery published new popular initiative. 18-month collection period begins.',
  },
  {
    id: 'cl-002',
    timestamp: '2026-04-03T11:05:00Z',
    type: 'revision',
    title: 'Explainer updated',
    subject: 'BVG-Reform (Berufliche Vorsorge)',
    subjectType: 'proposal',
    subjectId: 'prop-002',
    revisionId: 'rev-d4e5f6',
    evidenceCount: 34,
    summary: 'Updated impact analysis following new SECO economic data release.',
  },
  {
    id: 'cl-003',
    timestamp: '2026-04-03T09:30:00Z',
    type: 'ingestion',
    title: 'Parliamentary session data ingested',
    subject: 'Nationalrat — Frühjahrssession 2026, Week 13',
    subjectType: 'legal_document',
    subjectId: 'doc-001',
    revisionId: 'rev-g7h8i9',
    evidenceCount: 0,
    summary: '47 new voting records, 12 motions, 3 interpellations added from official Parliament API.',
  },
  {
    id: 'cl-004',
    timestamp: '2026-04-02T16:40:00Z',
    type: 'correction',
    title: 'Correction issued',
    subject: 'Actor profile: Nationalrätin Maria Schneider',
    subjectType: 'actor',
    subjectId: 'actor-001',
    revisionId: 'rev-j0k1l2',
    evidenceCount: 3,
    summary: 'Committee membership date corrected. Previous revision listed GPK membership from 2024; correct start is 2025.',
  },
  {
    id: 'cl-005',
    timestamp: '2026-04-02T10:15:00Z',
    type: 'forecast_update',
    title: 'Forecast revision',
    subject: 'Prämieninitiative — cost impact scenarios',
    subjectType: 'proposal',
    subjectId: 'prop-003',
    revisionId: 'rev-m3n4o5',
    evidenceCount: 21,
    summary: 'Revised base-case scenario after BAG published updated premium growth projections.',
  },
  {
    id: 'cl-006',
    timestamp: '2026-04-01T15:00:00Z',
    type: 'proposal_added',
    title: 'Counter-proposal published',
    subject: 'Indirekter Gegenvorschlag zur Biodiversitätsinitiative',
    subjectType: 'proposal',
    subjectId: 'prop-004',
    revisionId: 'rev-p6q7r8',
    evidenceCount: 8,
    summary: 'Federal Council published indirect counter-proposal text. Consultation period open until 2026-07-15.',
  },
];

export const mockActors: Actor[] = [
  {
    id: 'actor-001',
    name: 'Maria Schneider',
    party: 'SP',
    canton: 'Zürich',
    role: 'Nationalrätin',
    jurisdiction: 'confederation',
    committees: ['Geschäftsprüfungskommission (GPK)', 'Kommission für soziale Sicherheit und Gesundheit (SGK)'],
    recentVotes: [
      { date: '2026-03-18', proposal: 'BVG-Reform', vote: 'yes' },
      { date: '2026-03-15', proposal: 'Energiegesetz Revision', vote: 'no' },
      { date: '2026-03-12', proposal: 'Armeebotschaft 2026', vote: 'abstain' },
    ],
    revisionId: 'rev-j0k1l2',
    updatedAt: '2026-04-02T16:40:00Z',
  },
  {
    id: 'actor-002',
    name: 'Thomas Müller',
    party: 'FDP',
    canton: 'Bern',
    role: 'Ständerat',
    jurisdiction: 'confederation',
    committees: ['Finanzkommission (FK)', 'Aussenpolitische Kommission (APK)'],
    recentVotes: [
      { date: '2026-03-20', proposal: 'Steuerreform 2026', vote: 'yes' },
      { date: '2026-03-18', proposal: 'BVG-Reform', vote: 'no' },
    ],
    revisionId: 'rev-s9t0u1',
    updatedAt: '2026-04-01T09:00:00Z',
  },
];

export const mockProposals: Proposal[] = [
  {
    id: 'prop-001',
    title: 'Energieversorgungsinitiative',
    officialTitle: 'Volksinitiative «Für eine sichere Energieversorgung»',
    status: 'consultation',
    type: 'initiative',
    jurisdiction: 'confederation',
    submittedDate: '2026-04-03',
    sponsors: ['Energiekomitee Schweiz'],
    affectedLaws: ['EnG (Energiegesetz)', 'StromVG'],
    evidenceCount: 12,
    revisionId: 'rev-a1b2c3',
    summary: 'Aims to constitutionally anchor minimum domestic energy production targets and accelerate grid infrastructure investment.',
  },
  {
    id: 'prop-002',
    title: 'BVG-Reform',
    officialTitle: 'Reform der beruflichen Vorsorge (BVG 21)',
    status: 'pending_vote',
    type: 'bill',
    jurisdiction: 'confederation',
    voteDate: '2026-06-14',
    submittedDate: '2021-11-17',
    sponsors: ['Bundesrat'],
    affectedLaws: ['BVG (Bundesgesetz über die berufliche Vorsorge)'],
    evidenceCount: 34,
    revisionId: 'rev-d4e5f6',
    summary: 'Lowers the conversion rate from 6.8% to 6.0%, introduces lifetime contribution supplements, and reduces the coordination deduction.',
  },
  {
    id: 'prop-003',
    title: 'Prämieninitiative',
    officialTitle: 'Volksinitiative «Maximal 10% des Einkommens für Krankenkassenprämien»',
    status: 'pending_vote',
    type: 'initiative',
    jurisdiction: 'confederation',
    voteDate: '2026-06-14',
    submittedDate: '2020-03-10',
    sponsors: ['SP Schweiz'],
    affectedLaws: ['KVG (Krankenversicherungsgesetz)'],
    evidenceCount: 21,
    revisionId: 'rev-m3n4o5',
    summary: 'Caps individual health insurance premiums at 10% of disposable income, with cantons and Confederation covering the difference.',
  },
  {
    id: 'prop-004',
    title: 'Biodiversitäts-Gegenvorschlag',
    officialTitle: 'Indirekter Gegenvorschlag zur Biodiversitätsinitiative',
    status: 'consultation',
    type: 'counter_proposal',
    jurisdiction: 'confederation',
    submittedDate: '2026-04-01',
    sponsors: ['Bundesrat'],
    affectedLaws: ['NHG (Natur- und Heimatschutzgesetz)', 'RPG'],
    evidenceCount: 8,
    revisionId: 'rev-p6q7r8',
    summary: 'Proposes targeted amendments to strengthen biodiversity corridors and urban green infrastructure without the constitutional scope of the original initiative.',
  },
];

export const typeLabels: Record<ChangeLogEntry['type'], string> = {
  proposal_added: 'NEW',
  revision: 'REV',
  correction: 'COR',
  ingestion: 'ING',
  forecast_update: 'FCT',
};

export const statusLabels: Record<Proposal['status'], string> = {
  consultation: 'CONSULTATION',
  parliamentary_deliberation: 'DELIBERATION',
  pending_vote: 'PENDING VOTE',
  accepted: 'ACCEPTED',
  rejected: 'REJECTED',
};
