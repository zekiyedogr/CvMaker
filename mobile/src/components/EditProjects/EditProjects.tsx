
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import TextInput from '../TextInput/TextInput';
import DatePicker from '../DatePicker/DatePicker';
import AddButton from '../AddButton/AddButton';
import DeleteButton from '../DeleteButton/DeleteButton';

import DescriptionInput, {
    type Description,
} from '../DescriptionInput/DescriptionInput';

import styles from './EditProjects.styles';

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
    data: Project[] | null | undefined,
): Project[] => {
    return (data ?? []).map(project => ({
        ...project,
        Date: project.Date?.substring(0, 10) ?? '',
        Descriptions: project.Descriptions ?? [],
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
        value: string,
    ) => {
        const updatedProjects = projects.map((project, i) =>
            i === index
                ? { ...project, [field]: value }
                : project,
        );

        updateProjects(updatedProjects);
    };

    const handleDescriptionsChange = (
        index: number,
        Descriptions: Description[],
    ) => {
        const updatedProjects = projects.map((project, i) =>
            i === index
                ? { ...project, Descriptions }
                : project,
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
                Descriptions: [],
            },
        ]);
    };

    const handleDelete = (index: number) => {
        updateProjects(
            projects.filter((_, i) => i !== index),
        );
    };

    return (
        <View style={styles.container}>
            {projects.map((project, index) => (
                <View
                    style={styles.projectItem}
                    key={project.Id ?? `new-${index}`}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            Project {index + 1}
                        </Text>

                        <DeleteButton
                            iconOnly
                            onPress={() => handleDelete(index)}
                        />
                    </View>

                    <View style={styles.fields}>
                        <TextInput
                            label="Project Name"
                            name={`projectName-${index}`}
                            value={project.ProjectName}
                            onChange={value =>
                                handleFieldChange(index, 'ProjectName', value)
                            }
                        />

                        <DatePicker
                            label="Project Date"
                            value={project.Date}
                            onChange={value =>
                                handleFieldChange(index, 'Date', value)
                            }
                        />

                        <TextInput
                            label="Project Link"
                            name={`projectLink-${index}`}
                            value={project.Link}
                            onChange={value =>
                                handleFieldChange(index, 'Link', value)
                            }
                            placeholder="https://example.com"
                        />
                    </View>

                    <View style={styles.descriptions}>
                        <Text style={styles.descriptionsLabel}>
                            Project Descriptions
                        </Text>

                        <DescriptionInput
                            value={project.Descriptions}
                            onChange={Descriptions =>
                                handleDescriptionsChange(index, Descriptions)
                            }
                        />
                    </View>
                </View>
            ))}

            <AddButton
                label="Add Project"
                onPress={handleAdd}
            />
        </View>
    );
};

export default EditProjects;
