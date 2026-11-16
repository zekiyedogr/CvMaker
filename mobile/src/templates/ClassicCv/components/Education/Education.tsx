
import React from 'react';
import { View, Text } from 'react-native';

import createStyles from './Education.styles';

interface EducationItem {
    Id: number;
    StartDate: string;
    EndDate: string | null;
    IsPresent: boolean;
    SchoolName: string;
    Department: string;
    Degree: string | null;
    visibility: boolean;
}

interface EducationProps {
    education: {
        visibility: boolean;
        singularTitle: string;
        pluralTitle: string;
        content: EducationItem[];
    };
    properties: {
        theme: any;
        sizeValue: number;
        heading: any;
        body: any;
    };
}

const Education = ({ education, properties }: EducationProps) => {
    const styles = createStyles(
        properties.theme,
        properties.sizeValue,
        properties.heading,
        properties.body
    );

    if (!education?.visibility || !education.content) return null;

    const visibleEducations = education.content.filter(
        item => item.visibility
    );

    if (visibleEducations.length === 0) return null;

    const title = visibleEducations.length > 1
        ? education.pluralTitle
        : education.singularTitle;

    const formatYear = (date: string | null, present = false) => {
        if (present) return 'PRESENT';
        if (!date) return '';

        return new Date(date).getFullYear().toString();
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                {title.toUpperCase()}
            </Text>

            {visibleEducations.map(edu => (
                <View
                    style={styles.educationItem}
                    key={edu.Id}
                >
                    <View style={styles.years}>
                        <Text style={styles.yearText}>
                            {formatYear(edu.StartDate)}
                        </Text>

                        <Text style={styles.yearText}> - </Text>

                        <Text style={styles.yearText}>
                            {edu.IsPresent
                                ? 'PRESENT'
                                : formatYear(edu.EndDate)}
                        </Text>
                    </View>

                    <Text style={styles.schoolName}>
                        {edu.SchoolName?.toUpperCase()}
                    </Text>

                    <Text style={styles.content}>
                        {edu.Department}
                    </Text>

                    {edu.Degree && (
                        <Text style={styles.content}>
                            GPA: {edu.Degree} / 4.0
                        </Text>
                    )}
                </View>
            ))}

        </View>
    );
};

export default Education;
