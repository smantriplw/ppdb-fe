'use client';
import { Container } from '@/components/Contents/container';
import { Routes, fetcher } from '@/lib/routes';
import { BerkasHardSubPage } from '@/subpages/berkas_hard';
import { BerkasNilaiSubPage } from '@/subpages/berkas_nilai';
import Cookies from 'js-cookie';
import { Righteous } from 'next/font/google';
import { useRouter } from 'next/navigation';
import React from 'react';
import useSWR from 'swr';

const righteous = Righteous({
    weight: '400',
    subsets: ['latin', 'latin-ext'],
});

export default function BerkasPage() {
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
    }), {
        refreshInterval: 3000,
    });

    if (!isLoading && data?.error?.toLowerCase() === 'unauthorized') {
        Cookies.remove('ppdb_session');
        router.refresh();
    }
    return (
        <React.Fragment>
            <div className="mb-4 py-3">
                <h1 className={`text-center text-4xl text-[#456583] font-medium ${righteous.className}`}>
                    DASHBOARD UPLOAD BERKAS
                </h1>
            </div>
            <Container>
                <button className="btn btn-primary bg-[#205280] border-none hover:bg-[#205280] hover:bg-opacity-75" onClick={() => router.back()}>kembali</button>
                {isLoading ? <h1 className="text-xl font-semibold">Loading...</h1> : null}
                <div className="mt-4">
                    {!isLoading && !data?.error ? <BerkasHardSubPage type={data.data.type} {...data.data} token={savedToken} /> : null}
                </div>
            </Container>

            <div className="mt-4">
                <BerkasNilaiSubPage token={savedToken!} />
            </div>
        </React.Fragment>
    )
}