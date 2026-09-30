import type { RaciValue } from '@scoutbook/types';

const ROLE_COLS = [
  { key: 'poValue' as const, label: 'PO' },
  { key: 'pmValue' as const, label: 'PM' },
  { key: 'developerValue' as const, label: 'Dev' },
  { key: 'qaValue' as const, label: 'QA' },
];

export type RaciDiagramRow = {
  key: string;
  stepName: string;
  poValue: RaciValue;
  pmValue: RaciValue;
  developerValue: RaciValue;
  qaValue: RaciValue;
};

function cellClass(value: RaciValue): string {
  switch (value) {
    case 'R':
      return 'bg-primary text-primary-foreground';
    case 'A':
      return 'bg-amber-600 text-white dark:bg-amber-500';
    case 'C':
      return 'bg-sky-600 text-white dark:bg-sky-500';
    case 'I':
      return 'bg-muted text-muted-foreground';
    default:
      return 'bg-background text-muted-foreground/50';
  }
}

type Props = {
  rows: RaciDiagramRow[];
};

export function RaciDiagram({ rows }: Props) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No steps to diagram yet.
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block size-3 rounded-sm bg-primary" /> R
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block size-3 rounded-sm bg-amber-600" /> A
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block size-3 rounded-sm bg-sky-600" /> C
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block size-3 rounded-sm bg-muted" /> I
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[20rem] border-collapse text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="sticky left-0 z-10 bg-card p-2 font-medium">
                Step
              </th>
              {ROLE_COLS.map((col) => (
                <th key={col.key} className="p-2 text-center font-medium">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b">
                <th
                  scope="row"
                  className="sticky left-0 z-10 max-w-[10rem] truncate bg-card p-2 text-left font-medium"
                  title={row.stepName}
                >
                  {row.stepName}
                </th>
                {ROLE_COLS.map((col) => {
                  const value = row[col.key];
                  return (
                    <td key={col.key} className="p-1.5 text-center">
                      <span
                        className={`inline-flex size-9 items-center justify-center rounded-md text-xs font-semibold ${cellClass(value)}`}
                        aria-label={`${col.label}: ${value || 'none'}`}
                      >
                        {value || '—'}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
