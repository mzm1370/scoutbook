/**
 * Schedule async work from a useEffect without calling setState
 * synchronously in the effect body (react-hooks/set-state-in-effect).
 */
export function startEffectAsync(
  run: (ctl: { readonly cancelled: boolean }) => Promise<void>,
): () => void {
  const ctl = { cancelled: false };
  void Promise.resolve().then(() => {
    if (!ctl.cancelled) {
      void run(ctl);
    }
  });
  return () => {
    ctl.cancelled = true;
  };
}
