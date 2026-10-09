import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16 4 4 28h5l2.2-5h9.6l2.2 5h5L16 4Zm0 10.5 3 6.5h-6l3-6.5Z"
            />
        </svg>
    );
}
