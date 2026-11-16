import './BaseButton.css';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    title: string;
}

const BaseButton = ({ title, ...props }: ButtonProps) => {
    return (
        <button className='button' {...props}>
            {title}
        </button>
    );
}

export default BaseButton;