import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  TEST_INVENTORY_TIERS,
  type TestInventoryItem,
  type TestInventoryTier,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@scoutbook/ui/components/table';
import { Textarea } from '@scoutbook/ui/components/textarea';
import { useAbility } from '@web/auth/AbilityContext';
import { useAuth } from '@web/auth/AuthContext';
import { RiskBadge } from '@web/components/feature-badges';
import { PageHeader } from '@web/components/page-header';
import { notifySuccess, testInventoryApi } from '@web/lib/api';
import { startEffectAsync } from '@web/lib/effect-async';

export function TestInventoryPage() {
  const { token, user } = useAuth();
  const ability = useAbility();
  const canManage = ability.can('manage', 'TestInventory');
  const isPo = user?.role === 'PO';

  const [filter, setFilter] = useState<TestInventoryTier | 'ALL'>('ALL');
  const [rows, setRows] = useState<TestInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [saving, setSaving] = useState(false);

  const [area, setArea] = useState('');
  const [packagePath, setPackagePath] = useState('');
  const [tier, setTier] = useState<TestInventoryTier>('P2');
  const [why, setWhy] = useState('');

  async function reload(nextFilter: TestInventoryTier | 'ALL' = filter) {
    if (!token) return;
    const list = await testInventoryApi.list(
      token,
      nextFilter === 'ALL' ? undefined : nextFilter,
    );
    setRows(list);
  }

  useEffect(() => {
    if (!token) return;
    return startEffectAsync(async (ctl) => {
      setLoading(true);
      try {
        const list = await testInventoryApi.list(
          token,
          filter === 'ALL' ? undefined : filter,
        );
        if (!ctl.cancelled) setRows(list);
      } catch {
        if (!ctl.cancelled) setRows([]);
      } finally {
        if (!ctl.cancelled) setLoading(false);
      }
    });
  }, [token, filter]);

  async function onSeed() {
    if (!token) return;
    setSeeding(true);
    try {
      const result = await testInventoryApi.seed(token);
      setRows(
        filter === 'ALL'
          ? result.rows
          : result.rows.filter((row) => row.tier === filter),
      );
      notifySuccess(
        result.seeded
          ? `Seeded ${result.added} rows`
          : 'Inventory already seeded',
      );
    } catch {
      // toast
    } finally {
      setSeeding(false);
    }
  }

  async function onCreate() {
    if (!token) return;
    setSaving(true);
    try {
      await testInventoryApi.create(token, {
        area: area.trim(),
        packagePath: packagePath.trim(),
        tier,
        why: why.trim(),
      });
      setArea('');
      setPackagePath('');
      setWhy('');
      setTier('P2');
      await reload();
      notifySuccess('Inventory row added');
    } catch {
      // toast
    } finally {
      setSaving(false);
    }
  }

  async function onTierChange(row: TestInventoryItem, next: TestInventoryTier) {
    if (!token || next === row.tier) return;
    try {
      await testInventoryApi.update(token, row.id, { tier: next });
      await reload();
      notifySuccess('Tier updated');
    } catch {
      // toast
    }
  }

  async function onDelete(row: TestInventoryItem) {
    if (!token) return;
    try {
      await testInventoryApi.remove(token, row.id);
      await reload();
      notifySuccess('Row removed');
    } catch {
      // toast
    }
  }

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col gap-4">
      <PageHeader
        title="Test inventory"
        description="CI / test-area priority (P1 always-run). Separate from Feature delivery risk. PO must approve P1 add/remove."
        actions={
          canManage ? (
            <Button
              type="button"
              variant="outline"
              className="min-h-11"
              disabled={seeding || loading}
              onClick={() => void onSeed()}
            >
              {seeding ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden />
                  Seeding…
                </>
              ) : (
                'Seed defaults'
              )}
            </Button>
          ) : null
        }
      />

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={filter === 'ALL' ? 'default' : 'outline'}
          className="min-h-11 touch-manipulation"
          onClick={() => setFilter('ALL')}
        >
          All
        </Button>
        {TEST_INVENTORY_TIERS.map((t) => (
          <Button
            key={t}
            type="button"
            size="sm"
            variant={filter === t ? 'default' : 'outline'}
            className="min-h-11 touch-manipulation"
            onClick={() => setFilter(t)}
          >
            {t}
          </Button>
        ))}
      </div>

      {canManage ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add area</CardTitle>
            <CardDescription>
              Short fields only. P1 create requires Product Owner.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Input
              className="min-h-11"
              placeholder="Area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              maxLength={120}
            />
            <Input
              className="min-h-11"
              placeholder="Package / path"
              value={packagePath}
              onChange={(e) => setPackagePath(e.target.value)}
              maxLength={200}
            />
            <Select
              value={tier}
              onValueChange={(v) => setTier(v as TestInventoryTier)}
            >
              <SelectTrigger className="min-h-11">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                {TEST_INVENTORY_TIERS.map((t) => (
                  <SelectItem
                    key={t}
                    value={t}
                    disabled={t === 'P1' && !isPo}
                  >
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              className="min-h-11 sm:col-span-2"
              placeholder="Why (one sentence)"
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              maxLength={300}
            />
            <Button
              type="button"
              className="min-h-11 sm:col-span-2 sm:w-auto"
              disabled={
                saving ||
                area.trim().length < 2 ||
                packagePath.trim().length < 2 ||
                why.trim().length < 2
              }
              onClick={() => void onCreate()}
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden />
                  Saving…
                </>
              ) : (
                'Add row'
              )}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading inventory…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No rows yet.
          {canManage ? ' Use Seed defaults to load the RFC 0018 table.' : null}
        </p>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Area</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Always-run</TableHead>
                  <TableHead>Why</TableHead>
                  {canManage ? <TableHead className="w-28">Actions</TableHead> : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.area}</TableCell>
                    <TableCell className="max-w-[14rem] truncate font-mono text-xs">
                      {row.packagePath}
                    </TableCell>
                    <TableCell>
                      {canManage ? (
                        <Select
                          value={row.tier}
                          onValueChange={(v) =>
                            void onTierChange(row, v as TestInventoryTier)
                          }
                        >
                          <SelectTrigger className="min-h-11 w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TEST_INVENTORY_TIERS.map((t) => (
                              <SelectItem
                                key={t}
                                value={t}
                                disabled={
                                  !isPo &&
                                  (t === 'P1' || row.tier === 'P1')
                                }
                              >
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <RiskBadge tier={row.tier} />
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.alwaysRun ? 'default' : 'outline'}>
                        {row.alwaysRun ? 'Yes' : 'No'}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs text-sm text-muted-foreground">
                      {row.why}
                    </TableCell>
                    {canManage ? (
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="min-h-11"
                          disabled={row.tier === 'P1' && !isPo}
                          onClick={() => void onDelete(row)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-3 md:hidden">
            {rows.map((row) => (
              <Card key={row.id}>
                <CardHeader className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <RiskBadge tier={row.tier} />
                    <Badge variant={row.alwaysRun ? 'default' : 'outline'}>
                      {row.alwaysRun ? 'Always-run' : 'Targeted'}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{row.area}</CardTitle>
                  <CardDescription className="font-mono text-xs">
                    {row.packagePath}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>{row.why}</p>
                  {canManage ? (
                    <div className="flex flex-col gap-2">
                      <Select
                        value={row.tier}
                        onValueChange={(v) =>
                          void onTierChange(row, v as TestInventoryTier)
                        }
                      >
                        <SelectTrigger className="min-h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TEST_INVENTORY_TIERS.map((t) => (
                            <SelectItem
                              key={t}
                              value={t}
                              disabled={
                                !isPo && (t === 'P1' || row.tier === 'P1')
                              }
                            >
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        className="min-h-11"
                        disabled={row.tier === 'P1' && !isPo}
                        onClick={() => void onDelete(row)}
                      >
                        Delete
                      </Button>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
