'use client';

import { useMemo } from 'react';
import {
  Background,
  Controls,
  Position,
  ReactFlow,
  type Edge,
  type Node,
} from '@xyflow/react';

import { translateKnownTerm, translations, type Locale } from '@/lib/i18n';
import type { FamilyMember } from '@/types/health';

type Props = {
  locale: Locale;
  familyMembers: FamilyMember[];
};

function createNodes(familyMembers: FamilyMember[], locale: Locale): Node[] {
  const t = translations[locale];
  const grouped = new Map<number, FamilyMember[]>();
  for (const member of familyMembers) {
    grouped.set(member.generation, [
      ...(grouped.get(member.generation) ?? []),
      member,
    ]);
  }

  const maxGeneration = Math.max(
    ...familyMembers.map(({ generation }) => generation),
    0,
  );

  return familyMembers.map((member) => {
    const generationMembers = grouped.get(member.generation) ?? [];
    const index = generationMembers.findIndex(({ id }) => id === member.id);
    const spacing = Math.max(230, 840 / Math.max(generationMembers.length, 1));
    const totalWidth = spacing * Math.max(generationMembers.length - 1, 0);
    const x = 420 - totalWidth / 2 + index * spacing;
    const conditions = member.conditions.map(
      ({ condition_name }) => condition_name,
    );

    return {
      id: member.id,
      position: { x, y: (maxGeneration - member.generation) * 165 },
      data: {
        label: (
          <div
            className={`w-[190px] ${locale === 'ar' ? 'text-right' : 'text-left'}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-foreground">
                {member.name}
              </span>
              {!member.blood_relative && (
                <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] uppercase text-muted-foreground">
                  {t.nonBlood}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {translateKnownTerm(member.relationship, locale)}
            </p>
            <div className="mt-2 border-t border-border pt-2 text-xs">
              {conditions.length > 0 ? (
                conditions.map((condition) => (
                  <p key={condition} className="truncate text-primary">
                    {translateKnownTerm(condition, locale)}
                  </p>
                ))
              ) : (
                <p className="text-muted-foreground">{t.noCondition}</p>
              )}
            </div>
          </div>
        ),
      },
      type: 'default',
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      style: {
        width: 210,
        border: '1px solid var(--border)',
        borderRadius: '14px',
        background: 'var(--card)',
        color: 'var(--foreground)',
        padding: '12px',
        boxShadow: '0 8px 24px rgb(22 78 74 / 0.08)',
      },
    };
  });
}

function createEdges(familyMembers: FamilyMember[]): Edge[] {
  const selfMember = familyMembers.find(
    ({ relationship, generation }) =>
      relationship.toLowerCase() === 'self' || generation === 0,
  );
  const edges: Edge[] = [];

  for (const member of familyMembers) {
    if (member.generation >= 2) {
      const nextGeneration = familyMembers.filter(
        (candidate) =>
          candidate.generation === member.generation - 1 &&
          candidate.family_side === member.family_side,
      );
      for (const child of nextGeneration) {
        edges.push({
          id: `${member.id}-${child.id}`,
          source: member.id,
          target: child.id,
          type: 'smoothstep',
        });
      }
    }
  }

  if (selfMember) {
    const parents = familyMembers.filter(
      ({ relationship, generation }) =>
        generation === 1 && /father|mother|الأب|الأم|الام/i.test(relationship),
    );
    for (const parent of parents) {
      edges.push({
        id: `${parent.id}-${selfMember.id}`,
        source: parent.id,
        target: selfMember.id,
        type: 'smoothstep',
      });
    }
  }

  return edges.map((edge) => ({
    ...edge,
    style: { stroke: 'var(--primary)', strokeWidth: 1.5, opacity: 0.55 },
  }));
}

export function FamilyTree({ locale, familyMembers }: Props) {
  const t = translations[locale];
  const nodes = useMemo(
    () => createNodes(familyMembers, locale),
    [familyMembers, locale],
  );
  const edges = useMemo(() => createEdges(familyMembers), [familyMembers]);

  if (familyMembers.length === 0) {
    return (
      <div className="flex h-full min-h-[390px] items-center justify-center text-center">
        <div className="max-w-xs">
          <p className="font-medium">{t.treeEmpty}</p>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            {t.treeEmptyHint}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[480px] overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_top_left,color-mix(in_oklch,var(--secondary)_35%,transparent),transparent_45%)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.16 }}
        minZoom={0.45}
        maxZoom={1.3}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background color="var(--border)" gap={24} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
