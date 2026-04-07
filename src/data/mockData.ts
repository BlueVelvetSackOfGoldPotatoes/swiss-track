// ==================== TYPES ====================

export interface Continent {
  id: string;
  name: string;
  code: string;
}

export interface Country {
  id: string;
  name: string;
  code: string; // ISO 3166-1 alpha-2
  continentId: string;
}

export interface City {
  id: string;
  name: string;
  countryId: string;
  isCapital: boolean;
}

export interface ActorEvent {
  id: string;
  actorId: string;
  hash: string; // git-like short hash
  timestamp: string;
  type: 'vote' | 'speech' | 'committee_join' | 'committee_leave' | 'election' | 'appointment' | 'resignation' | 'scandal' | 'policy_change' | 'party_switch' | 'legislation_sponsored' | 'foreign_meeting';
  title: string;
  description: string;
  diff?: { removed?: string; added?: string };
  evidenceCount: number;
  sourceUrl?: string;
}

export interface Relationship {
  id: string;
  sourceId: string;
  sourceType: 'actor' | 'party';
  targetId: string;
  targetType: 'actor' | 'party';
  type: 'coalition' | 'opposition' | 'mentor' | 'ally' | 'rival' | 'ideological_alignment' | 'committee_co_member' | 'cross_border_alliance';
  strength: number; // 0-1
  description: string;
  since?: string;
}

export interface Party {
  id: string;
  name: string;
  abbreviation: string;
  countryId: string;
  ideology: string;
  color: string;
  foundedYear: number;
  familyId: string; // ideological family grouping
}

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
  countryId?: string;
}

export interface Actor {
  id: string;
  name: string;
  partyId: string;
  party: string;
  canton: string; // kept for backward compat, now means city/region
  cityId: string;
  countryId: string;
  role: string;
  jurisdiction: 'federal' | 'state' | 'city';
  committees: string[];
  recentVotes: { date: string; proposal: string; vote: 'yes' | 'no' | 'abstain' }[];
  revisionId: string;
  updatedAt: string;
  photoUrl?: string;
  birthYear?: number;
  inOfficeSince?: string;
}

export interface Proposal {
  id: string;
  title: string;
  officialTitle: string;
  status: 'consultation' | 'parliamentary_deliberation' | 'pending_vote' | 'accepted' | 'rejected';
  type: 'referendum' | 'initiative' | 'counter_proposal' | 'bill';
  jurisdiction: 'federal' | 'state' | 'city';
  countryId: string;
  voteDate?: string;
  submittedDate: string;
  sponsors: string[];
  affectedLaws: string[];
  evidenceCount: number;
  revisionId: string;
  summary: string;
}

// ==================== GEOGRAPHY ====================

export const continents: Continent[] = [
  { id: 'cont-eu', name: 'Europe', code: 'EU' },
  { id: 'cont-na', name: 'North America', code: 'NA' },
  { id: 'cont-sa', name: 'South America', code: 'SA' },
  { id: 'cont-as', name: 'Asia', code: 'AS' },
  { id: 'cont-af', name: 'Africa', code: 'AF' },
  { id: 'cont-oc', name: 'Oceania', code: 'OC' },
];

export const countries: Country[] = [
  { id: 'ch', name: 'Switzerland', code: 'CH', continentId: 'cont-eu' },
  { id: 'de', name: 'Germany', code: 'DE', continentId: 'cont-eu' },
  { id: 'fr', name: 'France', code: 'FR', continentId: 'cont-eu' },
  { id: 'us', name: 'United States', code: 'US', continentId: 'cont-na' },
  { id: 'br', name: 'Brazil', code: 'BR', continentId: 'cont-sa' },
  { id: 'jp', name: 'Japan', code: 'JP', continentId: 'cont-as' },
  { id: 'ke', name: 'Kenya', code: 'KE', continentId: 'cont-af' },
  { id: 'au', name: 'Australia', code: 'AU', continentId: 'cont-oc' },
];

