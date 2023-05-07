'use client';

import { ReCaptchaProvider } from 'next-recaptcha-v3';
import React from 'react';

export const RecaptchaProvider = ({ children, token }: React.PropsWithChildren<{
    token: string;
}>) => {
    return (
        <ReCaptchaProvider reCaptchaKey={token}>
            {children}
        </ReCaptchaProvider>
    )
}