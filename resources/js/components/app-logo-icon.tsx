import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({
    className = '',
    ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/brand/aptivra-mark.png"
            alt=""
            className={`object-contain ${className}`}
            {...props}
        />
    );
}
