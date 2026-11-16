
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import TextInput from '../TextInput/TextInput';
import Dropdown from '../Dropdown/Dropdown';
import DeleteButton from '../DeleteButton/DeleteButton';
import AddButton from '../AddButton/AddButton';

import styles from './EditLanguages.styles';

export interface Language {
    Id?: number;
    ProfileId?: number;
    Name: string;
    Levels: string;
}

interface EditLanguagesProps {
    data: Language[];
    onChange: (languages: Language[]) => void;
}

const languageLevels = [
    { label: 'Basic', value: 'Basic' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' },
    { label: 'Native', value: 'Native' },
];

const EditLanguages = ({ data, onChange }: EditLanguagesProps) => {
    const [languages, setLanguages] = useState<Language[]>(data ?? []);

    useEffect(() => {
        setLanguages(data ?? []);
    }, [data]);

    const updateLanguages = (updatedLanguages: Language[]) => {
        setLanguages(updatedLanguages);
        onChange(updatedLanguages);
    };

    const handleChange = (
        index: number,
        field: keyof Language,
        value: string
    ) => {
        const updatedLanguages = [...languages];

        updatedLanguages[index] = {
            ...updatedLanguages[index],
            [field]: value,
        };

        updateLanguages(updatedLanguages);
    };

    const handleAdd = () => {
        updateLanguages([
            ...languages,
            {
                Name: '',
                Levels: '',
            },
        ]);
    };

    const handleDelete = (index: number) => {
        updateLanguages(
            languages.filter((_, itemIndex) => itemIndex !== index)
        );
    };

    return (
        <View style={styles.container}>
            {languages.map((language, index) => (
                <View
                    style={styles.item}
                    key={language.Id ?? `new-${index}`}
                >
                    <View style={styles.header}>
                        <DeleteButton
                            iconOnly
                            onPress={() => handleDelete(index)}
                        />
                    </View>

                    <View style={styles.fields}>
                        <View style={styles.field}>
                            <TextInput
                                label="Language"
                                name={`language-${index}`}
                                value={language.Name}
                                onChange={(value) =>
                                    handleChange(index, 'Name', value)
                                }
                                placeholder="Enter language"
                            />
                        </View>

                        <View style={styles.field}>
                            <Dropdown
                                label="Language Level"
                                name={`language-level-${index}`}
                                value={language.Levels}
                                options={languageLevels}
                                onChange={(value) =>
                                    handleChange(index, 'Levels', value)
                                }
                                placeholder="Select language level"
                            />
                        </View>
                    </View>
                </View>
            ))}

            <AddButton
                label="Add Language"
                onPress={handleAdd}
            />
        </View>
    );
};

export default EditLanguages;
