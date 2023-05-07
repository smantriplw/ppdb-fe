export type Config = {
    recaptcha: {
        siteKey: string;
    };
    setValue: <K extends keyof Config>(key: K, value: Config[K]) => void;
}
