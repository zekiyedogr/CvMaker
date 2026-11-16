
import { useState } from 'react';
import {
    View,
    TextInput as RNTextInput,
} from 'react-native';

import DeleteButton from '../DeleteButton/DeleteButton';
import AddButton from '../AddButton/AddButton';

import styles from './DescriptionInput.styles';

export interface Description {
    Id?: number;
    WorkExperienceId?: number;
    ProjectId?: number;
    Description: string;
}

interface DescriptionInputProps {
    value: Description[];
    onChange: (updatedDescriptions: Description[]) => void;
}

const DescriptionInput = ({ value, onChange }: DescriptionInputProps) => {
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    const handleChange = (index: number, description: string) => {
        const updatedDescriptions = [...value];

        updatedDescriptions[index] = {
            ...updatedDescriptions[index],
            Description: description,
        };

        onChange(updatedDescriptions);
    };

    const handleAdd = () => {
        onChange([
            ...value,
            { Description: '' },
        ]);
    };

    const handleDelete = (index: number) => {
        onChange(value.filter((_, itemIndex) => itemIndex !== index));
    };

    return (
        <View style={styles.container}>
            {value.map((description, index) => (
                <View
                    style={styles.row}
                    key={description.Id ?? `new-${index}`}
                >
                    <View style={styles.inputContainer}>
                        <RNTextInput
                            style={[
                                styles.input,
                                focusedIndex === index && styles.focused,
                            ]}
                            value={description.Description}
                            onChangeText={text => handleChange(index, text)}
                            onFocus={() => setFocusedIndex(index)}
                            onBlur={() => setFocusedIndex(null)}
                            placeholder="Enter description..."
                            placeholderTextColor={styles.placeholder.color}
                        />
                    </View>

                    <View style={styles.deleteContainer}>
                        <DeleteButton
                            iconOnly
                            onPress={() => handleDelete(index)}
                        />
                    </View>
                </View>
            ))}

            <AddButton
                label="Add description"
                onPress={handleAdd}
            />
        </View>
    );
};

export default DescriptionInput;
