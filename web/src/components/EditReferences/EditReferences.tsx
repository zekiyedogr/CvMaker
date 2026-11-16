import { useEffect, useState } from 'react';
import TextInput from '../TextInput/TextInput';
import DeleteButton from '../DeleteButton/DeleteButton';
import AddButton from '../AddButton/AddButton';
import './EditReferences.css';

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
    return (data ?? []).filter(reference =>
        reference &&
        reference.Name?.trim() &&
        reference.Position?.trim() &&
        reference.Contact?.trim()
    );
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
            [field]: value
        };

        updateReferences(updatedReferences);
    };

    const addReference = () => {
        updateReferences([
            ...references,
            {
                Name: '',
                Position: '',
                Contact: ''
            }
        ]);
    };

    const deleteReference = (index: number) => {
        updateReferences(
            references.filter((_, i) => i !== index)
        );
    };

    return (
        <div className="edit-references-container">
            {references.map((reference, index) => (
                <div
                    className="edit-references-item"
                    key={reference.Id ?? `new-reference-${index}`}
                >
                    <div className="edit-references-header">
                        <h3>Reference {index + 1}</h3>

                        <DeleteButton
                            iconOnly
                            onClick={() => deleteReference(index)}
                        />
                    </div>

                    <div className="edit-references-fields">
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
                    </div>
                </div>
            ))}

            <div className="edit-references-add">
                <AddButton
                    label="Add Reference"
                    onClick={addReference}
                />
            </div>
        </div>
    );
};

export default EditReferences;
