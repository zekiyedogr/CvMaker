
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import TextInput from '../TextInput/TextInput';
import DeleteButton from '../DeleteButton/DeleteButton';
import AddButton from '../AddButton/AddButton';

import colors from '../../constants/colors';
import styles from './EditSkills.styles';

export interface SkillItem {
    Id?: number;
    SkillId?: number;
    Name: string;
}

export interface Skill {
    Id?: number;
    ProfileId?: number;
    Title: string;
    Items: SkillItem[];
}

interface EditSkillsProps {
    data: Skill[] | null;
    onChange: (skills: Skill[]) => void;
}

const normalizeSkills = (
    data: Skill[] | null | undefined,
): Skill[] => {
    return (data ?? []).map(skill => ({
        ...skill,
        Items: skill.Items ?? [],
    }));
};

const EditSkills = ({ data, onChange }: EditSkillsProps) => {
    const [skills, setSkills] = useState<Skill[]>(normalizeSkills(data));

    useEffect(() => {
        setSkills(normalizeSkills(data));
    }, [data]);

    const updateSkills = (updatedSkills: Skill[]) => {
        setSkills(updatedSkills);
        onChange(updatedSkills);
    };

    const handleTitleChange = (index: number, value: string) => {
        const updatedSkills = [...skills];

        updatedSkills[index] = {
            ...updatedSkills[index],
            Title: value,
        };

        updateSkills(updatedSkills);
    };

    const handleItemChange = (
        skillIndex: number,
        itemIndex: number,
        value: string,
    ) => {
        const updatedSkills = [...skills];

        const updatedItems = [...updatedSkills[skillIndex].Items];

        updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            Name: value,
        };

        updatedSkills[skillIndex] = {
            ...updatedSkills[skillIndex],
            Items: updatedItems,
        };

        updateSkills(updatedSkills);
    };

    const addSkill = () => {
        updateSkills([
            ...skills,
            {
                Title: '',
                Items: [],
            },
        ]);
    };

    const deleteSkill = (index: number) => {
        updateSkills(skills.filter((_, i) => i !== index));
    };

    const addSkillItem = (skillIndex: number) => {
        const updatedSkills = [...skills];

        updatedSkills[skillIndex] = {
            ...updatedSkills[skillIndex],
            Items: [
                ...updatedSkills[skillIndex].Items,
                { Name: '' },
            ],
        };

        updateSkills(updatedSkills);
    };

    const deleteSkillItem = (
        skillIndex: number,
        itemIndex: number,
    ) => {
        const updatedSkills = [...skills];

        updatedSkills[skillIndex] = {
            ...updatedSkills[skillIndex],
            Items: updatedSkills[skillIndex].Items.filter(
                (_, i) => i !== itemIndex,
            ),
        };

        updateSkills(updatedSkills);
    };

    return (
        <View style={styles.container}>
            {skills.map((skill, skillIndex) => (
                <View
                    style={styles.category}
                    key={skill.Id ?? `new-skill-${skillIndex}`}
                >
                    <View style={styles.categoryHeader}>
                        <View style={styles.titleInput}>
                            <TextInput
                                label="Skill Category"
                                name={`skill-title-${skillIndex}`}
                                value={skill.Title}
                                onChange={value =>
                                    handleTitleChange(skillIndex, value)
                                }
                                placeholder="Enter skill category"
                            />
                        </View>

                        <DeleteButton
                            iconOnly
                            onPress={() => deleteSkill(skillIndex)}
                        />
                    </View>

                    <View style={styles.items}>
                        {skill.Items.map((item, itemIndex) => (
                            <View
                                style={styles.itemRow}
                                key={
                                    item.Id ??
                                    `new-item-${skillIndex}-${itemIndex}`
                                }
                            >
                                <View style={styles.itemInput}>
                                    <TextInput
                                        label={`Skill ${itemIndex + 1}`}
                                        name={`skill-${skillIndex}-item-${itemIndex}`}
                                        value={item.Name}
                                        onChange={value =>
                                            handleItemChange(
                                                skillIndex,
                                                itemIndex,
                                                value,
                                            )
                                        }
                                        placeholder="Enter skill"
                                    />
                                </View>

                                <DeleteButton
                                    iconOnly
                                    onPress={() =>
                                        deleteSkillItem(skillIndex, itemIndex)
                                    }
                                />
                            </View>
                        ))}

                        <View style={styles.addItem}>
                            <AddButton
                                label="Add Skill"
                                onPress={() => addSkillItem(skillIndex)}
                            />
                        </View>
                    </View>
                </View>
            ))}

            <View style={styles.addCategory}>
                <AddButton
                    label="Add Skill Category"
                    onPress={addSkill}
                />
            </View>
        </View>
    );
};

export default EditSkills;
