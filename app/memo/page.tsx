import type { Metadata } from "next";
import { MemoView } from "@/components/MemoView";
import { DisclosureNote } from "@/components/ui";

export const metadata: Metadata = {
  title: "Investment memo",
  description:
    "A complete investment memo generated from a verified private company's sourced research record.",
};

export default function MemoPage() {
  return (
    <div className="container-page py-10">
      <MemoView />
      <div className="content-column">
        <DisclosureNote className="mt-8 print:hidden" />
      </div>
    </div>
  );
}
