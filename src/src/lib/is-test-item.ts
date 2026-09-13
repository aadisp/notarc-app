/**
 * Products/courses named "Test" (any case, extra whitespace) are treated as
 * scratch/test data admins create while testing the admin dashboard. They
 * should never be visible to non-admin visitors, but admins still need to
 * see them so they can find and delete them.
 */
export function isTestItem(name: string | undefined | null): boolean {
  return (name ?? "").trim().toLowerCase() === "test";
}