import React from 'react';

export const Container = ({ children, isCenter = true }:{ children: React.ReactNode, isCenter?: boolean; }) => {
    return (
        <div className={`md:mx-auto shadow-md bg-gradient-to-b from-[#81C0C5] to-white rounded-md md:w-1/2 md:h-1/2 p-5 flex flex-col items-center`}>
            {children}
        </div>
    )
}
