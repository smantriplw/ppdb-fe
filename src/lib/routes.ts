export type RouteReturn = {
    url: string;
    method: string;
}

export class Routes
{
    public static baseUrl = 'https://ppdb.api.sman3palu.sch.id';
    public static $routes = {
        'auth.peserta': ['/api/peserta/login', 'POST'],
        'auth.peserta.refresh': ['/api/peserta/refresh', 'POST'],

        'archives.check': ['/api/archives/check', 'POST'],
        'archives.create': ['/api/archives', 'POST'],
        'archives.edit': ['/api/archives/edit', 'POST'],
        'archives.edit.files': ['/api/archives/edit/files', 'POST'],
        'archives.edit.details': ['/api/archives/edit/details', 'POST'],
        'archives.edit.nilai': ['/api/archives/edit/nilai', 'POST'],

        'config': ['/config', 'GET'],
    };

    public static route<K extends keyof typeof Routes['$routes']>(key: K): RouteReturn
    {
        const route = Routes.$routes[key];
        if (route)
            route[0] = new URL(route[0], Routes.baseUrl).href;
        return { url: route[0], method: route[1] };
    }
}

export const fetcher = (...arg: [RequestInfo | URL, RequestInit | undefined]) => fetch(...arg).then(res => res.json());