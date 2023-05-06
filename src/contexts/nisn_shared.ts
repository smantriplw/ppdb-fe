import { createContext } from 'react';

export type JalurPendaftaran = 'zonasi' | 'prestasi' | 'afirmasi' | 'mutasi';
export type SharedContextData = {
    nisn: number;
    ttl?: string;
    jalur?:JalurPendaftaran;
    setValue: <K extends keyof SharedContextData>(key: K, value: SharedContextData[K]) => void;
};

export const NisnShareContext = createContext<SharedContextData>({
    nisn: 0,
    jalur: 'zonasi',
    setValue(_key, _value) {},
});
