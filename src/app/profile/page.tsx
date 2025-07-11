import UCPProfile from "~/app/profile/components/profile"
import { auth, signIn } from "~/server/auth";

export default async function UcpPage() {
    const session = await auth();
    if (!session) {
        return signIn();
    }
    return (
        <UCPProfile session={session} />
    );
}