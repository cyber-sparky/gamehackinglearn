"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  StudySessionView,
  StudyTopicPicker,
} from "@/components/study/StudySessionView";

function StudyContent() {
  const params = useSearchParams();
  const topicId = params.get("topic");
  if (topicId) return <StudySessionView topicId={topicId} />;
  return <StudyTopicPicker />;
}

export default function StudyPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading study session...</p>}>
      <StudyContent />
    </Suspense>
  );
}
