import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  RACI_VALUES,
  type RaciAssignment,
  type RaciAssignmentInput,
  type RaciValue,
} from '@scoutbook/types';
import { Badge } from '@scoutbook/ui/components/badge';
import { Button } from '@scoutbook/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@scoutbook/ui/components/card';
import { Input } from '@scoutbook/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@scoutbook/ui/components/select';
import { useAbility } from '@web/auth/AbilityContext';
import { RaciDiagram } from '@web/components/raci-diagram';
import { notifySuccess, raciApi } from '@web/lib/api';
import { startEffectAsync } from '@web/lib/effect-async';

const ROLE_COLS = [
  { key: 'poValue', label: 'PO' },
  { key: 'pmValue', label: 'PM' },
  { key: 'developerValue', label: 'Dev' },
  { key: 'qaValue', label: 'QA' },
  { key: 'designerValue', label: 'Des' },
  { key: 'techLeadValue', label: 'TL' },
] as const;

type DraftRow = RaciAssignmentInput & { key: string };

function toDraft(rows: RaciAssignment[]): DraftRow[] {
  return rows.map((row, index) => ({
    key: String(row.id),
    stepName: row.stepName,
    poValue: row.poValue,
    pmValue: row.pmValue,
    developerValue: row.developerValue,
    qaValue: row.qaValue,
    designerValue: row.designerValue,
    techLeadValue: row.techLeadValue,
    sortOrder: row.sortOrder ?? index,
  }));
}

function letterLabel(value: RaciValue): string {
  return value === '' ? '—' : value;
}

type Props = {
  featureId: number;
  token: string;
  onRowsChange?: (rows: RaciAssignment[]) => void;
};

