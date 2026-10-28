'use client';

import Link from 'next/link';
import { useMemo, useState, type CSSProperties } from 'react';
import {
  Activity,
  BrainCircuit,
  ClipboardList,
  FileHeart,
  HeartPulse,
  Languages,
  LayoutDashboard,
  LoaderCircle,
  Network,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRound,
  UsersRound,
} from 'lucide-react';

import { AddConditionForm } from '@/components/AddConditionForm';
import { AddFamilyMemberForm } from '@/components/AddFamilyMemberForm';
import { FamilySummary } from '@/components/FamilySummary';
import { FamilyTree } from '@/components/FamilyTree';
import { NewPatientForm } from '@/components/NewPatientForm';
import { PatternCard } from '@/components/PatternCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { DEMO_FAMILY } from '@/lib/demo-data';
import { translations, type Locale } from '@/lib/i18n';
import { buildFallbackNarratives } from '@/lib/narratives';
import { detectHealthPatterns } from '@/lib/rules';
import type {
  AnalysisResponse,
  FamilyMember,
  HealthPattern,
  MedicalCondition,
} from '@/types/health';

const clinicalCopy = {
  en: {
    clinicalBrand: 'Clinical family history',
    secureWorkspace: 'Fictional demo workspace',
    dashboard: 'Dashboard',
    patientRecord: 'Patient record',
    familyTree: 'Family tree',
    patterns: 'Patterns',
    summaries: 'Summaries',
    morning: 'Good morning, Dr. Ahmed',
    title: 'Family Health Clinical Dashboard',
    description:
      'Review reported family history, identify rule-based patterns, and prepare a clear clinical summary.',
    demoWorkspace: 'Fictional demo workspace',
    search: 'Search current patient…',
    doctor: 'Dr. Ahmed',
    clinician: 'Clinician',
    patients: 'Active patients',
    patternsFound: 'Rule signals',
    needsReview: 'Conditions to review',
    patientQueue: 'Current patient',
    patientQueueDescription: 'The patient record open for review.',
    demoPatient: 'Demo record',
    years: 'years',
    relatives: 'family members',
    reportedConditions: 'reported conditions',
    reviewReady: 'Ready for clinical review',
    noPatient: 'No active patient',
    noPatientHint: 'Create a patient record or reload the fictional demo.',
    noSearchMatch: 'No patient matches this search.',
    openReview: 'Open family review',
    clinicalWorkflow: 'Clinical workflow',
    workflowDescription: 'A short, safe path from intake to summary.',
    workflowOne: 'Record reported family history',
    workflowTwo: 'Run deterministic pattern rules',
    workflowThree: 'Review the explanation and summary',
    ruleControlled: 'Rules control every detected pattern',
    intakeTitle: 'Family history intake',
    intakeDescription:
      'Update this patient’s relatives and reported conditions before analysis.',
    reloadDemo: 'Reload demo',
    safetyTitle: 'Clinical safety boundary',
    safetyDescription:
      'The system supports review. It does not diagnose, calculate risk percentages, or recommend treatment.',
  },
  ar: {
    clinicalBrand: 'التاريخ الصحي العائلي السريري',
    secureWorkspace: 'مساحة تجريبية ببيانات وهمية',
    dashboard: 'لوحة التحكم',
    patientRecord: 'ملف المريض',
    familyTree: 'شجرة العائلة',
    patterns: 'الأنماط',
    summaries: 'الملخصات',
    morning: 'صباح الخير، د. أحمد',
    title: 'لوحة التاريخ الصحي العائلي السريرية',
    description:
      'راجع التاريخ العائلي المسجل، وحدد الأنماط بالقواعد الثابتة، وجهّز ملخصاً سريرياً واضحاً.',
    demoWorkspace: 'مساحة تجريبية ببيانات وهمية',
    search: 'ابحث في المريض الحالي…',
    doctor: 'د. أحمد',
    clinician: 'طبيب',
    patients: 'المرضى النشطون',
    patternsFound: 'إشارات القواعد',
    needsReview: 'حالات تحتاج مراجعة',
    patientQueue: 'المريض الحالي',
    patientQueueDescription: 'ملف المريض المفتوح للمراجعة الآن.',
    demoPatient: 'ملف تجريبي',
    years: 'سنة',
    relatives: 'أفراد في العائلة',
    reportedConditions: 'حالات مسجلة',
    reviewReady: 'جاهز للمراجعة السريرية',
    noPatient: 'لا يوجد مريض نشط',
    noPatientHint: 'أنشئ ملف مريض أو أعد تحميل البيانات التجريبية.',
    noSearchMatch: 'لا يوجد مريض مطابق للبحث.',
    openReview: 'فتح مراجعة العائلة',
    clinicalWorkflow: 'مسار العمل السريري',
    workflowDescription: 'مسار قصير وآمن من التسجيل إلى الملخص.',
    workflowOne: 'تسجيل التاريخ الصحي العائلي المبلغ عنه',
    workflowTwo: 'تشغيل قواعد الأنماط الثابتة',
    workflowThree: 'مراجعة الشرح والملخص',
    ruleControlled: 'القواعد تتحكم في جميع الأنماط المكتشفة',
    intakeTitle: 'تسجيل التاريخ العائلي',
    intakeDescription: 'حدّث أقارب المريض والحالات المسجلة قبل تشغيل التحليل.',
    reloadDemo: 'إعادة البيانات التجريبية',
    safetyTitle: 'حدود السلامة السريرية',
    safetyDescription:
      'يدعم النظام المراجعة فقط. لا يشخّص ولا يحسب نسب المخاطر ولا يوصي بالعلاج.',
  },
} as const;

