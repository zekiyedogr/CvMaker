
import React from 'react';
import { View, Text, Linking } from 'react-native';

import createStyles from './Project.styles';

interface ProjectItem {
    Id: number;
    ProjectName: string;
    Date: string;
    Link: string | null;
    visibility: boolean;
    subclause?: {
        text: string;
        visibility: boolean;
    }[];
}

interface ProjectProps {
    projects: {
        visibility: boolean;
        singularTitle: string;
        pluralTitle: string;
        content: ProjectItem[];
    };
    properties: {
        theme: any;
        sizeValue: number;
        heading: any;
        body: any;
    };
}

const formatMonthYear = (date: string | null) => {
    if (!date) return '';

    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
    });
};

const Project = ({ projects, properties }: ProjectProps) => {
    const styles = createStyles(
        properties.theme,
        properties.sizeValue,
        properties.heading,
        properties.body
    );

    if (!projects?.visibility || !projects.content) return null;

    const visibleProjects = projects.content.filter(
        project => project.visibility
    );

    if (visibleProjects.length === 0) return null;

    const title = visibleProjects.length > 1
        ? projects.pluralTitle
        : projects.singularTitle;

    const openLink = (link: string) => {
        const url = /^https?:\/\//i.test(link)
            ? link
            : `https://${link}`;

        Linking.openURL(url).catch(error => {
            console.error('Project link could not be opened:', error);
        });
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                {title.toUpperCase()}
            </Text>

            <View style={styles.projectInner}>
                <View style={styles.projectLine} />

                <View style={styles.projectContent}>
                    {visibleProjects.map(project => (
                        <View
                            style={styles.projectItem}
                            key={project.Id}
                        >

                            <View style={styles.projectHeading}>
                                <View style={styles.projectBullet} />

                                <Text style={styles.projectName}>
                                    {project.ProjectName}
                                </Text>

                                <Text style={styles.projectDate}>
                                    {formatMonthYear(project.Date)}
                                </Text>
                            </View>

                            <View style={styles.projectDescriptions}>
                                {(project.subclause ?? [])
                                    .filter(description => description.visibility)
                                    .map((description, index) => (
                                        <View
                                            style={styles.projectDescription}
                                            key={index}
                                        >
                                            <Text style={styles.descriptionBullet}>
                                                •
                                            </Text>

                                            <Text style={styles.descriptionText}>
                                                {description.text}
                                            </Text>
                                        </View>
                                    ))}
                            </View>

                            {project.Link && (
                                <Text
                                    style={styles.projectLink}
                                    onPress={() => openLink(project.Link!)}
                                >
                                    Link
                                </Text>
                            )}

                        </View>
                    ))}
                </View>
            </View>

        </View>
    );
};

export default Project;
