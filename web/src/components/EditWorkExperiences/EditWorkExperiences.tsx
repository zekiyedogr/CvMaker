import { useEffect, useState } from 'react';
import './EditWorkExperiences.css';

import TextInput from '../TextInput/TextInput';
import DatePicker from '../DatePicker/DatePicker';
import Checkbox from '../Checkbox/Checkbox';
import AddButton from '../AddButton/AddButton';
import DeleteButton from '../DeleteButton/DeleteButton';

import DescriptionInput, {
    type Description
} from '../DescriptionInput/DescriptionInput';

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
    data: WorkExperience[] | null | undefined
): WorkExperience[] => {
    return (data ?? []).map(experience => ({
        ...experience,
        StartDate: experience.StartDate?.substring(0, 10) ?? '',
        EndDate: experience.EndDate?.substring(0, 10) || null,
        IsPresent: experience.IsPresent ?? !experience.EndDate,
        Responsibilities: experience.Responsibilities ?? []
    }));
};

const EditWorkExperiences = ({ data, onChange }: EditWorkExperiencesProps) => {
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
        value: string
    ) => {
        const updatedData = workExperiences.map((experience, i) =>
            i === index
                ? {
                    ...experience,
                    [field]: field === 'EndDate' ? value || null : value
                }
                : experience
        );

        updateWorkExperiences(updatedData);
    };

    const handlePresentChange = (index: number, checked: boolean) => {
        const updatedData = workExperiences.map((experience, i) =>
            i === index
                ? {
                    ...experience,
                    IsPresent: checked,
                    EndDate: checked ? null : experience.EndDate
                }
                : experience
        );

        updateWorkExperiences(updatedData);
    };

    const handleResponsibilitiesChange = (
        index: number,
        Responsibilities: Description[]
    ) => {
        const updatedData = workExperiences.map((experience, i) =>
            i === index
                ? { ...experience, Responsibilities }
                : experience
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
                Responsibilities: []
            }
        ]);
    };

    const handleDelete = (index: number) => {
        updateWorkExperiences(
            workExperiences.filter((_, i) => i !== index)
        );
    };

    return (
        <div className="edit-work-experiences-container">
            {workExperiences.map((experience, index) => (
                <div
                    className="edit-work-experience-item"
                    key={experience.Id ?? `new-${index}`}
                >
                    <div className="edit-work-experience-header">
                        <h3>Work Experience {index + 1}</h3>

                        <DeleteButton
                            iconOnly
                            onClick={() => handleDelete(index)}
                        />
                    </div>

                    <div className="edit-work-experience-fields">
                        <TextInput
                            label="Company Name"
                            name={`companyName-${index}`}
                            value={experience.CompanyName}
                            onChange={(value) =>
                                handleFieldChange(index, 'CompanyName', value)
                            }
                        />

                        <TextInput
                            label="Position"
                            name={`position-${index}`}
                            value={experience.Position}
                            onChange={(value) =>
                                handleFieldChange(index, 'Position', value)
                            }
                        />

                        <TextInput
                            label="Location"
                            name={`location-${index}`}
                            value={experience.Location}
                            onChange={(value) =>
                                handleFieldChange(index, 'Location', value)
                            }
                        />

                        <div className="edit-work-experience-dates">
                            <DatePicker
                                label="Start Date"
                                value={experience.StartDate}
                                onChange={(value) =>
                                    handleFieldChange(index, 'StartDate', value)
                                }
                            />

                            <DatePicker
                                label="End Date"
                                value={experience.EndDate ?? ''}
                                onChange={(value) =>
                                    handleFieldChange(index, 'EndDate', value)
                                }
                                disabled={experience.IsPresent}
                                min={experience.StartDate || undefined}
                            />
                        </div>

                        <Checkbox
                            label="I currently work here"
                            checked={experience.IsPresent}
                            onChange={(checked) =>
                                handlePresentChange(index, checked)
                            }
                        />
                    </div>

                    <div className="edit-work-experience-responsibilities">
                        <label>Responsibilities</label>

                        <DescriptionInput
                            value={experience.Responsibilities}
                            onChange={(Responsibilities) =>
                                handleResponsibilitiesChange(index, Responsibilities)
                            }
                        />
                    </div>
                </div>
            ))}

            <AddButton label="Add Work Experience" onClick={handleAdd} />
        </div>
    );
};

export default EditWorkExperiences;
