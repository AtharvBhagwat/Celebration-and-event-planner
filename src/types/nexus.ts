export type ActiveTab = 'architect' | 'audit' | 'blueprints' | 'test-runner' | 'accessibility';

export interface PillarBreakdown {
  alignment: {
    rootCause: string;
    strategicFit: string;
  };
  codeQuality: {
    principles: string[];
    documentation: string;
    code: string;
    language: string;
  };
  security: {
    zeroTrustRules: string[];
    owaspMitigations: string[];
    secretsSanitized: boolean;
  };
  efficiency: {
    timeComplexity: string;
    spaceComplexity: string;
    optimizations: string[];
  };
  testing: {
    framework: string;
    testSuiteCode: string;
    edgeCasesCovered: string[];
  };
  accessibility: {
    wcagLevel: 'WCAG 2.2 AA' | 'WCAG 2.2 AAA';
    ariaAttributes: string[];
    contrastRatio: string;
    keyboardNavigability: string;
  };
}

export interface HeuristicIssue {
  pillar: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  remediation: string;
}

export interface AuditResult {
  score: number;
  issuesCount: number;
  issues: HeuristicIssue[];
  aiEvaluation?: string;
}

export interface SystemBlueprint {
  id: string;
  title: string;
  category: 'GenAI & RAG' | 'Distributed Systems' | 'Microservices' | 'Edge & Security' | 'Real-Time Sync';
  description: string;
  complexity: {
    time: string;
    space: string;
  };
  owaspMitigations: string[];
  nodes: {
    id: string;
    name: string;
    type: 'client' | 'gateway' | 'compute' | 'storage' | 'eventbus' | 'security';
    description: string;
  }[];
  codeSnippet: string;
  language: string;
  testSuite: string;
  wcagNotes: string;
}

export interface TestCase {
  id: string;
  title: string;
  type: 'unit' | 'integration' | 'edge-case' | 'security' | 'async-failure';
  input: string;
  expected: string;
  status: 'passed' | 'failed' | 'pending';
  durationMs: number;
  details?: string;
}
