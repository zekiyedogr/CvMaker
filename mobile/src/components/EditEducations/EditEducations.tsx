import { useEffect, useState } from 'react';
import { View, Text} from 'react-native';

import TextInput from '../TextInput/TextInput';
import DatePicker from '../DatePicker/DatePicker';
import Checkbox from '../Checkbox/Checkbox';
import AddButton from '../AddButton/AddButton';
import DeleteButton from '../DeleteButton/DeleteButton';

import colors from '../../constants/colors';
import styles from './EditEducations.styles';

export interface Education {
    Id?: number;
    ProfileId?: number;
    SchoolName: string;
    Department: string;
    Degree: string;
    Location: string;
    StartDate: string;
    EndDate: string | null;
    IsPresent: boolean;
}

interface EditEducationsProps {
    data: Education[] | null;
    onChange: (educations: Education[]) => void;
}

const formatDate = (date: string | null | undefined): string => {
    if (!date) return '';
    return date.substring(0, 10);
};

const normalizeEducations = (
    data: Education[] | null | undefined,
): Education[] => {
    return (data ?? []).map(education => ({
        ...education,
        StartDate: formatDate(education.StartDate),
        EndDate: formatDate(education.EndDate) || null,
        IsPresent: education.IsPresent ?? !education.EndDate,
    }));
};

const EditEducations = ({ data, onChange }: EditEducationsProps) => {
    const [educations, setEducations] = useState<Education[]>([]);

    useEffect(() => {
        setEducations(normalizeEducations(data));
    }, [data]);

    const updateEducations = (updatedEducations: Education[]) => {
        setEducations(updatedEducations);
        onChange(updatedEducations);
    };

    const handleAddEducation = () => {
        const newEducation: Education = {
            SchoolName: '',
            Department: '',
            Degree: '',
            Location: '',
            StartDate: '',
            EndDate: null,
            IsPresent: false,
        };

        updateEducations([...educations, newEducation]);
    };

    const handleDeleteEducation = (index: number) => {
        updateEducations(
            educations.filter((_, i) => i !== index),
        );
    };

    const handleFieldChange = (
        index: number,
        field: keyof Education,
        value: string,
    ) => {
        const updatedEducations = educations.map((education, i) => {
            if (i !== index) return education;

            return {
                ...education,
                [field]: value,
            };
        });

        updateEducations(updatedEducations);
    };

    const handlePresentChange = (
        index: number,
        checked: boolean,
    ) => {
        const updatedEducations = educations.map((education, i) => {
            if (i !== index) return education;

            return {
                ...education,
                IsPresent: checked,
                EndDate: checked ? null : education.EndDate,
            };
        });

        updateEducations(updatedEducations);
    };

    return (
        <View style={styles.container}>
            {educations.map((education, index) => (
                <View key={education.Id ?? `new-${index}`} style={styles.educationItem}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            Education {index + 1}
                        </Text>
                        <DeleteButton onPress={() => handleDeleteEducation(index)} />
                    </View>

                    <TextInput
                        label="School Name"
                        name={`SchoolName-${index}`}
                        value={education.SchoolName}
                        onChange={value =>
                            handleFieldChange(index, 'SchoolName', value)
                        }
                        placeholder="Enter school name"
                        type="text"
                    />

                    <TextInput
                        label="Department"
                        name={`Department-${index}`}
                        value={education.Department}
                        onChange={value =>
                            handleFieldChange(index, 'Department', value)
                        }
                        placeholder="Enter department"
                        type="text"
                    />

                    <TextInput
                        label="Degree"
                        name={`Degree-${index}`}
                        value={education.Degree}
                        onChange={value =>
                            handleFieldChange(index, 'Degree', value)
                        }
                        placeholder="Enter degree"
                        type="text"
                    />

                    <TextInput
                        label="Location"
                        name={`Location-${index}`}
                        value={education.Location}
                        onChange={value =>
                            handleFieldChange(index, 'Location', value)
                        }
                        placeholder="Enter location"
                        type="text"
                    />

                    <View style={styles.dateContainer}>
                        <DatePicker
                            label="Start Date"
                            value={education.StartDate}
                            onChange={value =>
                                handleFieldChange(index, 'StartDate', value)
                            }
                            max={education.EndDate || undefined}
                        />

                        <DatePicker
                            label="End Date"
                            value={education.EndDate || ''}
                            onChange={value =>
                                handleFieldChange(index, 'EndDate', value)
                            }
                            disabled={education.IsPresent}
                            min={education.StartDate || undefined}
                        />
                    </View>

                    <Checkbox
                        label="Currently studying here"
                        checked={education.IsPresent}
                        onChange={checked =>
                            handlePresentChange(index, checked)
                        }
                    />
                </View>
            ))}

            <AddButton
                label="Add Education"
                onPress={handleAddEducation}
            />
        </View>
    );
};

export default EditEducations;