export function FeatureRaciPanel({ featureId, token, onRowsChange }: Props) {
  const ability = useAbility();
  const canManage = ability.can('manage', 'Raci');
  const [draft, setDraft] = useState<DraftRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [view, setView] = useState<'diagram' | 'edit'>('diagram');
  const activeView = canManage ? view : 'diagram';

  useEffect(() => {
    return startEffectAsync(async (ctl) => {
      setLoading(true);
      try {
        const rows = await raciApi.list(token, featureId);
        if (!ctl.cancelled) {
          setDraft(toDraft(rows));
          onRowsChange?.(rows);
        }
      } catch {
        if (!ctl.cancelled) {
          setDraft([]);
          onRowsChange?.([]);
        }
      } finally {
        if (!ctl.cancelled) setLoading(false);
      }
    });
  }, [featureId, token, onRowsChange]);

  function updateRow(
    key: string,
    patch: Partial<RaciAssignmentInput>,
  ) {
    setDraft((rows) =>
      rows.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  }

  async function seed() {
    setSeeding(true);
    try {
      const rows = await raciApi.seed(token, featureId);
      setDraft(toDraft(rows));
      onRowsChange?.(rows);
      notifySuccess('RACI defaults loaded');
    } catch {
      // toast
    } finally {
      setSeeding(false);
    }
  }

  async function save() {
    setSaving(true);
    try {
      const rows = await raciApi.replace(token, featureId, {
        rows: draft.map(
          (
            {
              stepName,
              poValue,
              pmValue,
              developerValue,
              qaValue,
              designerValue,
              techLeadValue,
              sortOrder,
            },
            index,
          ) => ({
            stepName,
            poValue,
            pmValue,
            developerValue,
            qaValue,
            designerValue,
            techLeadValue,
            sortOrder: sortOrder ?? index,
          }),
        ),
      });
      setDraft(toDraft(rows));
      onRowsChange?.(rows);
      notifySuccess('RACI matrix saved');
    } catch {
      // toast
    } finally {
      setSaving(false);
    }
  }

  function addRow() {
    setDraft((rows) => [
      ...rows,
      {
        key: `new-${Date.now()}`,
        stepName: 'New step',
        poValue: '',
        pmValue: '',
        developerValue: '',
        qaValue: '',
        designerValue: '',
        techLeadValue: '',
        sortOrder: rows.length,
      },
    ]);
  }

  function removeRow(key: string) {
    setDraft((rows) => rows.filter((row) => row.key !== key));
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base">RACI</CardTitle>
          <Badge variant="outline">{draft.length} steps</Badge>
        </div>
        <CardDescription>
          R = does the work, A = accountable, C = consulted, I = informed.
          Leaving RACI needs at least one R and one A on every step.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading RACI…</p>
        ) : null}

        {!loading && draft.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {canManage
              ? 'No steps yet. Seed lifecycle defaults or add a row.'
              : 'No RACI steps yet. PO or PM must seed and save the matrix.'}
          </p>
        ) : null}

        {!loading && draft.length > 0 && canManage ? (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={activeView === 'diagram' ? 'default' : 'outline'}
              className="min-h-11"
              onClick={() => setView('diagram')}
            >
              Diagram
            </Button>
            <Button
              type="button"
              size="sm"
              variant={activeView === 'edit' ? 'default' : 'outline'}
              className="min-h-11"
              onClick={() => setView('edit')}
            >
              Edit
            </Button>
          </div>
        ) : null}

        {!loading && draft.length > 0 && !canManage ? (
          <p className="text-xs text-muted-foreground">
            View only — PO or PM can edit RACI.
          </p>
        ) : null}

        {!loading && draft.length > 0 && activeView === 'diagram' ? (
          <RaciDiagram rows={draft} />
        ) : null}

        {!loading && draft.length > 0 && activeView === 'edit' && canManage ? (
          <div className="grid gap-3">
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[36rem] border-collapse text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="p-2 font-medium">Step</th>
                    {ROLE_COLS.map((col) => (
                      <th key={col.key} className="p-2 font-medium">
                        {col.label}
                      </th>
                    ))}
                    <th className="p-2" />
                  </tr>
                </thead>
                <tbody>
                  {draft.map((row) => (
                    <tr key={row.key} className="border-b align-middle">
                      <td className="p-2">
                        <Input
                          value={row.stepName}
                          maxLength={120}
                          className="min-h-11"
                          onChange={(e) =>
                            updateRow(row.key, { stepName: e.target.value })
                          }
                        />
                      </td>
                      {ROLE_COLS.map((col) => (
                        <td key={col.key} className="p-2">
                          <Select
                            value={row[col.key] === '' ? '__blank' : row[col.key]}
                            onValueChange={(v) =>
                              updateRow(row.key, {
                                [col.key]:
                                  v === '__blank' ? '' : (v as RaciValue),
                              })
                            }
                          >
                            <SelectTrigger className="min-h-11 w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {RACI_VALUES.map((value) => (
                                <SelectItem
                                  key={value || 'blank'}
                                  value={value === '' ? '__blank' : value}
                                >
                                  {letterLabel(value)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                      ))}
                      <td className="p-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="min-h-11"
                          onClick={() => removeRow(row.key)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="grid gap-3 md:hidden">
              {draft.map((row) => (
                <li
                  key={row.key}
                  className="grid gap-2 rounded-lg border p-3"
                >
                  <Input
                    value={row.stepName}
                    maxLength={120}
                    className="min-h-11"
                    onChange={(e) =>
                      updateRow(row.key, { stepName: e.target.value })
                    }
                  />
                  <div className="grid grid-cols-2 gap-2">
                    {ROLE_COLS.map((col) => (
                      <label key={col.key} className="grid gap-1 text-xs">
                        <span className="text-muted-foreground">{col.label}</span>
                        <Select
                          value={
                            row[col.key] === '' ? '__blank' : row[col.key]
                          }
                          onValueChange={(v) =>
                            updateRow(row.key, {
                              [col.key]:
                                v === '__blank' ? '' : (v as RaciValue),
                            })
                          }
                        >
                          <SelectTrigger className="min-h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {RACI_VALUES.map((value) => (
                              <SelectItem
                                key={value || 'blank'}
                                value={value === '' ? '__blank' : value}
                              >
                                {letterLabel(value)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </label>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-11"
                    onClick={() => removeRow(row.key)}
                  >
                    Remove step
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {canManage ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              variant="outline"
              className="min-h-11"
              disabled={seeding || loading}
              onClick={() => void seed()}
            >
              {seeding ? (
                <>
                  <Loader2 className="animate-spin" />
                  Seeding…
                </>
              ) : (
                'Seed defaults'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="min-h-11"
              disabled={loading || draft.length >= 20}
              onClick={addRow}
            >
              Add step
            </Button>
            <Button
              type="button"
              className="min-h-11"
              disabled={saving || loading || draft.length === 0}
              onClick={() => void save()}
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" />
                  Saving…
                </>
              ) : (
                'Save RACI'
              )}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