export const cities: City[] = [
  { id: 'city-zurich', name: 'Zürich', countryId: 'ch', isCapital: false },
  { id: 'city-bern', name: 'Bern', countryId: 'ch', isCapital: true },
  { id: 'city-berlin', name: 'Berlin', countryId: 'de', isCapital: true },
  { id: 'city-munich', name: 'Munich', countryId: 'de', isCapital: false },
  { id: 'city-paris', name: 'Paris', countryId: 'fr', isCapital: true },
  { id: 'city-dc', name: 'Washington D.C.', countryId: 'us', isCapital: true },
  { id: 'city-nyc', name: 'New York', countryId: 'us', isCapital: false },
  { id: 'city-brasilia', name: 'Brasília', countryId: 'br', isCapital: true },
  { id: 'city-saopaulo', name: 'São Paulo', countryId: 'br', isCapital: false },
  { id: 'city-tokyo', name: 'Tokyo', countryId: 'jp', isCapital: true },
  { id: 'city-nairobi', name: 'Nairobi', countryId: 'ke', isCapital: true },
  { id: 'city-sydney', name: 'Sydney', countryId: 'au', isCapital: false },
  { id: 'city-canberra', name: 'Canberra', countryId: 'au', isCapital: true },
];

// ==================== PARTIES ====================

export const parties: Party[] = [
  { id: 'party-sp', name: 'Social Democratic Party', abbreviation: 'SP', countryId: 'ch', ideology: 'Social Democracy', color: '#E53935', foundedYear: 1888, familyId: 'fam-socdem' },
  { id: 'party-fdp', name: 'FDP.The Liberals', abbreviation: 'FDP', countryId: 'ch', ideology: 'Classical Liberalism', color: '#1E88E5', foundedYear: 2009, familyId: 'fam-liberal' },
  { id: 'party-svp', name: 'Swiss People\'s Party', abbreviation: 'SVP', countryId: 'ch', ideology: 'National Conservatism', color: '#2E7D32', foundedYear: 1971, familyId: 'fam-conserv' },
  { id: 'party-spd', name: 'Social Democratic Party of Germany', abbreviation: 'SPD', countryId: 'de', ideology: 'Social Democracy', color: '#E53935', foundedYear: 1863, familyId: 'fam-socdem' },
  { id: 'party-cdu', name: 'Christian Democratic Union', abbreviation: 'CDU', countryId: 'de', ideology: 'Christian Democracy', color: '#212121', foundedYear: 1945, familyId: 'fam-conserv' },
  { id: 'party-dem', name: 'Democratic Party', abbreviation: 'DEM', countryId: 'us', ideology: 'Liberalism', color: '#1565C0', foundedYear: 1828, familyId: 'fam-liberal' },
  { id: 'party-gop', name: 'Republican Party', abbreviation: 'GOP', countryId: 'us', ideology: 'Conservatism', color: '#C62828', foundedYear: 1854, familyId: 'fam-conserv' },
  { id: 'party-lrem', name: 'Renaissance', abbreviation: 'RE', countryId: 'fr', ideology: 'Centrism', color: '#FFB300', foundedYear: 2016, familyId: 'fam-liberal' },
  { id: 'party-pt', name: 'Workers\' Party', abbreviation: 'PT', countryId: 'br', ideology: 'Democratic Socialism', color: '#C62828', foundedYear: 1980, familyId: 'fam-socdem' },
  { id: 'party-ldp', name: 'Liberal Democratic Party', abbreviation: 'LDP', countryId: 'jp', ideology: 'Liberal Conservatism', color: '#1E88E5', foundedYear: 1955, familyId: 'fam-conserv' },
];

export const partyFamilies: Record<string, string> = {
  'fam-socdem': 'Social Democracy',
  'fam-liberal': 'Liberalism',
  'fam-conserv': 'Conservatism',
  'fam-green': 'Green Politics',
};

// ==================== ACTORS ====================

