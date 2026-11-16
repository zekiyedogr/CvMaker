import { useEffect, useState } from 'react';
import TextInput from '../TextInput/TextInput';
import DatePicker from '../DatePicker/DatePicker';
import Checkbox from '../Checkbox/Checkbox';
import DeleteButton from '../DeleteButton/DeleteButton';
import AddButton from '../AddButton/AddButton';
import './EditEducations.css';

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
    data: Education[] | null | undefined
): Education[] => {
    return (data ?? []).map(education => ({
        ...education,
        StartDate: formatDate(education.StartDate),
        EndDate: formatDate(education.EndDate) || null,
        IsPresent: education.IsPresent ?? !education.EndDate
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
            IsPresent: false
        };

        updateEducations([...educations, newEducation]);
    };

    const handleDeleteEducation = (index: number) => {
        const updatedEducations = educations.filter(
            (_, educationIndex) => educationIndex !== index
        );

        updateEducations(updatedEducations);
    };

    const handleFieldChange = (
        index: number,
        field: keyof Education,
        value: string
    ) => {
        const updatedEducations = educations.map((education, educationIndex) => {
            if (educationIndex !== index) return education;

            return {
                ...education,
                [field]: value
            };
        });

        updateEducations(updatedEducations);
    };

    const handlePresentChange = (index: number, checked: boolean) => {
        const updatedEducations = educations.map((education, educationIndex) => {
            if (educationIndex !== index) return education;

            return {
                ...education,
                IsPresent: checked,
                EndDate: checked ? null : education.EndDate
            };
        });

        updateEducations(updatedEducations);
    };

    return (
        <div className="edit-educations-container">
            {educations.map((education, index) => (
                <div className="edit-educations-item" key={education.Id ?? `new-${index}`}>
                    <div className="edit-educations-header">
                        <h3>Education {index + 1}</h3>

                        <DeleteButton
                            iconOnly
                            onClick={() => handleDeleteEducation(index)}
                        />
                    </div>

                    <TextInput
                        label="School Name"
                        name={`schoolName-${index}`}
                        value={education.SchoolName}
                        onChange={(value) =>
                            handleFieldChange(index, 'SchoolName', value)
                        }
                        placeholder="Enter school name"
                    />

                    <TextInput
                        label="Department"
                        name={`department-${index}`}
                        value={education.Department}
                        onChange={(value) =>
                            handleFieldChange(index, 'Department', value)
                        }
                        placeholder="Enter department"
                    />

                    <TextInput
                        label="Degree"
                        name={`degree-${index}`}
                        value={education.Degree}
                        onChange={(value) =>
                            handleFieldChange(index, 'Degree', value)
                        }
                        placeholder="Enter degree"
                    />

                    <TextInput
                        label="Location"
                        name={`location-${index}`}
                        value={education.Location}
                        onChange={(value) =>
                            handleFieldChange(index, 'Location', value)
                        }
                        placeholder="Enter location"
                    />

                    <div className="edit-project-dates">
                        <DatePicker
                            label="Start Date"
                            value={education.StartDate}
                            onChange={(value) =>
                                handleFieldChange(index, 'StartDate', value)
                            }
                        />

                        <DatePicker
                            label="End Date"
                            value={education.EndDate ?? ''}
                            onChange={(value) =>
                                handleFieldChange(index, 'EndDate', value)
                            }
                            disabled={education.IsPresent}
                            min={education.StartDate || undefined}
                        />
                    </div>

                    <Checkbox
                        label="Currently studying here"
                        checked={education.IsPresent}
                        onChange={(checked) =>
                            handlePresentChange(index, checked)
                        }
                    />
                </div>
            ))}

            <AddButton
                label="Add Education"
                onClick={handleAddEducation}
            />
        </div>
    );
};

export default EditEducations;
