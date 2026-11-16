
import React from 'react';
import { View, Text } from 'react-native';

import createStyles from './Experience.styles';

interface ExperienceItem {
    Id: number;
    CompanyName: string;
    Position: string;
    StartDate: string;
    EndDate: string | null;
    IsPresent: boolean;
    visibility: boolean;
    responsibilities: {
        Id: number;
        description: string;
        visibility: boolean;
    }[];
}

interface ExperienceProps {
    experience: {
        visibility: boolean;
        singularTitle: string;
        pluralTitle: string;
        content: ExperienceItem[];
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

const Experience = ({ experience, properties }: ExperienceProps) => {
    const styles = createStyles(
        properties.theme,
        properties.sizeValue,
        properties.heading,
        properties.body
    );

    if (!experience?.visibility || !experience.content) return null;

    const visibleExperiences = experience.content.filter(
        item => item.visibility
    );

    if (visibleExperiences.length === 0) return null;

    const title = visibleExperiences.length > 1
        ? experience.pluralTitle
        : experience.singularTitle;

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                {title.toUpperCase()}
            </Text>

            <View style={styles.inner}>

                <View style={styles.line} />

                <View style={styles.content}>

                    {visibleExperiences.map(exp => (
                        <View
                            style={styles.item}
                            key={exp.Id}
                        >

                            <View style={styles.heading}>

                                <View style={styles.bullet} />

                                <Text style={styles.company}>
                                    {exp.CompanyName}
                                </Text>

                                <Text style={styles.date}>
                                    {formatMonthYear(exp.StartDate)} — {
                                        exp.IsPresent
                                            ? 'PRESENT'
                                            : formatMonthYear(exp.EndDate)
                                    }
                                </Text>

                            </View>

                            <Text style={styles.position}>
                                {exp.Position}
                            </Text>

                            <View style={styles.descriptions}>

                                {(exp.responsibilities ?? [])
                                    .filter(respon => respon.visibility)
                                    .map(respon => (
                                        <View
                                            style={styles.description}
                                            key={respon.Id}
                                        >
                                            <Text style={styles.descriptionBullet}>
                                                {'\u2022'}
                                            </Text>

                                            <Text style={styles.descriptionText}>
                                                {respon.description}
                                            </Text>
                                        </View>
                                    ))}

                            </View>

                        </View>
                    ))}

                </View>
            </View>
        </View>
    );
};

export default Experience;
