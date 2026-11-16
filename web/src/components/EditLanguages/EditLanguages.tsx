import { useEffect, useState } from 'react';
import TextInput from '../TextInput/TextInput';
import Dropdown from '../Dropdown/Dropdown';
import DeleteButton from '../DeleteButton/DeleteButton';
import './EditLanguages.css';
import AddButton from '../AddButton/AddButton';

export interface Language {
    Id?: number;
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
    { label: 'Native', value: 'Native' }
];

const EditLanguages = ({ data, onChange }: EditLanguagesProps) => {
    const [languages, setLanguages] = useState<Language[]>(data ?? []);

    useEffect(() => {
        setLanguages(data ?? []);
    }, [data]);

    const handleChange = (
        index: number,
        field: keyof Language,
        value: string
    ) => {
        const updatedLanguages = [...languages];

        updatedLanguages[index] = {
            ...updatedLanguages[index],
            [field]: value
        };

        setLanguages(updatedLanguages);
        onChange(updatedLanguages);
    };

    const addLanguage = () => {
        const updatedLanguages = [
            ...languages,
            {
                Name: '',
                Levels: ''
            }
        ];

        setLanguages(updatedLanguages);
        onChange(updatedLanguages);
    };

    const deleteLanguage = (index: number) => {
        const updatedLanguages = languages.filter(
            (_, i) => i !== index
        );

        setLanguages(updatedLanguages);
        onChange(updatedLanguages);
    };

    return (
        <div className="edit-languages">
            {languages.map((language, index) => (
                <div className="language-item" key={language.Id ?? `new-${index}`}>
                    <div className="language-item-header">
                        <DeleteButton iconOnly onClick={() => deleteLanguage(index)} />
                    </div>

                    <div className="language-item-fields">
                        <TextInput
                            label="Language"
                            name={`language-${index}`}
                            value={language.Name}
                            onChange={(value) =>
                                handleChange(index, 'Name', value)
                            }
                            placeholder="Enter language"
                        />

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
                    </div>
                </div>
            ))}

            <AddButton label="Add Language" onClick={addLanguage}/>
        </div>
    );
};

export default EditLanguages;
