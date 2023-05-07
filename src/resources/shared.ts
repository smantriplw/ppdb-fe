export type JalurPendaftaran = 'zonasi' | 'prestasi' | 'afirmasi' | 'mutasi';
export type SharedData = {
    nisn?: string;
    ttl?: string;
    jalur?:JalurPendaftaran;
};