export const mockActors: Actor[] = [
  {
    id: 'actor-001', name: 'Maria Schneider', partyId: 'party-sp', party: 'SP', canton: 'Zürich',
    cityId: 'city-zurich', countryId: 'ch', role: 'National Councillor', jurisdiction: 'federal',
    committees: ['GPK', 'SGK'], recentVotes: [
      { date: '2026-03-18', proposal: 'BVG-Reform', vote: 'yes' },
      { date: '2026-03-15', proposal: 'Energiegesetz Revision', vote: 'no' },
      { date: '2026-03-12', proposal: 'Armeebotschaft 2026', vote: 'abstain' },
    ], revisionId: 'rev-j0k1l2', updatedAt: '2026-04-02T16:40:00Z', birthYear: 1978, inOfficeSince: '2019-12-02',
  },
  {
    id: 'actor-002', name: 'Thomas Müller', partyId: 'party-fdp', party: 'FDP', canton: 'Bern',
    cityId: 'city-bern', countryId: 'ch', role: 'Council of States', jurisdiction: 'federal',
    committees: ['FK', 'APK'], recentVotes: [
      { date: '2026-03-20', proposal: 'Steuerreform 2026', vote: 'yes' },
      { date: '2026-03-18', proposal: 'BVG-Reform', vote: 'no' },
    ], revisionId: 'rev-s9t0u1', updatedAt: '2026-04-01T09:00:00Z', birthYear: 1965, inOfficeSince: '2015-11-30',
  },
  {
    id: 'actor-003', name: 'Friedrich Weber', partyId: 'party-cdu', party: 'CDU', canton: 'Berlin',
    cityId: 'city-berlin', countryId: 'de', role: 'Member of Bundestag', jurisdiction: 'federal',
    committees: ['Finance Committee', 'EU Affairs'], recentVotes: [
      { date: '2026-03-10', proposal: 'Energy Transition Act', vote: 'yes' },
      { date: '2026-02-28', proposal: 'Digital Infrastructure Bill', vote: 'yes' },
    ], revisionId: 'rev-de001', updatedAt: '2026-04-01T10:00:00Z', birthYear: 1972, inOfficeSince: '2017-10-24',
  },
  {
    id: 'actor-004', name: 'Sarah Mitchell', partyId: 'party-dem', party: 'DEM', canton: 'Washington D.C.',
    cityId: 'city-dc', countryId: 'us', role: 'Senator', jurisdiction: 'federal',
    committees: ['Foreign Relations', 'Judiciary'], recentVotes: [
      { date: '2026-03-22', proposal: 'Infrastructure Renewal Act', vote: 'yes' },
      { date: '2026-03-15', proposal: 'AI Governance Framework', vote: 'yes' },
      { date: '2026-03-01', proposal: 'Defense Budget 2027', vote: 'no' },
    ], revisionId: 'rev-us001', updatedAt: '2026-04-03T08:00:00Z', birthYear: 1980, inOfficeSince: '2021-01-03',
  },
  {
    id: 'actor-005', name: 'James Crawford', partyId: 'party-gop', party: 'GOP', canton: 'New York',
    cityId: 'city-nyc', countryId: 'us', role: 'Representative', jurisdiction: 'federal',
    committees: ['Ways and Means', 'Armed Services'], recentVotes: [
      { date: '2026-03-22', proposal: 'Infrastructure Renewal Act', vote: 'no' },
      { date: '2026-03-01', proposal: 'Defense Budget 2027', vote: 'yes' },
    ], revisionId: 'rev-us002', updatedAt: '2026-04-02T12:00:00Z', birthYear: 1968, inOfficeSince: '2019-01-03',
  },
  {
    id: 'actor-006', name: 'Luísa Ferreira', partyId: 'party-pt', party: 'PT', canton: 'São Paulo',
    cityId: 'city-saopaulo', countryId: 'br', role: 'Federal Deputy', jurisdiction: 'federal',
    committees: ['Education Committee', 'Human Rights'], recentVotes: [
      { date: '2026-03-18', proposal: 'Universal Education Reform', vote: 'yes' },
      { date: '2026-03-05', proposal: 'Amazon Protection Act', vote: 'yes' },
    ], revisionId: 'rev-br001', updatedAt: '2026-04-01T14:00:00Z', birthYear: 1985, inOfficeSince: '2023-02-01',
  },
  {
    id: 'actor-007', name: 'Takeshi Yamamoto', partyId: 'party-ldp', party: 'LDP', canton: 'Tokyo',
    cityId: 'city-tokyo', countryId: 'jp', role: 'Member of House of Representatives', jurisdiction: 'federal',
    committees: ['Budget Committee', 'Foreign Affairs'], recentVotes: [
      { date: '2026-03-20', proposal: 'Defense Modernization Bill', vote: 'yes' },
      { date: '2026-03-12', proposal: 'Digital Economy Act', vote: 'yes' },
    ], revisionId: 'rev-jp001', updatedAt: '2026-04-02T06:00:00Z', birthYear: 1970, inOfficeSince: '2012-12-16',
  },
  {
    id: 'actor-008', name: 'Claire Dupont', partyId: 'party-lrem', party: 'RE', canton: 'Paris',
    cityId: 'city-paris', countryId: 'fr', role: 'Deputy', jurisdiction: 'federal',
    committees: ['Finance', 'European Affairs'], recentVotes: [
      { date: '2026-03-19', proposal: 'Pension Reform Amendment', vote: 'yes' },
      { date: '2026-03-10', proposal: 'Climate Adaptation Act', vote: 'yes' },
    ], revisionId: 'rev-fr001', updatedAt: '2026-04-03T09:00:00Z', birthYear: 1982, inOfficeSince: '2022-06-19',
  },
];

