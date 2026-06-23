import { Check, FileWarning, Info, X } from "lucide-react";
import { createContext, useState, useCallback, useContext, useRef } from "react";

export const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toast, setToast] = useState({
        message: "",
        type: "info",
        isRendered: false, //co dang tao div khong
        isVisible: false //co con show khong
    });

    const timeoutsRef = useRef([]);

    const showAlert = useCallback((message, type = "info") => {
        timeoutsRef.current?.forEach(clearTimeout);
        timeoutsRef.current = [];


        setToast({ message, isRendered: true, isVisible: false });


        const t1 = setTimeout(() => {
            setToast({ message, isRendered: true, isVisible: true })
        }, 10)


        //khuc nay bo di, khong cho show nua
        const t2 = setTimeout(() => {
            setToast((prev) => ({ ...prev, isVisible: false }));

            const t3 = setTimeout(() => {
                setToast({ message: "", type: "info", isRendered: false, isVisible: false })
            }, 400);

            timeoutsRef.current.push(t3);
        }, 3000);

        timeoutsRef.current.push(t1, t2);
    }, []);

    return (
        <ToastContext.Provider value={{ showAlert }}>
            {children}

            {/* render giao diện nếu toast có div */}
            {toast.isRendered &&
                <div id="toast-container">
                    <div className={`toast ${toast.isVisible ? 'show' : ''}`}>
                        <span className="toast-message">
                            <Info color="#1a1525" size={25} strokeWidth={1} className="mr-2" />
                            {/* NHÃ NOTE: tui làm xong đang chưa biết sao lỗi nên cmt lại =)) */}
                            {/* {type == "warning" && <FileWarning />} */}
                            {/* {type == "sucess" && <Check />} */}
                            {/* {type == "fail" && <X />} */}
                            {toast.message}
                        </span>
                    </div>
                </div>
            }
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    return useContext(ToastContext)
}