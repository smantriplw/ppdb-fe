import { Container } from '@/components/Contents/container';
import React from 'react';
import { Righteous, Noto_Sans } from 'next/font/google';
import { Routes, fetcher } from '@/lib/routes';
import useSWR from 'swr';
import { useBoolean } from 'usehooks-ts';

type DaftarNilai = {
    lesson: string;
    s1?: number;
    s2?: number;
    s3?: number;
    s4?: number;
    s5?: number;
    _key: string;
}

const righteous = Righteous({
    weight: '400',
    subsets: ['latin', 'latin-ext']
});
const noto = Noto_Sans({
    weight: '600',
    subsets: ['latin'],
});

type DataProps = {
    isError: boolean;
    message?: string;
}

export const BerkasNilaiSubPage = ({ token }: { token: string; }) => {
    const route = Routes.route('peserta.nilai');
    const { data: swrData, isLoading } = useSWR(route.url, arg => fetcher(arg, {
        method: route.method,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }));
    const [data, setData] = React.useState<DataProps>({
        isError: false,
    });
    const { value: loading, toggle: toggleLoading } = useBoolean(false);
    
    const [nilais, setNilais] = React.useState<DaftarNilai[]>([
        {
            lesson: 'Bahasa Inggris',
            _key: 'bahasa_inggris',
            s1: 0,
            s2: 0,
            s3: 0,
            s4: 0,
            s5: 0,
        }, {
            lesson: 'Bahasa Indonesia',
            _key: 'bahasa_indonesia',
            s1: 0,
            s2: 0,
            s3: 0,
            s4: 0,
            s5: 0,
        }, {
            lesson: 'Ilmu Pengetahuan Alam',
            _key: 'ipa',
            s1: 0,
            s2: 0,
            s3: 0,
            s4: 0,
            s5: 0,
        }, {
            lesson: 'Ilmu Pengetahuan Sosial',
            _key: 'ips',
            s1: 0,
            s2: 0,
            s3: 0,
            s4: 0,
            s5: 0,
        }, {
            lesson: 'Matematika',
            _key: 'mtk',
            s1: 0,
            s2: 0,
            s3: 0,
            s4: 0,
            s5: 0,
        }
    ]);

    const onChangeProp = ({ key, target, value }:{ key: string; target: string; value: number; }) => {
        const lesson = nilais.findIndex(n => n._key === key);
        if (lesson !== -1) {
            const newNilais = nilais.map((x, i) => {
                if (i === lesson) {
                    return {
                        ...nilais[lesson],
                        [target]: isNaN(value) ? 0 : value,
                    }
                }

                return x;
            });

            setNilais(newNilais);
        }
    }

    React.useEffect(() => {
        if (!isLoading && swrData?.data?.length) {
            setNilais(swrData.data.map((x: DaftarNilai & { archive_id: string; }) => ({
                ...x,
                lesson: x.lesson.replace('_', ' '),
                _key: x.lesson,
            })));
        }
    }, [isLoading, swrData]);

    const submitNilai = () => {
        setData({ isError: false });
        toggleLoading();
        const postRoute = Routes.route('peserta.nilai.create');
        fetch(postRoute.url, {
            method: postRoute.method,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(nilais.map(x => ({
                ...x,
                lesson: x._key,
            }))),
        }).then(res => res.json()).then(res => {
            if (res.error || res.errors) {
                setData({
                    isError: true,
                    message: res.error || res.message,
                });
            } else {
                setData({
                    isError: false,
                    message: 'Nilai terupload',
                });
            }

            toggleLoading();
        }).catch(err => {
            setData({
                isError: true,
                message: err.message,
            });
            toggleLoading();
        });
    }
    return (
        <React.Fragment>
            <div className="py-6">
                <h1 className={`text-center text-[#456583] text-4xl ${righteous.className}`}>
                    UPLOAD NILAI
                </h1>
                <div className="mt-4">
                    <Container isCenter={!isLoading}>
                        <div>
                            {!isLoading && swrData.data ? (
                            <>
                                {nilais.map(nilai => (
                                    <div key={nilai._key}>
                                        <h1 className={`uppercase text-2xl font-bold font-sans ${noto.className}`}>
                                            {nilai.lesson}
                                        </h1>
                                        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 py-3">
                                            {Object.keys(nilai).filter(x => x.startsWith('s')).map((keyed, index) => (
                                                <div key={keyed}>
                                                    <div className="bg-white p-3">
                                                        <h2 className="text-xl font-sans font-light">
                                                            Semester {index+1}
                                                        </h2>
                                                    </div>
                                                    <input name={`${nilai._key}.${keyed}`} onChange={(ev) => {
                                                        const value = ev.target.valueAsNumber;

                                                        if (value < 0 || value > 100) {
                                                            return;
                                                        }
                                                        onChangeProp({ key: nilai._key, target: keyed, value });
                                                    }} type="number" className="input input-bordered" disabled={loading} value={nilai[keyed as keyof typeof nilai]} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {data.message ? (
                                    <div className="text-center mt-2">
                                        <div className={`alert alert-${data.isError ? 'error' : 'success'} shadow-sm`}>
                                            <div>
                                                {data.isError ?
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    : <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                }
                                                <span>{data.isError ? 'Error' : 'Sukses'}! {data.message}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                                <div className="text-center">
                                    <p className="font-sans">
                                        Pastikan nilai yang Anda masukan benar dan sesuai dengan kenyataan
                                    </p>
                                </div>
                                <div className="text-center py-3">
                                    <button type="submit" className={`btn bg-[#0E8A92] border-none`} onClick={submitNilai} disabled={loading}>Upload</button>
                                </div>
                            </>
                            ) : <h1 className="text-center text-xl">Loading...</h1>}
                        </div>
                    </Container>
                </div>
            </div>
        </React.Fragment>
    )
}