function groupPatterns(patterns: HealthPattern[]) {
  return patterns.reduce<Record<string, HealthPattern[]>>((groups, pattern) => {
    groups[pattern.condition] = [...(groups[pattern.condition] ?? []), pattern];
    return groups;
  }, {});
}

export function FamilyHealthMapApp() {
  const [locale, setLocale] = useState<Locale>('en');
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() =>
    structuredClone(DEMO_FAMILY),
  );
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [notice, setNotice] = useState<'ai' | 'service' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const t = translations[locale];
  const c = clinicalCopy[locale];

  const conditionCount = familyMembers.reduce(
    (total, member) => total + member.conditions.length,
    0,
  );
  const currentPatient =
    familyMembers.find(({ generation }) => generation === 0) ??
    familyMembers[0];
  const patientAge = currentPatient?.birth_year
    ? new Date().getFullYear() - currentPatient.birth_year
    : null;
  const rulePatterns = useMemo(
    () => detectHealthPatterns(familyMembers),
    [familyMembers],
  );
  const reviewConditionCount = useMemo(
    () => new Set(rulePatterns.map(({ condition }) => condition)).size,
    [rulePatterns],
  );
  const groupedPatterns = useMemo(
    () => groupPatterns(analysis?.patterns ?? []),
    [analysis],
  );
  const patientMatchesSearch =
    !searchQuery.trim() ||
    currentPatient?.name
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());

  const navigation = [
    { id: 'overview', label: c.dashboard, icon: LayoutDashboard },
    { id: 'patient-record', label: c.patientRecord, icon: UserRound },
    { id: 'family-tree', label: c.familyTree, icon: Network },
    { id: 'patterns', label: c.patterns, icon: BrainCircuit },
    { id: 'clinical-summary', label: c.summaries, icon: FileHeart },
  ];

  function resetAnalysis() {
    setAnalysis(null);
    setNotice(null);
  }

  function switchLanguage() {
    const nextLocale: Locale = locale === 'en' ? 'ar' : 'en';
    setLocale(nextLocale);

    if (analysis) {
      setAnalysis({
        patterns: analysis.patterns,
        ...buildFallbackNarratives(
          analysis.patterns,
          familyMembers,
          nextLocale,
        ),
        aiAvailable: false,
      });
    }
  }

  function jumpTo(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  function loadDemo() {
    setFamilyMembers(structuredClone(DEMO_FAMILY));
    setSearchQuery('');
    resetAnalysis();
  }

  function createPatient(patient: FamilyMember) {
    setFamilyMembers([patient]);
    setSearchQuery('');
    resetAnalysis();
  }

  function addMember(member: FamilyMember) {
    setFamilyMembers((current) => [...current, member]);
    resetAnalysis();
  }

  function addCondition(memberId: string, condition: MedicalCondition) {
    setFamilyMembers((current) =>
      current.map((member) =>
        member.id === memberId
          ? { ...member, conditions: [...member.conditions, condition] }
          : member,
      ),
    );
    resetAnalysis();
  }

  async function analyzeFamily() {
    setIsAnalyzing(true);
    setNotice(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ familyMembers, locale }),
      });
      const data = (await response.json()) as AnalysisResponse & {
        error?: string;
      };
      if (!response.ok) throw new Error(data.error ?? 'Analysis failed.');
      setAnalysis(data);

      if (!data.aiAvailable && data.patterns.length > 0) {
        setNotice('ai');
      }
    } catch {
      const patterns = detectHealthPatterns(familyMembers);
      setAnalysis({
        patterns,
        ...buildFallbackNarratives(patterns, familyMembers, locale),
        aiAvailable: false,
      });
      setNotice('service');
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <SidebarProvider
      style={{ '--sidebar-width': '15.5rem' } as CSSProperties}
      className="bg-background"
    >
      <div
        lang={locale}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        className="flex min-h-svh w-full bg-background text-foreground"
      >
        <Sidebar
          side={locale === 'ar' ? 'right' : 'left'}
          collapsible="offcanvas"
          className="border-none"
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
          <SidebarHeader className="border-b border-white/10 p-5">
            <Link
              href="/"
              className="flex items-center gap-3 text-sidebar-foreground"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_10px_30px_rgba(65,176,110,0.25)]">
                <HeartPulse className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-heading text-base font-semibold tracking-tight">
                  {t.appName}
                </p>
                <p className="truncate text-xs text-sidebar-foreground/60">
                  {c.clinicalBrand}
                </p>
              </div>
            </Link>
          </SidebarHeader>

          <SidebarContent className="px-3 py-5">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1.5">
                  {navigation.map(({ id, label, icon: Icon }, index) => (
                    <SidebarMenuItem key={id}>
                      <SidebarMenuButton
                        size="lg"
                        isActive={index === 0}
                        className="h-10 rounded-xl px-3 text-sidebar-foreground/75 hover:bg-white/10 hover:text-sidebar-foreground data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground"
                        disabled={id === 'clinical-summary' && !analysis}
                        onClick={() => jumpTo(id)}
                      >
                        <Icon />
                        <span>{label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mx-3 mt-auto rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-5 text-sidebar-foreground/65">
              <ShieldCheck className="mb-3 size-5 text-sidebar-primary" />
              <p className="font-medium text-sidebar-foreground">
                {c.safetyTitle}
              </p>
              <p className="mt-1">{c.safetyDescription}</p>
            </div>
          </SidebarContent>

          <SidebarFooter className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3 rounded-xl px-2 py-1.5">
              <span className="flex size-9 items-center justify-center rounded-full bg-sidebar-primary font-semibold text-sidebar-primary-foreground">
                DA
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{c.doctor}</p>
                <p className="truncate text-xs text-sidebar-foreground/55">
                  {c.secureWorkspace}
                </p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="min-w-0 bg-background">
          <header className="sticky top-0 z-30 border-b bg-card/92 backdrop-blur-xl">
            <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
              <SidebarTrigger className="md:hidden" />
              <div className="relative min-w-0 flex-1 sm:max-w-md">
                <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="h-10 rounded-xl bg-background ps-9 shadow-none"
                  placeholder={c.search}
                  aria-label={c.search}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                aria-label={t.switchLanguageLabel}
                onClick={switchLanguage}
              >
                <Languages data-icon="inline-start" />
                {t.switchLanguage}
              </Button>
              <div className="hidden items-center gap-3 border-s ps-4 sm:flex">
                <div className="text-end">
                  <p className="text-sm font-semibold">{c.doctor}</p>
                  <p className="text-xs text-muted-foreground">{c.clinician}</p>
                </div>
                <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground ring-4 ring-secondary/25">
                  DA
                </span>
              </div>
            </div>
          </header>

          <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <section
              id="overview"
              className="relative overflow-hidden rounded-3xl bg-[var(--brand-navy)] p-6 text-[var(--brand-cream)] shadow-[0_24px_70px_rgba(20,30,70,0.16)] md:p-8"
            >
              <div className="absolute -end-16 -top-20 size-56 rounded-full border-[34px] border-[color-mix(in_srgb,var(--brand-mint)_16%,transparent)]" />
              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <p className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--brand-mint)]">
                    <Stethoscope className="size-4" />
                    {c.morning}
                  </p>
                  <h1 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
                    {c.title}
                  </h1>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-[color-mix(in_srgb,var(--brand-cream)_72%,transparent)] md:text-base">
                    {c.description}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="h-9 border border-white/10 bg-white/10 px-3 text-[var(--brand-cream)]">
                    <ShieldCheck data-icon="inline-start" />
                    {c.demoWorkspace}
                  </Badge>
                  <NewPatientForm locale={locale} onCreate={createPatient} />
                </div>
              </div>
            </section>

            <section className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: c.patients,
                  value: currentPatient ? 1 : 0,
                  icon: UsersRound,
                  tone: 'bg-secondary text-secondary-foreground',
                },
                {
                  label: c.patternsFound,
                  value: rulePatterns.length,
                  icon: BrainCircuit,
                  tone: 'bg-primary text-primary-foreground',
                },
                {
                  label: c.needsReview,
                  value: reviewConditionCount,
                  icon: ClipboardList,
                  tone: 'bg-[var(--brand-navy)] text-[var(--brand-cream)]',
                },
              ].map(({ label, value, icon: Icon, tone }) => (
                <Card
                  key={label}
                  className="overflow-hidden border-0 bg-card shadow-sm ring-1 ring-border"
                >
                  <CardContent className="flex items-center justify-between gap-4 py-5">
                    <div>
                      <p className="text-sm text-muted-foreground">{label}</p>
                      <p className="mt-1 font-heading text-3xl font-semibold tabular-nums">
                        {value}
                      </p>
                    </div>
                    <span
                      className={`flex size-11 items-center justify-center rounded-2xl ${tone}`}
                    >
                      <Icon className="size-5" />
                    </span>
                  </CardContent>
                </Card>
              ))}
            </section>

            <section
              id="patient-record"
              className="mt-6 grid scroll-mt-24 gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]"
            >
              <Card className="border-0 bg-card shadow-sm ring-1 ring-border">
                <CardHeader className="border-b">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <CardTitle>{c.patientQueue}</CardTitle>
                      <CardDescription className="mt-1">
                        {c.patientQueueDescription}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{c.demoPatient}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {!patientMatchesSearch ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      {c.noSearchMatch}
                    </div>
                  ) : currentPatient ? (
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                      <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-xl font-semibold text-secondary-foreground">
                        {currentPatient.name.slice(0, 2).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg font-semibold">
                            {currentPatient.name}
                          </p>
                          {patientAge !== null && (
                            <Badge variant="outline">
                              {patientAge} {c.years}
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {familyMembers.length} {c.relatives} ·{' '}
                          {conditionCount} {c.reportedConditions}
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-sm font-medium text-primary">
                          <span className="size-2 rounded-full bg-primary" />
                          {c.reviewReady}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => jumpTo('family-tree')}
                      >
                        <Network data-icon="inline-start" />
                        {c.openReview}
                      </Button>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="font-medium">{c.noPatient}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {c.noPatientHint}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 bg-[color-mix(in_srgb,var(--brand-mint)_30%,var(--card))] shadow-sm ring-1 ring-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="size-5 text-primary" />
                    {c.clinicalWorkflow}
                  </CardTitle>
                  <CardDescription>{c.workflowDescription}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[c.workflowOne, c.workflowTwo, c.workflowThree].map(
                    (step, index) => (
                      <div
                        key={step}
                        className="flex items-start gap-3 text-sm leading-5"
                      >
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-card text-xs font-semibold text-primary ring-1 ring-border">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ),
                  )}
                  <div className="mt-4 flex items-center gap-2 border-t pt-4 text-xs font-medium text-muted-foreground">
                    <ShieldCheck className="size-4 text-primary" />
                    {c.ruleControlled}
                  </div>
                </CardContent>
              </Card>
            </section>

            <section
              className="mt-6 scroll-mt-24"
              aria-labelledby="intake-heading"
            >
              <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2
                    id="intake-heading"
                    className="font-heading text-xl font-semibold"
                  >
                    {c.intakeTitle}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {c.intakeDescription}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={loadDemo}>
                  <Activity data-icon="inline-start" />
                  {c.reloadDemo}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2.5 rounded-2xl border bg-card p-3 shadow-sm">
                <AddFamilyMemberForm locale={locale} onAdd={addMember} />
                <AddConditionForm
                  locale={locale}
                  familyMembers={familyMembers}
                  onAdd={addCondition}
                />
                <Button
                  size="lg"
                  className="ms-auto min-w-40"
                  disabled={familyMembers.length === 0 || isAnalyzing}
                  onClick={analyzeFamily}
                >
                  {isAnalyzing ? (
                    <LoaderCircle
                      className="animate-spin"
                      data-icon="inline-start"
                    />
                  ) : (
                    <BrainCircuit data-icon="inline-start" />
                  )}
                  {isAnalyzing ? t.analyzing : t.analyzeFamily}
                </Button>
              </div>
            </section>

            {notice && (
              <Alert className="mt-5 bg-secondary/55 text-foreground">
                <ShieldCheck />
                <AlertTitle>{t.safeFallbackTitle}</AlertTitle>
                <AlertDescription>
                  {notice === 'ai' ? t.aiUnavailable : t.serviceUnavailable}
                </AlertDescription>
              </Alert>
            )}

            <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.85fr)]">
              <Card
                id="family-tree"
                className="scroll-mt-24 border-0 shadow-sm ring-1 ring-border"
              >
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Network className="size-4 text-primary" />
                    {t.familyTree}
                  </CardTitle>
                  <CardDescription>{t.treeDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <FamilyTree locale={locale} familyMembers={familyMembers} />
                </CardContent>
              </Card>

              <div id="patterns" className="scroll-mt-24 space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-heading text-xl font-semibold">
                      {t.detectedPatterns}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t.fixedRules}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {(analysis?.patterns ?? rulePatterns).length} {t.results}
                  </Badge>
                </div>

                {!analysis ? (
                  <Card className="border-dashed bg-card/60 shadow-none">
                    <CardContent className="py-10 text-center">
                      <BrainCircuit className="mx-auto mb-3 size-7 text-primary" />
                      <p className="font-medium">{t.noAnalysis}</p>
                      <p className="mt-1 text-sm leading-5 text-muted-foreground">
                        {t.noAnalysisHint}
                      </p>
                    </CardContent>
                  </Card>
                ) : analysis.patterns.length === 0 ? (
                  <Card className="border-0 shadow-sm ring-1 ring-border">
                    <CardContent className="py-8">
                      <p className="text-sm leading-6">
                        {analysis.aiExplanation}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  Object.entries(groupedPatterns).map(
                    ([condition, patterns]) => (
                      <PatternCard
                        key={condition}
                        locale={locale}
                        condition={condition}
                        patterns={patterns}
                      />
                    ),
                  )
                )}
              </div>
            </section>

            {analysis && analysis.patterns.length > 0 && (
              <section id="clinical-summary" className="mt-6 scroll-mt-24">
                <FamilySummary locale={locale} analysis={analysis} />
              </section>
            )}

            <footer className="mx-auto mt-8 max-w-4xl border-t pt-6 text-center text-xs leading-5 text-muted-foreground">
              {t.disclaimer}
            </footer>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