// ==================== ACTOR EVENTS (GIT-LIKE HISTORY) ====================

export const actorEvents: ActorEvent[] = [
  // Maria Schneider events
  { id: 'ev-001', actorId: 'actor-001', hash: 'a3f7c2', timestamp: '2026-04-02T16:40:00Z', type: 'vote', title: 'Correction: GPK membership date', description: 'Committee membership start date corrected from 2024 to 2025.', diff: { removed: 'GPK member since 2024', added: 'GPK member since 2025' }, evidenceCount: 3 },
  { id: 'ev-002', actorId: 'actor-001', hash: 'b8e1d4', timestamp: '2026-03-18T14:00:00Z', type: 'vote', title: 'Voted YES on BVG-Reform', description: 'Supported pension reform bill in National Council plenary session.', evidenceCount: 5 },
  { id: 'ev-003', actorId: 'actor-001', hash: 'c9f2e5', timestamp: '2026-03-15T11:00:00Z', type: 'vote', title: 'Voted NO on Energiegesetz Revision', description: 'Opposed energy law revision citing insufficient renewable targets.', evidenceCount: 2 },
  { id: 'ev-004', actorId: 'actor-001', hash: 'd0a3f6', timestamp: '2026-03-12T10:00:00Z', type: 'vote', title: 'ABSTAINED on Armeebotschaft 2026', description: 'Abstained on military spending bill.', evidenceCount: 1 },
  { id: 'ev-005', actorId: 'actor-001', hash: 'e1b4g7', timestamp: '2025-12-02T09:00:00Z', type: 'committee_join', title: 'Joined SGK committee', description: 'Appointed to Commission for Social Security and Health.', evidenceCount: 2 },
  { id: 'ev-006', actorId: 'actor-001', hash: 'f2c5h8', timestamp: '2025-01-15T09:00:00Z', type: 'committee_join', title: 'Joined GPK committee', description: 'Appointed to Control Committee.', evidenceCount: 2 },
  { id: 'ev-007', actorId: 'actor-001', hash: 'g3d6i9', timestamp: '2024-06-14T09:00:00Z', type: 'legislation_sponsored', title: 'Sponsored climate protection motion', description: 'Filed motion 24.3456 for enhanced CO₂ reduction targets.', evidenceCount: 4 },
  { id: 'ev-008', actorId: 'actor-001', hash: 'h4e7j0', timestamp: '2019-12-02T10:00:00Z', type: 'election', title: 'Elected to National Council', description: 'Won seat in 2019 federal elections for SP, Canton Zürich.', evidenceCount: 8 },

  // Sarah Mitchell events
  { id: 'ev-020', actorId: 'actor-004', hash: 'k7h0m3', timestamp: '2026-03-22T16:00:00Z', type: 'vote', title: 'Voted YES on Infrastructure Renewal Act', description: 'Supported bipartisan infrastructure bill in Senate floor vote.', evidenceCount: 12 },
  { id: 'ev-021', actorId: 'actor-004', hash: 'l8i1n4', timestamp: '2026-03-15T14:00:00Z', type: 'vote', title: 'Voted YES on AI Governance Framework', description: 'Co-sponsored and voted for landmark AI regulation bill.', evidenceCount: 18 },
  { id: 'ev-022', actorId: 'actor-004', hash: 'm9j2o5', timestamp: '2026-03-01T11:00:00Z', type: 'vote', title: 'Voted NO on Defense Budget 2027', description: 'Opposed military spending increase, citing domestic priorities.', evidenceCount: 7 },
  { id: 'ev-023', actorId: 'actor-004', hash: 'n0k3p6', timestamp: '2026-02-10T10:00:00Z', type: 'speech', title: 'Senate floor speech on AI ethics', description: 'Delivered 45-minute address on responsible AI development.', evidenceCount: 3 },
  { id: 'ev-024', actorId: 'actor-004', hash: 'o1l4q7', timestamp: '2025-11-15T09:00:00Z', type: 'foreign_meeting', title: 'Met with EU Digital Commissioner', description: 'Bilateral meeting in Brussels on transatlantic AI standards.', evidenceCount: 5 },
  { id: 'ev-025', actorId: 'actor-004', hash: 'p2m5r8', timestamp: '2025-06-01T09:00:00Z', type: 'committee_join', title: 'Joined Judiciary Committee', description: 'Appointed to Senate Judiciary Committee.', evidenceCount: 2 },
  { id: 'ev-026', actorId: 'actor-004', hash: 'q3n6s9', timestamp: '2021-01-03T12:00:00Z', type: 'election', title: 'Sworn in as Senator', description: 'Took oath of office after winning 2020 Senate race.', evidenceCount: 15 },

  // Friedrich Weber events
  { id: 'ev-030', actorId: 'actor-003', hash: 'r4o7t0', timestamp: '2026-03-10T14:00:00Z', type: 'vote', title: 'Voted YES on Energy Transition Act', description: 'Supported landmark German energy transition legislation.', evidenceCount: 8 },
  { id: 'ev-031', actorId: 'actor-003', hash: 's5p8u1', timestamp: '2025-09-20T10:00:00Z', type: 'party_switch', title: 'Considered leaving CDU', description: 'Reports surfaced of disagreements with party leadership on climate policy. Ultimately remained.', diff: { removed: 'Full CDU alignment', added: 'CDU member with public dissent on climate' }, evidenceCount: 6 },

  // Luísa Ferreira events
  { id: 'ev-040', actorId: 'actor-006', hash: 't6q9v2', timestamp: '2026-03-18T15:00:00Z', type: 'vote', title: 'Voted YES on Universal Education Reform', description: 'Supported expansion of public education funding.', evidenceCount: 4 },
  { id: 'ev-041', actorId: 'actor-006', hash: 'u7r0w3', timestamp: '2026-03-05T11:00:00Z', type: 'legislation_sponsored', title: 'Sponsored Amazon Protection Act', description: 'Primary sponsor of environmental protection legislation for Amazon region.', evidenceCount: 9 },
];

