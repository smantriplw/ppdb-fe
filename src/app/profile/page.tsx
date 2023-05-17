'use client';
import { Container } from '@/components/Contents/container';
import { Modal } from '@/components/Contents/modal';
import { Routes, fetcher } from '@/lib/routes';
import Cookies from 'js-cookie';
import { Righteous } from 'next/font/google';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import useSWR from 'swr';
import { useBoolean } from 'usehooks-ts';

const righteous = Righteous({
    weight: '400',
    subsets: ['latin', 'latin-ext'],
  });

export default function ProfilePage() {
    const { value: showUnduh, toggle: toggleUnduh } = useBoolean(false);
    const { value: allowUnduh, setValue: setAllowUnduh } = useBoolean(false);
    const savedToken = Cookies.get('ppdb_session');
    const router = useRouter();
    const [imgUrl, setImgUrl] = React.useState<string>('');

    const refreshUnduh = React.useCallback(() => {
        const cardRoute = Routes.route('peserta.card');
        fetch(cardRoute.url, {
            method: cardRoute.method,
            headers: {
                Authorization: `Bearer ${savedToken}`,
            }
        }).then(r => r.json()).then(r => {
            if (r.data) {
                const photoUrl = new URL(r.data.photo, Routes.baseUrl).href;
                setImgUrl(photoUrl);
            }
        });
    }, [savedToken]);

    useEffect(() => {
        if (!savedToken) {
            router.push('/');
        }

        if (showUnduh) {
            refreshUnduh();
        }
    }, [router, savedToken, showUnduh, refreshUnduh, toggleUnduh]);

    const route = Routes.route('auth.peserta');
    const { data, isLoading } = useSWR(route.url, url => fetcher(url, {
        headers: {
            Authorization: `Bearer ${savedToken}`,
        }
    }), {
        onSuccess(data) {
            const zoneType = data.data.type;
            const isAllow = data.data.nilai_completed && !!data.data.skhu_path && !!data.data.photo_path && !!(
                (zoneType === 'zonasi' && data.data.kk_path) ||
                (zoneType === 'prestasi' && data.data.certificate_path) ||
                (zoneType === 'afirmasi' && data.data.kip_path) ||
                (zoneType === 'mutasi' && data.data.mutation_path)
            );

            setAllowUnduh(!isAllow);
        },
    });

    if (!isLoading && data?.error) {
        Cookies.remove('ppdb_session');
        router.push('/');
    }
    return (
        <React.Fragment>
            <div className="mb-4 py-3">
                <h1 className={`text-center text-4xl text-[#456583] font-medium ${righteous.className}`}>
                    DASHBOARD LOGIN
                </h1>
            </div>
            <Container>
                <h1 className="text-2xl">
                    {!isLoading && data?.data ? <p>Halo <span className="font-bold font-sans">{data.data.name}</span></p> : 'Loading ...'}
                </h1>
                <p>
                    Silahkan lengkapi berkas, dan pengubahan data diri. {!isLoading ? (
                        <span>Kalau mau logout, klik <span className="font-semibold text-blue-500 cursor-pointer" onClick={() => {
                            Cookies.remove('ppdb_session');
                            router.push('/');
                        }}>ini</span></span>
                    ) : null}
                </p>
                {!isLoading && !data?.error ? (
                    <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 py-3">
                        <div className="card bg-[#0E8A92] shadow-md w-fit">
                            <div className="card-body text-white">
                                <h2 className="card-title">UBAH DATA DIRI</h2>
                                <p>
                                    Jika Anda ingin mengubah data diri, silahkan klik tombol dibawah ini
                                </p>
                                <div className="card-actions justify-end">
                                    <button onClick={() => router.push('/profile/change')} className="btn btn-primary bg-[#205280] border-none hover:bg-[#205280] hover:bg-opacity-75">
                                        Ubah
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="card w-fit bg-[#0E8A92] shadow-md">
                            <div className="card-body text-white">
                                <h2 className="card-title">UPLOAD BERKAS</h2>
                                <p>
                                    Jika Anda ingin mengupload berkas file, dan nilai semester. Klik tombol dibawah ini
                                </p>
                                <div className="card-actions justify-end">
                                    <button onClick={() => router.push('/profile/berkas')} className="btn btn-primary bg-[#205280] border-none  hover:bg-[#205280] hover:bg-opacity-75">
                                        upload
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="card w-fit bg-[#0E8A92] shadow-md items-center">
                            <div className="card-body text-white">
                                <h2 className="card-title">UNDUH KARTU</h2>
                                <p>
                                    Jika Anda ingin mengunduh kartu peserta, diwajibkan untuk melengkapi berkas.
                                </p>
                                <div className="card-actions justify-end">
                                    <button disabled={allowUnduh} onClick={toggleUnduh} className="btn btn-primary bg-[#205280] border-none  hover:bg-[#205280] hover:bg-opacity-75">
                                        unduh
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="card w-fit bg-[#0E8A92] shadow-md items-center">
                            <div className="card-body text-white">
                                <h2 className="card-title text-center">CONTACT PERSON</h2>
                                <ul>
                                    <li>
                                        0852-5661-7661 (Ahmad Ariansyah)
                                    </li>
                                    <li>
                                        0821-9179-7352 (Rizky Mardiansa)
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : null}
            </Container>

            <Modal opened={showUnduh} onClose={toggleUnduh}>
                <h3 className="font-sans font-bold text-2xl">
                    KARTU PENDAFTARAN
                </h3>
                <div className="py-4">
                    <div className="avatar">
                        <div className="rounded">
                            {imgUrl.length ? <img src={imgUrl} alt={'Kartu pendaftaran'} width={45} height={60} /> : null}
                        </div>
                    </div>
                    {!imgUrl.length ? <h2 className="font-sans text-xl">LOADING...</h2> : null}
                </div>
                <div className="modal-action mt-4">
                    <button className="btn bg-[#205280] border-none" onClick={() => {
                        refreshUnduh();
                    }}>
                        Refresh
                    </button>
                    <a download={data?.data ? data.data.id + '.png' : null} target="_blank" href={imgUrl} className="btn bg-[#456583] border-none">
                        Download
                    </a>
                    <button className="btn btn-primary" onClick={toggleUnduh}>
                        OK
                    </button>
               </div>
            </Modal>
        </React.Fragment>
    )
}