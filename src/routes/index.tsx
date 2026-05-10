import { createFileRoute } from "@tanstack/react-router";
import { ProtectionDashboard } from "@/components/ProtectionDashboard";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <ProtectionDashboard />;
}
