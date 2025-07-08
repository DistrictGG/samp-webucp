import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar"
import { AppSidebar } from "~/components/app-sidebar";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function UcpPage() {
    const session = await auth();
    const ucpDat = await api.ucp.playerucp({ uuid: session?.user?.id ?? "" });
    return (
        <HydrateClient>
            s
        </HydrateClient>
    );
}