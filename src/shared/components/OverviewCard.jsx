export function OverviewCard({ iconName, iconColor, contentText, valueNum }) {
    return (
        <>
            <div className="w-full bg-card rounded-2xl p-6 border-1 border-border 
            flex flex-col items-start gap-2 hover:shadow">
                <div className={"p-3 rounded-md bg-background"} style={{ color: iconColor }}>
                    {iconName}
                </div>
                <p className="text-muted-foreground">{contentText}</p>
                <p className="text-foreground text-3xl font-medium">{valueNum}</p>
            </div>
        </>
    );
}
