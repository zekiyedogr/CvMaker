
import { useEffect, useRef, useState } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';
import './Dropdown.css';

export interface DropdownOption {
    label: string;
    value: string | number;
}

interface DropdownProps {
    label: string;
    name: string;
    value: string | number;
    options: DropdownOption[];
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
}

const Dropdown = ({
    label,
    name,
    value,
    options,
    onChange,
    placeholder = 'Select an option',
    disabled = false,
    required = false
}: DropdownProps) => {

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(
        option => String(option.value) === String(value)
    );

    // Dışarıya tıklanınca dropdown kapansın
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (option: DropdownOption) => {
        onChange(String(option.value));
        setIsOpen(false);
    };

    return (
        <div className="dropdown" ref={dropdownRef}>

            <label htmlFor={name}>
                {label}
                {required && <span className="dropdown-required"> *</span>}
            </label>

            <div className="dropdown-select-wrapper">

                <button
                    type="button"
                    id={name}
                    className={`dropdown-trigger ${isOpen ? 'active' : ''}`}
                    onClick={() => setIsOpen(prev => !prev)}
                    disabled={disabled}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                >
                    <span className={!selectedOption ? 'placeholder' : ''}>
                        {selectedOption?.label || placeholder}
                    </span>

                    <FiChevronDown
                        className={`dropdown-icon ${isOpen ? 'rotated' : ''}`}
                    />
                </button>

                {isOpen && (
                    <div className="dropdown-options" role="listbox">

                        {options.length > 0 ? (
                            options.map(option => {
                                const isSelected =
                                    String(option.value) === String(value);

                                return (
                                    <button
                                        type="button"
                                        key={option.value}
                                        className={`dropdown-option ${
                                            isSelected ? 'selected' : ''
                                        }`}
                                        onClick={() => handleSelect(option)}
                                        role="option"
                                        aria-selected={isSelected}
                                    >
                                        <span>{option.label}</span>

                                        {isSelected && (
                                            <FiCheck className="dropdown-check" />
                                        )}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="dropdown-empty">
                                No options available
                            </div>
                        )}

                    </div>
                )}

            </div>
        </div>
    );
};

export default Dropdown;
