import { LogOut } from 'lucide-react';

export function HeaderPage ({roleName, avatarUrl}) {
    return (
        <>
            <div className="grid grid-cols-12 shadow p-2 px-8">
                <div className="col-span-1 px-2 content-center">
                    <img  className="rounded-full w-15"
                    src = {avatarUrl} alt="Avatar Image" />               

                </div>

                <div className="col-span-3 content-center">
                    <span className="text-lg font-medium">Welcome back!</span><br />
                    <span className="text-gray-500">{roleName}</span>
                </div>
                <div className="col-span-8 content-center p-2">
                    <div className='place-self-end'>
                        <button className='flex 
                        bg-white text-gray-600
                        hover:bg-red-300 hover:text-white
                        hover:rounded
                        p-2'>
                            <div className='content-center'> <LogOut color='gray'/> </div>
                            <span className='p-2 font-medium'>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}