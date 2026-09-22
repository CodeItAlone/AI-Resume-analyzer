import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Analysis Workbench — Resurox",
  description: "Upload resume documents and analyze candidate job fit with deterministic rubric scoring and evidence markup.",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
