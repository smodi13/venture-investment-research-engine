import type { Metadata } from "next";
import { UNIVERSE_ROWS } from "@/lib/rows";
import { PipelineBoard } from "@/components/PipelineBoard";
import { DisclosureNote, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Investment pipeline",
  description:
    "Track companies through a ten stage investment pipeline, with notes, next steps, and CSV export. All workflow state is stored in the browser.",
};

export default function PipelinePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Workflow"
        title="Investment pipeline"
        intro="Ten stages from new lead through to invested, with the two honest endings most pipelines omit: passed, and monitoring. Change status and priority, write notes, set next steps, and export the filtered set to CSV."
      />

      <section className="container-page py-8">
        <PipelineBoard rows={UNIVERSE_ROWS} />
        <DisclosureNote className="mt-8" />
      </section>
    </div>
  );
}
