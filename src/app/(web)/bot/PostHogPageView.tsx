// app/PostHogPageView.tsx
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";

export function PostHogPageView({ orgId }: { orgId: number }): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();
  console.log(`orgId is ${orgId} with type ${typeof orgId}`);
  // Track pageviews
  useEffect(() => {
    if (orgId === 2) return; // dont track wiselydesk employees
    // @ts-expect-error
    if ((pathname && posthog && orgId !== 2) || parseInt(orgId) !== 2) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url
      });
    }
  }, [pathname, searchParams, posthog, orgId]);

  return null;
}
