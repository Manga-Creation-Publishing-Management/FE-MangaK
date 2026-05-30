
export function OverviewCard ({iconName, iconColor, contentText, valueNum}) {
    
    return (
        <>
            <div className="bg-white rounded-2xl p-6 border-1 border-gray-200 
            flex flex-col items-center gap-2 hover:shadow">
                <div className={`p-3 rounded-full ${iconColor}`}>
                    {iconName}
                </div>

                <p className="text-gray-600">{contentText}</p>
                <p className="text-3xl font-medium">{valueNum}</p>
            </div>
        </>
    );
}