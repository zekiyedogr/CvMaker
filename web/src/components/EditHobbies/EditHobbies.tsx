import { useEffect, useState } from 'react';
import TextInput from '../TextInput/TextInput';
import DeleteButton from '../DeleteButton/DeleteButton';
import AddButton from '../AddButton/AddButton';
import './EditHobbies.css';

export interface Hobby {
    Id?: number;
    ProfileId?: number;
    Name: string;
}

interface EditHobbiesProps {
    data: Hobby[] | null;
    onChange: (hobbies: Hobby[]) => void;
}

const normalizeHobbies = (
    data: Hobby[] | null | undefined
): Hobby[] => {
    return (data ?? []).filter(hobby =>
        hobby &&
        hobby.Name?.trim()
    );
};

const EditHobbies = ({ data, onChange }: EditHobbiesProps) => {
    const [hobbies, setHobbies] = useState<Hobby[]>(
        normalizeHobbies(data)
    );

    useEffect(() => {
        setHobbies(normalizeHobbies(data));
    }, [data]);

    const updateHobbies = (updatedHobbies: Hobby[]) => {
        setHobbies(updatedHobbies);
        onChange(updatedHobbies);
    };

    const handleChange = (
        index: number,
        value: string
    ) => {
        const updatedHobbies = [...hobbies];

        updatedHobbies[index] = {
            ...updatedHobbies[index],
            Name: value
        };

        updateHobbies(updatedHobbies);
    };

    const addHobby = () => {
        updateHobbies([
            ...hobbies,
            { Name: '' }
        ]);
    };

    const deleteHobby = (index: number) => {
        updateHobbies(
            hobbies.filter((_, i) => i !== index)
        );
    };

    return (
        <div className="edit-hobbies-container">
            {hobbies.map((hobby, index) => (
                <div
                    className="edit-hobbies-item"
                    key={hobby.Id ?? `new-hobby-${index}`}
                >
                    <div className="edit-hobbies-header">
                        <h3>Hobby {index + 1}</h3>

                        <DeleteButton
                            iconOnly
                            onClick={() => deleteHobby(index)}
                        />
                    </div>

                    <div className="edit-hobbies-fields">
                        <TextInput
                            label="Hobby"
                            name={`hobby-name-${index}`}
                            value={hobby.Name}
                            onChange={value =>
                                handleChange(index, value)
                            }
                            placeholder="Enter hobby"
                        />
                    </div>
                </div>
            ))}

            <div className="edit-hobbies-add">
                <AddButton
                    label="Add Hobby"
                    onClick={addHobby}
                />
            </div>
        </div>
    );
};

export default EditHobbies;
