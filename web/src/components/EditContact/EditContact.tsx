import { useState } from 'react';
import './EditContact.css';
import TextInput from '../TextInput/TextInput';

interface ContactInformation {
    Email: string | null;
    Phone: string | null;
    Location: string | null;
    LinkedIn: string | null;
    GitHub: string | null;
    Portfolio: string | null;
    X: string | null;
    Medium: string | null;
    DevTo: string | null;
    Hashnode: string | null;
    Dribbble: string | null;
    Behance: string | null;
    StackOverflow: string | null;
    Skype: string | null;
    Zoom: string | null;
    Discord: string | null;
}

interface EditContactProps {
    data: ContactInformation | null;
    onChange: (updatedData: Partial<ContactInformation>) => void;
}

const contactFields: {
    key: keyof ContactInformation;
    label: string;
    prefix?: string;
}[] = [
    { key: 'Email', label: 'Email' },
    { key: 'Phone', label: 'Phone' },
    { key: 'Location', label: 'Location' },
    { key: 'LinkedIn', label: 'LinkedIn', prefix: 'linkedin.com/in/' },
    { key: 'GitHub', label: 'GitHub', prefix: 'github.com/' },
    { key: 'Portfolio', label: 'Portfolio' },
    { key: 'X', label: 'X', prefix: 'x.com/' },
    { key: 'Medium', label: 'Medium', prefix: 'medium.com/@' },
    { key: 'DevTo', label: 'Dev.to', prefix: 'dev.to/' },
    { key: 'Hashnode', label: 'Hashnode', prefix: 'hashnode.com/@' },
    { key: 'Dribbble', label: 'Dribbble', prefix: 'dribbble.com/' },
    { key: 'Behance', label: 'Behance', prefix: 'behance.net/' },
    { key: 'StackOverflow', label: 'Stack Overflow', prefix: 'stackoverflow.com/users/' },
    { key: 'Skype', label: 'Skype' },
    { key: 'Zoom', label: 'Zoom' },
    { key: 'Discord', label: 'Discord' }
];

const EditContact = ({ data, onChange }: EditContactProps) => {
    const [formData, setFormData] = useState<ContactInformation>({
        Email: data?.Email ?? '',
        Phone: data?.Phone ?? '',
        Location: data?.Location ?? '',
        LinkedIn: data?.LinkedIn ?? '',
        GitHub: data?.GitHub ?? '',
        Portfolio: data?.Portfolio ?? '',
        X: data?.X ?? '',
        Medium: data?.Medium ?? '',
        DevTo: data?.DevTo ?? '',
        Hashnode: data?.Hashnode ?? '',
        Dribbble: data?.Dribbble ?? '',
        Behance: data?.Behance ?? '',
        StackOverflow: data?.StackOverflow ?? '',
        Skype: data?.Skype ?? '',
        Zoom: data?.Zoom ?? '',
        Discord: data?.Discord ?? ''
    });

    const [touchedFields, setTouchedFields] = useState<Set<keyof ContactInformation>>(new Set());

    const handleChange = (field: keyof ContactInformation, value: string) => {
        const fieldInfo = contactFields.find(item => item.key === field);
        const prefix = fieldInfo?.prefix;

        let finalValue = value;

        if (prefix) {
            // Remove the prefix when the user deletes its content
            if (value === prefix) {
                finalValue = '';
            }
            // Add the prefix when the user starts typing
            else if (value && !value.startsWith(prefix)) {
                finalValue = prefix + value;
            }
        }

        const updatedFormData = {
            ...formData,
            [field]: finalValue
        };

        const updatedTouchedFields = new Set(touchedFields);
        updatedTouchedFields.add(field);

        setFormData(updatedFormData);
        setTouchedFields(updatedTouchedFields);

        const changedData: Partial<ContactInformation> = {};

        updatedTouchedFields.forEach((touchedField) => {
            const currentValue = updatedFormData[touchedField] ?? '';
            const touchedPrefix = contactFields.find(
                item => item.key === touchedField
            )?.prefix;

            changedData[touchedField] =
                currentValue.trim() === '' ||
                (touchedPrefix && currentValue.trim() === touchedPrefix)
                    ? null
                    : currentValue.trim();
        });

        console.log('Değiştirilen alan:', field);
        console.log('Gönderilen değer:', changedData);
        onChange(changedData);
    };

    return (
        <div className="edit-contact">
            <div className="edit-contact-grid">
                {contactFields.map((field) => (
                    <div className="edit-contact-field" key={field.key}>
                        <TextInput
                            label={field.label}
                            name={`contact-${field.key}`}
                            value={formData[field.key] ?? ''}
                            onChange={(value) => handleChange(field.key, value)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EditContact;
