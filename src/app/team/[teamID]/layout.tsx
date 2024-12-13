import AuthPage from "@/app/AuthPage";
import NavBar from "@/app/layoutcomponents/NavBar";

export default async function TeamLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ teamID: number }>;
}) {
    const teamID = (await params).teamID;

    return (
        <AuthPage>
            <div>
                <NavBar teamID={teamID} />
                <main className="pl-[270px] sm:pl-[250px] w-full">
                    {children}
                </main>
            </div>
        </AuthPage>
    );
}