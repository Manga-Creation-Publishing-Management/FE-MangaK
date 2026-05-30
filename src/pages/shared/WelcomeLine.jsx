export function WelcomeLine ({roleName}) {
    return (
        <>
            <div className="flex justify-start p-4">
                <div className="p-3">
                    <p className="font-medium text-2xl pb-1">{roleName} DashBoard</p>
                    <p className="text-gray-500">Welcome back! Here's your overview</p>
                </div>
            </div>
        </>

    );

}