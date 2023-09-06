import type { Session } from "next-auth";

const ORG_IDS: { [key: string]: number } = {
  "wiselydesk.com": 2,
  "anymove.app": 3,
  "amboss.com": 4,
  "amboss.de": 4,
  "medicuja.de": 4,
  "medicuja.com": 4,
  "getaround.com": 5
};

// delete this eventually .. please
export function orgChooser(session: Session) {
  console.log(session);
  const email = session.user?.email;
  if (!email) throw new Error("No organization found for this user");

  const orgKey = Object.keys(ORG_IDS).find((domain) =>
    email.endsWith(`@${domain}`)
  );
  if (!orgKey) throw new Error("No organization found for this user");

  return ORG_IDS[orgKey];
}
