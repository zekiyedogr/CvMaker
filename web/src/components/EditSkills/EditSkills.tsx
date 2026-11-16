
import { useEffect, useState } from 'react';
import TextInput from '../TextInput/TextInput';
import DeleteButton from '../DeleteButton/DeleteButton';
import AddButton from '../AddButton/AddButton';
import './EditSkills.css';

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

// Remove null, undefined and empty values.
const normalizeSkills = (
    data: Skill[] | null | undefined
): Skill[] => {
    return (data ?? [])
        .filter(skill => skill && skill.Title?.trim())
        .map(skill => ({
            ...skill,
            Items: (skill.Items ?? []).filter(
                Items => Items && Items.Name?.trim()
            )
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
            Title: value
        };

        updateSkills(updatedSkills);
    };

    const handleItemChange = (
        skillIndex: number,
        itemIndex: number,
        value: string
    ) => {
        const updatedSkills = [...skills];

        const updatedItems = [...updatedSkills[skillIndex].Items];

        updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            Name: value
        };

        updatedSkills[skillIndex] = {
            ...updatedSkills[skillIndex],
            Items: updatedItems
        };

        updateSkills(updatedSkills);
    };

    const addSkill = () => {
        updateSkills([
            ...skills,
            {
                Title: '',
                Items: []
            }
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
                { Name: '' }
            ]
        };

        updateSkills(updatedSkills);
    };

    const deleteSkillItem = (
        skillIndex: number,
        itemIndex: number
    ) => {
        const updatedSkills = [...skills];

        updatedSkills[skillIndex] = {
            ...updatedSkills[skillIndex],
            Items: updatedSkills[skillIndex].Items.filter(
                (_, i) => i !== itemIndex
            )
        };

        updateSkills(updatedSkills);
    };

    return (
        <div className="edit-skills-container">
            {skills.map((skill, skillIndex) => (
                <div
                    className="edit-skills-category"
                    key={skill.Id ?? `new-skill-${skillIndex}`}
                >
                    <div className="edit-skills-category-header">
                        <TextInput
                            label="Skill Category"
                            name={`skill-title-${skillIndex}`}
                            value={skill.Title}
                            onChange={(value) =>
                                handleTitleChange(skillIndex, value)
                            }
                            placeholder="Enter skill category"
                        />

                        <DeleteButton
                            iconOnly
                            onClick={() => deleteSkill(skillIndex)}
                        />
                    </div>

                    <div className="edit-skills-items">
                        {skill.Items.map((item, itemIndex) => (
                            <div
                                className="edit-skills-item-row"
                                key={item.Id ?? `new-item-${skillIndex}-${itemIndex}`}
                            >
                                <TextInput
                                    label={`Skill ${itemIndex + 1}`}
                                    name={`skill-${skillIndex}-item-${itemIndex}`}
                                    value={item.Name}
                                    onChange={(value) =>
                                        handleItemChange(
                                            skillIndex,
                                            itemIndex,
                                            value
                                        )
                                    }
                                    placeholder="Enter skill"
                                />

                                <DeleteButton
                                    iconOnly
                                    onClick={() =>
                                        deleteSkillItem(skillIndex, itemIndex)
                                    }
                                />
                            </div>
                        ))}

                        <div className="edit-skills-add-item">
                            <AddButton
                                label="Add Skill"
                                onClick={() => addSkillItem(skillIndex)}
                            />
                        </div>
                    </div>
                </div>
            ))}

            <div className="edit-skills-add-category">
                <AddButton
                    label="Add Skill Category"
                    onClick={addSkill}
                />
            </div>
        </div>
    );
};

export default EditSkills;
