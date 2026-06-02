
export function OverviewCard ({iconName, iconColor, contentText, valueNum}) {
    
    return (
        <>
            <div className="color-background rounded-2xl p-6 border-1 border-gray-200 
            flex flex-col items-center gap-2 hover:shadow">
                <div className={"p-3 rounded-full sidebar"}>
                    {iconName}
                </div>

                <p className="text-sidebar-foreground">{contentText}</p>
                <p className="text-sidebar-foreground text-3xl font-medium">{valueNum}</p>
            </div>
        </>
    );
}