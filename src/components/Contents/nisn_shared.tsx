'use client';

import { NisnShareContext, SharedContextData } from '@/contexts/nisn_shared';
import React, { useState } from 'react'

export const NisnSharedProvider = ({ children }:React.PropsWithChildren) => {
    const [state, setState] = React.useState<SharedContextData>({
        nisn: 0,
        setValue: (key, value) => {
            setState({
                ...state,
                [key]: value,
            });
        },
    });
    return (
        <React.Fragment>
            <NisnShareContext.Provider value={state}>
                {children}
            </NisnShareContext.Provider>
        </React.Fragment>
    )
}