// ==================== RELATIONSHIPS ====================

export const relationships: Relationship[] = [
  // Cross-party within country
  { id: 'rel-001', sourceId: 'actor-001', sourceType: 'actor', targetId: 'actor-002', targetType: 'actor', type: 'committee_co_member', strength: 0.4, description: 'Both serve in federal parliament, overlapping committee interests.', since: '2019-12-02' },
  // Cross-border ideological alignment
  { id: 'rel-002', sourceId: 'party-sp', sourceType: 'party', targetId: 'party-spd', targetType: 'party', type: 'ideological_alignment', strength: 0.85, description: 'Both social democratic parties, members of Progressive Alliance.' },
  { id: 'rel-003', sourceId: 'party-sp', sourceType: 'party', targetId: 'party-pt', targetType: 'party', type: 'ideological_alignment', strength: 0.7, description: 'Shared democratic socialist roots, both in Progressive Alliance.' },
  { id: 'rel-004', sourceId: 'party-fdp', sourceType: 'party', targetId: 'party-lrem', targetType: 'party', type: 'ideological_alignment', strength: 0.65, description: 'Liberal centrist alignment, both ALDE/Renew affiliates.' },
  { id: 'rel-005', sourceId: 'party-svp', sourceType: 'party', targetId: 'party-gop', targetType: 'party', type: 'ideological_alignment', strength: 0.5, description: 'Conservative-nationalist tendencies, though different political systems.' },
  { id: 'rel-006', sourceId: 'party-cdu', sourceType: 'party', targetId: 'party-ldp', targetType: 'party', type: 'ideological_alignment', strength: 0.55, description: 'Both center-right governing parties with long incumbency traditions.' },
  // Actors across borders
  { id: 'rel-007', sourceId: 'actor-004', sourceType: 'actor', targetId: 'actor-008', targetType: 'actor', type: 'cross_border_alliance', strength: 0.6, description: 'Collaborated on transatlantic AI governance framework at OECD.', since: '2025-11-15' },
  { id: 'rel-008', sourceId: 'actor-001', sourceType: 'actor', targetId: 'actor-006', targetType: 'actor', type: 'ally', strength: 0.5, description: 'Co-signed open letter on global social policy standards at UN.', since: '2025-09-01' },
  // Intra-party rivalry
  { id: 'rel-009', sourceId: 'actor-004', sourceType: 'actor', targetId: 'actor-005', targetType: 'actor', type: 'rival', strength: 0.7, description: 'Frequent opponents in Senate/House debates on defense spending.' },
];

