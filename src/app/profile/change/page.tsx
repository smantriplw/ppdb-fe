'use client';
import { Container } from '@/components/Contents/container';
import { Routes, fetcher } from '@/lib/routes';
import { DetailsSubPage } from '@/subpages/details';
import Cookies from 'js-cookie';
import { Righteous } from 'next/font/google';
import { useRouter } from 'next/navigation';
import React from 'react'
import useSWR from 'swr';

const righteous = Righteous({
    weight: '400',
    subsets: ['latin', 'latin-ext'],
});

export default function ChangeProfile() {
    const savedToken = Cookies.get('ppdb_session');
    const router = useRouter();

    React.useEffect(() => {
        if (!savedToken) {
            router.push('/');
        }
    }, [router, savedToken]);

    const route = Routes.route('auth.peserta');
    const { data, isLoading } = useSWR(route.url, url => fetcher(url, {
        headers: {
            Authorization: `Bearer ${savedToken}`,
        }
    }));

    if (!isLoading && data?.error) {
        Cookies.remove('ppdb_session');
        router.refresh();
    }
    return (
        <React.Fragment>
            <div className="mb-4 py-3">
                <h1 className={`text-center text-4xl text-[#456583] font-medium ${righteous.className}`}>
                    DASHBOARD UBAH DATA DIRI
                </h1>
            </div>
                {!isLoading && !data?.error ? (
                    <DetailsSubPage isNew={false} nisn={data.data.nisn} ttl={data.data.birthday} jalur={data.data.type} {...data.data} token={savedToken} />
                ) : null}
        </React.Fragment>
    )
}