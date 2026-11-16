import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import TextInput from '../TextInput/TextInput';
import DeleteButton from '../DeleteButton/DeleteButton';
import AddButton from '../AddButton/AddButton';

import styles from './EditHobbies.styles';

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
    return (data ?? []).map(hobby => ({
        ...hobby,
    }));
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

    const handleChange = (index: number, value: string) => {
        const updatedHobbies = [...hobbies];

        updatedHobbies[index] = {
            ...updatedHobbies[index],
            Name: value,
        };

        updateHobbies(updatedHobbies);
    };

    const handleAdd = () => {
        updateHobbies([
            ...hobbies,
            { Name: '' },
        ]);
    };

    const handleDelete = (index: number) => {
        updateHobbies(
            hobbies.filter((_, itemIndex) => itemIndex !== index)
        );
    };

    return (
        <View style={styles.container}>
            {hobbies.map((hobby, index) => (
                <View
                    style={styles.item}
                    key={hobby.Id ?? `new-hobby-${index}`}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            Hobby {index + 1}
                        </Text>

                        <DeleteButton
                            iconOnly
                            onPress={() => handleDelete(index)}
                        />
                    </View>

                    <View style={styles.fields}>
                        <TextInput
                            label="Hobby"
                            name={`hobby-name-${index}`}
                            value={hobby.Name}
                            onChange={value =>
                                handleChange(index, value)
                            }
                            placeholder="Enter hobby"
                        />
                    </View>
                </View>
            ))}

            <View style={styles.addButton}>
                <AddButton
                    label="Add Hobby"
                    onPress={handleAdd}
                />
            </View>
        </View>
    );
};

export default EditHobbies;