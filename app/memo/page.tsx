import type { Metadata } from "next";
import { MemoView } from "@/components/MemoView";
import { DisclosureNote } from "@/components/ui";

export const metadata: Metadata = {
  title: "Investment memo",
  description:
    "A complete demonstration investment memo, written on a fictional company so that every judgment can be stated with the confidence a memo requires.",
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
