import prisma from "@/lib/prisma";

type Params = {
  params: {
    orgId: string;
  };
};

export const GET = async (req: Request, { params }: Params) => {
  const { orgId } = params;

  if (!orgId) {
    return Response.json(
      { message: "Organization ID is required" },
      { status: 400 }
    );
  }

  let bots;

  // let WiselyDesk Employees see all bots
  if (parseInt(orgId) === 2) {
    bots = await prisma.bot.findMany();
  } else {
    bots = await prisma.bot.findMany({
      where: {
        organization_id: parseInt(orgId)
      }
    });
  }

  return Response.json({ bots });
};
