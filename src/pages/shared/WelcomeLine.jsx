export function WelcomeLine ({roleName}) {
    return (
        <>
            <div className="flex justify-start p-2">
                <div className="p-3">
                    <p className="text-sidebar-foreground font-medium text-2xl pb-1">{roleName} DashBoard</p>
                    <p className="text-muted-foreground">Welcome back! Here's your overview</p>
                </div>
            </div>
        </>

    );

}