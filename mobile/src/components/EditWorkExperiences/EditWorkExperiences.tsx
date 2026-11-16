
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import TextInput from '../TextInput/TextInput';
import DatePicker from '../DatePicker/DatePicker';
import Checkbox from '../Checkbox/Checkbox';
import AddButton from '../AddButton/AddButton';
import DeleteButton from '../DeleteButton/DeleteButton';

import DescriptionInput, {
    type Description,
} from '../DescriptionInput/DescriptionInput';

import styles from './EditWorkExperiences.styles';

export interface WorkExperience {
    Id?: number;
    ProfileId?: number;
    CompanyName: string;
    Position: string;
    Location: string;
    StartDate: string;
    EndDate: string | null;
    IsPresent: boolean;
    Responsibilities: Description[];
}

interface EditWorkExperiencesProps {
    data: WorkExperience[] | null;
    onChange: (updatedData: WorkExperience[]) => void;
}

const normalizeWorkExperiences = (
    data: WorkExperience[] | null | undefined,
): WorkExperience[] => {
    return (data ?? []).map(experience => ({
        ...experience,
        StartDate: experience.StartDate?.substring(0, 10) ?? '',
        EndDate: experience.EndDate?.substring(0, 10) || null,
        IsPresent: experience.IsPresent ?? !experience.EndDate,
        Responsibilities: experience.Responsibilities ?? [],
    }));
};

const EditWorkExperiences = ({
    data,
    onChange,
}: EditWorkExperiencesProps) => {
    const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);

    useEffect(() => {
        setWorkExperiences(normalizeWorkExperiences(data));
    }, [data]);

    const updateWorkExperiences = (updatedData: WorkExperience[]) => {
        setWorkExperiences(updatedData);
        onChange(updatedData);
    };

    const handleFieldChange = (
        index: number,
        field: 'CompanyName' | 'Position' | 'Location' | 'StartDate' | 'EndDate',
        value: string,
    ) => {
        const updatedData = workExperiences.map((experience, i) =>
            i === index
                ? {
                    ...experience,
                    [field]: field === 'EndDate' ? value || null : value,
                }
                : experience,
        );

        updateWorkExperiences(updatedData);
    };

    const handlePresentChange = (index: number, checked: boolean) => {
        const updatedData = workExperiences.map((experience, i) =>
            i === index
                ? {
                    ...experience,
                    IsPresent: checked,
                    EndDate: checked ? null : experience.EndDate,
                }
                : experience,
        );

        updateWorkExperiences(updatedData);
    };

    const handleResponsibilitiesChange = (
        index: number,
        Responsibilities: Description[],
    ) => {
        const updatedData = workExperiences.map((experience, i) =>
            i === index
                ? { ...experience, Responsibilities }
                : experience,
        );

        updateWorkExperiences(updatedData);
    };

    const handleAdd = () => {
        updateWorkExperiences([
            ...workExperiences,
            {
                CompanyName: '',
                Position: '',
                Location: '',
                StartDate: '',
                EndDate: null,
                IsPresent: false,
                Responsibilities: [],
            },
        ]);
    };

    const handleDelete = (index: number) => {
        updateWorkExperiences(
            workExperiences.filter((_, i) => i !== index),
        );
    };

    return (
        <View style={styles.container}>
            {workExperiences.map((experience, index) => (
                <View
                    style={styles.experienceItem}
                    key={experience.Id ?? `new-${index}`}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            Work Experience {index + 1}
                        </Text>
                        <DeleteButton onPress={() => handleDelete(index)} />
                    </View>

                    <View style={styles.fields}>
                        <TextInput
                            label="Company Name"
                            name={`companyName-${index}`}
                            value={experience.CompanyName}
                            onChange={value =>
                                handleFieldChange(index, 'CompanyName', value)
                            }
                        />

                        <TextInput
                            label="Position"
                            name={`position-${index}`}
                            value={experience.Position}
                            onChange={value =>
                                handleFieldChange(index, 'Position', value)
                            }
                        />

                        <TextInput
                            label="Location"
                            name={`location-${index}`}
                            value={experience.Location}
                            onChange={value =>
                                handleFieldChange(index, 'Location', value)
                            }
                        />

                        <View style={styles.dateContainer}>
                            <DatePicker
                                label="Start Date"
                                value={experience.StartDate}
                                onChange={value =>
                                    handleFieldChange(index, 'StartDate', value)
                                }
                                max={experience.EndDate || undefined}
                            />

                            <DatePicker
                                label="End Date"
                                value={experience.EndDate ?? ''}
                                onChange={value =>
                                    handleFieldChange(index, 'EndDate', value)
                                }
                                disabled={experience.IsPresent}
                                min={experience.StartDate || undefined}
                            />
                        </View>

                        <Checkbox
                            label="I currently work here"
                            checked={experience.IsPresent}
                            onChange={checked =>
                                handlePresentChange(index, checked)
                            }
                        />
                    </View>

                    <View style={styles.responsibilities}>
                        <Text style={styles.responsibilitiesLabel}>
                            Responsibilities
                        </Text>

                        <DescriptionInput
                            value={experience.Responsibilities}
                            onChange={Responsibilities =>
                                handleResponsibilitiesChange(index, Responsibilities)
                            }
                        />
                    </View>
                </View>
            ))}

            <AddButton
                label="Add Work Experience"
                onPress={handleAdd}
            />
        </View>
    );
};

export default EditWorkExperiences;
