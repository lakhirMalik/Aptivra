function xsrf(): string {
    const cookie = document.cookie
        .split('; ')
        .find((c) => c.startsWith('XSRF-TOKEN='));

    return cookie ? decodeURIComponent(cookie.split('=')[1]) : '';
}

export async function send(
    url: string,
    method: 'POST' | 'PUT',
    body?: unknown,
): Promise<void> {
    const res = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': xsrf(),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? 'Request failed');
    }
}

export function uploadFile<T>(
    url: string,
    file: File,
    onProgress: (percent: number) => void,
): Promise<T> {
    return new Promise((resolve, reject) => {
        const form = new FormData();
        form.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('X-XSRF-TOKEN', xsrf());
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                onProgress(Math.round((e.loaded / e.total) * 100));
            }
        };
        xhr.onload = () => {
            let data: unknown = null;

            try {
                data = JSON.parse(xhr.responseText);
            } catch {
                data = null;
            }

            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(data as T);

                return;
            }

            const body = data as {
                message?: string;
                errors?: Record<string, string[]>;
            } | null;
            reject(
                new Error(
                    body?.errors?.file?.[0] ??
                        body?.message ??
                        'The upload failed.',
                ),
            );
        };
        xhr.onerror = () =>
            reject(
                new Error(
                    'Network error. Check your connection and try again.',
                ),
            );
        xhr.send(form);
    });
}

export async function getJson<T>(url: string): Promise<T> {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });

    if (!res.ok) {
        throw new Error(
            res.status === 404
                ? 'This document is no longer available.'
                : 'The request failed.',
        );
    }

    return res.json();
}

export async function remove(url: string): Promise<void> {
    const res = await fetch(url, {
        method: 'DELETE',
        headers: { Accept: 'application/json', 'X-XSRF-TOKEN': xsrf() },
    });

    if (!res.ok && res.status !== 404) {
        throw new Error('The request failed.');
    }
}
