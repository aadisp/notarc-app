/**
 * Products/courses named "Test" (any case, extra whitespace) are treated as
 * scratch/test data admins create while testing the admin dashboard. They
 * should never be visible to non-admin visitors, but admins still need to
 * see them so they can find and delete them.
 *
 * Matches an exact "test", or anything starting with "test " (e.g.
 * "Test Product", "Test Course 2") — but not names that merely contain the
 * word "test" elsewhere (e.g. "Contest Kit" is left alone).
 */
export function isTestItem(name: string | undefined | null): boolean {
  const trimmed = (name ?? "").trim().toLowerCase();
  return trimmed === "test" || trimmed.startsWith("test ");
}