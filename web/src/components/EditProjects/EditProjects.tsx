import { useEffect, useState } from 'react';
import './EditProjects.css';

import TextInput from '../TextInput/TextInput';
import DatePicker from '../DatePicker/DatePicker';
import AddButton from '../AddButton/AddButton';
import DeleteButton from '../DeleteButton/DeleteButton';

import DescriptionInput, {
    type Description
} from '../DescriptionInput/DescriptionInput';

export interface Project {
    Id?: number;
    ProfileId?: number;
    ProjectName: string;
    Date: string;
    Link: string;
    Descriptions: Description[];
}

interface EditProjectsProps {
    data: Project[] | null;
    onChange: (updatedData: Project[]) => void;
}

const normalizeProjects = (
    data: Project[] | null | undefined
): Project[] => {
    return (data ?? []).map(project => ({
        ...project,
        Date: project.Date?.substring(0, 10) ?? '',
        Descriptions: project.Descriptions ?? []
    }));
};

const EditProjects = ({ data, onChange }: EditProjectsProps) => {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        setProjects(normalizeProjects(data));
    }, [data]);

    const updateProjects = (updatedProjects: Project[]) => {
        setProjects(updatedProjects);
        onChange(updatedProjects);
    };

    const handleFieldChange = (
        index: number,
        field: 'ProjectName' | 'Date' | 'Link',
        value: string
    ) => {
        const updatedProjects = projects.map((project, i) =>
            i === index
                ? { ...project, [field]: value }
                : project
        );

        updateProjects(updatedProjects);
    };

    const handleDescriptionsChange = (
        index: number,
        Descriptions: Description[]
    ) => {
        const updatedProjects = projects.map((project, i) =>
            i === index
                ? { ...project, Descriptions }
                : project
        );

        updateProjects(updatedProjects);
    };

    const handleAdd = () => {
        updateProjects([
            ...projects,
            {
                ProjectName: '',
                Date: '',
                Link: '',
                Descriptions: []
            }
        ]);
    };

    const handleDelete = (index: number) => {
        updateProjects(
            projects.filter((_, i) => i !== index)
        );
    };

    return (
        <div className="edit-projects-container">
            {projects.map((project, index) => (
                <div
                    className="edit-project-item"
                    key={project.Id ?? `new-${index}`}
                >
                    <div className="edit-project-header">
                        <h3>Project {index + 1}</h3>

                        <DeleteButton
                            iconOnly
                            onClick={() => handleDelete(index)}
                        />
                    </div>

                    <div className="edit-project-fields">
                        <TextInput
                            label="Project Name"
                            name={`projectName-${index}`}
                            value={project.ProjectName}
                            onChange={(value) =>
                                handleFieldChange(index, 'ProjectName', value)
                            }
                        />

                        <DatePicker
                            label="Project Date"
                            value={project.Date}
                            onChange={(value) =>
                                handleFieldChange(index, 'Date', value)
                            }
                        />

                        <TextInput
                            label="Project Link"
                            name={`projectLink-${index}`}
                            value={project.Link}
                            onChange={(value) =>
                                handleFieldChange(index, 'Link', value)
                            }
                            placeholder="https://example.com"
                        />
                    </div>

                    <div className="edit-project-descriptions">
                        <label>Project Descriptions</label>

                        <DescriptionInput
                            value={project.Descriptions}
                            onChange={(Descriptions) =>
                                handleDescriptionsChange(index, Descriptions)
                            }
                        />
                    </div>
                </div>
            ))}

            <AddButton
                label="Add Project"
                onClick={handleAdd}
            />
        </div>
    );
};

export default EditProjects;
