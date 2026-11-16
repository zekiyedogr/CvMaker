import { View } from 'react-native';
import TextInput from '../TextInput/TextInput';
import styles from './EditContact.styles';

export interface ContactInformation {
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
    {
        key: 'StackOverflow',
        label: 'Stack Overflow',
        prefix: 'stackoverflow.com/users/',
    },
    { key: 'Skype', label: 'Skype' },
    { key: 'Zoom', label: 'Zoom' },
    { key: 'Discord', label: 'Discord' },
];

const EditContact = ({ data, onChange }: EditContactProps) => {

    const handleChange = (
        field: keyof ContactInformation,
        value: string,
    ) => {
        const fieldInfo = contactFields.find(item => item.key === field);
        const prefix = fieldInfo?.prefix;

        let finalValue = value;

        if (prefix) {
            if (value === prefix) {
                finalValue = '';
            } else if (value && !value.startsWith(prefix)) {
                finalValue = prefix + value;
            }
        }

        const trimmedValue = finalValue.trim();

        onChange({
            [field]:
                trimmedValue === '' ||
                (prefix && trimmedValue === prefix)
                    ? null
                    : trimmedValue,
        });
    };

    return (
        <View style={styles.container}>
            {contactFields.map(field => (
                <View
                    style={styles.field}
                    key={field.key}
                >
                    <TextInput
                        label={field.label}
                        name={`contact-${field.key}`}
                        value={data?.[field.key] ?? ''}
                        onChange={value => handleChange(field.key, value)}
                        placeholder={field.label}
                        type="text"
                    />
                </View>
            ))}
        </View>
    );
};

export default EditContact;