// ==================== PROPOSALS ====================

export const mockProposals: Proposal[] = [
  {
    id: 'prop-001', title: 'Energieversorgungsinitiative', officialTitle: 'Volksinitiative «Für eine sichere Energieversorgung»',
    status: 'consultation', type: 'initiative', jurisdiction: 'federal', countryId: 'ch',
    submittedDate: '2026-04-03', sponsors: ['Energiekomitee Schweiz'],
    affectedLaws: ['EnG (Energiegesetz)', 'StromVG'], evidenceCount: 12, revisionId: 'rev-a1b2c3',
    summary: 'Aims to constitutionally anchor minimum domestic energy production targets.',
  },
  {
    id: 'prop-002', title: 'BVG-Reform', officialTitle: 'Reform der beruflichen Vorsorge (BVG 21)',
    status: 'pending_vote', type: 'bill', jurisdiction: 'federal', countryId: 'ch',
    voteDate: '2026-06-14', submittedDate: '2021-11-17', sponsors: ['Bundesrat'],
    affectedLaws: ['BVG'], evidenceCount: 34, revisionId: 'rev-d4e5f6',
    summary: 'Lowers the conversion rate from 6.8% to 6.0%, introduces lifetime contribution supplements.',
  },
  {
    id: 'prop-003', title: 'AI Governance Framework', officialTitle: 'Artificial Intelligence Governance and Safety Act',
    status: 'parliamentary_deliberation', type: 'bill', jurisdiction: 'federal', countryId: 'us',
    submittedDate: '2025-09-15', sponsors: ['Sen. Sarah Mitchell', 'Sen. R. Kumar'],
    affectedLaws: ['Federal Trade Commission Act', 'National AI Initiative Act'], evidenceCount: 45, revisionId: 'rev-us-ai01',
    summary: 'Establishes federal framework for AI system risk classification and mandatory safety testing.',
  },
  {
    id: 'prop-004', title: 'Energy Transition Act', officialTitle: 'Energiewende-Beschleunigungsgesetz',
    status: 'accepted', type: 'bill', jurisdiction: 'federal', countryId: 'de',
    submittedDate: '2025-06-01', sponsors: ['Bundesregierung'],
    affectedLaws: ['EEG', 'EnWG'], evidenceCount: 28, revisionId: 'rev-de-en01',
    summary: 'Accelerates renewable energy deployment targets to 80% by 2030.',
  },
];

// ==================== CHANGELOG ====================

