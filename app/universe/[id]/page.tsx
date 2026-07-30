import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COMPANIES, getCompany } from "@/lib/companies";
import { CompanyDetail } from "@/components/CompanyDetail";
import { DisclosureNote } from "@/components/ui";

export function generateStaticParams() {
  return COMPANIES.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const company = getCompany(id);
  if (!company) return { title: "Company not found" };
  return { title: company.name, description: company.description };
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = getCompany(id);
  if (!company) notFound();

  return (
    <div className="container-page py-10">
      <CompanyDetail company={company} />
      <DisclosureNote className="mt-10" />
    </div>
  );
}
