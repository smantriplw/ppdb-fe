import { JalurPendaftaran } from "@/resources/shared";

type BerkasElement = {
    name: string;
    key: string;
}

export const berkases: Record<JalurPendaftaran, BerkasElement> = {
    zonasi: {
        name: 'Foto KK',
        key: 'kk',
    },
    prestasi: {
        name: 'Foto Sertifikat',
        key: 'certificate',
    },
    afirmasi: {
        name: 'Foto KIP non Bencana',
        key: 'kip',
    },
    mutasi: {
        name: 'Dokumen SK Mutasi Orang Tua',
        key: 'mutation',
    },
}