export const mockChangelog: ChangeLogEntry[] = [
  { id: 'cl-001', timestamp: '2026-04-03T14:22:00Z', type: 'proposal_added', title: 'New initiative registered', subject: 'Energieversorgungsinitiative', subjectType: 'proposal', subjectId: 'prop-001', revisionId: 'rev-a1b2c3', evidenceCount: 12, summary: 'Federal Chancellery published new popular initiative.', countryId: 'ch' },
  { id: 'cl-002', timestamp: '2026-04-03T11:05:00Z', type: 'revision', title: 'Explainer updated', subject: 'BVG-Reform', subjectType: 'proposal', subjectId: 'prop-002', revisionId: 'rev-d4e5f6', evidenceCount: 34, summary: 'Updated impact analysis following new SECO data.', countryId: 'ch' },
  { id: 'cl-003', timestamp: '2026-04-03T09:30:00Z', type: 'ingestion', title: 'AI governance bill advances', subject: 'AI Governance Framework', subjectType: 'proposal', subjectId: 'prop-003', revisionId: 'rev-us-ai01', evidenceCount: 45, summary: 'Senate committee passed AI governance bill with amendments.', countryId: 'us' },
  { id: 'cl-004', timestamp: '2026-04-02T16:40:00Z', type: 'correction', title: 'Actor profile corrected', subject: 'Maria Schneider', subjectType: 'actor', subjectId: 'actor-001', revisionId: 'rev-j0k1l2', evidenceCount: 3, summary: 'GPK membership date corrected.', countryId: 'ch' },
  { id: 'cl-005', timestamp: '2026-04-02T10:15:00Z', type: 'forecast_update', title: 'Cross-border AI policy analysis', subject: 'Mitchell-Dupont AI cooperation', subjectType: 'actor', subjectId: 'actor-004', revisionId: 'rev-xb01', evidenceCount: 8, summary: 'New analysis of transatlantic AI governance alignment.', countryId: 'us' },
];

// ==================== LABELS ====================

export const typeLabels: Record<ChangeLogEntry['type'], string> = {
  proposal_added: 'NEW', revision: 'REV', correction: 'COR', ingestion: 'ING', forecast_update: 'FCT',
};

export const statusLabels: Record<Proposal['status'], string> = {
  consultation: 'CONSULTATION', parliamentary_deliberation: 'DELIBERATION', pending_vote: 'PENDING VOTE', accepted: 'ACCEPTED', rejected: 'REJECTED',
};

export const eventTypeLabels: Record<ActorEvent['type'], string> = {
  vote: 'VOTE', speech: 'SPCH', committee_join: 'JOIN', committee_leave: 'LEFT', election: 'ELCT',
  appointment: 'APPT', resignation: 'RSGN', scandal: 'SCAN', policy_change: 'PLCY',
  party_switch: 'SWCH', legislation_sponsored: 'LGSL', foreign_meeting: 'FRGN',
};

export const eventTypeColors: Record<ActorEvent['type'], string> = {
  vote: 'bg-primary/10', speech: 'bg-accent/20', committee_join: 'bg-green-500/10', committee_leave: 'bg-destructive/10',
  election: 'bg-yellow-500/10', appointment: 'bg-blue-500/10', resignation: 'bg-destructive/10', scandal: 'bg-destructive/20',
  policy_change: 'bg-purple-500/10', party_switch: 'bg-orange-500/10', legislation_sponsored: 'bg-green-500/10', foreign_meeting: 'bg-blue-500/10',
};

// ==================== HELPERS ====================

export const getCountry = (id: string) => countries.find(c => c.id === id);
export const getContinent = (id: string) => continents.find(c => c.id === id);
export const getCity = (id: string) => cities.find(c => c.id === id);
export const getParty = (id: string) => parties.find(p => p.id === id);
export const getActorEvents = (actorId: string) => actorEvents.filter(e => e.actorId === actorId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
export const getActorsByCountry = (countryId: string) => mockActors.filter(a => a.countryId === countryId);
export const getActorsByContinent = (continentId: string) => {
  const countryIds = countries.filter(c => c.continentId === continentId).map(c => c.id);
  return mockActors.filter(a => countryIds.includes(a.countryId));
};
