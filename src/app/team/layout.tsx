export default function TeamLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <h1>Team 레이아웃</h1>
            <main>{children}</main>
        </div>
    );
}