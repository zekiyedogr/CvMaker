import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import TextInput from '../TextInput/TextInput';
import DeleteButton from '../DeleteButton/DeleteButton';
import AddButton from '../AddButton/AddButton';

import styles from './EditReferences.styles';

export interface Reference {
    Id?: number;
    ProfileId?: number;
    Name: string;
    Position: string;
    Contact: string;
}

interface EditReferencesProps {
    data: Reference[] | null;
    onChange: (references: Reference[]) => void;
}

const normalizeReferences = (
    data: Reference[] | null | undefined
): Reference[] => {
    return (data ?? []).map(reference => ({
        ...reference,
    }));
};

const EditReferences = ({ data, onChange }: EditReferencesProps) => {
    const [references, setReferences] = useState<Reference[]>(
        normalizeReferences(data)
    );

    useEffect(() => {
        setReferences(normalizeReferences(data));
    }, [data]);

    const updateReferences = (updatedReferences: Reference[]) => {
        setReferences(updatedReferences);
        onChange(updatedReferences);
    };

    const handleChange = (
        index: number,
        field: keyof Reference,
        value: string
    ) => {
        const updatedReferences = [...references];

        updatedReferences[index] = {
            ...updatedReferences[index],
            [field]: value,
        };

        updateReferences(updatedReferences);
    };

    const handleAdd = () => {
        updateReferences([
            ...references,
            {
                Name: '',
                Position: '',
                Contact: '',
            },
        ]);
    };

    const handleDelete = (index: number) => {
        updateReferences(
            references.filter((_, itemIndex) => itemIndex !== index)
        );
    };

    return (
        <View style={styles.container}>
            {references.map((reference, index) => (
                <View
                    style={styles.item}
                    key={reference.Id ?? `new-reference-${index}`}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            Reference {index + 1}
                        </Text>

                        <DeleteButton
                            iconOnly
                            onPress={() => handleDelete(index)}
                        />
                    </View>

                    <View style={styles.fields}>
                        <TextInput
                            label="Name"
                            name={`reference-name-${index}`}
                            value={reference.Name}
                            onChange={value =>
                                handleChange(index, 'Name', value)
                            }
                            placeholder="Enter reference name"
                        />

                        <TextInput
                            label="Position"
                            name={`reference-position-${index}`}
                            value={reference.Position}
                            onChange={value =>
                                handleChange(index, 'Position', value)
                            }
                            placeholder="Enter position"
                        />

                        <TextInput
                            label="Contact"
                            name={`reference-contact-${index}`}
                            value={reference.Contact}
                            onChange={value =>
                                handleChange(index, 'Contact', value)
                            }
                            placeholder="Enter email or phone"
                        />
                    </View>
                </View>
            ))}

            <View style={styles.addButton}>
                <AddButton
                    label="Add Reference"
                    onPress={handleAdd}
                />
            </View>
        </View>
    );
};

export default EditReferences;