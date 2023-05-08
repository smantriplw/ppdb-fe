import React, { useRef } from 'react';

type ModalProps = {
    onClose: () => void;
    opened?: boolean;
}
export const Modal = (props: React.PropsWithChildren<ModalProps>) => {
    const ref = useRef(null);
    return (
        <div className={`modal modal-bottom sm:modal-middle${props.opened ? ' modal-open' : ''}`}>
            <div className="modal-box" ref={ref}>
                {props.children}
            </div>
        </div>
    )
}