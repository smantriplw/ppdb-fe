export type JalurPendaftaran = 'zonasi' | 'prestasi' | 'afirmasi' | 'mutasi';
export type SharedData = {
    nisn?: string;
    ttl?: string;
    jalur?:JalurPendaftaran;

    address?: string
    name?: string;
    gender?: string;
    mother_name?: string;
    father_name?: string;
    birthday?: string;
    phone?: string;
    graduated_year?: number;
    school?: string;
    nik?: string;
    email?: string;
    type?: string;
};